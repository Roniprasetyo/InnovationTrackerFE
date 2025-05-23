import { useRef, useState, useEffect } from "react";
import { decodeHtml, formatDate, separator } from "../../util/Formatting";
import {
  API_LINK,
  COLOR_PRIMARY,
  EMP_API_LINK,
  FILE_LINK,
} from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import Icon from "../../part/Icon";
import { decryptId } from "../../util/Encryptor";
import Cookies from "js-cookie";
import Label from "../../part/Label";
import Button from "../../part/Button";

export default function SuggestionSystemDetail({ onChangePage, withID }) {
  const cookie = Cookies.get("activeUser");
  let userInfo = "";
  if (cookie) userInfo = JSON.parse(decryptId(cookie));
  const [listEmployee, setListEmployee] = useState([]);
  const [nilaiKepsek, setNilaiKepsek] = useState([]);
  const [nilaiKadept, setNilaiKadept] = useState([]);
  const [nilaiWadir, setNilaiWadir] = useState([]);
  const [userData, setUserData] = useState({});
  const [listKriteriaPenilaian, setListKriteriaPenilaian] = useState([]);
  const [listPenilaianForCoor, setListPenilaianForCoor] = useState([]);
  const [listDetailKriteriaPenilaian, setListDetailKriteriaPenilaian] =
    useState([]);
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const formDataRef = useRef({
    Key: "",
    NPK: "",
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
        const data = await UseFetch(API_LINK + "RencanaSS/GetRencanaSSById", {
          id: withID,
        });

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

  useEffect(() => {
    if (listEmployee.length > 0 && userInfo?.upt) {
      const userData = listEmployee.find(
        (value) => value.npk === formDataRef.current["NPK"]
      );
      setUserData(userData);
    }
  }, [listEmployee, userInfo]);

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "MiniConvention/GetListKriteriaPenilaian"
        );
        const data2 = await UseFetch(
          API_LINK + "RencanaSS/GetPenilaianForCoorById",
          { id: withID }
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          setListKriteriaPenilaian(data);
          setListPenilaianForCoor(data2);
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
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "MiniConvention/GetListDetailKriteriaPenilaian"
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          const dataDetail = data.map((item) => ({
            Text: `${item.Desc} - (${item.Score})`,
            Value: item.Value,
            Score: item.Score,
            Id: item.Value2,
          }));

          setListDetailKriteriaPenilaian(dataDetail);
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
    const kepsek = listPenilaianForCoor.filter(
      (item) =>
        item["Jabatan Penilai"] === "Kepala Seksi" ||
        item["Jabatan Penilai"] === "Sekretaris Prodi"
    );
    const kadept = listPenilaianForCoor.filter(
      (item) =>
        item["Jabatan Penilai"] === "Kepala Departemen" ||
        item["Jabatan Penilai"] === "Kepala Jurusan"
    );
    const wadir = listPenilaianForCoor.filter(
      (item) =>
        item["Jabatan Penilai"] === "Wakil Direktur" ||
        item["Jabatan Penilai"] === "Direktur"
    );

    const totalNilaiKepsek = kepsek.reduce(
      (acc, curr) => acc + (parseFloat(curr.Nilai) || 0),
      0
    );
    const totalNilaiKadept = kadept.reduce(
      (acc, curr) => acc + (parseFloat(curr.Nilai) || 0),
      0
    );
    const totalNilaiWadir = wadir.reduce(
      (acc, curr) => acc + (parseFloat(curr.Nilai) || 0),
      0
    );

    setNilaiKepsek(totalNilaiKepsek);
    setNilaiKadept(totalNilaiKadept);
    setNilaiWadir(totalNilaiWadir);
  }, [listPenilaianForCoor]);

  // console.log("PPP ", userInfo.role);
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
            <h3 className="fw-bold text-center">SS REGISTRATION DETAIL</h3>
          </div>
          <div className="card-body p-3">
            {isLoading ? (
              <Loading />
            ) : (
              <div className="row">
                {formDataRef.current.Status === "Rejected" && (
                  <div className="col-lg-12 mb-3">
                    <div className="bg-gradient bg-danger rounded-3 px-3 pt-3 pb-2 text-white">
                      <h5 className="fw-medium fw-bold">
                        Reason for Rejection
                      </h5>
                      <Label data={formDataRef.current["Alasan Penolakan"]} />
                    </div>
                  </div>
                )}
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
                          <Label title="Name​" data={userData?.name || "-"} />
                        </div>

                        <div className="col-md-4">
                          <Label
                            title="Section​"
                            data={userData["upt"] || "-"}
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

                  {userInfo?.role?.trim() === "ROL36" && (
                    <div className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-center gap-5">
                          <div
                            className="card fw-medium text-center"
                            style={{
                              width: "200px",
                              minHeight: "150px",
                              backgroundColor: "white",
                              boxShadow: COLOR_PRIMARY,
                              transform: "scale(1.05)",
                              transition:
                                "all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}
                          >
                            <div className="card-header">Total Score</div>
                            <div
                              style={{
                                flexGrow: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "16px",
                              }}
                            >
                              <div>Ka.Unit/Ka.UPT/SekProdi</div>
                              <h1 style={{ margin: 0, fontSize: "40px" }}>
                                {nilaiKepsek || 0}
                              </h1>
                            </div>
                          </div>
                          <div
                            className="card fw-medium text-center"
                            style={{
                              width: "200px",
                              minHeight: "150px",
                              boxShadow: COLOR_PRIMARY,
                              transform: "scale(1.05)",
                              transition:
                                "all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}
                          >
                            <div className="card-header">Total Score</div>
                            <div
                              style={{
                                flexGrow: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "16px",
                              }}
                            >
                              <div>Ka.Prodi/Ka.Dept</div>
                              <h1 style={{ margin: 0, fontSize: "40px" }}>
                                {nilaiKadept || 0}
                              </h1>
                            </div>
                          </div>
                          <div
                            className="card fw-medium text-center"
                            style={{
                              width: "200px",
                              minHeight: "150px",
                              boxShadow: COLOR_PRIMARY,
                              transform: "scale(1.05)",
                              transition:
                                "all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}
                          >
                            <div className="card-header">Total Score</div>
                            <div
                              style={{
                                flexGrow: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "16px",
                              }}
                            >
                              <div>WaDIR/DIR</div>
                              <h1 style={{ margin: 0, fontSize: "40px" }}>
                                {nilaiWadir || 0}
                              </h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {formDataRef.current.Status === "Rejected" && (
                    <div>
                      <hr />
                      <h5 className="fw-medium fw-bold">
                        Reason for Rejection
                      </h5>
                      <Label data={formDataRef.current["Alasan Penolakan"]} />
                      <hr />
                    </div>
                  )}
                </div>
                {formDataRef.current.Status === "Approved" && (
                  <div className="col-lg-12">
                    <div className="card mb-3">
                      <div className="card-header align-items-center d-flex">
                        <h5 className="fw-medium">Criteria</h5>
                      </div>
                      <div className="card-body d-flex flex-wrap">
                        <div
                          className="pe-4 border-end"
                          style={{ width: "80%" }}
                        >
                          {listKriteriaPenilaian.map((item) => {
                            const selectedItem =
                              listDetailKriteriaPenilaian.find(
                                (detail) => detail.Id === item.Value
                              );

                            const filteredArrData =
                              listDetailKriteriaPenilaian.filter(
                                (detail) => detail.Id === item.Value
                              );

                            return (
                              <div className="row mb-3" key={item.Value}>
                                <div className="col-lg-4">
                                  <Label data={item.Text} />
                                </div>
                                <div className="col-lg-8">--</div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="ps-4" style={{ width: "20%" }}>
                          <div
                            className="d-flex flex-column gap-3"
                            style={{ height: "100px" }}
                          >
                            <div
                              className="card fw-medium text-center"
                              style={{ width: "200px" }}
                            >
                              Ka.Unit/Ka.UPT
                              <hr />
                              <h5>{0}</h5>
                            </div>
                            <div
                              className="card fw-medium text-center"
                              style={{ width: "200px" }}
                            >
                              Ka.Prodi/Ka.Dept
                              <hr />
                              <h5>{0}</h5>
                            </div>
                            <div
                              className="card fw-medium text-center"
                              style={{ width: "200px" }}
                            >
                              WaDIR/DIR
                              <hr />
                              <h5>{0}</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="col-lg-2">
                  <Button
                    iconName={"angle-left"}
                    classType={"primary"}
                    onClick={() => onChangePage("index")}
                    label="Back"
                  />
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
