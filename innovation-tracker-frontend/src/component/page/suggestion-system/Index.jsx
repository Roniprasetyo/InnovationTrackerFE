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
    "Project Title": null,
    "Start Date": null,
    "End Date": null,
    "Period": null,
    "Category": null,
    Status: null,
    Creaby: null,
    Count: 0,
  },
];

const dataFilterSort = [
  { Value: "[Project Title] asc", Text: "[Project Title] [↑]" },
  { Value: "[Project Title] desc", Text: "[Project Title] [↓]" },
  { Value: "[Start Date] asc", Text: "[Start Date] [↑]" },
  { Value: "[Start Date] desc", Text: "[Start Date] [↓]" },
  { Value: "[End Date] asc", Text: "[End Date] [↑]" },
  { Value: "[End Date] desc", Text: "[End Date] [↓]" },
  { Value: "[Period] asc", Text: "[Period] [↑]" },
  { Value: "[Period] desc", Text: "[Period] [↓]" },
  { Value: "[Category] asc", Text: "[Category] [↑]" },
  { Value: "[Category] desc", Text: "[Category] [↓]" },
];

const dataFilterStatus = [
  { Value: "Draft", Text: "Draft" },
  { Value: "Waiting Approval", Text: "Waiting Approval" },
  { Value: "Approved", Text: "Approved" },
  { Value: "Rejected", Text: "Rejected" },
];

// const dataFilterJenis = [
//   { Value: "Jenis Improvement", Text: "Jenis Improvement" },
//   { Value: "Kategori Keilmuan", Text: "Kategori Keilmuan" },
//   { Value: "Kategori Peran Inovasi", Text: "Kategori Peran Inovasi" },
// ];

export default function SuggestionSytemIndex({ onChangePage, onScoring, onEditScoring }) {
  const cookie = Cookies.get("activeUser");
  let userInfo = "";
  if (cookie) userInfo = JSON.parse(decryptId(cookie));
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listEmployee, setListEmployee] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [listReviewer, setListReviewer] = useState([]);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Category] asc",
    status: "",
    jenis: "SS",
    role: userInfo.role,
    npk: userInfo.npk,
  });
  const [penJabatan, setPenJabatan] = useState([]);
  // console.log("user info", userInfo);

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
      };
    });
  }

  const getStatusByKey = (key) => {
    const data = currentData.find(item => item.Key === key);
    return data ? data.Status : null;
  };

  const handleSubmit = async (id) => {
    setIsError(false);
    const tempStatus = getStatusByKey(id);
    
    const confirm = await SweetAlert(
      "Confirm",
      "Are you sure about this value?",
      "warning",
      "Submit",
      null,
      "",
      true
    );


    if (confirm) {
      console.log(1, id);
      if(tempStatus !== "Approved") {
        UseFetch(API_LINK + "RencanaSS/UpdateStatusPenilaian", {
          id: id,
        })
        .then((data) => {
          if (!data) {
            setIsError(true)
          }
          else {
            SweetAlert(
              "Success",
              "Thank you for your rating. Please wait until the next update",
              "success"
            );
            handleSetCurrentPage(currentFilter.page);
          }
        })
          .then(() => setIsLoading(false));
      }
      // else {
      //   const reviewer = confirm.reviewer;
      //   const batch = confirm.batch;
      //   const category = confirm.category;
      //   UseFetch(API_LINK + "RencanaSS/CreateKonvensiSS", {
      //     reviewer,
      //     batch,
      //     id,
      //     category,
      //   })
      //     .then((data) => {
      //       if (data === "ERROR" || data.length === 0) setIsError(true);
      //       else {
      //         SweetAlert(
      //           "Success",
      //           "Thank you for submitting your registration form. Please wait until the next update",
      //           "success"
      //         );
      //         handleSetCurrentPage(currentFilter.page);
      //       }
      //     })
      //     .then(() => setIsLoading(false));
      // }
    }
  };

  const handleApprove = async (id) => {
    setIsError(false);
    const confirm = await SweetAlert(
      "Confirm",
      "Are you sure you want to approve this submission?",
      "warning",
      "Approve",
      null,
      "",
      true
    );

    if (confirm) {
      UseFetch(API_LINK + "RencanaSS/SetApproveRencanaSS", {
        id: id,
        set: "Approved",
        reason: null,
      })
        .then((data) => {
          if (data === "ERROR" || data.length === 0) setIsError(true);
          else {
            handleSetCurrentPage(currentFilter.page);
          }
        })
        .then(() => setIsLoading(false));
    }
  };

  const handleReject = async (id) => {
    setIsError(false);
    const confirm = await SweetAlert(
      "Confirm",
      "Are you sure you want to reject this submission?",
      "warning",
      "Reject",
      null,
      "",
      true
    );

    if (confirm) {
      UseFetch(API_LINK + "RencanaSS/SetApproveRencanaSS", {
        id: id,
        set: "Rejected",
        reason: confirm,
      })
        .then((data) => {
          if (data === "ERROR" || data.length === 0) setIsError(true);
          else {
            handleSetCurrentPage(currentFilter.page);
          }
        })
        .then(() => setIsLoading(false));
    }
  };

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

    useEffect(() => {
      const fetchDataPenilaian = async () => {
        setIsError((prevError) => ({ ...prevError, error: false }));
        try {
          const data = await UseFetch(API_LINK + "RencanaSS/GetPenilaian2");
  
          // console.log("SIS ID: ", data);
          if (data === "ERROR") {
            throw new Error("Error: Failed to get the category data.");
          } else {
            setPenJabatan({
              sis_id: data.map((value) => value["Id Sis"]),
              pen_created_by: data.map((value) => value.CreatedBy)
            });
          }
        } catch (error) {
          window.scrollTo(0, 0);
          setIsError((prevError) => ({
            ...prevError,
            error: true,
            message: error.message,
          }));
          setListReviewer({});
        }
      };
      fetchDataPenilaian();
    }, [])
    // console.log("Jabatannn: ", penJabatan);

    useEffect(() => {
      const fetchData = async () => {
        setIsError((prevError) => ({ ...prevError, error: false }));
        try {
          const data = await UseFetch(API_LINK + "RencanaSS/GetListReviewer");
  
          if (data === "ERROR") {
            throw new Error("Error: Failed to get the category data.");
          } else {
            setListReviewer(data);
          }
        } catch (error) {
          window.scrollTo(0, 0);
          setIsError((prevError) => ({
            ...prevError,
            error: true,
            message: error.message,
          }));
          setListReviewer({});
        }
      };
  
      fetchData();
    }, []);

    console.log("User Info ", userInfo);
    
    useEffect(() => {
      const fetchData = async () => {
        setIsError((prevError) => ({ ...prevError, error: false }));
        try {
          const data = await UseFetch(API_LINK + "MasterSetting/GetListSetting", {
            p1: "Innovation Category",
          });
  
          if (data === "ERROR") {
            throw new Error("Error: Failed to get the category data.");
          } else {
            setListCategory(data.filter((item) => item.Text.includes("Batch")));
          }
        } catch (error) {
          window.scrollTo(0, 0);
          setIsError((prevError) => ({
            ...prevError,
            error: true,
            message: error.message,
          }));
          setListCategory({});
        }
      };
  
      fetchData();
    }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);

      try {
        const data = await UseFetch(
          API_LINK + "RencanaSS/GetRencanaSS",
          currentFilter
        );
        console.log("DATA SS:", data);

        if (data === "ERROR") {
          // setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const hanifData = listEmployee.find((value) => value.username === currentData.Creaby);
          // console.log("DATA HANIF:", hanifData);
          const role = userInfo.role.slice(0, 5);
          const inorole = userInfo.inorole;
          const formattedData = data.map((value, index) => {
            const foundEmployee = listEmployee.find(
              (emp) => emp.username === value["Creaby"]
            );
          
            // console.log("FOUND KEY: ", listEmployee);
            // console.log("1",userInfo)
            console.log("v",value);
            console.log("us",userInfo);
            console.log("2",foundEmployee)
            console.log("3",penJabatan)
            console.log("4",data)
            const uniqueKeys = [...new Set(data.map(item => item.Key))];
// console.log("Unique Keys:", uniqueKeys);
            return {
              Key: value.Key,
              No: value["No"],
              "Project Title": maxCharDisplayed(
                decodeHtml(
                  decodeHtml(decodeHtml(value["Project Title"]))
                ).replace(/<\/?[^>]+(>|$)/g, ""),
                50
              ),
              Category: value["Category"],
              "Start Date": formatDate(value["Start Date"], true),
              "End Date": formatDate(value["End Date"], true),
              Period: value["Period"],
              Status: value["Status"],
              Count: value["Count"],
              Action:
                role === "ROL03" &&
                value["Status"] === "Draft" &&
                value["Creaby"] === userInfo.username
                  ? ["Detail", "Edit", "Submit"]
                  : inorole === "Facilitator" &&
                    value["Status"] === "Waiting Approval"
                  ? ["Detail", "Reject", "Approve"]
                  : role === "ROL03" &&
                    value["Status"] === "Rejected" &&
                    value["Creaby"] === userInfo.username
                  ? ["Detail", "Edit", "Submit"]
                  : userInfo.upt === foundEmployee.upt && userInfo.jabatan === "Kepala Seksi" && value["Status"] === "Waiting Approval"
                  ? ["Detail", "Reject", "Approve"]
                  : role === "ROL01" &&
                  value["Status"] === "Approved"
                  ? ["Detail", "Submit"]
                  : userInfo.upt === foundEmployee.upt && userInfo.jabatan === "Kepala Seksi" && (value["Status"] === "Approved" || value["Status"] === "Scoring") 
                  ? ["Detail", "Scoring"]
                  : userInfo.jabatan === "Sekretaris Prodi" || userInfo.jabatan === "Kepala Departemen"
                  ? ["Detail", "Scoring"]
                  // Status Approved By Role 03
                  // : userInfo.upt === foundEmployee.upt && userInfo.jabatan === "Kepala Seksi" && (value["Status"] === "Approved" || value["Status"] === "Draft Scoring") && uniqueKeys.some(key => penJabatan.sis_id.includes(key)) && value.Creaby === userInfo.username ? ["Detail"] 
                  : userInfo.upt === foundEmployee.upt && userInfo.jabatan === "Kepala Seksi" && value["Status"] === "Approved"  ? ["Detail", "Scoring"] 
                  : userInfo.upt === foundEmployee.upt && userInfo.jabatan === "Kepala Seksi" && value["Status"] === "Draft Scoring" ? ["Detail", "EditScoring", "Submit"] 
                  : ["Detail"],
              Alignment: [
                "center",
                "left",
                "left",
                "left",
                "right",
                "center",
                "center",
                "center",
                "center",
                "center",
              ],
            };
          });
          // console.log(406, formattedData);          
          setCurrentData(formattedData);
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    // console.log("COOKIE", JSON.parse(decryptId(cookie))); 
    fetchData();
  }, [currentFilter, listEmployee]);
  
  if (isLoading) return <Loading />;

  console.log("DeptArrData:", userInfo);

  return (
    <>
      <div className="my-3">
        <div className="mb-4 color-primary text-center">
          <div className="d-flex gap-3 justify-content-center">
            <h2 className="display-1 fw-bold">Suggestion</h2>
            <div className="d-flex align-items-end mb-2">
              <h2 className="display-5 fw-bold align-items-end">System</h2>
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
          {userInfo.role.slice(0, 5) !== "ROL01" ? (
            <Button
              iconName="add"
              label="Register"
              classType="success"
              onClick={() => onChangePage("add")}
            />
          ) : (
            ""
          )}
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
              defaultValue="[Team Name] asc"
            />
            <DropDown
              ref={searchFilterStatus}
              forInput="ddStatus"
              label="Status"
              type="semua"
              arrData={
                userInfo.role.slice(0, 5) === "ROL01"
                  ? dataFilterStatus.filter((item) => item.Value != "Draft")
                  : dataFilterStatus
              }
              defaultValue=""
            />
          </Filter>
        </div>
      </div>
      <div className="mt-3 mb-5">
        <div className="d-flex flex-column">
          <Table
            data={currentData}
            onDetail={onChangePage}
            onSubmit={handleSubmit}
            onApprove={handleApprove}
            onReject={handleReject}
            onEdit={onChangePage}
            onScoring={onScoring}
            onEditScoring={onEditScoring}
          />
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
