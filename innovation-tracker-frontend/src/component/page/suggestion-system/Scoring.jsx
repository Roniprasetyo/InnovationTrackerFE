import { useRef, useState, useEffect } from "react";
import { redirect, useSearchParams } from "react-router-dom";
import { decodeHtml, formatDate, maxCharDisplayed, separator } from "../../util/Formatting";
import { API_LINK, EMP_API_LINK, FILE_LINK, ROOT_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Loading from "../../part/Loading";
import { date, number, object, string } from "yup";
import * as Yup from "yup";
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

function deobfuscateId(obfuscated) {
  const parts = obfuscated.split(".");
  if (parts.length === 2) {
    return atob(parts[1]); // hanya ambil bagian Base64
  }
  return null;
}

export default function MiniConventionScoring({ onChangePage, WithID }) {
  const cookie = Cookies.get("activeUser");
  const [searchParams] = useSearchParams();
  const encodedId = searchParams.get("id");
  let userInfo = "";
  const id = deobfuscateId(encodedId);
  if (cookie) userInfo = JSON.parse(decryptId(cookie));
  const [errors, setErrors] = useState({});
  const [listEmployee, setListEmployee] = useState([]);
  const [listKriteriaPenilaian, setListKriteriaPenilaian] = useState([]);
  const [listDepartment, setListDepartment] = useState([]);
  const [listAllDepartment, setAllListDepartment] = useState([]);
  const [listPenilaianKaUpt, setListPenilaianKaUpt] = useState([]);
  const [scoringPosition, setScoringPosition] = useState([]);
  const [scoringPositionRole, setScoringPositionRole] = useState([]);
  const [activeTab, setActiveTab] = useState(false);
  const [isSearchDropdown, setIsSearchDropdown] = useState(false);
  const [listAllPenilaian, setAllListPenilaian] = useState([]);
  const [listSettingRanking, setListSettingRanking] = useState([]);
  const [listPenilaianKaDept, setListPenilaianKaDept] = useState([]);
  const [listPenilaianWadir, setListPenilaianWadir] = useState([]);
  const [submitOnly, setReadOnly] = useState(false);
  const [listKaDept, setKaDept] = useState([]);
  const [detailSS, setDetailSS] = useState([]);
  const [listRecordPenilaian, setRecordListPenilaian] = useState([]);
  const [listDetailKriteriaPenilaian, setListDetailKriteriaPenilaian] =
    useState([]);
  const [userData, setUserData] = useState({});
  const [totalScoreforKaUpt, setTotalScoreforKaUpt] = useState(0);
  const [totalScoreforKaDept, setTotalScoreforKaDept] = useState(0);
  const [totalScoreforWadir, setTotalScoreforWadir] = useState(0);
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [forPenilai, setForPenilai] = useState("");
  const [hasUserSelectedTab, setHasUserSelectedTab] = useState(false);
  const [listValues, setListValues] = useState([]);

  useEffect(() => {
    if (listKriteriaPenilaian.length > 0) {
      const values = listKriteriaPenilaian.map((item) => item.Value);
      setListValues(values);
    }
  }, [listKriteriaPenilaian]);

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

  const formDataRef2 = useRef({});
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

      try {
        const data = await UseFetch(API_LINK + "RencanaSS/GetRencanaSSByIdV2", {
          id: id,
        });

        if (data === "ERROR" || data.length === 0) {
          throw new Error("Error: Failed to get SS data");
        } else {
          setDetailSS(data[0]);
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
  }, [id]);

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
    
      if (matched) {
        formDataRef3.current[val] = matched.Score;
      } else {
        formDataRef3.current[val] = null;
      }

      const parsed = parseFloat(matched?.Score);
      if (!isNaN(parsed)) total += parsed;
    });

    if (userInfo.jabatan === "Kepala Seksi" || userInfo.jabatan === "Sekretaris Prodi"){
      setTotalScoreforKaUpt(total);
    }else if(userInfo.jabatan == "Kepala Departemen"){
      setTotalScoreforKaDept(total);
    }else if(userInfo.jabatan === "Wakil Direktur" || userInfo.jabatan === "Direktur" ){
      setTotalScoreforWadir(total);
    }
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

    let status1 = "";

    if (
      userInfo.jabatan === "Kepala Seksi" ||
      userInfo.jabatan === "Sekretaris Prodi"
    ) {
      if (
        formDataRef.current.Status === "Approved" ||
        formDataRef.current.Status.includes("Draft Scoring")
      ) {
        status1 = "Draft Scoring";
      }
    } else if (userInfo.jabatan === "Kepala Departemen") {
      if (
        formDataRef.current.Status === "Approved" ||
        formDataRef.current.Status.includes("Draft Scoring")
      ) {
        status1 = "Draft Scoring";
      }
    } else if (
      userInfo.jabatan === "Wakil Direktur" ||
      userInfo.jabatan === "Direktur"
    ) {
      if (
        formDataRef.current.Status === "Scoring - Ka.Prodi/Ka.Dept" ||
        formDataRef.current.Status.includes("Draft Scoring")
      ) {
        status1 = "Draft Scoring";
      }
    }

    const payload = {
      dkp_id: Object.values(formDataRef2.current).join(", "),
      sis_id: id,
      pen_nilai: Object.values(formDataRef3.current).join(", "),
      jabatan: userInfo.jabatan,
      statusPN: "-",
      created: userInfo.username,
      statusSS: status1
    };

    const payloadSchema = Yup.object().shape({
      dkp_id: Yup.string()
        .required("dkp_id is required")
        .matches(
          /^(\d+\s*,\s*)*\d+$/,
          "dkp_id must be a comma-separated list of numbers"
        )
        .test(
          "length-9",
          "All Assessment Schemes must be filled!",
          function (value) {
            if (!value) return false;
            const items = value
              .split(",")
              .map((v) => v.trim())
              .filter((v) => v !== "");
            return items.length === listKriteriaPenilaian.length;
          }
        ),

      sis_id: Yup.string().required("sis_id is required"),

      pen_nilai: Yup.string()
        .required("pen_nilai is required")
        .matches(
          /^(\d+\s*,\s*)*\d+$/,
          "pen_nilai must be a comma-separated list of numbers"
        ),

      jabatan: Yup.string().required("jabatan is required"),

      statusPN: Yup.string().required("statusPN is required"),

      created: Yup.string().required("created is required"),
      statusSS: Yup.string().nullable()
    });

    const validationErrors = await validateAllInputs(
      payload,
      payloadSchema,
      setErrors
    );

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError((prevError) => ({ ...prevError, error: false }));
      setErrors({});

      try {
        const data = await UseFetch(
          API_LINK + "RencanaSS/CreatePenilaian",
          payload
        );
        if (!data) {
          throw new Error("Error: Failed to Submit the data.");
        } else {
          SweetAlert("Success", "Data Successfully Submitted", "success");
          setTimeout(function() {
            if (window.opener) {
              window.opener.location.href = ROOT_LINK + "/submission/ss";
              window.close();
            } else {
              window.location.href = ROOT_LINK + "/submission/ss";
            }
          }, 2000);
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
    } else {
      SweetAlert("Error", Object.values(validationErrors).join("\n"), "error");
    }
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
        setListCategory({});
      }finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchDataDetailByID = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(API_LINK + "RencanaSS/GetPenilaianByIdForKaProd", {
          sis_id: id,
        });

        if (!data) {
          // throw new Error("Error: Failed to get the category data.");
        } else {
          setListPenilaianKaDept(data);
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
      }finally {
        setIsLoading(false);
      }
    };
    fetchDataDetailByID();
  }, []);


  useEffect(() => {
    const fetchDataDetailByID = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(API_LINK + "RencanaSS/GetPenilaianByIdForDirorWadir", {
          sis_id: id,
        });

        if (!data) {
          throw new Error("Error: Failed to get the category data.");
        } else {
          setListPenilaianWadir(data);
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
      }finally {
        setIsLoading(false);
      }
    };
    fetchDataDetailByID();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "RencanaSS/GetPenilaianById", {
            id: id,
          }
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          
          setListPenilaianKaUpt(data);

        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListCategory({});
      }finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "RencanaSS/GetAllPenilaianById", {
            id: id,
          }
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          
          setAllListPenilaian(data);

        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListCategory({});
      }finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "RencanaSS/GetListSettingRanking"
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          setListSettingRanking(data);

        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListCategory({});
      }finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  

  useEffect(() => {
    if (listPenilaianKaUpt.length === 0 || listEmployee.length === 0) return;
  
    const distinctCreaby = [...new Set(listPenilaianKaUpt.map(item => item.Creaby).filter(Boolean))];

    const filteredEmployees = listEmployee.filter(emp =>
      distinctCreaby.includes(emp.username)
    );

    setRecordListPenilaian(filteredEmployees);
  
  }, [listPenilaianKaUpt, listEmployee]);
  
  useEffect(() => {
    if (listRecordPenilaian.length === 0) return;

    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "RencanaSS/GetListStrukturDepartment"
        );

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
        setListCategory({});
      }finally {
        setIsLoading(false);
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
      detail["Creaby"] === listPenilaianKaUpt[0].npk
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "RencanaSS/GetListDetailKriteriaPenilaian"
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          const dataDetail = data.map((item) => ({
            Text: `(Poin: ${item.Score}) - ${item.Desc}`,
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
      }finally {
        setIsLoading(false);
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
      if (userInfo?.jabatan === "Kepala Departemen") {
        setSelectedTab(1);
      } else if (userInfo?.jabatan === "Kepala Seksi" || userInfo?.jabatan === "Sekretaris Prodi") {
        setSelectedTab(0);
      } else if (userInfo?.jabatan === "Wakil Direktur") {
        setSelectedTab(2);
      }
    }
  }, [userInfo, hasUserSelectedTab]);

  const tabLabels = ["Ka.Unit/Ka.UPT/SekProdi", "Ka.Prodi/Ka.Dept", "WaDIR/DIR"];

  const tabIndexUser = tabLabels.findIndex((label) => {
    if (userInfo.jabatan === "Kepala Departemen") return label === "Ka.Prodi/Ka.Dept";
    if (userInfo.jabatan === "Wakil Direktur" || userInfo.jabatan === "Direktur") return label === "WaDIR/DIR";
    return label === "Ka.Unit/Ka.UPT/SekProdi";
  });
    
  const [selectedTab, setSelectedTab] = useState(tabIndexUser);

  const arrTextDataforKaUpt =
  listPenilaianKaUpt.map(
    (item) => item
  );
  
  const arrTextDataforKaDept =
  listPenilaianKaDept.map(
    (item) => item
  );

  const arrTextDataforWadir =
  listPenilaianKaDept.map(
    (item) => item
  );

  useEffect(() => {
    let tempTotal1 = 0;
    let tempTotal2 = 0;
    let tempTotal3 = 0;

    listPenilaianKaUpt.forEach((item) => {
      if (
        item["Jabatan Penilai"] !== "Kepala Seksi" &&
        item["Jabatan Penilai"] !== "Sekretaris Prodi"
      ) {
        tempTotal1 = 0;
      } else {
        tempTotal1 += parseFloat(item.Nilai) || 0;
      }
    });

    listPenilaianKaDept.forEach((item) => {
      if (item["Jabatan Penilai"] !== "Kepala Departemen" && userInfo.jabatan !== "Kepala Departemen") {
        tempTotal2 = 0;
      } else {
        tempTotal2 += parseFloat(item.Nilai) || 0;
      }
    });

    listPenilaianWadir.forEach((item) => {
      if (item["Jabatan Penilai"] !== "Wakil Direktur" && userInfo.jabatan !== "Wakil Direktur" && userInfo.jabatan !== "Direktur") {
        tempTotal3 = 0;
      } else {
        tempTotal3 += parseFloat(item.Nilai) || 0;
      }
    });

    setTotalScoreforKaUpt(tempTotal1);
    setTotalScoreforKaDept(tempTotal2);
    setTotalScoreforWadir(tempTotal3);
  }, [listPenilaianKaUpt, listPenilaianKaDept, listPenilaianWadir]);

  useEffect(() => {
    if (listPenilaianWadir !== null && listPenilaianWadir.length > 0) {
      const firstData = listPenilaianWadir[0];
  
      if (firstData) {
        const namePosition = listEmployee.find((item) => item.username === firstData["Creaby"]);
        setScoringPosition(namePosition?.name);
        setScoringPositionRole(firstData["Jabatan Penilai"]);
      }
    }
    else if (listPenilaianKaDept !== null & listPenilaianKaDept.length > 0) {
      const firstData = listPenilaianKaDept[0];
  
      if (firstData) {
        const namePosition = listEmployee.find((item) => item.username === firstData["Creaby"]);
        setScoringPosition(namePosition?.name);
        setScoringPositionRole(firstData["Jabatan Penilai"]);
      }
    } else if(listPenilaianKaUpt !== null & listPenilaianKaUpt.length > 0) {
      const firstData = listPenilaianKaUpt[0];
  
      if (firstData) {
        const namePosition = listEmployee.find((item) => item.username === firstData["Creaby"]);
        setScoringPosition(namePosition?.name);
        setScoringPositionRole(firstData["Jabatan Penilai"]);
      }
    }
  }, [listPenilaianWadir]);  

  const findRanking = (score, listSettingRanking) => {
    for (const ranking of listSettingRanking) {
      const rangeText = ranking.Range;
      
      if (rangeText.includes("-")) {
        const [min, max] = rangeText.split("-").map((num) => parseFloat(num.trim()));
        if (score >= min && score <= max) {
          return ranking.Ranking;
        }
      } else {
        const singleValue = parseFloat(rangeText.trim());
        if (score === singleValue) {
          return ranking.Ranking;
        }
      }
    }
    return "No Ranking";
  };
  
  useEffect(() => {
    let jabatanTarget = [];

    if (selectedTab === 0) jabatanTarget = ["Kepala Seksi", "Sekretaris Prodi"];
    else if (selectedTab === 1) jabatanTarget = ["Kepala Departemen"];
    else if (selectedTab === 2) jabatanTarget = ["Wakil Direktur", "Direktur"];
    let isChecked = false;
    if(listAllPenilaian.length !== 0){
      isChecked = listAllPenilaian.some(
        (item) =>
          item["Jabatan Penilai"] &&
          jabatanTarget.some((jabatan) =>
            item["Jabatan Penilai"].includes(jabatan)
          )
      );
      setReadOnly(isChecked);
    }
    setActiveTab(selectedTab === tabIndexUser);
  }, [selectedTab, tabIndexUser, listAllPenilaian]);

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
                      <div className="card-header d-flex align-items-center justify-content-between">
                        <h5 className="fw-medium m-0">Criteria</h5>
                          <div className="text-end">
                            <div className="small">Already Scored by:</div>
                            {(listPenilaianKaUpt.length > 0 || listPenilaianKaDept.length > 0 || listPenilaianWadir.length > 0) && (
                              <div className="fw-semibold">{scoringPosition} as {scoringPositionRole}</div>
                            )}
                          </div>
                        </div>
                        <div className="card-body d-flex flex-wrap">
                          <Box sx={{width:'80%'}}>
                            <div>
                              <Box>
                                {isLoading ? (
                                  <Loading />
                                ) : (

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
                                    {tabLabels.map((label, index) => {
                                      let jabatanTarget = [];

                                      if (index === 0) jabatanTarget = ['Kepala Seksi', 'Sekretaris Prodi'];
                                      else if (index === 1) jabatanTarget = ['Kepala Departemen'];
                                      else if (index === 2) jabatanTarget = ['Wakil Direktur', 'Direktur'];
                                      
                                      let isChecked = listAllPenilaian.some(
                                        (item) =>
                                          item['Jabatan Penilai'] &&
                                          jabatanTarget.some((jabatan) =>
                                            item['Jabatan Penilai'].includes(jabatan)
                                          )
                                      );                                      

                                      return (
                                        <Tab
                                          key={index}
                                          label={isChecked ? (
                                            <div className="d-flex gap-2 align-items-center">
                                              <span style={{ color: 'green', fontSize:'20px' }}>✓</span>
                                              <span style={{ fontSize: '14px' }}>{label}</span>
                                            </div>
                                          ) : (
                                            label
                                          )}
                                          sx={{
                                            backgroundColor: selectedTab === index ? "#ffffff" : "#f0f0f0",
                                            borderRight: index !== 2 ? '1px solid #ddd' : 'none',
                                            fontWeight: "bold",
                                            color: "black",
                                            minHeight: '48px',
                                          }}
                                        />
                                      );
                                    })}
                                  </Tabs>
                                )}
                              </Box>
                            </div>
                            <div className="card" style={{ borderTop: 'none', borderRadius: '0 0 12px 12px' }}>
                              <div
                                className=" card-body pe-4"
                              >
                                {listKriteriaPenilaian.map((item) => {
                                  let totalNilai = 0;
                                  const filteredArrData =
                                    listDetailKriteriaPenilaian.filter(
                                      (detail) => detail.Id === item.Value
                                    );

                                    const matchingPenilaianforKaUpt = listPenilaianKaUpt.find(
                                      (detail) => detail.Kriteria === item.Value
                                    );

                                    const matchingPenilaianforKaDept = listPenilaianKaDept.find(
                                      (detail) => detail.Kriteria === item.Value
                                    );

                                    const matchingPenilaianforWadir = listPenilaianWadir.find(
                                      (detail) => detail.Kriteria === item.Value
                                    );

                                    const rankingKaUpt = findRanking(totalScoreforKaUpt, listSettingRanking);
                                    const rankingKaDept = findRanking(totalScoreforKaDept, listSettingRanking);
                                    const rankingWadir = findRanking(totalScoreforWadir, listSettingRanking);

                                    const isKepalaSeksi = forPenilai.jabatan === "Kepala Seksi" || forPenilai.jabatan === "Sekretaris Prodi";
                                    const isKaDept = forPenilai.jabatan === "Kepala Departemen";
                                    const isWadir = forPenilai.jabatan === "Wakil Direktur" || forPenilai.jabatan === "Direktur";
                                    const isFirstTab = selectedTab === tabIndexUser;
                                    const range3End =
                                    listSettingRanking
                                      .find(
                                        (item) => item.Ranking === "Ranking 3"
                                      )
                                      ?.Range.split("-")
                                      .map((r) => parseInt(r.trim(), 10))[1] +
                                    1;

                                  const range5End =
                                    listSettingRanking
                                      .find(
                                        (item) => item.Ranking === "Ranking 5"
                                      )
                                      ?.Range.split("-")
                                      .map((r) => parseInt(r.trim(), 10))[1] +
                                    1;

                                  const range4End =
                                    listSettingRanking
                                      .find(
                                        (item) => item.Ranking === "Ranking 4"
                                      )
                                      ?.Range.split("-")
                                      .map((r) => parseInt(r.trim(), 10))[1] +
                                    1;

                                    let content = null;

                                    if (isKepalaSeksi) {
                                      if (!isFirstTab) {
                                        if (selectedTab === 1) {
                                          content = (totalScoreforKaUpt < range5End && totalScoreforKaUpt !== 0) ? (
                                            <div className="form-control bg-light">
                                              The score does not reach the required range.
                                            </div>
                                          ) : matchingPenilaianforKaDept ? (
                                            ((matchingPenilaianforKaDept['Jabatan Penilai'] !== 'Kepala Departemen') && (matchingPenilaianforKaDept["Jabatan Penilai"] === 'Kepala Seksi' || matchingPenilaianforKaDept["Jabatan Penilai"] === 'Sekretaris Prodi')) ? (
                                              <div className="form-control bg-light">
                                                Not yet scored
                                              </div>
                                            ) : (
                                              <div className="form-control bg-light">
                                                {`(Poin: ${matchingPenilaianforKaDept.Nilai}) - ${matchingPenilaianforKaDept.Deskripsi}`}
                                              </div>
                                            )
                                          ) : (
                                            <div className="form-control bg-light">
                                              Not yet scored
                                            </div>
                                          );
                                        }
                                         else if (selectedTab === 2) {
                                          content = (totalScoreforKaUpt < range5End && totalScoreforKaUpt !== 0) || (totalScoreforKaDept < range4End && totalScoreforKaDept !== 0) ? (
                                            <div className="form-control bg-light">
                                              The score does not reach the required range.
                                            </div>
                                          ) : matchingPenilaianforWadir && 
                                              (matchingPenilaianforWadir['Jabatan Penilai'] === 'Wakil Direktur' || 
                                                matchingPenilaianforWadir['Jabatan Penilai'] === 'Direktur') ? (
                                            <div className="form-control bg-light">
                                              {`(Poin: ${matchingPenilaianforWadir.Nilai}) - ${matchingPenilaianforWadir.Deskripsi}`}
                                            </div>
                                          ) : <div className="form-control bg-light">
                                                Not yet scored
                                              </div>
                                        }
                                        else {
                                          // Selain tab 1 atau 2
                                          content = (
                                            <div className="form-control bg-light">
                                              Not yet scored
                                            </div>
                                          );
                                        }
                                      } else {
                                        // Kalau masih first tab (punya dia sendiri)
                                        content = matchingPenilaianforKaUpt ? (
                                          <div className="form-control bg-light">
                                            {`(Poin: ${matchingPenilaianforKaUpt.Nilai}) - ${matchingPenilaianforKaUpt.Deskripsi}`}
                                          </div>
                                        ) : (
                                          <SearchDropdown
                                            forInput={item.Value}
                                            arrData={filteredArrData}
                                            isRound
                                            value={formDataRef2.current[item.Value] || ""}
                                            onChange={handleInputChange}
                                          />
                                        );
                                      }
                                    }
                                    else if (isKaDept) {
                                      if (!isFirstTab) {
                                        if (selectedTab === 0) {
                                          content = matchingPenilaianforKaUpt ? (
                                            <div className="form-control bg-light">
                                              {`${matchingPenilaianforKaUpt.Deskripsi} - (Poin: ${matchingPenilaianforKaUpt.Nilai})`}
                                            </div>
                                          ) : (
                                            <div className="form-control bg-light">
                                              Not yet scored
                                            </div>
                                          );
                                        } else if (selectedTab === 1) {
                                          content = matchingPenilaianforKaDept ? (
                                            <div className="form-control bg-light">
                                              {`${matchingPenilaianforKaDept.Deskripsi} - (Poin: ${matchingPenilaianforKaDept.Nilai})`}
                                            </div>
                                          ) : detailSS.Facil === userInfo.npk ? (
                                            <SearchDropdown
                                              forInput={item.Value}
                                              arrData={filteredArrData}
                                              isRound
                                              value={
                                                formDataRef2.current[
                                                  item.Value
                                                ] || ""
                                              }
                                              onChange={handleInputChange}
                                            />
                                          ) : (
                                            <div className="form-control bg-light">
                                              Not yet scored
                                            </div>
                                          );
                                        } else if (selectedTab === 2) {
                                          content =
                                            (totalScoreforKaUpt < range5End &&
                                              totalScoreforKaUpt !== 0) ||
                                            (totalScoreforKaDept < range4End &&
                                              totalScoreforKaDept !== 0) ? (
                                              <div className="form-control bg-light">
                                                The score does not reach the
                                                required range.
                                              </div>
                                            ) : matchingPenilaianforWadir &&
                                              (matchingPenilaianforWadir[
                                                "Jabatan Penilai"
                                              ] === "Wakil Direktur" ||
                                                matchingPenilaianforWadir[
                                                  "Jabatan Penilai"
                                                ] === "Direktur") ? (
                                              <div className="form-control bg-light">
                                                {`${matchingPenilaianforWadir.Deskripsi} - (Poin: ${matchingPenilaianforWadir.Nilai})`}
                                              </div>
                                            ) : (
                                              <div className="form-control bg-light">
                                                Not yet scored
                                              </div>
                                            );
                                        } else {
                                          content = (
                                            <div className="form-control bg-light">
                                              Not yet scored
                                            </div>
                                          );
                                        }
                                      } else {
                                        content =
                                          totalScoreforKaUpt < 41 &&
                                          totalScoreforKaUpt !== 0 ? (
                                            <div className="form-control bg-light">
                                              The score does not reach the
                                              required range.
                                            </div>
                                          ) : matchingPenilaianforKaDept ? (
                                            matchingPenilaianforKaDept[
                                              "Jabatan Penilai"
                                            ] === "Kepala Departemen" ? (
                                              <div className="form-control bg-light">
                                                {`${matchingPenilaianforKaDept.Deskripsi} - (Poin: ${matchingPenilaianforKaDept.Nilai})`}
                                              </div>
                                            ) : (
                                              <SearchDropdown
                                                forInput={item.Value}
                                                arrData={filteredArrData}
                                                isRound
                                                selectedValued={
                                                  arrTextDataforKaDept[
                                                    item.Value - 1
                                                  ]
                                                }
                                                value={
                                                  formDataRef2.current[
                                                    item.Value
                                                  ] || ""
                                                }
                                                onChange={handleInputChange}
                                              />
                                            )
                                          ) : detailSS.Facil === userInfo.npk ? (
                                              <SearchDropdown
                                                forInput={item.Value}
                                                arrData={filteredArrData}
                                                isRound
                                                value={
                                                  formDataRef2.current[
                                                    item.Value
                                                  ] || ""
                                                }
                                                onChange={handleInputChange}
                                              />
                                            ) : (
                                              <div className="form-control bg-light">
                                                Not yet scored
                                              </div>
                                            );
                                      }
                                    }else if (isWadir) {
                                      if (!isFirstTab) {
                                        if (selectedTab === 0) {
                                          content = matchingPenilaianforKaUpt ? (
                                            <div className="form-control bg-light">
                                              {`(Poin: ${matchingPenilaianforKaUpt.Nilai}) - ${matchingPenilaianforKaUpt.Deskripsi}`}
                                            </div>
                                          ) : (
                                            <div className="form-control bg-light">
                                              Not yet scored
                                            </div>
                                          );
                                        }
                                        else if (selectedTab === 1) {
                                          content = (totalScoreforKaUpt < range5End && totalScoreforKaUpt !== 0) ? (
                                            <div className="form-control bg-light">
                                              The score does not reach the required range.
                                            </div>
                                          ) : matchingPenilaianforKaDept && (matchingPenilaianforKaDept['Jabatan Penilai'] !== 'Wakil Direktur' || matchingPenilaianforKaDept['Jabatan Penilai'] !== 'Direktur') ? (
                                            <div className="form-control bg-light">
                                              {`(Poin: ${matchingPenilaianforKaDept.Nilai}) - ${matchingPenilaianforKaDept.Deskripsi}`}
                                            </div>
                                          ) : (
                                            <div className="form-control bg-light">
                                              Not yet scored
                                            </div>
                                          );
                                        } else if (selectedTab === 2) {
                                          content = matchingPenilaianforWadir && (matchingPenilaianforWadir['Jabatan Penilai'] === 'Wakil Direktur' || matchingPenilaianforWadir['Jabatan Penilai'] === 'Direktur') ? (
                                            <div className="form-control bg-light">
                                              {`(Poin: ${matchingPenilaianforWadir.Nilai}) - ${matchingPenilaianforWadir.Deskripsi}`}
                                            </div>
                                          ) : (
                                            <div className="form-control bg-light">
                                              Not yet scored
                                            </div>
                                          );
                                        } else {
                                          content = (
                                            <div className="form-control bg-light">
                                              Not yet scored
                                            </div>
                                          );
                                        }
                                      } else {
                                        content =
                                        (detailSS.Facil === userInfo.npk) ? (
                                          <SearchDropdown
                                            forInput={item.Value}
                                            arrData={filteredArrData}
                                            isRound
                                            value={
                                              formDataRef2.current[
                                                item.Value
                                              ] || ""
                                            }
                                            onChange={handleInputChange}
                                          />
                                        ) : (totalScoreforKaUpt < range5End &&
                                            totalScoreforKaUpt !== 0) ||
                                          totalScoreforKaDept < range4End ? (
                                            <div className="form-control bg-light">
                                              The score does not reach the
                                              required range.
                                            </div>
                                          ) : matchingPenilaianforWadir &&
                                            (matchingPenilaianforWadir[
                                              "Jabatan Penilai"
                                            ] === "Wakil Direktur" ||
                                              matchingPenilaianforWadir[
                                                "Jabatan Penilai"
                                              ] === "Direktur") ? (
                                            <div className="form-control bg-light">
                                              {`(Poin: ${matchingPenilaianforWadir.Nilai})- ${matchingPenilaianforWadir.Deskripsi}`}
                                            </div>
                                          ) : (
                                            <SearchDropdown
                                              forInput={item.Value}
                                              arrData={filteredArrData}
                                              isRound
                                              selectedValued={
                                                arrTextDataforKaDept[
                                                  item.Value - 1
                                                ]
                                              }
                                              value={
                                                formDataRef2.current[
                                                  item.Value
                                                ] || ""
                                              }
                                              onChange={handleInputChange}
                                            />
                                          );
                                        }
                                      }
                                    return (
                                      <div className="row mb-3" key={item.Value}>
                                        <div className="col-lg-4">
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "4px",
                                          }}
                                        >
                                          <Label
                                            data={
                                              item.Text === "Reduksi Biaya"
                                                ? `${item.Text} \t (IDR)`
                                                : item.Text
                                            }
                                          />
                                          <span
                                            style={{
                                              color: "red",
                                              fontSize: "1rem",
                                              lineHeight: "1",
                                            }}
                                          >
                                            *
                                          </span>
                                        </div>

                                        {item.Text === "Reduksi Biaya" && (
                                          <div style={{ marginTop: "-20px" }}>
                                            <small
                                              style={{
                                                fontSize: "0.75rem",
                                                color: "#6c757d",
                                              }}
                                            >
                                              {maxCharDisplayed(item.Desc, 60)}
                                            </small>
                                          </div>
                                        )}
                                      </div>
                                        <div className="col-lg-8">
                                          {content}
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
                                  <>
                                  {/* Ka.Unit/Ka.UPT/SekProdi */}
                                  <div
                                    className="card fw-medium text-center"
                                    style={{
                                      width: "200px",
                                      minHeight: "180px",
                                      color: selectedTab === 0 ? "white" : "black",                                                                          
                                      backgroundColor: selectedTab === 0 ? "#0d6efd" : "white",
                                      boxShadow:
                                        selectedTab === 0
                                          ? "0 2px 10px rgba(13, 110, 253, 0.75)"
                                          : "none",
                                          transform: selectedTab === 0
                                          ? "scale(1.05)"
                                          : "scale(1)",      
                                      transition: "all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
                                    }}
                                  >
                                    <div className="mt-2">Total Score</div>
                                    <hr />
                                    Ka.Unit/Ka.UPT/SekProdi
                                    <h1>{totalScoreforKaUpt}</h1>
                                  </div>

                                  {/* Ka.Prodi/Ka.Dept */}
                                  <div
                                    className="card fw-medium text-center"
                                    style={{
                                      width: "200px",
                                      minHeight: "180px",
                                      color: selectedTab === 1 ? "white" : "black",                                                                          
                                      backgroundColor: selectedTab === 1 ? "#0d6efd" : "white",
                                      boxShadow:
                                        selectedTab === 1
                                          ? "0 2px 10px rgba(13, 110, 253, 0.75)"
                                          : "none",
                                          transform: selectedTab === 1
                                          ? "scale(1.05)"
                                          : "scale(1)",      
                                      transition: "all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
                                    }}
                                  >
                                    <div className="mt-2">Total Score</div>
                                    <hr />
                                    Ka.Prodi/Ka.Dept
                                    <h1>{totalScoreforKaDept}</h1>
                                  </div>

                                  {/* WaDIR/DIR */}
                                  <div
                                    className="card fw-medium text-center"
                                    style={{
                                      width: "200px",
                                      minHeight: "180px",
                                      color: selectedTab === 2 ? "white" : "black",                                                                          
                                      backgroundColor: selectedTab === 2 ? "#0d6efd" : "white",
                                      boxShadow:
                                        selectedTab === 2
                                          ? "0 2px 10px rgba(13, 110, 253, 0.75)"
                                          : "none",
                                          transform: selectedTab === 2
                                          ? "scale(1.05)"
                                          : "scale(1)",      
                                      transition: "all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
                                    }}
                                  >
                                    <div className="mt-2">Total Score</div>
                                    <hr />
                                    WaDIR/DIR
                                    <h1>{totalScoreforWadir}</h1>
                                  </div>
                                </>
                              </div>
                            </div>
                          </Box>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      {activeTab && !submitOnly && (
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
                      )}
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
