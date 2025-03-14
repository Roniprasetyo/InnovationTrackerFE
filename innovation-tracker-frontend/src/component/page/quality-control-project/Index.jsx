import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK } from "../../util/Constants";
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
import { maxCharDisplayed } from "../../util/Formatting";
import Icon from "../../part/Icon";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    Name: null,
    Type: null,
    Status: null,
    Count: 0,
  },
];
const inisialisasiDataQcp = [
  {
    Key: 1,
    No: 1,
    Title: "QCP Registration Title 1111111111111111111111111111111111111111111111111111111111111111",
    Jenis: "Teknik",
    Case: "Lorem ipsum odor amet, consectetuer adipiscing elit. Taciti eu nostra litora duis auctor netus nascetur inceptos mus. Euismod ultrices lacus non cursus iaculis donec. Etiam netus mauris eros integer elementum. Vulputate montes ultricies sagittis dignissim conubia nascetur conubia. Suspendisse maecenas donec tempor vitae eu. Placerat eros ex fringilla mi iaculis dignissim aptent. Neque sodales orci libero fringilla sem sem molestie...",
    Leader: "Jono Doe",
    Submitted: "2025-03-04",
    Count: 10,
  },
  {
    Key: 2,
    No: 2,
    Title: "QCP Registration Title 2",
    Jenis: "Non Teknik",
    Case: "Lorem ipsum odor amet, consectetuer adipiscing elit. Taciti eu nostra litora duis auctor netus nascetur inceptos mus. Euismod ultrices lacus non cursus iaculis donec. Etiam netus mauris eros integer elementum. Vulputate montes ultricies sagittis dignissim conubia nascetur conubia. Suspendisse maecenas donec tempor vitae eu. Placerat eros ex fringilla mi iaculis dignissim aptent. Neque sodales orci libero fringilla sem sem molestie...",
    Leader: "Larissa Roger",
    Submitted: "2025-03-01",
    Count: 10,
  },
  {
    Key: 3,
    No: 3,
    Title: "QCP Registration Title 3",
    Jenis: "Non Teknik",
    Case: "Lorem ipsum odor amet, consectetuer adipiscing elit. Taciti eu nostra litora duis auctor netus nascetur inceptos mus. Euismod ultrices lacus non cursus iaculis donec. Etiam netus mauris eros integer elementum. Vulputate montes ultricies sagittis dignissim conubia nascetur conubia. Suspendisse maecenas donec tempor vitae eu. Placerat eros ex fringilla mi iaculis dignissim aptent. Neque sodales orci libero fringilla sem sem molestie...",
    Leader: "Juan Rafael",
    Submitted: "2025-03-03",
    Count: 10,
  },
  {
    Key: 4,
    No: 4,
    Title: "QCP Registration Title 4",
    Jenis: "Teknik",
    Case: "Lorem ipsum odor amet, consectetuer adipiscing elit. Taciti eu nostra litora duis auctor netus nascetur inceptos mus. Euismod ultrices lacus non cursus iaculis donec. Etiam netus mauris eros integer elementum. Vulputate montes ultricies sagittis dignissim conubia nascetur conubia. Suspendisse maecenas donec tempor vitae eu. Placerat eros ex fringilla mi iaculis dignissim aptent. Neque sodales orci libero fringilla sem sem molestie...",
    Leader: "Prowler Max",
    Submitted: "2025-03-02",
    Count: 10,
  },
  {
    Key: 5,
    No: 5,
    Title: "QCP Registration Title 5",
    Jenis: "Teknik",
    Case: "Lorem ipsum odor amet, consectetuer adipiscing elit. Taciti eu nostra litora duis auctor netus nascetur inceptos mus. Euismod ultrices lacus non cursus iaculis donec. Etiam netus mauris eros integer elementum. Vulputate montes ultricies sagittis dignissim conubia nascetur conubia. Suspendisse maecenas donec tempor vitae eu. Placerat eros ex fringilla mi iaculis dignissim aptent. Neque sodales orci libero fringilla sem sem molestie...",
    Leader: "Larissa Roger",
    Submitted: "2025-03-05",
    Count: 10,
  },
  {
    Key: 6,
    No: 6,
    Title: "QCP Registration Title 6",
    Jenis: "Non Teknik",
    Case: "Lorem ipsum odor amet, consectetuer adipiscing elit. Taciti eu nostra litora duis auctor netus nascetur inceptos mus. Euismod ultrices lacus non cursus iaculis donec. Etiam netus mauris eros integer elementum. Vulputate montes ultricies sagittis dignissim conubia nascetur conubia. Suspendisse maecenas donec tempor vitae eu. Placerat eros ex fringilla mi iaculis dignissim aptent. Neque sodales orci libero fringilla sem sem molestie...",
    Leader: "Larissa Roger",
    Submitted: "2025-03-06",
    Count: 10,
  },
  {
    Key: 7,
    No: 27,
    Title: "QCP Registration Title 7",
    Jenis: "Teknik",
    Case: "Lorem ipsum odor amet, consectetuer adipiscing elit. Taciti eu nostra litora duis auctor netus nascetur inceptos mus. Euismod ultrices lacus non cursus iaculis donec. Etiam netus mauris eros integer elementum. Vulputate montes ultricies sagittis dignissim conubia nascetur conubia. Suspendisse maecenas donec tempor vitae eu. Placerat eros ex fringilla mi iaculis dignissim aptent. Neque sodales orci libero fringilla sem sem molestie...",
    Leader: "Larissa Roger",
    Submitted: "2025-03-06",
    Count: 10,
  },
  {
    Key: 8,
    No: 8,
    Title: "QCP Registration Title 8",
    Jenis: "Non Teknik",
    Case: "Lorem ipsum odor amet, consectetuer adipiscing elit. Taciti eu nostra litora duis auctor netus nascetur inceptos mus. Euismod ultrices lacus non cursus iaculis donec. Etiam netus mauris eros integer elementum. Vulputate montes ultricies sagittis dignissim conubia nascetur conubia. Suspendisse maecenas donec tempor vitae eu. Placerat eros ex fringilla mi iaculis dignissim aptent. Neque sodales orci libero fringilla sem sem molestie...",
    Leader: "Larissa Roger",
    Submitted: "2025-03-08",
    Count: 10,
  },
  {
    Key: 9,
    No: 9,
    Title: "QCP Registration Title 9",
    Jenis: "Teknik",
    Case: "Lorem ipsum odor amet, consectetuer adipiscing elit. Taciti eu nostra litora duis auctor netus nascetur inceptos mus. Euismod ultrices lacus non cursus iaculis donec. Etiam netus mauris eros integer elementum. Vulputate montes ultricies sagittis dignissim conubia nascetur conubia. Suspendisse maecenas donec tempor vitae eu. Placerat eros ex fringilla mi iaculis dignissim aptent. Neque sodales orci libero fringilla sem sem molestie...",
    Leader: "Larissa Roger",
    Submitted: "2025-03-09",
    Count: 10,
  },
  {
    Key: 10,
    No: 10,
    Title: "QCP Registration Title 10",
    Jenis: "Non Teknik",
    Case: "Lorem ipsum odor amet, consectetuer adipiscing elit. Taciti eu nostra litora duis auctor netus nascetur inceptos mus. Euismod ultrices lacus non cursus iaculis donec. Etiam netus mauris eros integer elementum. Vulputate montes ultricies sagittis dignissim conubia nascetur conubia. Suspendisse maecenas donec tempor vitae eu. Placerat eros ex fringilla mi iaculis dignissim aptent. Neque sodales orci libero fringilla sem sem molestie...",
    Leader: "Larissa Roger",
    Submitted: "2025-03-10",
    Count: 10,
  },
];

const dataFilterSort = [
  { Value: "[Name] asc", Text: "Name [↑]" },
  { Value: "[Name] desc", Text: "Name [↓]" },
];

const dataFilterStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Tidak Aktif", Text: "Tidak Aktif" },
];

const dataFilterJenis = [
  { Value: "Jenis Improvement", Text: "Jenis Improvement" },
  { Value: "Kategori Keilmuan", Text: "Kategori Keilmuan" },
];

export default function QualityControlProjectIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Name] asc",
    status: "Aktif",
    jenis: "",
  });

  const searchQuery = useRef();
  const searchFilterSort = useRef();
  const searchFilterStatus = useRef();
  const searchFilterJenis = useRef();

  function handleSetCurrentPage(newCurrentPage) {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => {
      return {
        ...prevFilter,
        page: newCurrentPage,
      };
    });
  }

  function handleSearch() {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => {
      return {
        ...prevFilter,
        page: 1,
        query: searchQuery.current.value,
        sort: searchFilterSort.current.value,
        status: searchFilterStatus.current.value,
        jenis: searchFilterJenis.current.value,
      };
    });
  }

  function handleSetStatus(id) {
    setIsLoading(true);
    setIsError(false);
    UseFetch(API_LINK + "MasterSetting/SetStatusSetting", {
      idSetting: id,
    })
      .then((data) => {
        if (data === "ERROR" || data.length === 0) setIsError(true);
        else {
          SweetAlert(
            "Sukses",
            "Status data alat/mesin berhasil diubah menjadi " + data[0].Status,
            "success"
          );
          handleSetCurrentPage(currentFilter.page);
        }
      })
      .then(() => setIsLoading(false));
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);

      try {
        const data = await UseFetch(
          API_LINK + "MasterSetting/GetSetting",
          currentFilter
        );

        if (data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const formattedData = data.map((value) => ({
            ...value,
            Aksi: ["Toggle", "Detail", "Edit"],
            Alignment: ["center", "left", "center", "center", "center"],
          }));
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

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="my-3">
        <div className="mb-4 color-primary text-center">
          <div className="d-flex gap-3 justify-content-center">
            <h2 className="display-1 fw-bold">Quality</h2>
            <div className="d-flex align-items-end mb-2">
              <h2 className="display-5 fw-bold align-items-end">
                Control Project
              </h2>
            </div>
          </div>
        </div>
      </div>
      {isError.error && (
        <div className="flex-fill ">
          <Alert
            type="danger"
            message={isError.message}
            handleClose={() => setIsError({ error: false, message: "" })}
          />
        </div>
      )}
      <div className="flex-fill">
        <div className="input-group">
          <Button
            iconName="add"
            label="Register"
            classType="success"
            onClick={() => onChangePage("add")}
          />
          <Input
            ref={searchQuery}
            forInput="pencarianSetting"
            placeholder="Search"
          />
          <Button
            iconName="search"
            classType="primary px-3"
            title="Search"
            onClick={handleSearch}
          />
          <Filter>
            <DropDown
              ref={searchFilterSort}
              forInput="ddUrut"
              label="Sort By"
              type="none"
              arrData={dataFilterSort}
              defaultValue="[Nama Alat/Mesin] asc"
            />
            <DropDown
              ref={searchFilterJenis}
              forInput="ddJenis"
              label="Type"
              type="semua"
              arrData={dataFilterJenis}
              defaultValue=""
            />
            <DropDown
              ref={searchFilterStatus}
              forInput="ddStatus"
              label="Status"
              type="none"
              arrData={dataFilterStatus}
              defaultValue="Aktif"
            />
          </Filter>
        </div>
      </div>
      <div className="mt-3 mb-5">
        <div className="mb-3">
          {inisialisasiDataQcp.map((item, index) => (
            <div className="shadow rounded-5 mb-3" key={index}>
              <div className="row  p-4">
                <div className="col-md-10 mb-3">
                  <div className="d-flex">
                    <h3 className="display-6 fw-bold color-primary">
                      {maxCharDisplayed(item.Title, 50)}
                    </h3>
                    <div className="d-flex align-items-end mx-3 mb-3">
                      <span className="badge rounded-pill text-bg-primary">
                        {item.Jenis}
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p
                      className="fs-6 fw-light"
                      style={{ textAlign: "justify" }}
                    >
                      {maxCharDisplayed(item.Case, 400)}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>
                      <strong>Leader & Facilitator: </strong>
                      {item.Leader}
                    </span>
                    <strong>Submitted on: {item.Submitted}</strong>
                  </div>
                </div>
                <div className="col-md-2 d-flex justify-content-center align-items-center">
                  <button className="btn btn-light border border-primary rounded-5 w-75">
                    Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Paging
            pageSize={PAGE_SIZE}
            pageCurrent={currentFilter.page}
            totalData={currentData[0]["Count"]}
            navigation={handleSetCurrentPage}
          />
        </div>
      </div>
    </>
  );
}
