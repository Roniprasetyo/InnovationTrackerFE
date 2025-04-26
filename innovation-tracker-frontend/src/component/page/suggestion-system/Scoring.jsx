import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { decodeHtml, formatDate, separator } from "../../util/Formatting";
import { API_LINK, EMP_API_LINK, FILE_LINK, ROOT_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Loading from "../../part/Loading";
import { date, number, object, string } from "yup";
import Alert from "../../part/Alert";
import SweetAlert from "../../util/SweetAlert";
import Icon from "../../part/Icon";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import Table from "../../part/Table";
import { decryptId } from "../../util/Encryptor";
import Cookies from "js-cookie";
import Label from "../../part/Label";
import Input from "../../part/Input";
import SearchDropdown from "../../part/SearchDropdown";
import DropDown from "../../part/Dropdown";
import Button from "../../part/Button";
import { Tabs, Tab, Box, Paper, List } from "@mui/material";
import PropTypes from 'prop-types';

const inisialisasiData = [
  {
    Key: null,
    No: null,
    Name: null,
    Count: 0,
  },
];

function TabScoring(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabScoring.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function MiniConventionScoring({ onChangePage, WithID }) {
  const cookie = Cookies.get("activeUser");
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  let userInfo = "";
  if (cookie) userInfo = JSON.parse(decryptId(cookie));
  const [errors, setErrors] = useState({});
  const [listEmployee, setListEmployee] = useState([]);
  const [listKriteriaPenilaian, setListKriteriaPenilaian] = useState([]);
  const [listDepartment, setListDepartment] = useState([]);
  const [listAllDepartment, setAllListDepartment] = useState([]);
  const [listPenilaian, setListPenilaian] = useState([]);
  const [listPenilaianUpdate, setListPenilaianUpdate] = useState([]);
  const [listKaDept, setKaDept] = useState([]);
  const [listRecordPenilaian, setRecordListPenilaian] = useState([]);
  const [listDetailKriteriaPenilaian, setListDetailKriteriaPenilaian] =
    useState([]);
  const [userData, setUserData] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [forPenilai, setForPenilai] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [hasUserSelectedTab, setHasUserSelectedTab] = useState(false);

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

  const formDataRef2 = useRef([]);
  const formDataRef3 = useRef({});

  const userSchema = object({
    Key: number().required("required"),
    NPK: string().required("required"),
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
    sis_kualitas: string().max(200, "maximum 200 characters").nullable(),
    sis_biaya: string().max(200, "maximum 200 characters").nullable(),
    sis_kemanan: string().max(200, "maximum 200 characters").nullable(),
    sis_pengiriman: string().max(200, "maximum 200 characters").nullable(),
    sis_moral: string().max(200, "maximum 200 characters").nullable(),
    "Alasan Penolakan": string(),
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      // console.log("ID: ", id);

      try {
        const data = await UseFetch(API_LINK + "RencanaSS/GetRencanaSSByIdV2", {
          id: id,
        });

        // console.log("Data SS: ", id, data);
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
  }, [id]);

  useEffect(() => {
    if (listEmployee.length > 0 && userInfo?.upt) {
      const userData = listEmployee.find(
        (value) => value.npk === formDataRef.current["NPK"]
      );
      setUserData(userData);
    }
  }, [listEmployee, userInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    formDataRef2.current[name] = value;

    const validationError = validateInput(name, value, userSchema);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));

    let total = 0;
    formDataRef3.current = [];
    Object.values(formDataRef2.current).forEach((val) => {
      const matched = listDetailKriteriaPenilaian.find(
        (item) => item.Value === val
      );
    

      formDataRef3.current[val] = matched?.Score;

      console.log("val dari formDataRef2:", matched?.Score);
      // console.log("matched item:", formDataRef3);

      const parsed = parseFloat(matched?.Score);
      if (!isNaN(parsed)) total += parsed;
    });

    setTotalScore(total);
  };

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
            // jurusan: value.departemen_jurusan,
          }))
        );

        const temp = data.find((value) => value.npk === userInfo.npk);
        setForPenilai(temp);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("DP", formDataRef3);

    const payload = {
      dkp_id: Object.values(formDataRef2.current).join(", "),
      sis_id: id,
      pen_nilai: Object.values(formDataRef3.current).join(", "),
      jabatan: userInfo.jabatan,
      status: "-",
    };

    // const validationErrors = await validateAllInputs(
    //   formDataRef2.current,
    //   userSchema,
    //   setErrors
    // );

    console.log("FormDataRef: ", formDataRef2.current);
    console.log("Payload: ", payload);
    console.log("Payload nilai: ", formDataRef3);

    // if (Object.values(validationErrors).every((error) => !error)) {
    //   setIsLoading(true);
    //   setIsError((prevError) => ({ ...prevError, error: false }));
    //   setErrors({});

      try {
        const data = await UseFetch(
          API_LINK + "RencanaSS/CreatePenilaian",
          payload
        );

        // console.log("tes", data);
        if (!data) {
          throw new Error("Error: Failed to Submit the data.");
        } else {
          SweetAlert("Success", "Data Successfully Submitted", "success");
          // onChangePage("index");
          window.location.href = ROOT_LINK + "/submission/ss";
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
    // } else window.scrollTo(0, 0);
  };

  useEffect(() => {
    
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "MiniConvention/GetListKriteriaPenilaian"
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          setListKriteriaPenilaian(data);
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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "RencanaSS/GetPenilaianById", {id}
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          const dataDetail = data.map((item) => ({
            Keys: item.Key,
            Text: `${item.Deskripsi} - (${item.Nilai})`,
            Value: item.Value,
            Score: item.Nilai,
            KrpId: item.Kriteria,
          }));

          setListPenilaianUpdate(dataDetail);
          setListPenilaian(data);

        }
      } catch (error) {
          // window.scrollTo(0, 0);
          // setIsError((prevError) => ({
          //   ...prevError,
          //   error: true,
          //   message: error.message,
          // }));
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (listPenilaian.length === 0 || listEmployee.length === 0) return;
  
    const distinctCreaby = [...new Set(listPenilaian.map(item => item.Creaby).filter(Boolean))];

    const filteredEmployees = listEmployee.filter(emp =>
      distinctCreaby.includes(emp.username)
    );

    setRecordListPenilaian(filteredEmployees);
  
  }, [listPenilaian, listEmployee]);
  
  useEffect(() => {
    if (listRecordPenilaian.length === 0) return;

    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "RencanaSS/GetListStrukturDepartment"
        );

        console.log("LISTT DEPATEMEN: ", data);
        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          const npkTarget = String(listRecordPenilaian[0]?.npk);
          const matchingByNpk = data.find(item => String(item.Npk) === npkTarget);
  
          const strukturParentTarget = matchingByNpk["Struktur Parent"];
  
          const finalResult = data.filter(item =>
            item["Struktur Parent"] === strukturParentTarget &&
            (item.Jabatan === "Kepala Departemen" || item.Jabatan === "Sekretaris Prodi")
          );

          setAllListDepartment(data);
          setListDepartment(finalResult);
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
  }, [listRecordPenilaian]);

  const kadept = listAllDepartment.find(
    (detail) =>
      detail["Npk"] === forPenilai.npk
  );
  const kaupt = listAllDepartment.find(
    (detail) =>
      detail["Creaby"] === listPenilaian[0].npk
  );

  // console.log("DATA ", listEmployee.filter((item) => item.upt === "Prodi MI" ));
  console.log("RECORD LIST ", forPenilai);
  console.log("KA DEPT ", kadept);
  console.log("KA UPT ",kaupt);
  console.log("DeptArrData:", listDepartment);
  console.log("All Dept:", listAllDepartment);
  console.log("List Penilaian:", listPenilaian);
  console.log("List Penilaian Update:", listPenilaianUpdate);
  console.log("User Info:", userInfo);

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "MiniConvention/GetListDetailKriteriaPenilaian"
        );

        console.log("471: ", data);
        if (!data) {
          throw new Error("Error: Failed to get the category data.");
        } else {
          const dataDetail = data.map((item) => ({
            Text: `${item.Desc} - (Poin ${item.Score})`,
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
      }
    };

    fetchData();
  }, []);

  const formatNumber = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    setFormattedValue(formatNumber(rawValue));
    setUserInput(rawValue);
    // handleInputChange({ target: { name: "budget", value: rawValue } });
  };

  const DeptArrData = listDepartment.length > 0 && userInfo?.npk
  ? listDepartment.find(detail => String(detail.Npk) === String(userInfo.npk))
  : null;

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
    setHasUserSelectedTab(true);
  };
  
  useEffect(() => {
    if (!hasUserSelectedTab) {
      if (userInfo?.jabatan === "Sekretaris Prodi" || userInfo?.jabatan === "Kepala Departemen") {
        setSelectedTab(1);
      } else if (userInfo?.jabatan === "Kepala Seksi") {
        setSelectedTab(0);
      } else if (userInfo?.jabatan === "Wakil Direktur") {
        setSelectedTab(2);
      }
    }
  }, [userInfo, hasUserSelectedTab]);

  const tabLabels = ["Ka.Unit/Ka.UPT"];
  if (userInfo?.jabatan === "Sekretaris Prodi") {
    tabLabels.push("Ka.Prodi/Ka.Dept");
  }else if(userInfo?.jabatan === "Wakil Direktur") {
    tabLabels.push("Ka.Prodi/Ka.Dept", "WaDIR/DIR");
  }
  

  if (isLoading) return <Loading />;

  return (
    <>
    
      <div className="container min-vh-100">
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
            Scoring Data
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
              <h3 className="fw-bold text-center">DATA SCORING FORM</h3>
            </div>
            <div className="card-body p-3">
              {isLoading ? (
                <Loading />
              ) : (
                <form>
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
                                data={userData?.name || "-"}
                              />
                            </div>

                            <div className="col-md-4">
                              <Label
                                title="Section​"
                                data={userData?.upt || "-"}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="card mb-3">
                        <div className="card-header align-items-center d-flex">
                          <h5 className="fw-medium">Criteria</h5>
                        </div>
                        <div className="card-body d-flex flex-wrap">
                          <Box sx={{width:'80%'}}>
                            <div>
                              <Box>
                                <Tabs
                                  value={selectedTab}
                                  className="card rounded-bottom-0"
                                  onChange={handleTabChange} 
                                  variant="fullWidth"
                                  sx={{
                                    "& .MuiTabs-indicator": {
                                      height: "3px",
                                      backgroundColor: "#1976d2",
                                    },
                                  }}
                                >
                                  {tabLabels.map((label, index) => (
                                    <Tab
                                      key={label}
                                      label={label}
                                      sx={{
                                        backgroundColor: selectedTab === index ? "#ffffff" : "#f0f0f0", // putih saat aktif, abu saat non-aktif
                                        borderRight: index !== 2 ? '1px solid #ddd' : 'none',
                                        fontWeight: "bold",
                                        color: "black",
                                        minHeight: '48px',
                                      }}
                                    />
                                  ))}
                                </Tabs>
                              </Box>
                            </div>
                            <div className="card" style={{ borderTop: 'none', borderRadius: '0 0 12px 12px' }}>
                              <div
                                className=" card-body pe-4"
                                
                              >
                                {listKriteriaPenilaian.map((item) => {

                                  const filteredArrData =
                                    listDetailKriteriaPenilaian.filter(
                                      (detail) => detail.Id === item.Value
                                    );

                                    
                                    const matchingPenilaian = listPenilaian.find(
                                      (detail) =>
                                        detail["Jabatan Penilai"] === forPenilai.jabatan &&
                                      detail.Kriteria === item.Value
                                    );

                                    const matchingPenilaian2 = listPenilaian.find(
                                      (detail) =>
                                        detail["Jabatan Penilai"] !== forPenilai.jabatan &&
                                      detail.Kriteria === item.Value
                                    );
                                    const arrTextData =
                                    listPenilaianUpdate.map(
                                      (item) => item
                                      
                                    );
                                  return (
                                    <div className="row mb-3" key={item.Value}>
                                      <div className="col-lg-4">
                                        <Label data={item.Text} />
                                      </div>
                                      <div className="col-lg-8">
                                      {selectedTab === 1 && matchingPenilaian ? (
                                        <div className="form-control bg-light">
                                          {`${matchingPenilaian.Deskripsi} - (Poin: ${matchingPenilaian.Nilai})`}
                                        </div>
                                      ) : selectedTab === 0 && matchingPenilaian2 ? (
                                        <div className="form-control bg-light">
                                        {`${matchingPenilaian2.Deskripsi} - (Poin: ${matchingPenilaian2.Nilai})`}
                                        </div>
                                        ) : selectedTab === 2 && matchingPenilaian2 ? (
                                          <div className="form-control bg-light">
                                          {`${matchingPenilaian2.Deskripsi} - (Poin: ${matchingPenilaian2.Nilai})`}
                                          </div>
                                        ) :
                                        <SearchDropdown
                                          forInput={item.Value}
                                          arrData={filteredArrData}
                                          isRound
                                          selectedValued={arrTextData[item.Value-1]}
                                          value={formDataRef2.current[item.Value] || ""}
                                          onChange={handleInputChange}
                                        />
                                      }
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </Box>
                          <Box sx={{width:'20%'}}>
                            <div className="ps-4">
                              <div
                                className="d-flex flex-column gap-3"
                                style={{ height: "100px" }}
                              >
                                <div
                                  className="card fw-medium text-center"
                                  style={{ width: "200px", minHeight:'180px' }}
                                >
                                  Ka.Unit/Ka.UPT
                                  <hr />
                                  <h5>{totalScore}</h5>
                                </div>
                                <div
                                  className="card fw-medium text-center"
                                  style={{ width: "200px", minHeight:'180px' }}
                                >
                                  Ka.Prodi/Ka.Dept
                                  <hr />
                                  <h5>{0}</h5>
                                </div>
                                <div
                                  className="card fw-medium text-center"
                                  style={{ width: "200px", minHeight:'180px' }}
                                >
                                  WaDIR/DIR
                                  <hr />
                                  <h5>{0}</h5>
                                </div>
                              </div>
                            </div>
                          </Box>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 ms-auto">
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
                            onClick={handleSubmit}
                            style={{ width: "100%", borderRadius: "16px" }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* <div className="d-flex justify-content-end pe-3 mb-3">
                    <sub>
                      Submitted by{" "}
                      <strong>{formDataRef.current["Creaby"] || "-"}</strong>
                    </sub>
                  </div> */}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
