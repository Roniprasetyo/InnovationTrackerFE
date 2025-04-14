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
    Count: 0,
  },
];

export default function MiniConventionDetail({ onChangePage, withID }) {
  const cookie = Cookies.get("activeUser");
  let userInfo = "";
  if (cookie) userInfo = JSON.parse(decryptId(cookie));
  const [errors, setErrors] = useState({});
  const [listEmployee, setListEmployee] = useState([]);
  const [userData, setUserData] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const formDataRef = useRef({
    Key: "",
    NPK:"",
    Period: "",
    Category: "",
    CategoryImp: "",
    "Project Title": "",
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
    "Alasan Penolakan": "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(
          API_LINK + "MiniConvention/GetMiniConventionById",
          {
            id: withID,
          }
        );

        if (data === "ERROR" || data.length === 0) {
          throw new Error("Error: Failed to get SS data");
        } else {
          formDataRef.current = data[0];
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
  }, [withID]);

  useEffect(() => {
    if (listEmployee.length > 0 && userInfo?.upt) {
      const userData = listEmployee.find(
        (value) =>
          value.npk === formDataRef.current["NPK"]
      );
      setUserData(userData);
    }
  }, [listEmployee, userInfo]);

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
            <h3 className="fw-bold text-center">SS CONVENTION DETAIL</h3>
          </div>
          <div className="card-body p-3">
            {isLoading ? (
              <Loading />
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="card mb-3">
                    <div className="card-header">
                      <h5 className="fw-medium">User Data</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4">
                          <Label
                            title="NPK"
                            data={formDataRef.current["NPK"] || "-"}
                          />
                        </div>

                        <div className="col-md-4">
                          <Label
                            title="Name​"
                            data={userData["name"]}
                          />
                        </div>

                        <div className="col-md-4">
                          <Label
                            title="Section​"
                            data={userData["upt"]}
                          />
                        </div>
                      </div>
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
                            title="Improvement Category"
                            data={formDataRef.current.CategoryImp || "-"}
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
                        </div><hr />
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
                        </div><hr />
                        <div className="col-lg-12 mb-4">
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
                    <div className="card-body">
                      <div className="row">
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
                  {formDataRef.current.Status === "Rejected" && (
                    <div>
                      <hr />
                      <h5 className="fw-medium fw-bold">Reason for Rejection</h5>
                      <Label
                      data={formDataRef.current["Alasan Penolakan"]}/>
                      <hr />
                    </div>
                  )}
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