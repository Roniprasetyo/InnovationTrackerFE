import { useRef, useState, useEffect } from "react";
import { decodeHtml, formatDate, separator } from "../../util/Formatting";
import { API_LINK, EMP_API_LINK, FILE_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import Icon from "../../part/Icon";
import Table from "../../part/Table";
import { decryptId } from "../../util/Encryptor";
import Cookies from "js-cookie";
import Label from "../../part/Label";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    Name: null,
    Section: null,
    Count: 0,
  },
];

export default function QualityControlProjectDetail({ onChangePage, withID }) {
  const cookie = Cookies.get("activeUser");
  let userInfo = "";
  if (cookie) userInfo = JSON.parse(decryptId(cookie));
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);

  const [listEmployee, setListEmployee] = useState([]);

  const formDataRef = useRef({
    Key: "",
    Category: "",
    CategoryImp: "",
    "Group Name": "",
    "Project Title": "",
    "Project Benefit": 0,
    Case: "",
    CaseFile: "",
    Problem: "",
    ProblemFile: "",
    Goal: "",
    GoalFile: "",
    Scope: "",
    "Start Date": "",
    "End Date": "",
    Quality: "",
    Cost: null,
    Delivery: "",
    Safety: "",
    Moral: "",
    Status: "",
    Creaby: "",
    member: [{}],
  });

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
            npk: value.npk,
            upt: value.upt_bagian,
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
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "RencanaCircle/GetRencanaQCPById",
          {
            id: withID,
          }
        );

        if (data === "ERROR" || data.length === 0) {
          throw new Error("Error: Failed to get QCP data");
        } else {
          formDataRef.current = data;
          const members = data.member.filter(
            (item) => item.Position === "Member"
          );
          const memberCount = members.length || 0;
          memberCount > 0
            ? setCurrentData(
                members?.map((item, index) => ({
                  Key: index,
                  No: index + 1,
                  Name: item.Name,
                  Section:
                    listEmployee.find((value) => value.npk === item.Npk)?.upt ||
                    "",
                  Count: memberCount,
                  Alignment: ["center", "left", "left"],
                }))
              )
            : setCurrentData(inisialisasiData);
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [listEmployee, withID]);

  if (isLoading) return <Loading />;

  return (
    <>
      <div
        className="row my-3"
        style={{ display: "flex", alignItems: "center" }}
      >
        <h2
          className="fw-bold"
          style={{ color: "rgb(0, 89, 171)", margin: "0" }}
        >
          <Icon
            type="Bold"
            name="angle-left"
            cssClass="btn me-1 py-0 text"
            onClick={() => onChangePage("index")}
            style={{
              fontSize: "22px",
              cursor: "pointer",
              color: "rgb(0, 89, 171)",
            }}
          />
          Detail Data
        </h2>
      </div>
      <div className="mt-3">
        {isError.error && (
          <div className="flex-fill ">
            <Alert
              type="danger"
              message={isError.message}
              handleClose={() => setIsError({ error: false, message: "" })}
            />
          </div>
        )}
        <div className="card mb-5">
          <div className="card-header">
            <h3 className="fw-bold text-center">QCP REGISTRATION DETAIL</h3>
          </div>
          <div className="card-body p-3">
            {isLoading ? (
              <Loading />
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="card mb-3">
                    <div className="card-header">
                      <h5 className="fw-medium">Team Member</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <Label
                            title="Circle Name"
                            data={formDataRef.current["Group Name"] || "-"}
                          />
                        </div>
                        <div className="col-md-6">
                          <Label title="Section" data={userInfo.upt} />
                        </div>
                        <div className="col-md-6">
                          <Label
                            title="Facilitator"
                            data={
                              formDataRef.current.member.find(
                                (item) => item.Position === "Facilitator"
                              )?.Name || "-"
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <Label
                            title="Leader"
                            data={
                              formDataRef.current.member.find(
                                (item) => item.Position === "Leader"
                              )?.Name || "-"
                            }
                          />
                        </div>
                      </div>
                      <Label title="Team Member" />
                      <Table data={currentData} />
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="card mb-3">
                    <div className="card-header">
                      <h5 className="fw-medium">Project Description</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-lg-12">
                          <Label
                            title="Project Title"
                            data={decodeHtml(
                              formDataRef.current["Project Title"] || "-"
                            )}
                          />
                        </div>
                        <div className="col-lg-3">
                          <Label
                            title="Innovation Category"
                            data={formDataRef.current.Category || "-"}
                          />
                        </div>
                        <div className="col-lg-3">
                          <Label
                            title="Knowledge Category"
                            data={decodeHtml(
                              formDataRef.current.CategoryImp || "-"
                            )}
                          />
                        </div>
                        <div className="col-lg-3">
                          <Label
                            title="Project Timeframe"
                            data={
                              formatDate(
                                formDataRef.current["Start Date"].split("T")[0],
                                true
                              ) +
                                " - " +
                                formatDate(
                                  formDataRef.current["End Date"].split("T")[0],
                                  true
                                ) || "-"
                            }
                          />
                        </div>
                        <div className="col-lg-3">
                          <Label
                            title="Period"
                            data={formDataRef.current["Period"] || "-"}
                          />
                        </div>
                        <div className="col-lg-12">
                          <Label
                            title="Project Scope"
                            data={decodeHtml(
                              formDataRef.current["Scope"] || "-"
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="card mb-3">
                    <div className="card-header">
                      <h5 className="fw-medium">Project Charter</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-lg-12 mb-4">
                          <Label
                            title="Bussiness Case"
                            data={decodeHtml(
                              formDataRef.current["Case"] || "-"
                            )}
                          />
                          {formDataRef.current["CaseFile"] && (
                            <a
                              href={FILE_LINK + formDataRef.current["CaseFile"]}
                              className="text-decoration-none"
                              target="_blank"
                            >
                              <sub>[Download File]</sub>
                            </a>
                          )}
                        </div>
                        <hr />
                        <div className="col-lg-12 mb-4">
                          <Label
                            title="Problem Statement"
                            data={decodeHtml(
                              formDataRef.current["Problem"] || "-"
                            )}
                          />
                          {formDataRef.current["ProblemFile"] && (
                            <a
                              href={
                                FILE_LINK + formDataRef.current["ProblemFile"]
                              }
                              className="text-decoration-none"
                              target="_blank"
                            >
                              <sub>[Download File]</sub>
                            </a>
                          )}
                        </div>
                        <hr />
                        <div className="col-lg-12 mb-3">
                          <Label
                            title="Goal Statement​"
                            data={decodeHtml(
                              formDataRef.current["Goal"] || "-"
                            )}
                          />
                          {formDataRef.current["GoalFile"] && (
                            <a
                              href={FILE_LINK + formDataRef.current["GoalFile"]}
                              className="text-decoration-none"
                              target="_blank"
                            >
                              <sub>[Download File]</sub>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="card mb-3">
                    <div className="card-header">
                      <h5 className="fw-medium">Project Benefit</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-lg-12">
                          <Label
                            title="Project Benefit (Rp)"
                            data={
                              separator(
                                formDataRef.current["Project Benefit"]
                              ) || "-"
                            }
                          />
                        </div>
                        <div className="col-lg-6">
                          <label className="form-label fw-bold">
                            Tangible Benefit
                          </label>
                          <div className="d-flex align-items-center ms-2">
                            <Label
                              title="Quality"
                              data={formDataRef.current["Quality"] || "-"}
                            />
                          </div>
                          <div className="d-flex align-items-center ms-2">
                            <Label
                              title="Cost"
                              data={formDataRef.current["Cost"] || "-"}
                            />
                          </div>
                          <div className="d-flex align-items-center ms-2">
                            <Label
                              title="Delivery"
                              data={formDataRef.current["Delivery"] || "-"}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 p-3">
                          <label className="form-label fw-bold">
                            Intangible Benefit
                          </label>
                          <div className="d-flex align-items-center ms-2">
                            <Label
                              title="Safety"
                              data={formDataRef.current["Safety"] || "-"}
                            />
                          </div>
                          <div className="d-flex align-items-center ms-2">
                            <Label
                              title="Moral"
                              data={formDataRef.current["Moral"] || "-"}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end pe-3 mb-3">
                  <sub>
                    Submitted by{" "}
                    <strong>{formDataRef.current["Creaby"] || "-"}</strong>
                  </sub>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
