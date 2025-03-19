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
    Name: null,
    Type: null,
    Status: null,
    Count: 0,
  },
];

const dataFilterSort = [
  // { Value: "[Team Name] asc", Text: "Team Name [↑]" },
  // { Value: "[Team Name] desc", Text: "Team Name [↓]" },
  // { Value: "[Circle Title] asc", Text: "[Circle Title] [↑]" },
  // { Value: "[Circle Title] desc", Text: "[Circle Title] [↓]" },
  // { Value: "[Circle Benefit] asc", Text: "[Circle Benefit] [↑]" },
  // { Value: "[Circle Benefit] desc", Text: "[Circle Benefit] [↓]" },
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
  { Value: "Revision", Text: "Revision" },
  { Value: "Rejected", Text: "Rejected" },
];

// const dataFilterJenis = [
//   { Value: "Jenis Improvement", Text: "Jenis Improvement" },
//   { Value: "Kategori Keilmuan", Text: "Kategori Keilmuan" },
//   { Value: "Kategori Peran Inovasi", Text: "Kategori Peran Inovasi" },
// ];

export default function SystemSuggestionIndex({ onChangePage }) {
  const cookie = Cookies.get("activeUser");
  let userInfo = "";
  if (cookie) userInfo = JSON.parse(decryptId(cookie));

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Start Date] asc",
    status: "",
    jenis: "SS",
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

  const handleSubmit = async (id) => {
    setIsError(false);
    const confirm = await SweetAlert(
      "Confirm",
      "Are you sure you want to submit this registration form? Once submitted, the form will be final and cannot be changed.",
      "warning",
      "SUBMIT",
      null,
      "",
      true
    );

    if (confirm) {
      UseFetch(API_LINK + "RencanaSs/SentRencanaSs", {
        id: id,
      })
        .then((data) => {
          if (data === "ERROR" || data.length === 0) setIsError(true);
          else {
            SweetAlert(
              "Success",
              "Thank you for submitting your registration form. Please wait until the next update",
              "success"
            );
            handleSetCurrentPage(currentFilter.page);
          }
        })
        .then(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);

      try {
        const data = await UseFetch(
          API_LINK + "RencanaSs/GetRencanaSS",
          currentFilter 
        );

        if (data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const role = userInfo.role.slice(0, 5);
          const formattedData = data.map((value, index) => ({
            Key: value.Key,
            No: index + 1,
            "Name": maxCharDisplayed(value["Name"], 30),
            "Project Title": maxCharDisplayed(
              decodeHtml(value["Project Title"]).replace(/<\/?[^>]+(>|$)/g, ""),
              50
            ),
            Category: value["Category"],
            "Project Benefit": separator(value["Project Benefit"]),
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
                : role === "ROL01" && value["Status"] === "Waiting Approval"
                ? ["Detail", "Reject", "Approve"]
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
            <h2 className="display-1 fw-bold">Suggestion</h2>
            <div className="d-flex align-items-end mb-2">
              <h2 className="display-5 fw-bold align-items-end">
                System
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
              arrData={dataFilterStatus}
              defaultValue="Draft"
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
            onEdit={onChangePage}
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