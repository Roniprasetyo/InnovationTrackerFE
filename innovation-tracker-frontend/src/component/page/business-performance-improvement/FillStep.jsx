import { useRef, useState, useEffect } from "react";
import { date, number, object, string } from "yup";
import { decodeHtml, formatDate, separator } from "../../util/Formatting";
import { API_LINK, EMP_API_LINK, FILE_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Loading from "../../part/Loading";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import Alert from "../../part/Alert";
import Icon from "../../part/Icon";
import Table from "../../part/Table";
import { decryptId } from "../../util/Encryptor";
import Cookies from "js-cookie";
import Label from "../../part/Label";
import SearchDropdown from "../../part/SearchDropdown";
import Button from "../../part/Button";
import TextArea from "../../part/TextArea";
import FileUpload from "../../part/FileUpload";
import UploadFile from "../../util/UploadFile";
import Modal from "../../part/Modal";
import SweetAlert from "../../util/SweetAlert";
// import userInfo from

const inisialisasiData = [
  {
    Key: null,
    No: null,
    Name: null,
    Count: 0,
  },
];

const MetodologiArr = [
  { Value: 51, Text: "PDCA (Plan-Do-Check-Act)" },
  { Value: 50, Text: "DMAIC (Define-Measure-Analyze-Improve-Control)" },
  { Value: 48, Text: "Kaizen" },
  { Value: 37, Text: "Six Sigma" },
  { Value: 60, Text: "Lean Manufacturing" },
  { Value: 44, Text: "5S (Sort, Set in Order, Shine, Standardize, Sustain)" },
];

export default function BussinessPerformanceImprovementFillStep({ onChangePage, withID }) {
  const cookie = Cookies.get("activeUser");
  let userInfo = "";
  // console.log(withID);
  if (cookie) userInfo = JSON.parse(decryptId(cookie));
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [listEmployee, setListEmployee] = useState([]);
  const [listMetodologi, setListMetodologi] = useState([]);
  const [typeSetting, setTypeSetting] = useState([]);

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
    "Alasan Penolakan": "",
    member: [{}],
    Nama: "",
    Section: "",
  });

  console.log("username", userInfo.username);

  const payloadRef = useRef({
    rci_id: withID,
    fts_created_by: userInfo.username,
    set_id: null,
    fts_plan: "",
    fts_plan_file: "",
    fts_do: "",
    fts_do_file: "",
    fts_check: "",
    fts_check_file: "",
    fts_action: "",
    fts_action_file: "",
    fts_status: "",
  });

  const planFileRef = useRef(null);
  const doFileRef = useRef(null);
  const checkFileRef = useRef(null);
  const actionFileRef = useRef(null);

  const payloadSchema = object({
    rci_id: number().required("required"),
    set_id: number().required("The Section is Required"),
    fts_plan: string().required("The Section is Required"),
    fts_plan_file: string().nullable(),
    fts_do: string().required("required"),
    fts_do_file: string().nullable(),
    fts_check: string().nullable(),
    fts_check_file: string().nullable(),
    fts_action: string().nullable(),
    fts_action_file: string().nullable(),
    fts_status: string().nullable(),
    fts_created_by: string().required("required creaby"),
  });

  const [formDataMetodologiRef, setFormDataMetodRed] = useState("");
  const modalRef = useRef();

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
        setListEmployee(data);
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
          API_LINK + "RencanaCircle/GetSettingMetodologi"
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          setListMetodologi(data);
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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(API_LINK + "RencanaCircle/GetTypeSetting");

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the Type Setting data.");
        } else {
          setTypeSetting(data);
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
  }, []);

  const handleFileChange = (ref, extAllowed) => {
    const { name, value } = ref.current;
    const file = ref.current.files[0];
    const fileName = file.name;
    const fileSize = file.size;
    const fileExt = fileName.split(".").pop().toLowerCase();
    const validationError = validateInput(name, value, payloadSchema);
    let error = "";

    if (fileSize / 1024576 > 10) error = "berkas terlalu besar";
    else if (!extAllowed.split(",").includes(fileExt))
      error = "format berkas tidak valid";

    if (error) ref.current.value = "";

    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: error,
    }));
  };

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
          throw new Error("Error: Failed to get BPI data");
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
                  Count: memberCount,
                  Alignment: ["center", "left"],
                }))
              )
            : setCurrentData(inisialisasiData);
          formDataRef.current = {
            ...formDataRef.current,
            Section: listEmployee.find(
              (member) =>
                member.npk ===
                formDataRef.current.member.find(
                  (pos) => pos.Position === "Leader"
                )?.Npk
            )?.upt_bagian,
          };
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
  }, [withID, listEmployee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validationError = validateInput(name, value, payloadSchema);
    payloadRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
    console.log(
      (payloadRef.current[name] = name),
      ": ",
      (payloadRef.current[name] = value)
    );
  };

  const handleOpenModal = (id) => {
    console.log(id);
    if (id.length === 0) {
      window.scrollTo(0, 0);
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: "Please select one or more data!",
      }));
    } else {
      modalRef.current.open();
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const validationErrors = await validateAllInputs(
      payloadRef.current,
      payloadSchema,
      setErrors
    );

    console.log("Payload", payloadRef.current);

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError((prevError) => ({ ...prevError, error: false }));
      setErrors({});

      const uploadPromises = [];

      if (planFileRef.current?.files.length > 0) {
        uploadPromises.push(
          UploadFile(planFileRef.current).then(
            (data) => (payloadRef.current["fts_plan_file"] = data.Hasil)
          )
        );
      }
      if (doFileRef.current?.files.length > 0) {
        uploadPromises.push(
          UploadFile(doFileRef.current).then(
            (data) => (payloadRef.current["fts_do_file"] = data.Hasil)
          )
        );
      }
      if (checkFileRef.current?.files.length > 0) {
        uploadPromises.push(
          UploadFile(checkFileRef.current).then(
            (data) => (payloadRef.current["fts_check_file"] = data.Hasil)
          )
        );
      }
      if (actionFileRef.current?.files.length > 0) {
        uploadPromises.push(
          UploadFile(actionFileRef.current).then(
            (data) => (payloadRef.current["fts_action_file"] = data.Hasil)
          )
        );
      }
      
      try {
        await Promise.all(uploadPromises);

        const data = await UseFetch(
          API_LINK + "RencanaCircle/CreateFillTheStep",
          payloadRef.current
        );

        console.log("Data", data);
        if (data === "ERROR") {
          throw new Error("Error: Failed to submit the data.");
        } else {
          SweetAlert("Success", "Data successfully submitted", "success");
          onChangePage("index");
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
    } else window.scrollTo(0, 0);
  };

  const filteredTypeMetodologi = typeSetting.filter(
    (detail) => detail.Text === "Metodologi"
  );

  const filteredArrData = listMetodologi.filter(
    (detail) => detail.Type === filteredTypeMetodologi[0]?.Value
  );

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
            <h3 className="fw-bold text-center">BPI REGISTRATION DETAIL</h3>
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
                          <Label
                            title="Section"
                            data={formDataRef.current.Section}
                          />
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
                  <form onSubmit={handleAdd}>
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
                    <div className="card mb-3">
                      <div className="card-header">
                        <h5 className="fw-medium">The Steps</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="row">
                              <div className="col-lg-11">
                                <SearchDropdown
                                  arrData={filteredArrData}
                                  forInput="set_id"
                                  value={payloadRef.current.set_id}
                                  label="Metodologi"
                                  onChange={handleInputChange}
                                  isRequired
                                  errorMessage={errors.set_id}
                                />
                              </div>
                              <div className="col-md-1 mt-4">
                                <Button
                                  // classType="secondary"
                                  label="?"
                                  onClick={() =>
                                    handleOpenModal(formDataMetodologiRef)
                                  }
                                  style={{ borderRadius: "16px" }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-12">
                              <TextArea
                                forInput="fts_plan"
                                label="Plan"
                                isRequired
                                placeholder="Explains how the benefits of a project outweigh the costs and why the project should be implemented (menjelaskan bagaimana manfaat suatu proyek lebih besar daripada biayanya dan mengapa proyek tersebut harus dilaksanakan)"
                                value={payloadRef.current.fts_plan}
                                onChange={handleInputChange}
                                errorMessage={errors.fts_plan}
                              />
                            </div>
                            <div className="col-lg-4 mb-3">
                              <FileUpload
                                forInput="fts_plan_file"
                                label="Plan Document (.pdf)"
                                formatFile=".pdf"
                                ref={planFileRef}
                                onChange={() =>
                                  handleFileChange(planFileRef, "pdf")
                                }
                                errorMessage={errors.fts_plan_file}
                              />
                            </div>
                            <hr />
                            <div className="col-lg-12">
                              <TextArea
                                forInput="fts_do"
                                label="Do"
                                isRequired
                                placeholder="Describe the steps taken to implement the plan and any resources used
(Jelaskan langkah-langkah yang dilakukan untuk melaksanakan rencana serta sumber daya yang digunakan)"
                                value={payloadRef.current.fts_do}
                                onChange={handleInputChange}
                                errorMessage={errors.fts_do}
                              />
                            </div>
                            <div className="col-lg-4 mb-3">
                              <FileUpload
                                forInput="fts_do_file"
                                label="Do Document (.pdf)"
                                formatFile=".pdf"
                                ref={doFileRef}
                                onChange={() =>
                                  handleFileChange(doFileRef, "pdf")
                                }
                                errorMessage={errors.fts_do_file}
                              />
                            </div>
                            <hr />
                            {/* Bagian CHECK */}
                            <div className="col-lg-12">
                              <label className="form-label fw-bold">
                                Check <span className="text-danger">*</span>
                              </label>

                              {/* Tampilkan informasi jika disabled */}
                              {formDataRef.current.Status !== "Scoring" && (
                                <div className="alert alert-warning p-2 mb-2">
                                  This section is only editable during{" "}
                                  <strong>Scoring</strong> status.
                                </div>
                              )}

                              <TextArea
                                forInput="pdcaCheck"
                                isRequired
                                isDisabled={
                                  formDataRef.current.Status !== "Scoring"
                                }
                                placeholder={
                                  formDataRef.current.Status === "Scoring"
                                    ? "Explain how the outcomes were monitored or measured and whether the plan was successful\n(Jelaskan bagaimana hasil dievaluasi atau diukur serta apakah rencananya berhasil)"
                                    : "" // dikosongkan karena tidak muncul saat disabled
                                }
                                value={payloadRef.current.fts_check}
                                onChange={handleInputChange}
                                errorMessage={errors.fts_check}
                              />
                            </div>

                            <div className="col-lg-4">
                              {formDataRef.current.Status === "Scoring" ? (
                                <FileUpload
                                  forInput="pdcaCheckFile"
                                  label="Check Document (.pdf)"
                                  formatFile=".pdf"
                                  ref={checkFileRef}
                                  onChange={() =>
                                    handleFileChange(checkFileRef, "pdf")
                                  }
                                  errorMessage={errors.fts_check_file}
                                />
                              ) : (
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="File upload only available in Scoring status"
                                  disabled
                                />
                              )}
                            </div>

                            {/* Bagian ACTION */}
                            <div className="col-lg-12">
                              <label className="form-label fw-bold">
                                Action <span className="text-danger">*</span>
                              </label>

                              {/* Tampilkan informasi jika disabled */}
                              {formDataRef.current.Status !== "Scoring" && (
                                <div className="alert alert-warning p-2 mb-2">
                                  This section is only editable during{" "}
                                  <strong>Scoring</strong> status.
                                </div>
                              )}

                              <TextArea
                                forInput="pdcaAction"
                                isRequired
                                isDisabled={
                                  formDataRef.current.Status !== "Scoring"
                                }
                                placeholder={
                                  formDataRef.current.Status === "Scoring"
                                    ? "Describe what actions were taken based on the evaluation and how the process can be improved\n(Jelaskan tindakan yang diambil berdasarkan evaluasi dan bagaimana prosesnya dapat ditingkatkan)"
                                    : "" // biarkan kosong karena tidak akan muncul
                                }
                                value={payloadRef.current.fts_action}
                                onChange={handleInputChange}
                                errorMessage={errors.fts_action}
                              />
                            </div>

                            <div className="col-lg-4">
                              {formDataRef.current.Status === "Scoring" ? (
                                <FileUpload
                                  forInput="pdcaActionFile"
                                  label="Action Document (.pdf)"
                                  formatFile=".pdf"
                                  ref={actionFileRef}
                                  onChange={() =>
                                    handleFileChange(actionFileRef, "pdf")
                                  }
                                  errorMessage={errors.fts_action_file}
                                />
                              ) : (
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="File upload only available in Scoring status"
                                  disabled
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* {formDataRef.current.Status === "Rejected" && (
                    <div>
                      <hr />
                      <h5 className="fw-medium fw-bold">
                        Reason for Rejection
                      </h5>
                      <Label data={formDataRef.current["Alasan Penolakan"]} />
                      <hr />
                    </div>
                  )} */}
                    <div className="col-lg-12">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="flex-grow-1 m-2">
                          <Button
                            classType="danger me-2 px-4 py-2"
                            label="CANCEL"
                            onClick={() => onChangePage("index")}
                            style={{ width: "100%", borderRadius: "16px" }}
                          />
                        </div>
                        <div className="flex-grow-1 m-2">
                          <Button
                            classType="primary ms-2 px-4 py-2"
                            label="SUBMIT"
                            type="submit"
                            // onClick={handleSubmit}
                            style={{ width: "100%", borderRadius: "16px" }}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
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
      <Modal title="Pict Metodologi" ref={modalRef} size="small">
        <image src="../../util/image.png" alt="Metodologi Image" />
      </Modal>
    </>
  );
}
