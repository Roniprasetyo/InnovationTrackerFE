import { useRef, useState, useEffect } from "react";
import { number, object, string } from "yup";
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

const inisialisasiData = [
  {
    Key: null,
    No: null,
    Name: null,
    NPK: null,
    Count: 0,
  },
];

export default function QualityControlProjectAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMem, setIsLoadingMem] = useState(false);

  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [listCategory, setListCategory] = useState([]);

  const [checkedStates, setCheckedStates] = useState({
    quality: false,
    cost: false,
    delivery: false,
    safety: false,
    moral: false,
  });

  const handleCheckboxChange = (key) => {
    setCheckedStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const formDataRef = useRef({
    setId: "",
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
    rciTimeFrame: "",
    rciQuality: "",
    rciCost: "",
    rciDelivery: "",
    rciSafety: "",
    rciMoral: "",
  });

  const memberDataRef = useRef({
    memName: "",
    memNpk: "",
  });

  const bussinessCaseFileRef = useRef(null);
  const problemFileRef = useRef(null);
  const goalFileRef = useRef(null);

  const userSchema = object({
    setId: number().required("required"),
    rciGroupName: string()
      .max(50, "maximum 50 characters")
      .required("required"),
    rciTitle: string().max(100, "maximum 100 characters").required("required"),
    rciProjBenefit: number()
      .max(11, "maximum 11 characters")
      .required("required"),
    rciCase: string().required("required"),
    rciCaseFile: string(),
    rciProblem: string().required("required"),
    rciProblemFile: string(),
    rciGoal: string().required("required"),
    rciGoalFile: string(),
    rciScope: string().max(200, "maximum 200 characters").required("required"),
    rciTimeFrame: string()
      .max(200, "maximum 200 characters")
      .required("required"),
    rciQuality: string().max(100, "maximum 100 characters"),
    rciCost: number(),
    rciDelivery: string().max(100, "maximum 100 characters"),
    rciMoral: string().max(100, "maximum 100 characters"),
  });

  const memberSchema = object({
    memName: string().max(50, "maximum 50 characters"),
    memNpk: number(),
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

  const handleAddMember = (Name, NPK) => {
    if (currentData[0].Count === 0) {
      const data = [
        {
          Key: NPK,
          No: 1,
          Name,
          NPK,
          Count: 1,
        },
      ];
      const formattedData = data.map((value) => ({
        ...value,
        Aksi: ["Remove"],
        Alignment: ["center", "left", "center", "center"],
      }));
      setCurrentData(formattedData);
    } else {
      if (currentData.some((member) => member.NPK === NPK) === true) {
        setIsError({ error: true, message: "Member already exists!" });
        return;
      }
      if (currentData.length === 6) {
        setIsError({ error: true, message: "Max member reached!" });
        return;
      }
      setCurrentData((prevData) => [
        ...prevData,
        {
          Key: NPK,
          No: prevData.length + 1,
          Name,
          NPK,
          Count: prevData.length + 1,
          Aksi: ["Remove"],
          Alignment: ["center", "left", "center", "center"],
        },
      ]);
    }
    memberDataRef.current.memName = "";
    memberDataRef.current.memNpk = "";
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

    const memData = currentData.map((value) => ({
      memName: value.Name,
      memNpk: value.NPK,
      memPost: "Anggota",
    }));

    const body = { ...formDataRef.current, member: memData };
    console.log(body);
    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    const memValidationErrors = await validateAllInputs(
      memberDataRef.current,
      memberSchema,
      setErrors
    );

    if (
      Object.values(validationErrors).every((error) => !error) &&
      Object.values(memValidationErrors).every((error) => !error)
    ) {
      setIsLoading(true);
      setIsError((prevError) => ({ ...prevError, error: false }));
      setErrors({});

      //   try {
      //     const data = await UseFetch(
      //       API_LINK + "MasterSetting/CreateSetting",
      //       formDataRef.current
      //     );

      //     if (data === "ERROR") {
      //       throw new Error("Error: Failed to submit the data.");
      //     } else {
      //       SweetAlert("Success", "Data successfully submitted", "success");
      //       onChangePage("index");
      //     }
      //   } catch (error) {
      //     window.scrollTo(0, 0);
      //     setIsError((prevError) => ({
      //       ...prevError,
      //       error: true,
      //       message: error.message,
      //     }));
      //   } finally {
      //     setIsLoading(false);
      //   }
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
                              //   isRequired
                              //   value={formDataRef.current.setName}
                              //   onChange={handleInputChange}
                              //   errorMessage={errors.setName}
                            />
                          </div>
                          <div className="col-md-6">
                            <Input
                              type="text"
                              forInput="setName"
                              label="Directorate"
                              //   isRequired
                              //   value={formDataRef.current.setName}
                              //   onChange={handleInputChange}
                              //   errorMessage={errors.setName}
                            />
                          </div>
                          <div className="col-md-6">
                            <Input
                              type="text"
                              forInput="setName"
                              label="Facilitator"
                              //   isRequired
                              //   value={formDataRef.current.setName}
                              //   onChange={handleInputChange}
                              //   errorMessage={errors.setName}
                            />
                          </div>
                          <div className="col-md-6">
                            <Input
                              type="text"
                              forInput="setName"
                              label="Leader"
                              //   isRequired
                              //   value={formDataRef.current.setName}
                              //   onChange={handleInputChange}
                              //   errorMessage={errors.setName}
                            />
                          </div>
                        </div>
                        <div className="flex-fill">
                          <div className="input-group">
                            <div className="flex-grow-1">
                              <Input
                                placeholder="Name"
                                forInput="memName"
                                value={memberDataRef.current.memName}
                                onChange={handleInputMemberChange}
                                errorMessage={errors.memName}
                              />
                            </div>
                            <div className="flex-grow-1">
                              <Input
                                placeholder="NPK"
                                forInput="memNpk"
                                value={memberDataRef.current.memNpk}
                                onChange={handleInputMemberChange}
                                errorMessage={errors.memNpk}
                              />
                            </div>
                            <Button
                              iconName="add"
                              label="Add Member"
                              classType="success"
                              onClick={() =>
                                handleAddMember(
                                  memberDataRef.current.memName,
                                  memberDataRef.current.memNpk
                                )
                              }
                            />
                          </div>
                        </div>
                        <Table data={currentData} onRemove={handleRemove} />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
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

                  <div className="col-lg-6">
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
                    <Input
                      type="text"
                      forInput="rciScope"
                      label="Project Scope"
                      isRequired
                      value={formDataRef.current.rciScope}
                      onChange={handleInputChange}
                      errorMessage={errors.rciScope}
                    />
                  </div>
                  <div className="col-lg-4">
                    <Input
                      type="textarea"
                      forInput="rciTimeFrame"
                      label="Project Timeframe/Milestone​"
                      isRequired
                      value={formDataRef.current.rciTimeFrame}
                      onChange={handleInputChange}
                      errorMessage={errors.rciTimeFrame}
                    />
                  </div>
                  <div className="col-lg-4">
                    <label className="form-label fw-bold ms-1">
                      Tangible Benefit
                    </label>
                    <div className="d-flex align-items-center mb-3">
                      <input
                        className="form-check-input mb-2 me-2"
                        type="checkbox"
                        checked={checkedStates.quality}
                        onChange={() => handleCheckboxChange("quality")}
                      />
                      <Input
                        type="text"
                        forInput="rciQuality"
                        isDisabled={!checkedStates.quality}
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
                        checked={checkedStates.cost}
                        onChange={() => handleCheckboxChange("cost")}
                      />
                      <Input
                        type="text"
                        forInput="rciCost"
                        isDisabled={!checkedStates.cost}
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
                        checked={checkedStates.delivery}
                        onChange={() => handleCheckboxChange("delivery")}
                      />
                      <Input
                        type="text"
                        forInput="rciDelivery"
                        isDisabled={!checkedStates.delivery}
                        placeholder="Delivery"
                        value={formDataRef.current.rciDelivery}
                        onChange={handleInputChange}
                        errorMessage={errors.rciDelivery}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <label className="form-label fw-bold ms-1">
                      Intangible Benefit
                    </label>
                    <div className="d-flex align-items-center mb-3">
                      <input
                        className="form-check-input mb-2 me-2"
                        type="checkbox"
                        checked={checkedStates.safety}
                        onChange={() => handleCheckboxChange("safety")}
                      />
                      <Input
                        type="text"
                        forInput="rciSafety"
                        isDisabled={!checkedStates.safety}
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
                        isDisabled={!checkedStates.moral}
                        onChange={() => handleCheckboxChange("moral")}
                        id="flexCheckChecked"
                      />
                      <Input
                        type="text"
                        forInput="rciMoral"
                        isDisabled={!checkedStates.moral}
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
