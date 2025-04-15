import { useRef, useState, useEffect } from "react";
import { date, number, object, string } from "yup";
import { API_LINK, EMP_API_LINK } from "../../util/Constants";
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

const inisialisasiData = [
  {
    Key: null,
    Name: null,
    Section: null,
    Count: 0,
  },
];

export default function ValueChainInnovationEdit({ onChangePage, withID }) {
  const cookie = Cookies.get("activeUser");
  let userInfo = "";
  if (cookie) userInfo = JSON.parse(decryptId(cookie));
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const [listEmployee, setListEmployee] = useState([]);
  const [listEmployeeFull, setListEmployeeFull] = useState([]);
  const [listFacil, setListFacil] = useState([]);
  const [listPeriod, setListPeriod] = useState([]);
  const [listCompany, setListCompany] = useState([]);
  const [ListCompany2, setListCompany2] = useState([]);

  const [checkedStates, setCheckedStates] = useState({
    rciQuality: false,
    rciCost: false,
    rciDelivery: false,
    rciSafety: false,
    rciMoral: false,
  });

  const periodDataRef = useRef({
    startPeriod: "",
    endPeriod: "",
  });

  const handleCheckboxChange = (key) => {
    if (checkedStates[key]) formDataRef.current[key] = "";
    setCheckedStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const formDataRef = useRef({
    rciId: "",
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
    rciLeader: "",
    rciPerusahaan1: "",
    rciPerusahaan2: "",
  });

  const memberDataRef = useRef({
    rciMember: "",
  });

  const bussinessCaseFileRef = useRef(null);
  const problemFileRef = useRef(null);
  const goalFileRef = useRef(null);

  const userSchema = object({
    rciId: number().required("required"),
    setId: number().required("required"),
    perId: number().nullable(),
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
    rciQuality: string().max(100, "maximum 100 characters").nullable(),
    rciCost: string().max(100, "maximum 100 characters").nullable(),
    rciSafety: string().max(100, "maximum 100 characters").nullable(),
    rciDelivery: string().max(100, "maximum 100 characters").nullable(),
    rciMoral: string().max(100, "maximum 100 characters").nullable(),
    rciLeader: string().required("required"),
    rciFacil: string().required("required"),
    rciPerusahaan1: string().required("required"),
    rciPerusahaan2: string(),
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
      try {
        const data = await UseFetch(
          API_LINK + "RencanaCircle/GetListPerusahaan"
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the company data.");
        } else {
          setListCompany(data);
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListCompany([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(
          API_LINK + "RencanaCircle/GetRencanaVCIByIdforEdit",
          {
            id: withID,
          }
        );

        if (data === "ERROR" || data.length === 0) {
          throw new Error("Terjadi kesalahan: Gagal mengambil data VCI.");
        } else {
          formDataRef.current = {
            rciId: data["Key"],
            setId: data["CategoryId"],
            perId: data["PeriodId"],
            rciGroupName: data["Group Name"],
            rciTitle: decodeHtml(data["Project Title"]),
            rciProjBenefit: separator(data["Project Benefit"]),
            rciCase: decodeHtml(data["Case"]),
            rciCaseFile: data["CaseFile"],
            rciProblem: decodeHtml(data["Problem"]),
            rciProblemFile: data["ProblemFile"],
            rciGoal: decodeHtml(data["Goal"]),
            rciGoalFile: data["GoalFile"],
            rciScope: decodeHtml(data["Scope"]),
            rciStartDate: data["Start Date"].split("T")[0],
            rciEndDate: data["End Date"].split("T")[0],
            rciQuality: data["Quality"],
            rciCost: data["Cost"],
            rciDelivery: data["Delivery"],
            rciSafety: data["Safety"],
            rciMoral: data["Moral"],
            rciFacil: data["member"].find(
              (item) => item.Position === "Facilitator"
            ).Npk,
            rciLeader: data["member"].find((item) => item.Position === "Leader")
              .Npk,
            rciPerusahaan1: data["Company 1"],
            rciPerusahaan2: data["Company 2"] || "",
          };
          const members = data["member"].filter(
            (item) => item.Position === "Member"
          );
          const memberCount = members.length || 0;
          if (memberCount > 0) {
            setCurrentData(
              members?.map((item, index) => ({
                Key: item.Npk,
                No: index + 1,
                Name: item.Npk + " - " + item.Name,
                Section:
                  listEmployeeFull.find((value) => value.npk === item.Npk)
                    ?.upt_bagian || "",
                Count: memberCount,
                Action: ["Delete"],
                Alignment: ["center", "left", "left", "center", "center"],
              })) || []
            );
          } else {
            setCurrentData(inisialisasiData);
          }
          setCheckedStates({
            rciQuality: data["Quality"] ? true : false,
            rciCost: data["Cost"] ? true : false,
            rciDelivery: data["Delivery"] ? true : false,
            rciSafety: data["Safety"] ? true : false,
            rciMoral: data["Moral"] ? true : false,
          });
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
      }
    };

    fetchData();
  }, [withID, listEmployeeFull]);

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
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
          listEmployeeFull.find((item) => item.npk === id)?.upt_bagian || "",
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

  const handleDelete = (id) => {
    if (currentData.length === 1) setCurrentData(inisialisasiData);
    else {
      const prevData = currentData.filter((member) => member.Key !== id);
      setCurrentData(
        prevData.map((item, index) => ({
          Key: item.Key,
          No: index + 1,
          Name: item.Name,
          Section: item.Section,
          Count: prevData.length,
          Action: ["Delete"],
          Alignment: ["center", "left", "left", "center", "center"],
        }))
      );
    }
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
    name === "rciProjBenefit"
      ? (formDataRef.current[name] = separator(value))
      : (formDataRef.current[name] = value);
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

      if (eDate > innovationEndPeriod) {
        window.scrollTo(0, 0);
        setIsError({
          error: true,
          message:
            "Invalid date: Selected end date exceeds the innovation period end date",
        });
        return;
      }

      const newMemData = [
        { memNpk: formDataRef.current.rciFacil, memPost: "Facilitator" },
        { memNpk: formDataRef.current.rciLeader, memPost: "Leader" },
        ...currentData.map(({ Key }) => ({ memNpk: Key, memPost: "Member" })),
      ];
      delete formDataRef.current.rciFacil;
      delete formDataRef.current.rciLeader;

      const body = {
        ...formDataRef.current,
        rciProjBenefit: clearSeparator(formDataRef.current.rciProjBenefit),
        member: newMemData,
      };
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
          API_LINK + "RencanaCircle/UpdateRencanaVCI",
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
              <h3 className="fw-bold text-center">VCI REGISTRATION FORM</h3>
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
                              label="Circle Name"
                              isRequired
                              value={formDataRef.current.rciGroupName}
                              onChange={handleInputChange}
                              errorMessage={errors.rciGroupName}
                            />
                          </div>
                          <div className="col-md-6">
                            <DropDown
                              forInput="rciPerusahaan1"
                              label="Company 1"
                              type="pilih"
                              arrData={listCompany}
                              isRequired
                              value={formDataRef.current.rciPerusahaan1}
                              onChange={handleInputChange}
                              errorMessage={errors.rciPerusahaan1}
                            />
                          </div>
                          <div className="col-md-6">
                            <DropDown
                              forInput="rciPerusahaan2"
                              label="Company 2"
                              arrData={listCompany}
                              type="pilih"
                              value={formDataRef.current.rciPerusahaan2}
                              onChange={handleInputChange}
                              errorMessage={errors.rciPerusahaan2}
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
                            <SearchDropdown
                              forInput="rciLeader"
                              label="Leader"
                              placeHolder="Leader"
                              arrData={listEmployee}
                              isDisabled
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
                              isRequired
                              isDisabled
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
                              hasExisting={formDataRef.current.rciCaseFile}
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
                              hasExisting={formDataRef.current.rciProblemFile}
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
                              hasExisting={formDataRef.current.rciGoalFile}
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
                          <div className="col-lg-8">
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
                                className="form-check-input mb-2 me-2"
                                type="checkbox"
                                checked={checkedStates.rciMoral}
                                onChange={() =>
                                  handleCheckboxChange("rciMoral")
                                }
                              />
                              <div className="flex-grow-1">
                                <Input
                                  type="text"
                                  forInput="rciMoral"
                                  label="Moral"
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
