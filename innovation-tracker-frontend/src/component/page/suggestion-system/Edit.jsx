import { useRef, useState, useEffect } from "react";
import { date, number, object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import { separator, clearSeparator } from "../../util/Formatting";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import Icon from "../../part/Icon";
import Table from "../../part/Table";
import TextArea from "../../part/TextArea";
import FileUpload from "../../part/FileUpload";
import SearchDropdown from "../../part/SearchDropdown";
import { decryptId } from "../../util/Encryptor";
import UploadFile from "../../util/UploadFile";
import Cookies from "js-cookie";
import { decodeHtml, formatDate } from "../../util/Formatting";
import Label from "../../part/Label";

const inisialisasiData = [
  {
    Key: null,
    Name: null,
    Count: 0,
  },
];

export default function SuggestionSystemEdit({ onChangePage, withID }) {
  const cookie = Cookies.get("activeUser");
  let userInfo = "";
  if (cookie) userInfo = JSON.parse(decryptId(cookie));
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const [listCategory, setListCategory] = useState([]);
  const [listPeriod, setListPeriod] = useState([]);
  const [listImpCategory, setListImpCategory] = useState([]);

  const [checkedStates, setCheckedStates] = useState({
    sisQuality: false,
    sisCost: false,
    sisDelivery: false,
    sisSafety: false,
    sisMoral: false,
  });

  const handleCheckboxChange = (key) => {
    if (checkedStates[key]) formDataRef.current[key] = "";
    setCheckedStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const formDataRef = useRef({
    sis_id: "",
    kry_id: "",
    sis_judul: "",
    ino_category: "",
    know_category: "",
    sis_tanggalmulai: "",
    sis_tanggalakhir: "",
    per_id: "",
    sis_ruanglingkup: "",
    sis_kasus: "",
    sis_kasusfile: "",
    sis_masalah: "",
    sis_masalahfile: "",
    sis_tujuan: "",
    sis_tujuanfile: "",
    sisQuality: "",
    sisCost: "",
    sisDelivery: "",
    sisSafety: "",
    sisMoral: "",
    sisStatus: "",
    sisReasonforRejection: "",
  });

  const periodDataRef = useRef({
    startPeriod: "",
    endPeriod: "",
  });

  const bussinessCaseFileRef = useRef(null);
  const problemFileRef = useRef(null);
  const goalFileRef = useRef(null);

  const userSchema = object({
    sis_id: number().required("required"),
    kry_id: number().required("required"),
    sis_judul: string().required("required"),
    ino_category: string().required("required"),
    know_category: string().required("required"),
    sis_tanggalmulai: date().typeError("invalid date").required("required"),
    sis_tanggalakhir: date()
      .typeError("Invalid date format")
      .required("Start date is required"),
    per_id: number().required("required"),
    sis_ruanglingkup: string().required("required"),
    sis_kasus: string().required("required"),
    sis_kasusfile: string().nullable(),
    sis_masalah: string().required("required"),
    sis_masalahfile: string().nullable(),
    sis_tujuan: string().required("required"),
    sis_tujuanfile: string().nullable(),
    sisQuality: string().max(200, "maximum 200 characters").nullable(),
    sisCost: string().max(200, "maximum 200 characters").nullable(),
    sisSafety: string().max(200, "maximum 200 characters").nullable(),
    sisDelivery: string().max(200, "maximum 200 characters").nullable(),
    sisMoral: string().max(200, "maximum 200 characters").nullable(),
    sisStatus: string().required("required"),
    sisReasonforRejection: string().nullable(),
  });

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
          setListCategory(data.filter((item) => item.Text.includes("SS")));
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
        const data = await UseFetch(API_LINK + "MasterSetting/GetListSetting", {
          p1: "Knowledge Category",
        });

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          setListImpCategory(data);
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListImpCategory({});
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "MasterPeriod/GetListPeriod",
          {}
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the period data.");
        } else {
          setListPeriod(data);
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListPeriod({});
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      console.log(withID);
      setIsError((prevError) => ({ ...prevError, error: false }));
      setIsLoading(true);
      try {
        const data = await UseFetch(API_LINK + "RencanaSS/GetRencanaSSById", {
          id: withID,
        });

        if (data === "ERROR" || data.length === 0) {
          throw new Error(
            "Terjadi kesalahan: Gagal mengambil data alat/mesin."
          );
        } else {
          formDataRef.current = {
            sis_id: data[0]["Key"],
            kry_id: data[0]["NPK"],
            per_id: data[0]["PeriodId"],
            ino_category: data[0]["CategoryId"],
            know_category: data[0]["CategoryIdImp"],
            sis_judul: decodeHtml(data[0]["Project Title"]),
            sis_kasus: decodeHtml(data[0]["Case"]),
            sis_kasusfile: data[0]["CaseFile"],
            sis_masalah: decodeHtml(data[0]["Problem"]),
            sis_masalahfile: data[0]["ProblemFile"],
            sis_tujuan: decodeHtml(data[0]["Goal"]),
            sis_tujuanfile: data[0]["GoalFile"],
            sis_ruanglingkup: decodeHtml(data[0]["Scope"]),
            sis_tanggalmulai: data[0]["Start Date"].split("T")[0],
            sis_tanggalakhir: data[0]["End Date"].split("T")[0],
            sisQuality: data[0]["Quality"],
            sisCost: data[0]["Cost"],
            sisDelivery: data[0]["Delivery"],
            sisSafety: data[0]["Safety"],
            sisMoral: data[0]["Moral"],
            sisStatus: data[0]["Status"],
            sisReasonforRejection: data[0]["Alasan Penolakan"],
          };

          setCheckedStates({
            sisQuality: data[0]["Quality"] ? true : false,
            sisCost: data[0]["Cost"] ? true : false,
            sisDelivery: data[0]["Delivery"] ? true : false,
            sisSafety: data[0]["Safety"] ? true : false,
            sisMoral: data[0]["Moral"] ? true : false,
          });
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

  const handleFileChange = (ref, extAllowed) => {
    const { name, value } = ref.current;
    const file = ref.current.files[0];
    const fileName = file.name;
    const fileSize = file.size;
    const fileExt = fileName.split(".").pop().toLowerCase();
    const validationError = validateInput(name, value, userSchema);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validationError = validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    console.log(validationErrors);

    if (Object.values(validationErrors).every((error) => !error)) {
      const sDate = new Date(formDataRef.current.sis_tanggalmulai);
      const eDate = new Date(formDataRef.current.sis_tanggalakhir);
      const selectedEndDate = new Date(periodDataRef.current.endPeriod);

      if (sDate >= eDate) {
        window.scrollTo(0, 0);
        setIsError({
          error: true,
          message: "Invalid date: The end date must be after the start date!",
        });
        return;
      }

      if (eDate > selectedEndDate) {
        window.scrollTo(0, 0);
        setIsError({
          error: true,
          message:
            "Invalid date: Selected end date exceeds the innovation period end date",
        });
        return;
      }

      setIsLoading(true);
      setIsError((prevError) => ({ ...prevError, error: false }));
      setErrors({});

      const uploadPromises = [];

      if (bussinessCaseFileRef.current.files.length > 0) {
        uploadPromises.push(
          UploadFile(bussinessCaseFileRef.current).then(
            (data) => (formDataRef.current["sis_kasusfile"] = data.Hasil)
          )
        );
      }
      if (problemFileRef.current.files.length > 0) {
        uploadPromises.push(
          UploadFile(problemFileRef.current).then(
            (data) => (formDataRef.current["sis_masalahfile"] = data.Hasil)
          )
        );
      }
      if (goalFileRef.current.files.length > 0) {
        uploadPromises.push(
          UploadFile(goalFileRef.current).then(
            (data) => (formDataRef.current["sis_tujuanfile"] = data.Hasil)
          )
        );
      }

      try {
        await Promise.all(uploadPromises);

        const data = await UseFetch(
          API_LINK + "RencanaSS/UpdateRencanaSS",
          formDataRef.current
        );

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
          Update Data
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
        <form onSubmit={handleAdd}>
          <div className="card mb-5">
            <div className="card-header">
              <h3 className="fw-bold text-center">SS REGISTRATION FORM</h3>
            </div>
            <div className="card-body p-4">
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
                            <Input
                              type="text"
                              forInput="kry_id"
                              label="NPK"
                              isDisabled
                              value={formDataRef.current.kry_id}
                              onChange={handleInputChange}
                              errorMessage={errors.kry_id}
                            />
                          </div>
                          <div className="col-md-4">
                            <Input
                              type="text"
                              forInput="nama_kar"
                              label="Name​"
                              isDisabled
                              value={userInfo.nama}
                            />
                          </div>
                          <div className="col-md-4">
                            <Input
                              type="text"
                              forInput="produptdep"
                              label="Section"
                              isDisabled
                              value={userInfo.upt}
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
                            <TextArea
                              forInput="sis_judul"
                              label="Title"
                              isRequired
                              placeholder="Contains a brief explanation of the idea <i>(memuat penjelasan singkat tentang ide yang akan disampaikan)</i>"
                              value={formDataRef.current.sis_judul}
                              onChange={handleInputChange}
                              errorMessage={errors.sis_judul}
                            />
                          </div>
                          <div className="col-lg-6">
                            <DropDown
                              forInput="ino_category"
                              label="Innovation Category"
                              arrData={listCategory}
                              isRequired
                              value={formDataRef.current.ino_category}
                              onChange={handleInputChange}
                              errorMessage={errors.ino_category}
                            />
                          </div>
                          <div className="col-lg-6">
                            <DropDown
                              forInput="know_category"
                              label="Knowledge Category"
                              arrData={listImpCategory}
                              isRequired
                              value={formDataRef.current.know_category}
                              onChange={handleInputChange}
                              errorMessage={errors.know_category}
                            />
                          </div>
                          <div className="col-lg-4">
                            <Input
                              type="date"
                              forInput="sis_tanggalmulai"
                              label="Start Date"
                              placeholder={
                                periodDataRef.current.startPeriod
                                  ? "Innovation period starts on " +
                                    formatDate(
                                      periodDataRef.current.startPeriod,
                                      true
                                    )
                                  : ""
                              }
                              isRequired
                              value={formDataRef.current.sis_tanggalmulai}
                              onChange={handleInputChange}
                              errorMessage={errors.sis_tanggalmulai}
                            />
                          </div>
                          <div className="col-lg-4">
                            <Input
                              type="date"
                              forInput="sis_tanggalakhir"
                              label="End Date"
                              placeholder={
                                periodDataRef.current.endPeriod
                                  ? "Innovation period ends on " +
                                    formatDate(
                                      periodDataRef.current.endPeriod,
                                      true
                                    )
                                  : ""
                              }
                              isRequired
                              value={formDataRef.current.sis_tanggalakhir}
                              onChange={handleInputChange}
                              errorMessage={errors.sis_tanggalakhir}
                            />
                          </div>
                          <div className="col-lg-4">
                            <DropDown
                              forInput="per_id"
                              label="Period"
                              arrData={listPeriod}
                              isRequired
                              isDisabled
                              value={formDataRef.current.per_id}
                              onChange={handleInputChange}
                              errorMessage={errors.per_id}
                            />
                          </div>

                          <div className="col-lg-12">
                            <TextArea
                              forInput="sis_ruanglingkup"
                              label="Project Scope"
                              isRequired
                              placeholder="Designing a plan with a focus on processes, results, and impact on the team <i>(merancang perencanaan dengan berfokus pada proses, hasil dan impact terhadap team)</i>"
                              value={formDataRef.current.sis_ruanglingkup}
                              onChange={handleInputChange}
                              errorMessage={errors.sis_ruanglingkup}
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
                          <div className="col-lg-12">
                            <TextArea
                              forInput="sis_kasus"
                              label="Bussiness Case"
                              isRequired
                              placeholder="Explains how the benefits of a project outweigh the costs and why the project should be implemented <i>(menjelaskan bagaimana manfaat suatu proyek lebih besar daripada biayanya dan mengapa proyek tersebut harus dilaksanakan)</i>"
                              value={formDataRef.current.sis_kasus}
                              onChange={handleInputChange}
                              errorMessage={errors.sis_kasus}
                            />
                          </div>
                          <div className="col-lg-4 mb-3">
                            <FileUpload
                              forInput="sis_kasusfile"
                              label="Bussiness Case Document (.pdf)"
                              formatFile=".pdf"
                              ref={bussinessCaseFileRef}
                              onChange={() =>
                                handleFileChange(bussinessCaseFileRef, "pdf")
                              }
                              hasExisting={formDataRef.current.CaseFile}
                              errorMessage={errors.sis_kasusfile}
                            />
                          </div>
                          <hr />
                          <div className="col-lg-12">
                            <TextArea
                              forInput="sis_masalah"
                              label="Problem Statement​"
                              isRequired
                              placeholder="Define the problem that the user or customer is facing <i>(mendefinisikan masalah yang dihadapi pengguna atau pelanggan)</i>"
                              value={formDataRef.current.sis_masalah}
                              onChange={handleInputChange}
                              errorMessage={errors.sis_masalah}
                            />
                          </div>
                          <div className="col-lg-4 mb-3">
                            <FileUpload
                              forInput="sis_masalahfile"
                              label="Problem Statement​ Document (.pdf)"
                              formatFile=".pdf"
                              ref={problemFileRef}
                              onChange={() =>
                                handleFileChange(problemFileRef, "pdf")
                              }
                              hasExisting={formDataRef.current.ProblemFile}
                              errorMessage={errors.sis_masalahfile}
                            />
                          </div>
                          <hr />
                          <div className="col-lg-12">
                            <TextArea
                              forInput="sis_tujuan"
                              label="Goal Statement​"
                              isRequired
                              placeholder="Explain the objectives of the project <i>(menjelaskan tentang tujuan proyek)</i>"
                              value={formDataRef.current.sis_tujuan}
                              onChange={handleInputChange}
                              errorMessage={errors.sis_tujuan}
                            />
                          </div>
                          <div className="col-lg-4">
                            <FileUpload
                              forInput="sis_tujuanfile"
                              label="Goal Statement​ Document (.pdf)"
                              formatFile=".pdf"
                              ref={goalFileRef}
                              onChange={() =>
                                handleFileChange(goalFileRef, "pdf")
                              }
                              hasExisting={formDataRef.current.GoalFile}
                              errorMessage={errors.sis_tujuanfile}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="card mb-3">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-12">
                            <label className="form-label fw-bold ms-1">
                              Tangible Benefit
                            </label>
                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input mb-2 me-2"
                                type="checkbox"
                                checked={checkedStates.sisQuality}
                                onChange={() =>
                                  handleCheckboxChange("sisQuality")
                                }
                              />
                              <div className="flex-grow-1">
                                <Input
                                  type="text"
                                  forInput="sisQuality"
                                  label="Quality"
                                  isDisabled={!checkedStates.sisQuality}
                                  value={formDataRef.current.sisQuality}
                                  onChange={handleInputChange}
                                  errorMessage={errors.sisQuality}
                                />
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input mb-2 me-2"
                                type="checkbox"
                                checked={checkedStates.sisCost}
                                onChange={() => handleCheckboxChange("sisCost")}
                              />
                              <div className="flex-grow-1">
                                <Input
                                  type="text"
                                  forInput="sisCost"
                                  label="Cost"
                                  isDisabled={!checkedStates.sisCost}
                                  value={formDataRef.current.sisCost}
                                  onChange={handleInputChange}
                                  errorMessage={errors.sisCost}
                                />
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input mb-2 me-2"
                                type="checkbox"
                                checked={checkedStates.sisDelivery}
                                onChange={() =>
                                  handleCheckboxChange("sisDelivery")
                                }
                              />
                              <div className="flex-grow-1">
                                <Input
                                  type="text"
                                  forInput="sisDelivery"
                                  label="Delivery"
                                  isDisabled={!checkedStates.sisDelivery}
                                  value={formDataRef.current.sisDelivery}
                                  onChange={handleInputChange}
                                  errorMessage={errors.sisDelivery}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <label className="form-label fw-bold ms-1">
                              Intangible Benefit
                            </label>
                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input mb-2 me-2"
                                type="checkbox"
                                checked={checkedStates.sisSafety}
                                onChange={() =>
                                  handleCheckboxChange("sisSafety")
                                }
                              />
                              <div className="flex-grow-1">
                                <Input
                                  type="text"
                                  forInput="sisSafety"
                                  label="Safety"
                                  isDisabled={!checkedStates.sisSafety}
                                  value={formDataRef.current.sisSafety}
                                  onChange={handleInputChange}
                                  errorMessage={errors.sisSafety}
                                />
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input mb-2 me-2"
                                type="checkbox"
                                checked={checkedStates.sisMoral}
                                onChange={() =>
                                  handleCheckboxChange("sisMoral")
                                }
                              />
                              <div className="flex-grow-1">
                                <Input
                                  type="text"
                                  label="Moral"
                                  forInput="sisMoral"
                                  isDisabled={!checkedStates.sisMoral}
                                  value={formDataRef.current.sisMoral}
                                  onChange={handleInputChange}
                                  errorMessage={errors.sisMoral}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {formDataRef.current.sisStatus === "Rejected" && (
                      <>
                        <hr />
                        <h5 className="fw-medium fw-bold">
                          Reason for Rejection
                        </h5>
                        <Label
                          data={formDataRef.current.sisReasonforRejection}
                        />
                        <hr />
                      </>
                    )}
                  </div>
                </div>
              )}
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
                    type="submit"
                    label="SUBMIT"
                    style={{ width: "100%", borderRadius: "16px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
