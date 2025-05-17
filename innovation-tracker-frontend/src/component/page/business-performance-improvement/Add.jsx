import { useRef, useState, useEffect } from "react";
import { date, number, object, string } from "yup";
import { API_LINK, EMP_API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
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
import DropDownSearch from "../../part/DropDownSearch";
import SearchDropdown from "../../part/SearchDropdown";
import { decryptId } from "../../util/Encryptor";
import UploadFile from "../../util/UploadFile";
import Cookies from "js-cookie";
import { clearSeparator, separator } from "../../util/Formatting";
import { formatDate, decodeHtml } from "../../util/Formatting";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    Name: null,
    Section: null,
    Count: 0,
  },
];

export default function BusinessPerformanceImprovementAdd({ onChangePage }) {
  const cookie = Cookies.get("activeUser");
  let userInfo = "";
  if (cookie) userInfo = JSON.parse(decryptId(cookie));
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [checkedStates, setCheckedStates] = useState({
    sisQuality: false,
    sisCost: false,
    sisDelivery: false,
    sisSafety: false,
    sisMoral: false,
  });

  const [listCategory, setListCategory] = useState([]);
  const [listEmployee, setListEmployee] = useState([]);
  const [listEmployeeFull, setListEmployeeFull] = useState([]);
  const [listFacil, setListFacil] = useState([]);
  const [listPeriod, setListPeriod] = useState([]);
  const [listImpCategory, setListImpCategory] = useState([]);

  const formDataRef = useRef({
    setId: "",
    perId: "",
    rciGroupName: "",
    rciTitle: "",
    rciProjBenefit: "",
    rciCase: "",
    rciCaseFile: "",
    rciProblem: "",
    rciProblemFile: "",
    rciGoal: "",
    rciGoalFile: "",
    rciScope: "",
    rciStartDate: "",
    rciEndDate: "",
    rciQuality: "",
    rciCost: "",
    rciDelivery: "",
    rciSafety: "",
    rciMoral: "",
    rciFacil: "",
    rciLeader: userInfo.npk,
    setId2: "",
  });
  const memberDataRef = useRef({
    rciMember: "",
  });
  const periodDataRef = useRef({
    startPeriod: "",
    endPeriod: "",
  });
  const bussinessCaseFileRef = useRef(null);
  const problemFileRef = useRef(null);
  const goalFileRef = useRef(null);

  const userSchema = object({
    setId: string().required("required"),
    perId: string().nullable(),
    rciGroupName: string()
      .max(100, "maximum 100 characters")
      .required("required"),
    rciTitle: string().required("required"),
    rciProjBenefit: string().max(13, "maximum 10 digits"),
    rciCase: string().required("required"),
    rciCaseFile: string().nullable(),
    rciProblem: string().required("required"),
    rciProblemFile: string().nullable(),
    rciGoal: string().required("required"),
    rciGoalFile: string().nullable(),
    rciScope: string().required("required"),
    rciStartDate: date().typeError("invalid date").required("required"),
    rciEndDate: date()
      .typeError("Invalid date format")
      .required("Start date is required"),
    rciQuality: string().max(200, "maximum 200 characters").nullable(),
    rciCost: string().max(200, "maximum 200 characters").nullable(),
    rciSafety: string().max(200, "maximum 200 characters").nullable(),
    rciDelivery: string().max(200, "maximum 200 characters").nullable(),
    rciMoral: string().max(200, "maximum 200 characters").nullable(),
    rciLeader: string().required("required"),
    rciFacil: string().required("required"),
    setId2: string().required("required"),
  });

  const memberSchema = object({
    rciMember: string().required("required"),
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prev) => ({ ...prev, error: false }));

      try {
        const response = await fetch(`${EMP_API_LINK}getDataKaryawan`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });

        const data = await response.json();
        setListEmployeeFull(data);
        setListEmployee(
          data.map((value) => ({
            Value: value.npk,
            Text: value.npk + " - " + value.nama + " - " + value.upt_bagian,
          }))
        );
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError({ error: true, message: error.message });
        setListEmployee({});
        setListEmployeeFull({});
      }
    };

    fetchData();
  }, []);

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
          setListCategory(data.filter((item) => item.Text.includes("BPI")));
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
          setListImpCategory(
            data.map((item) => ({
              ...item,
              Text: decodeHtml(item.Text),
            }))
          );
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
      setIsLoading(true);
      try {
        const data = await UseFetch(
          API_LINK + "MasterPeriod/GetListPeriod",
          {}
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the period data.");
        } else {
          setListPeriod(data);
          const selected = data.find(
            (item) => item.Text === new Date().getFullYear()
          );
          formDataRef.current.perId = selected.Value;
          setSelectedPeriod(selected.Value);
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListPeriod([]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "MasterFacilitator/GetListFacilitator",
          { p1: new Date().getFullYear(), p2: 8 }
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the facilitator data.");
        } else {
          setListFacil(data);
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListFacil([]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      // setIsLoading(true);
      try {
        const data = await UseFetch(API_LINK + "MasterPeriod/GetPeriodById", {
          p1: selectedPeriod,
        });

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the period data.");
        } else {
          const sDate = data[0].perAwal.split("T")[0];
          const eDate = data[0].perAkhir.split("T")[0];
          if (data[0]) {
            periodDataRef.current = {
              startPeriod: sDate,
              endPeriod: eDate,
            };
          }
        }
      } catch (error) {
        window.scrollTo(0, 0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  const handleAddMember = (id, Name) => {
    if (
      id === null ||
      id === undefined ||
      Name === null ||
      Name === undefined
    ) {
      setIsError({
        error: true,
        message: "Invalid member: Please select a member",
      });
      return;
    }
    if (id === userInfo.npk) {
      setIsError({
        error: true,
        message: "Invalid member: Selected employee is a leader",
      });
      return;
    }
    if (
      formDataRef.current.rciFacil !== "" &&
      id === formDataRef.current.rciFacil
    ) {
      setIsError({
        error: true,
        message: "Invalid member: Selected employee is a facilitator",
      });
      return;
    }
    if (currentData[0].Count === 0) {
      const data = [
        {
          Key: id,
          No: 1,
          Name: Name,
          Count: 1,
        },
      ];
      const formattedData = data.map((value) => ({
        ...value,
        Section:
          listEmployeeFull.find((item) => item.npk === value.Key)?.upt_bagian ||
          "",
        Action: ["Delete"],
        Alignment: ["center", "left", "left", "center", "center"],
      }));
      setCurrentData(formattedData);
    } else {
      if (currentData.some((member) => member.Key === id) === true) {
        window.scrollTo(0, 0);
        setIsError({ error: true, message: "Member already exists!" });
        return;
      }
      if (currentData.length === 6) {
        window.scrollTo(0, 0);
        setIsError({ error: true, message: "Max member reached!" });
        return;
      }
      setCurrentData((prevData) => [
        ...prevData,
        {
          Key: id,
          No: prevData.length + 1,
          Name: Name,
          Section:
            listEmployeeFull.find((item) => item.npk === id)?.upt_bagian || "",
          Count: prevData.length + 1,
          Action: ["Delete"],
          Alignment: ["center", "left", "left", "center", "center"],
        },
      ]);
    }
    memberDataRef.current.rciMember = "";
  };

  const handleCheckboxChange = (key) => {
    if (checkedStates[key]) formDataRef.current[key] = "";
    setCheckedStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleDelete = (id) => {
    if (currentData.length === 1) setCurrentData(inisialisasiData);
    else
      setCurrentData((prevData) =>
        prevData.filter((member) => member.Key !== id)
      );
  };

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

  const handleInputMemberChange = (e) => {
    const { name, value } = e.target;
    const validationError = validateInput(name, value, memberSchema);
    memberDataRef.current[name] = value;
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

    if (Object.values(validationErrors).every((error) => !error)) {
      if (currentData.length < 2) {
        window.scrollTo(0, 0);
        setIsError({
          error: true,
          message: "Invalid member: Please add at least 2 members!",
        });
        return;
      }
      const sDate = new Date(formDataRef.current.rciStartDate);
      const eDate = new Date(formDataRef.current.rciEndDate);
      const innovationEndPeriod = new Date(periodDataRef.current.endPeriod);

      if (sDate >= eDate) {
        window.scrollTo(0, 0);
        setIsError({
          error: true,
          message: "Invalid date: The end date must be after the start date!",
        });
        return;
      }

      if (eDate >= innovationEndPeriod) {
        window.scrollTo(0, 0);
        setIsError({
          error: true,
          message:
            "Invalid date: Selected end date outrange the innovation period end date",
        });
        return;
      }

      const newMemData = [
        { memNpk: formDataRef.current.rciFacil, memPost: "Facilitator" },
        { memNpk: formDataRef.current.rciLeader, memPost: "Leader" },
        ...currentData.map(({ Key }) => ({ memNpk: Key, memPost: "Member" })),
      ];

      formDataRef.current = {
        ...formDataRef.current,
        rciProjBenefit: clearSeparator(formDataRef.current.rciProjBenefit),
        member: newMemData,
      };
      delete formDataRef.current.rciFacil;
      delete formDataRef.current.rciLeader;

      setIsLoading(true);
      setIsError((prevError) => ({ ...prevError, error: false }));
      setErrors({});

      const uploadPromises = [];

      if (bussinessCaseFileRef.current.files.length > 0) {
        uploadPromises.push(
          UploadFile(bussinessCaseFileRef.current).then(
            (data) => (formDataRef.current["rciCaseFile"] = data.Hasil)
          )
        );
      }
      if (problemFileRef.current.files.length > 0) {
        uploadPromises.push(
          UploadFile(problemFileRef.current).then(
            (data) => (formDataRef.current["rciProblemFile"] = data.Hasil)
          )
        );
      }
      if (goalFileRef.current.files.length > 0) {
        uploadPromises.push(
          UploadFile(goalFileRef.current).then(
            (data) => (formDataRef.current["rciGoalFile"] = data.Hasil)
          )
        );
      }

      try {
        await Promise.all(uploadPromises);

        const data = await UseFetch(
          API_LINK + "RencanaCircle/CreateRencanaQCP",
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
          Add Data
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
              <h3 className="fw-bold text-center">BPI REGISTRATION FORM</h3>
            </div>
            <div className="card-body p-4">
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
                            <Input
                              type="text"
                              forInput="rciGroupName"
                              label="Circle Name"
                              isRequired
                              value={formDataRef.current.rciGroupName}
                              onChange={handleInputChange}
                              errorMessage={errors.rciGroupName}
                            />
                          </div>
                          <div className="col-md-6">
                            <Input
                              type="text"
                              forInput="setName"
                              label="Section"
                              isDisabled={true}
                              value={userInfo.upt}
                            />
                          </div>
                          <div className="col-md-6">
                            <SearchDropdown
                              forInput="rciFacil"
                              label="Facilitator"
                              placeHolder="Facilitator"
                              arrData={listFacil}
                              isRequired
                              isRound
                              value={formDataRef.current.rciFacil}
                              onChange={handleInputChange}
                              errorMessage={errors.rciFacil}
                            />
                          </div>
                          <div className="col-md-6">
                            <Input
                              type="text"
                              forInput="rciLeader"
                              label="Leader"
                              isRequired
                              isDisabled={true}
                              value={userInfo.nama}
                              onChange={handleInputChange}
                              errorMessage={errors.rciLeader}
                            />
                          </div>
                        </div>
                        <div className="flex-fill">
                          <div className="input-group">
                            <div className="flex-grow-1">
                              <SearchDropdown
                                forInput="rciMember"
                                placeHolder="Member"
                                arrData={listEmployee}
                                isRequired
                                value={memberDataRef.current.rciMember}
                                onChange={handleInputMemberChange}
                                errorMessage={errors.rciMember}
                              />
                            </div>
                            <Button
                              iconName="add"
                              label="Add Member"
                              classType="success"
                              onClick={() =>
                                handleAddMember(
                                  memberDataRef.current.rciMember,
                                  listEmployee.find(
                                    (item) =>
                                      item.Value ===
                                      memberDataRef.current.rciMember
                                  )?.Text
                                )
                              }
                            />
                          </div>
                        </div>
                        <Table data={currentData} onDelete={handleDelete} />
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
                              forInput="rciTitle"
                              label="Title"
                              isRequired
                              value={formDataRef.current.rciTitle}
                              onChange={handleInputChange}
                              errorMessage={errors.rciTitle}
                            />
                          </div>
                          <div className="col-lg-6">
                            <DropDown
                              forInput="setId"
                              label="Innovation Category"
                              arrData={listCategory}
                              isRequired
                              value={formDataRef.current.setId}
                              onChange={handleInputChange}
                              errorMessage={errors.setId}
                            />
                          </div>
                          <div className="col-lg-6">
                            <SearchDropdown
                              forInput="setId2"
                              label="Knowledge Category"
                              placeHolder="Knowledge Category"
                              arrData={listImpCategory}
                              isRequired
                              isRound
                              value={formDataRef.current.setId2}
                              onChange={handleInputChange}
                              errorMessage={errors.setId2}
                            />
                          </div>
                          <div className="col-lg-4">
                            <Input
                              type="date"
                              forInput="rciStartDate"
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
                              value={formDataRef.current.rciStartDate}
                              onChange={handleInputChange}
                              errorMessage={errors.rciStartDate}
                            />
                          </div>
                          <div className="col-lg-4">
                            <Input
                              type="date"
                              forInput="rciEndDate"
                              label="End Date"
                              placeholder={
                                "Innovation period ends on " +
                                formatDate(
                                  periodDataRef.current.endPeriod,
                                  true
                                )
                              }
                              isRequired
                              value={formDataRef.current.rciEndDate}
                              onChange={handleInputChange}
                              errorMessage={errors.rciEndDate}
                            />
                          </div>
                          <div className="col-lg-4">
                            <DropDown
                              forInput="perId"
                              label="Period"
                              arrData={listPeriod}
                              isRequired
                              isDisabled={true}
                              value={formDataRef.current.perId}
                              onChange={handleInputChange}
                              errorMessage={errors.perId}
                            />
                          </div>

                          <div className="col-lg-12">
                            <TextArea
                              forInput="rciScope"
                              label="Project Scope"
                              isRequired
                              value={formDataRef.current.rciScope}
                              onChange={handleInputChange}
                              errorMessage={errors.rciScope}
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
                              forInput="rciCase"
                              label="Bussiness Case"
                              isRequired
                              value={formDataRef.current.rciCase}
                              onChange={handleInputChange}
                              errorMessage={errors.rciCase}
                            />
                          </div>
                          <div className="col-lg-4 mb-3">
                            <FileUpload
                              forInput="rciCaseFile"
                              label="Bussiness Case Document (.pdf)"
                              formatFile=".pdf"
                              ref={bussinessCaseFileRef}
                              onChange={() =>
                                handleFileChange(bussinessCaseFileRef, "pdf")
                              }
                              errorMessage={errors.rciCaseFile}
                            />
                          </div>
                          <hr />
                          <div className="col-lg-12">
                            <TextArea
                              forInput="rciProblem"
                              label="Problem Statement​"
                              isRequired
                              value={formDataRef.current.rciProblem}
                              onChange={handleInputChange}
                              errorMessage={errors.rciProblem}
                            />
                          </div>
                          <div className="col-lg-4 mb-3">
                            <FileUpload
                              forInput="rciProblemFile"
                              label="Problem Statement​ Document (.pdf)"
                              formatFile=".pdf"
                              ref={problemFileRef}
                              onChange={() =>
                                handleFileChange(problemFileRef, "pdf")
                              }
                              errorMessage={errors.rciProblemFile}
                            />
                          </div>
                          <hr />
                          <div className="col-lg-12">
                            <TextArea
                              forInput="rciGoal"
                              label="Goal Statement​"
                              isRequired
                              value={formDataRef.current.rciGoal}
                              onChange={handleInputChange}
                              errorMessage={errors.rciGoal}
                            />
                          </div>
                          <div className="col-lg-4">
                            <FileUpload
                              forInput="goalFileRef"
                              label="Goal Statement​ Document (.pdf)"
                              formatFile=".pdf"
                              ref={goalFileRef}
                              onChange={() =>
                                handleFileChange(goalFileRef, "pdf")
                              }
                              errorMessage={errors.goalFileRef}
                            />
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
                          <div className="col-lg-6">
                            <Input
                              type="text"
                              forInput="rciProjBenefit"
                              label="Project Benefit (Rp)"
                              value={formDataRef.current.rciProjBenefit}
                              onChange={handleInputChange}
                              errorMessage={errors.rciProjBenefit}
                            />
                          </div>
                          <div className="col-lg-12">
                            <label className="form-label fw-bold ms-1">
                              Tangible Benefit
                            </label>
                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input mb-2 me-2"
                                type="checkbox"
                                checked={checkedStates.rciQuality}
                                onChange={() =>
                                  handleCheckboxChange("rciQuality")
                                }
                              />
                              <div className="flex-grow-1">
                                <Input
                                  type="text"
                                  forInput="rciQuality"
                                  label="Quality"
                                  isDisabled={!checkedStates.rciQuality}
                                  value={formDataRef.current.rciQuality}
                                  onChange={handleInputChange}
                                  errorMessage={errors.rciQuality}
                                />
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input mb-2 me-2"
                                type="checkbox"
                                checked={checkedStates.rciCost}
                                onChange={() => handleCheckboxChange("rciCost")}
                              />
                              <div className="flex-grow-1">
                                <Input
                                  type="text"
                                  forInput="rciCost"
                                  label="Cost"
                                  isDisabled={!checkedStates.rciCost}
                                  value={formDataRef.current.rciCost}
                                  onChange={handleInputChange}
                                  errorMessage={errors.rciCost}
                                />
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input mb-2 me-2"
                                type="checkbox"
                                checked={checkedStates.rciDelivery}
                                onChange={() =>
                                  handleCheckboxChange("rciDelivery")
                                }
                              />
                              <div className="flex-grow-1">
                                <Input
                                  type="text"
                                  forInput="rciDelivery"
                                  label="Delivery"
                                  isDisabled={!checkedStates.rciDelivery}
                                  value={formDataRef.current.rciDelivery}
                                  onChange={handleInputChange}
                                  errorMessage={errors.rciDelivery}
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
                                checked={checkedStates.rciSafety}
                                onChange={() =>
                                  handleCheckboxChange("rciSafety")
                                }
                              />
                              <div className="flex-grow-1">
                                <Input
                                  type="text"
                                  forInput="rciSafety"
                                  label="Safety"
                                  isDisabled={!checkedStates.rciSafety}
                                  value={formDataRef.current.rciSafety}
                                  onChange={handleInputChange}
                                  errorMessage={errors.rciSafety}
                                />
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              <input
                                className="form-check-input me-2"
                                type="checkbox"
                                isDisabled={checkedStates.rciMoral}
                                onChange={() =>
                                  handleCheckboxChange("rciMoral")
                                }
                              />
                              <div className="flex-grow-1">
                                <Input
                                  type="text"
                                  label="Moral"
                                  forInput="rciMoral"
                                  isDisabled={!checkedStates.rciMoral}
                                  value={formDataRef.current.rciMoral}
                                  onChange={handleInputChange}
                                  errorMessage={errors.rciMoral}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
