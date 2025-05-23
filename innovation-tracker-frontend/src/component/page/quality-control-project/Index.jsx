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
import Icon from "../../part/Icon";
import {
  decodeHtml,
  formatDate,
  maxCharDisplayed,
  separator,
} from "../../util/Formatting";
import { decryptId } from "../../util/Encryptor";
import Cookies from "js-cookie";
import NotFound from "../not-found/Index";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "Circle Name": null,
    "Project Title": null,
    Category: null,
    "Project Benefit": null,
    "Start Date": null,
    "End Date": null,
    Period: null,
    Status: null,
    Count: 0,
  },
];

const dataFilterSort = [
  { Value: "[Circle Name] asc", Text: "Circle Name [↑]" },
  { Value: "[Circle Name] desc", Text: "Circle Name [↓]" },
  { Value: "[Project Title] asc", Text: "[Project Title] [↑]" },
  { Value: "[Project Title] desc", Text: "[Project Title] [↓]" },
  { Value: "[Project Benefit] asc", Text: "[Project Benefit] [↑]" },
  { Value: "[Project Benefit] desc", Text: "[Project Benefit] [↓]" },
  { Value: "[Category] asc", Text: "[Category] [↑]" },
  { Value: "[Category] desc", Text: "[Category] [↓]" },
  { Value: "[Start Date] asc", Text: "[Start Date] [↑]" },
  { Value: "[Start Date] desc", Text: "[Start Date] [↓]" },
  { Value: "[End Date] asc", Text: "[End Date] [↑]" },
  { Value: "[End Date] desc", Text: "[End Date] [↓]" },
  { Value: "[Period] asc", Text: "[Period] [↑]" },
  { Value: "[Period] desc", Text: "[Period] [↓]" },
];

const dataFilterStatus = [
  { Value: "Draft", Text: "Draft" },
  { Value: "Waiting Approval", Text: "Waiting Approval" },
  { Value: "Approved", Text: "Approved" },
  { Value: "Rejected", Text: "Rejected" },
];

export default function QualityControlProjectIndex({ onChangePage }) {
  const cookie = Cookies.get("activeUser");
  let userInfo = "";
  if (cookie) {
    try {
      userInfo = JSON.parse(decryptId(cookie));
    } catch (e) {
      userInfo = "";
    }
  }

  if (!userInfo) {
    return (
      <div>
        <div className="mt-3 flex-fill">
          <Alert type="danger" message="Your session has expired." />
        </div>
        <NotFound />
      </div>
    );
  }

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Category] asc",
    status: "",
    jenis: "QCP",
    role: userInfo.role,
    npk: userInfo.npk,
  });

  const searchQuery = useRef();
  const searchFilterSort = useRef();
  const searchFilterStatus = useRef();

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
    const data = currentData.find((item) => item.Key === key);
    return data ? data.Status : null;
  };

  const handleSubmit = async (id) => {
    setIsError(false);
    setIsLoading(true);

    const tempStatus = getStatusByKey(id);

    const confirm = await SweetAlert(
      "Confirm",
      "Are you sure about this value?",
      "info",
      "Submit",
      null,
      "",
      true
    );

    if (confirm) {
      try {
        const updateResult = await UseFetch(
          API_LINK + "RencanaCircle/SentRencanaCircle",
          {
            id: id,
          }
        );

        if (updateResult === "ERROR" || updateResult.length === 0) {
          setIsError(true);
        } else {
          const decodedTitle = decodeHtml(
            decodeHtml(decodeHtml(currentData["Project Title"]))
          ).replace(/<\/?[^>]+(>|$)/g, "");

          const decodedNama = decodeHtml(
            decodeHtml(decodeHtml(userInfo.nama))
          ).replace(/<\/?[^>]+(>|$)/g, "'");

          const notifikasiMessage = `A new Quality Control Project registration has been submitted by ${decodedNama} - ${userInfo.npk} with the title: ${decodedTitle}. Please review and take the appropriate action.`;

          await UseFetch(API_LINK + "Notifikasi/CreateNotifikasiQCC1", {
            from: userInfo.username,
            to: "",
            message: notifikasiMessage,
            sis: -1,
            rci: id,
          });

          SweetAlert(
            "Success",
            "Thank you for submitting your registration form. Please wait until the next update",
            "success"
          );

          handleSetCurrentPage(currentFilter.page);
        }
      } catch (error) {
        console.error("Terjadi error saat submit:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
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
      UseFetch(API_LINK + "RencanaCircle/SetApproveRencanaCircle", {
        id: id,
        set: "Approved",
      })
        .then(async (data) => {
          const decodedTitle = decodeHtml(
            decodeHtml(decodeHtml(currentData["Project Title"]))
          ).replace(/<\/?[^>]+(>|$)/g, "");

          if (data === "ERROR" || data.length === 0) {
            setIsError(true);
          } else {
            await UseFetch(
              API_LINK + "Notifikasi/CreateNotifikasiApproveRejectQCC",
              {
                from: userInfo.username,
                to: "",
                message: `Quality Control Project Approve. Your Quality Control Project titled ${decodedTitle} has been approved and please continue to fill in the next form`,
                sis: -1,
                rci: id,
              }
            );
            handleSetCurrentPage(currentFilter.page);
          }
        })
        .catch(() => setIsError(true))
        .finally(() => setIsLoading(false));
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
      UseFetch(API_LINK + "RencanaCircle/SetApproveRencanaCircle", {
        id: id,
        set: "Rejected",
        reason: confirm,
      })
        .then(async (data) => {
          const decodedTitle = decodeHtml(
            decodeHtml(decodeHtml(currentData["Project Title"]))
          ).replace(/<\/?[^>]+(>|$)/g, "");

          if (data === "ERROR" || data.length === 0) {
            setIsError(true);
          } else {
            await UseFetch(
              API_LINK + "Notifikasi/CreateNotifikasiApproveRejectQCC",
              {
                from: userInfo.username,
                to: "",
                message: `Quality Control Project Reject. Your Quality Control Project titled ${decodedTitle} has been rejected. Please check the provided reason for further details.`,
                sis: -1,
                rci: id,
              }
            );
            handleSetCurrentPage(currentFilter.page);
          }
        })
        .catch(() => setIsError(true))
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);

      try {
        const data = await UseFetch(
          API_LINK + "RencanaCircle/GetRencanaQCP",
          currentFilter
        );

        if (data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const role = userInfo.role.slice(0, 5);
          const inorole = userInfo.inorole;
          const formattedData = data.map((value, index) => ({
            Key: value.Key,
            No: value["No"],
            "Circle Name": maxCharDisplayed(value["Circle Name"], 30),
            "Project Title": maxCharDisplayed(
              decodeHtml(
                decodeHtml(decodeHtml(value["Project Title"]))
              ).replace(/<\/?[^>]+(>|$)/g, ""),
              50
            ),
            Category: value["Category"],
            "Project Benefit": separator(value["Project Benefit"]),
            "Start Date": formatDate(value["Start Date"], true),
            "End Date": formatDate(value["End Date"], true),
            Period: value["Period"],
            Status: value["Status"],
            Count: value["Count"],
            IsBold:
              value["Creaby"] === userInfo.username
                ? ["Draft Steps", "Approved"].includes(value["Status"])
                : ["Waiting Approval", "Draft Steps", "Draft Scoring", "Approved"].includes(
                    value["Status"]
                  ),
            Action:
              role === "ROL01" &&
              value["Status"] === "Draft" &&
              value["Creaby"] === userInfo.username
                ? ["Detail", "Edit", "Submit"]
                : role === "ROL01" &&
                  value["Status"] === "Waiting Approval" &&
                  value["Creaby"] !== userInfo.username
                ? ["Detail", "Reject", "Approve"]
                : inorole === "Facilitator" &&
                  value["Status"] === "Scoring"
                ? ["Detail", "Scoring"]
                : role === "ROL01" &&
                  value["Status"] === "Draft Steps" &&
                  value["Creaby"] === userInfo.username
                ? ["Detail", "EditFillTheStep", "Submit"]
                : role === "ROL01" &&
                  value["Status"] === "Rejected" &&
                  value["Creaby"] === userInfo.username
                ? ["Detail", "Edit", "Submit"]
                : role === "ROL36" && value["Status"] === "Approved"
                ? ["Detail", "Submit"]
                : (value["Status"] === "Approved" || value["Status"] === "Phase 1 is Scored") &&
                  value["Creaby"] === userInfo.username
                ? ["Detail", "FillTheStep"]
                : value["Status"] === "Draft Steps" &&
                  value["Creaby"] === userInfo.username
                ? ["Detail", "EditFillTheStep", "Submit"]
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
          {userInfo.role.slice(0, 5) !== "ROL36" ? (
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
              defaultValue="[Category] asc"
            />
            <DropDown
              ref={searchFilterStatus}
              forInput="ddStatus"
              label="Status"
              type="semua"
              arrData={
                userInfo.role.slice(0, 5) === "ROL36"
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
            onFillStep={onChangePage}
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
