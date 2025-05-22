import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK, APPLICATION_ID } from "../../util/Constants";
import { formatDate } from "../../util/Formatting";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Loading from "../../part/Loading";
import Icon from "../../part/Icon";
import Cookies from "js-cookie";
import { decryptId } from "../../util/Encryptor";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    Pesan: null,
    Waktu: null,
    Count: 0,
  },
];

const dataFilterSort = [
  { Value: "[Waktu] asc", Text: "Waktu [↑]" },
  { Value: "[Waktu] desc", Text: "Waktu [↓]" },
];

const dataFilterStatus = [
  { Value: "Belum Dibaca", Text: "Belum Dibaca" },
  { Value: "Terbaca", Text: "Terbaca" },
];

export default function NotifikasiIndex({ onChangePage }) {
  const cookie = Cookies.get("activeUser");
  let userInfo = "";
  if (cookie) userInfo = JSON.parse(decryptId(cookie));

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "Waktu",
    status: "Belum Dibaca",
    app: APPLICATION_ID,
  });

  const searchQuery = useRef();
  const searchFilterSort = useRef();
  const searchFilterStatus = useRef();

  function handleSetCurrentPage(newCurrentPage) {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: newCurrentPage,
    }));
  }

  function handleSearch() {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: 1,
      query: searchQuery.current.value,
      sort: searchFilterSort.current.value,
      status: searchFilterStatus.current.value,
    }));
  }

  async function handleSetRead() {
    const result = await SweetAlert(
      "Tandai Semua Sudah Dibaca",
      "Apakah Anda yakin ingin menandai status semua notifikasi menjadi sudah dibaca?",
      "info",
      "Ya, saya yakin!"
    );

    if (result) {
      setIsLoading(true);
      setIsError(false);

      const data = await UseFetch(API_LINK + "Notifikasi/UpdateNotifikasi", {
        application: userInfo.username,
        key: userInfo.username,
      });

      if (data === "ERROR" || data.length === 0) setIsError(true);
      else {
        SweetAlert("Sukses", "Semua notifikasi ditandai sudah dibaca", "success");
        handleSetCurrentPage(currentFilter.page);
        setIsLoading(true);
      }
    }
  }

  function handleOnClick(item) {
    const isiPesan = item.rawHTML || "";

    console.log("dawd", item)
    if (item.Key) {  
      onChangePage("detailSS", item.Key);
    } else if (item.rci_id && isiPesan.includes("Quality Control Circle")) {
      onChangePage("detailQCC", item.rci_id);
    } else if (item.rci_id && isiPesan.includes("Quality Control Project")) {
      onChangePage("detailQCP", item.rci_id);
    } else if (item.rci_id && isiPesan.includes("Business Performance")) {
      onChangePage("detailBPI", item.rci_id);
    } else if (item.rci_id && isiPesan.includes("Value Chain Innovation")) {
      onChangePage("detailVCI", item.rci_id);
    } else {
      alert("Tidak ada detail terkait");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);

      try {
        const data = await UseFetch(
          API_LINK + "Notifikasi/GetDataNotifikasi",
          currentFilter
        );

        if (data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const formattedData = data.map((value) => {
            const pesanHTML = (
              <div
                className="link-decoration-none"
                style={{ fontSize: "14px", cursor: "pointer" }}
                dangerouslySetInnerHTML={{
                  __html: value["Pesan"],
                }}
              />
            );

            const formatted = {
              ...value,
              Pesan: pesanHTML,
              Waktu: formatDate(value["Waktu"]),
              Alignment: ["center", "left", "left", "center", "center", "center"],
            };

            if (value["Status"] !== "Terbaca") {
              formatted.Aksi = (
                <Icon
                  name="check"
                  type="Bold"
                  cssClass="btn bi-check-lg"
                  title="Tandai Sudah Dibaca"
                  onClick={async () => {
                    const result = await SweetAlert(
                      "Tandai Sudah Dibaca",
                      "Apakah Anda yakin ingin menandai notifikasi ini sudah dibaca?",
                      "info",
                      "Ya, tandai!"
                    );

                    if (result) {
                      setIsLoading(true);
                      await UseFetch(API_LINK + "Notifikasi/SetReadNotifikasi", {
                        key: value.Key,
                        application: userInfo.username,
                      });
                      setCurrentFilter((prev) => ({ ...prev }));
                      setIsLoading(true);
                    }
                  }}
                />
              );
            }

            return formatted;
          });

          setCurrentData(formattedData);
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentFilter]);

  return (
    <div className="my-3 container">
      <div className="d-flex flex-column">
        {isError && (
          <div className="flex-fill">
            <Alert
              type="warning"
              message="Terjadi kesalahan: Gagal mengambil data notifikasi."
            />
          </div>
        )}
        <div className="mb-4 color-primary text-center">
          <div className="d-flex gap-3 justify-content-center">
            <h2 className="display-1 fw-bold">Notification</h2>
            <div className="d-flex align-items-end mb-2">
              <h2 className="display-5 fw-bold align-items-end">System</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-fill">
        <div className="input-group">
          <Input
            ref={searchQuery}
            forInput="pencarianNotifikasi"
            placeholder="Cari"
          />
          <Button
            iconName="search"
            classType="primary px-4"
            title="Cari"
            onClick={handleSearch}
          />
          <Filter>
            <DropDown
              ref={searchFilterSort}
              forInput="ddUrut"
              label="Urut Berdasarkan"
              type="none"
              arrData={dataFilterSort}
              defaultValue="[Waktu] desc"
            />
            <DropDown
              ref={searchFilterStatus}
              forInput="ddStatus"
              label="Status"
              type="none"
              arrData={dataFilterStatus}
              defaultValue="Belum Dibaca"
            />
          </Filter>
          <Button
            iconName="check-double"
            classType="success px-4 border-start"
            title="Set Sudah Dibaca"
            label="Set Sudah Dibaca"
            onClick={handleSetRead}
          />
        </div>
      </div>

      <div className="mt-3">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="d-flex flex-column">
            <Table
              data={currentData.map((item) => ({
                ...item,
                Pesan: item.Pesan ? (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOnClick(item);
                    }}
                    className="text-primary text-decoration-none"
                  >
                    {item.Pesan}
                  </a>
                ) : (
                  "-"
                ),
              }))}
            />
            <Paging
              pageSize={PAGE_SIZE}
              pageCurrent={currentFilter.page}
              totalData={currentData[0]?.Count || 0}
              navigation={handleSetCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
