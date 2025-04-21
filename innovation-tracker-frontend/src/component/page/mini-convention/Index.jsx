import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK, EMP_API_LINK } from "../../util/Constants";
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
import {
  decodeHtml,
  formatDate,
  maxCharDisplayed,
  separator,
} from "../../util/Formatting";
import { decryptId } from "../../util/Encryptor";
import Cookies from "js-cookie";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "Submission Name": null,
    "Project Title": null,
    Batch: null,
    Status: null,
    Count: 0,
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

export default function MiniConventionIndex({ onChangePage , onScoring}) {
  const cookie = Cookies.get("activeUser");
  let userInfo = "";
  if (cookie) userInfo = JSON.parse(decryptId(cookie));
  const [isError, setIsError] = useState(false);
  const [listEmployee, setListEmployee] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Submission Name] asc",
    status: "Awaiting Scoring",
    jenis: "Mini Convention",
    role: userInfo.role,
    npk: userInfo.npk,
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

  async function handleDelete(id) {
    setIsError(false);
    const confirm = await SweetAlert(
      "Confirm",
      "Are you sure you want to delete this data?.",
      "warning",
      "DELETE",
      null,
      "",
      true
    );

    if (confirm) {
      UseFetch(API_LINK + "MiniConvention/SetStatusSetting", {
        idSetting: id,
      })
        .then((data) => {
          if (data === "ERROR" || data.length === 0) setIsError(true);
          else {
            SweetAlert("Success", "Data successfully deleted", "success");
            handleSetCurrentPage(currentFilter.page);
          }
        })
        .then(() => setIsLoading(false));
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);

      try {
        const data = await UseFetch(
          API_LINK + "MiniConvention/GetMiniConvention",
          currentFilter
        );

        if (data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const formattedData = data.map((value, index) => {
            const foundEmployee = listEmployee.find(
              (emp) => emp.npk === value["Submission Name"]
            );
          
            console.log("FOND", foundEmployee);
            return {
              Key: value.Key,
              No: value["No"],
              "Submission Name": foundEmployee ? foundEmployee.name : value["Submission Name"] + " (N/A)",
              "Project Title": maxCharDisplayed(
                decodeHtml(
                  decodeHtml(decodeHtml(value["Project Title"]))
                ).replace(/<\/?[^>]+(>|$)/g, ""),
                50
              ),
              Batch: value["Batch"],
              Status: value["Status"],
              Count: value["Count"],
              Action: ["Detail", "Scoring"],
              Alignment: [
                "center",
                "left",
                "left",
                "left",
                "center",
                "center",
              ],
            };
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

  useEffect(() => {
          const fetchData = async () => {
            setIsError((prevError) => ({ ...prevError, error: false }));
            try {
              const response = await fetch(`${EMP_API_LINK}getDataKaryawan`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
              });
      
              const data = await response.json();
              setListEmployee(
                data.map((value) => ({
                  username: value.username,
                  npk: value.npk,
                  name: value.nama,
                  upt: value.upt_bagian,
                  jabatan: value.jabatan,
                }))
              );
  
            } catch (error) {
              window.scrollTo(0, 0);
              setIsError((prevError) => ({
                ...prevError,
                error: true,
                message: error.message,
              }));
              setListEmployee({});
            }
          };
      
          fetchData();
        }, []);

  return (
    <>
      <div className="my-3">
        <div className="mb-4 color-primary text-center">
          <div className="d-flex gap-3 justify-content-center">
            <h2 className="display-1 fw-bold">Mini</h2>
            <div className="d-flex align-items-end mb-2">
              <h2 className="display-5 fw-bold align-items-end">Convention</h2>
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
          <Input
            ref={searchQuery}
            forInput="pencarianSetting"
            isRound
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
              defaultValue="[Name] asc"
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
        {isLoading ? (
          <Loading />
        ) : (
          <div className="table-responsive">
            <Table
              data={currentData}
              onDelete={handleDelete}
              onDetail={onChangePage}
              onEdit={onChangePage}
              onScoring={onScoring}
            />
            <Paging
              pageSize={PAGE_SIZE}
              pageCurrent={currentFilter.page}
              totalData={currentData[0]["Count"]}
              navigation={handleSetCurrentPage}
            />
          </div>
        )}
      </div>
    </>
  );
}
