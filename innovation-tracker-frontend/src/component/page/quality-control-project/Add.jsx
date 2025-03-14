import { useRef, useState, useEffect } from "react";
import { date, number, object, string } from "yup";
import { API_LINK } from "../../util/Constants";
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
import SearchDropdown from "../../part/SearchDropdown";
import { decryptId } from "../../util/Encryptor";
import UploadFile from "../../util/UploadFile";
import Cookies from "js-cookie";

const inisialisasiData = [
  {
    Key: null,
    Name: null,
    Count: 0,
  },
];

const listPeriod = [
  { Value: "2024", Text: "2024" },
  { Value: "2025", Text: "2025" },
];

export default function QualityControlProjectAdd({ onChangePage }) {
  const cookie = Cookies.get("activeUser");
  let userInfo = "";
  if (cookie) userInfo = JSON.parse(decryptId(cookie));
  console.log(userInfo);
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [currentData, setCurrentData] = useState(inisialisasiData);

  const [listCategory, setListCategory] = useState([]);
  const [listEmployee, setListEmployee] = useState([]);

  const [checkedStates, setCheckedStates] = useState({
    rciQuality: false,
    rciCost: false,
    rciDelivery: false,
    rciSafety: false,
    rciMoral: false,
  });

  const handleCheckboxChange = (key) => {
    if (checkedStates[key]) formDataRef.current[key] = "";
    setCheckedStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const formDataRef = useRef({
    setId: "",
    perId: 2025,
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
    rciLeader: "",
  });

  const memberDataRef = useRef({
    rciMember: "",
  });

  const bussinessCaseFileRef = useRef(null);
  const problemFileRef = useRef(null);
  const goalFileRef = useRef(null);

  const userSchema = object({
    setId: number().required("required"),
    perId: number().nullable(),
    rciGroupName: string()
      .max(50, "maximum 50 characters")
      .required("required"),
    rciTitle: string().max(100, "maximum 100 characters").required("required"),
    rciProjBenefit: number()
      .test(
        "maxDigits",
        "Maximum 11 digits allowed",
        (value) => !value || value.toString().length <= 11
      )
      .required("Project benefit is required"),
    rciCase: string().required("required"),
    rciCaseFile: string().nullable(),
    rciProblem: string().required("required"),
    rciProblemFile: string().nullable(),
    rciGoal: string().required("required"),
    rciGoalFile: string().nullable(),
    rciScope: string().max(200, "maximum 200 characters").required("required"),
    rciStartDate: date()
      .min(new Date(), "start date must be after today")
      .typeError("invalid date")
      .required("required"),
    rciEndDate: date()
      .typeError("Invalid date format")
      .required("Start date is required"),
    rciQuality: string().max(100, "maximum 100 characters").nullable(),
    rciCost: number().nullable(),
    rciSafety: string().max(100, "maximum 100 characters").nullable(),
    rciDelivery: string().max(100, "maximum 100 characters").nullable(),
    rciMoral: string().max(100, "maximum 100 characters").nullable(),
    rciLeader: string().required("required"),
    rciFacil: string().required("required"),
  });

  const memberSchema = object({
    rciMember: string().required("required"),
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "MasterSetting/GetListSetting", {
          p1: "Kategori Keilmuan",
        });

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          setListCategory(data);
          window.scrollTo(0, 0);
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
      setIsLoading(true);
      try {
        const data = await UseFetch(
          API_LINK + "RencanaCircle/GetListKaryawan",
          {}
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          setListEmployee(data);
          const member = data.find((item) => item["Value"] === userInfo.npk);
          formDataRef.current.rciLeader = member.Value;
          window.scrollTo(0, 0);
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListCategory({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddMember = (id, Name) => {
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
        Action: ["Remove"],
        Alignment: ["center", "center", "center", "center"],
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
          Name,
          Count: prevData.length + 1,
          Action: ["Remove"],
          Alignment: ["center", "center", "center", "center"],
        },
      ]);
    }
    memberDataRef.current.rciMember = "";
  };

  const handleRemove = (id) => {
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

    const newMemData = [
      { memNpk: formDataRef.current.rciFacil, memPost: "Facilitator" },
      { memNpk: formDataRef.current.rciLeader, memPost: "Leader" },
      ...currentData.map(({ Key }) => ({ memNpk: Key, memPost: "Member" })),
    ];

    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    delete formDataRef.current.rciFacil;
    delete formDataRef.current.rciLeader;

    const body = { ...formDataRef.current, member: newMemData };
    console.log(body);
    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError((prevError) => ({ ...prevError, error: false }));
      setErrors({});

      const uploadPromises = [];

      if (bussinessCaseFileRef.current.files.length > 0) {
        uploadPromises.push(
          UploadFile(bussinessCaseFileRef.current).then(
            (data) => (body["rciCaseFile"] = data.Hasil)
          )
        );
      }
      if (problemFileRef.current.files.length > 0) {
        uploadPromises.push(
          UploadFile(problemFileRef.current).then(
            (data) => (body["rciProblemFile"] = data.Hasil)
          )
        );
      }
      if (goalFileRef.current.files.length > 0) {
        uploadPromises.push(
          UploadFile(goalFileRef.current).then(
            (data) => (body["rciGoalFile"] = data.Hasil)
          )
        );
      }

      try {
        await Promise.all(uploadPromises);

        const data = await UseFetch(
          API_LINK + "RencanaCircle/CreateRencanaQCP",
          body
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
              <h3 className="fw-bold text-center">QCP REGISTRATION FORM</h3>
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
                          <div className="col-md-12">
                            <Input
                              type="text"
                              forInput="rciGroupName"
                              label="Group Name"
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
                              label="Prodi/UPT/Dep​"
                              isDisabled
                              //   isRequired
                              value={"Manajemen Informatika"}
                              //   onChange={handleInputChange}
                              //   errorMessage={errors.setName}
                            />
                          </div>
                          <div className="col-md-6">
                            <Input
                              type="text"
                              forInput="setName"
                              label="Directorate"
                              isDisabled
                              //   isRequired
                              value={"Manajemen Informatika"}
                              //   onChange={handleInputChange}
                              //   errorMessage={errors.setName}
                            />
                          </div>
                          <div className="col-md-6">
                            <SearchDropdown
                              forInput="rciFacil"
                              label="Facilitator"
                              placeHolder="Facilitator"
                              arrData={listEmployee}
                              isRequired
                              isRound
                              value={formDataRef.current.rciFacil}
                              onChange={handleInputChange}
                              errorMessage={errors.rciFacil}
                            />
                          </div>
                          <div className="col-md-6">
                            <SearchDropdown
                              forInput="rciLeader"
                              label="Leader"
                              placeHolder="Leader"
                              arrData={listEmployee}
                              isRequired
                              isRound
                              value={formDataRef.current.rciLeader}
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
                                  ).Text
                                )
                              }
                            />
                          </div>
                        </div>
                        <Table data={currentData} onRemove={handleRemove} />
                      </div>
                    </div>
                  </div>
                  <hr className="mb-3" />
                  <div className="col-lg-8">
                    <Input
                      type="text"
                      forInput="rciTitle"
                      label="Title"
                      isRequired
                      value={formDataRef.current.rciTitle}
                      onChange={handleInputChange}
                      errorMessage={errors.rciTitle}
                    />
                  </div>
                  <div className="col-lg-4">
                    <DropDown
                      forInput="setId"
                      label="Category"
                      arrData={listCategory}
                      isRequired
                      value={formDataRef.current.setId}
                      onChange={handleInputChange}
                      errorMessage={errors.setId}
                    />
                  </div>
                  <div className="col-lg-4">
                    <Input
                      type="date"
                      forInput="rciStartDate"
                      label="Start Date"
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
                      isDisabled
                      value={formDataRef.current.perId}
                      onChange={handleInputChange}
                      errorMessage={errors.perId}
                    />
                  </div>
                  <div className="col-lg-12">
                    <TextArea
                      forInput="rciCase"
                      label="Bussiness Case"
                      value={formDataRef.current.rciCase}
                      onChange={handleInputChange}
                      errorMessage={errors.rciCase}
                    />
                  </div>
                  <div className="col-lg-4">
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
                  <div className="col-lg-12">
                    <TextArea
                      forInput="rciProblem"
                      label="Problem Statement​"
                      value={formDataRef.current.rciProblem}
                      onChange={handleInputChange}
                      errorMessage={errors.rciProblem}
                    />
                  </div>
                  <div className="col-lg-4">
                    <FileUpload
                      forInput="rciProblemFile"
                      label="Problem Statement​ Document (.pdf)"
                      formatFile=".pdf"
                      ref={problemFileRef}
                      onChange={() => handleFileChange(problemFileRef, "pdf")}
                      errorMessage={errors.rciProblemFile}
                    />
                  </div>
                  <div className="col-lg-12">
                    <TextArea
                      forInput="rciGoal"
                      label="Goal Statement​"
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
                      onChange={() => handleFileChange(goalFileRef, "pdf")}
                      errorMessage={errors.goalFileRef}
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
                  <div className="col-lg-8">
                    <Input
                      type="number"
                      forInput="rciProjBenefit"
                      label="Project Benefit"
                      value={formDataRef.current.rciProjBenefit}
                      onChange={handleInputChange}
                      errorMessage={errors.rciProjBenefit}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label fw-bold ms-1">
                      Tangible Benefit
                    </label>
                    <div className="d-flex align-items-center mb-3">
                      <input
                        className="form-check-input mb-2 me-2"
                        type="checkbox"
                        checked={checkedStates.rciQuality}
                        onChange={() => handleCheckboxChange("rciQuality")}
                      />
                      <Input
                        type="text"
                        forInput="rciQuality"
                        isDisabled={!checkedStates.rciQuality}
                        placeholder="Quality"
                        value={formDataRef.current.rciQuality}
                        onChange={handleInputChange}
                        errorMessage={errors.rciQuality}
                      />
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <input
                        className="form-check-input mb-2 me-2"
                        type="checkbox"
                        checked={checkedStates.rciCost}
                        onChange={() => handleCheckboxChange("rciCost")}
                      />
                      <Input
                        type="text"
                        forInput="rciCost"
                        isDisabled={!checkedStates.rciCost}
                        placeholder="Cost"
                        value={formDataRef.current.rciCost}
                        onChange={handleInputChange}
                        errorMessage={errors.rciCost}
                      />
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <input
                        className="form-check-input mb-2 me-2"
                        type="checkbox"
                        checked={checkedStates.rciDelivery}
                        onChange={() => handleCheckboxChange("rciDelivery")}
                      />
                      <Input
                        type="text"
                        forInput="rciDelivery"
                        isDisabled={!checkedStates.rciDelivery}
                        placeholder="Delivery"
                        value={formDataRef.current.rciDelivery}
                        onChange={handleInputChange}
                        errorMessage={errors.rciDelivery}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label fw-bold ms-1">
                      Intangible Benefit
                    </label>
                    <div className="d-flex align-items-center mb-3">
                      <input
                        className="form-check-input mb-2 me-2"
                        type="checkbox"
                        checked={checkedStates.rciSafety}
                        onChange={() => handleCheckboxChange("rciSafety")}
                      />
                      <Input
                        type="text"
                        forInput="rciSafety"
                        isDisabled={!checkedStates.rciSafety}
                        placeholder="Safety"
                        value={formDataRef.current.rciSafety}
                        onChange={handleInputChange}
                        errorMessage={errors.rciSafety}
                      />
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <input
                        className="form-check-input mb-2 me-2"
                        type="checkbox"
                        isDisabled={!checkedStates.rciMoral}
                        onChange={() => handleCheckboxChange("rciMoral")}
                        id="flexCheckChecked"
                      />
                      <Input
                        type="text"
                        forInput="rciMoral"
                        isDisabled={!checkedStates.rciMoral}
                        placeholder="Moral"
                        value={formDataRef.current.rciMoral}
                        onChange={handleInputChange}
                        errorMessage={errors.rciMoral}
                      />
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
