import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { maxCharDisplayed } from "../../util/Formatting";
import { API_LINK, EMP_API_LINK, ROOT_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Loading from "../../part/Loading";
import { date, number, object, string } from "yup";
import * as Yup from "yup";
import Alert from "../../part/Alert";
import SweetAlert from "../../util/SweetAlert";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import { decryptId } from "../../util/Encryptor";
import Cookies from "js-cookie";
import Label from "../../part/Label";
import Input from "../../part/Input";
import SearchDropdown from "../../part/SearchDropdown";
import Button from "../../part/Button";
import { Tabs, Tab, Box } from "@mui/material";
import PropTypes from "prop-types";
import "../../../assets/css/general.css"
import DropDown from "../../part/Dropdown";
import FloatingCard from "../../part/FloatingCard";

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

function deobfuscateId(obfuscated) {
  const parts = obfuscated.split(".");
  if (parts.length === 2) {
    return atob(parts[1]);
  }
  return null;
}

export default function QCCScoring({ onChangePage, WithID }) {
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
  const [listKriteria, setListKriteria] = useState([]);
  const [listNilaiDetailKriteria, setListNilaiDetailKriteria] = useState([]);
  const [scoringPosition, setScoringPosition] = useState([]);
  const [scoringPositionRole, setScoringPositionRole] = useState([]);
  const [activeTab, setActiveTab] = useState(false);
  const [listAllPenilaian, setAllListPenilaian] = useState([]);
  const [listSettingRanking, setListSettingRanking] = useState([]);
  const [listPenilaianKaDept, setListPenilaianKaDept] = useState([]);
  const [listPenilaianWadir, setListPenilaianWadir] = useState([]);
  const [submitOnly, setReadOnly] = useState(false);
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
  const [formCommentFase1, setFormCommentFase1] = useState("");
  const [formCommentFase2, setFormCommentFase2] = useState("");
  const [formCommentFase3, setFormCommentFase3] = useState("");

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
        const data = await UseFetch(API_LINK + "RencanaCircle/GetRencanaQccByIdForScoring", {
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
  }, [id]);
  const handleCancel = () => {
    window.opener.location.href = ROOT_LINK + "/submission/qcc";
    window.close();
  };
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
      const matched = listNilaiDetailKriteria.find(
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

    if (
      userInfo.jabatan === "Kepala Seksi" ||
      userInfo.jabatan === "Sekretaris Prodi"
    ) {
      setTotalScoreforKaUpt(total);
    } else if (
      userInfo.jabatan == "Kepala Departemen" ||
      userInfo.jabatan == "Kepala Jurusan"
    ) {
      setTotalScoreforKaDept(total);
    } else if (
      userInfo.jabatan === "Wakil Direktur" ||
      userInfo.jabatan === "Direktur"
    ) {
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
    let comment = "";
    if (
      userInfo.jabatan === "Kepala Seksi" ||
      userInfo.jabatan === "Sekretaris Prodi"
    ) {
      formCommentFase1?.trim() !== "" ? formCommentFase1 : "";
      comment = formCommentFase1;
    } else if (
      userInfo.jabatan === "Kepala Departemen" ||
      userInfo.jabatan === "Kepala Jurusan"
    ) {
      formCommentFase2?.trim() !== "" ? formCommentFase2 : "";
      comment = formCommentFase2;
    } else if (
      userInfo.jabatan === "Direktur" ||
      userInfo.jabatan === "Wakil Direktur"
    ) {
      comment = formCommentFase3?.trim() !== "" ? formCommentFase3 : "";
    }

    const payload = {
      dkp_id: Object.values(formDataRef2.current).join(", "),
      sis_id: id,
      pen_nilai: Object.values(formDataRef3.current).join(", "),
      jabatan: userInfo.jabatan,
      statusPN: "-",
      created: userInfo.username,
      pen_comment: `${comment} - ${userInfo.username}`,
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
      pen_nilai: Yup.string().required("pen_nilai is required"),
      jabatan: Yup.string().required("jabatan is required"),
      statusPN: Yup.string().required("statusPN is required"),
      created: Yup.string().required("created is required"),
      pen_comment: Yup.string().nullable(),
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
          setTimeout(function () {
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

  const handleComment1 = (e) => {
    setFormCommentFase1(e.target.value);
  };

  const handleComment2 = (e) => {
    setFormCommentFase2(e.target.value);
  };

  const handleComment3 = (e) => {
    setFormCommentFase3(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "RencanaCircle/GetListKriteriaPenilaian", {category: "QCC/QCP/BPI/VCI"}
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataDetailByID = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "RencanaSS/GetPenilaianByIdForKaProd",
          {
            sis_id: id,
          }
        );

        if (!data) {
        } else {
          if (data[0]?.Komment !== null && data[0]?.Komment !== "") {
            setFormCommentFase2(data[0]?.Komment);
          } else {
            setFormCommentFase2("-");
          }
          setListPenilaianKaDept(data);
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
    fetchDataDetailByID();
  }, []);

  useEffect(() => {
    const fetchDataDetailByID = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "RencanaSS/GetPenilaianByIdForDirorWadir",
          {
            sis_id: id,
          }
        );

        if (!data) {
          throw new Error("Error: Failed to get the Wadir/Dir data.");
        } else {
          if (data[0]?.Komment !== null && data[0]?.Komment !== "") {
            setFormCommentFase3(data[0]?.Komment);
          } else {
            setFormCommentFase3("-");
          }
          setListPenilaianWadir(data);
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
    fetchDataDetailByID();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(API_LINK + "RencanaCircle/GetDeskripsiDetailkriteriaById");
        const data2 = await UseFetch(API_LINK + "RencanaCircle/GetNilaiDetailkriteriaById");

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the Penilaian KA UPT data.");
        } else {
          const dataDetail = data2.map((item) => ({
            Text: `(Poin: ${item.Score})`,
            Value: item.Value,
            Score: item.Score,
            Deskripsi: item.Deskripsi,
          }));

          setListKriteria(data);
          setListNilaiDetailKriteria(dataDetail);
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

  console.log("LIST PENILAIAN", listNilaiDetailKriteria);
  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "RencanaSS/GetAllPenilaianById",
          {
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
        const data = await UseFetch(
          API_LINK + "RencanaSS/GetListSettingRanking"
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          setListSettingRanking(data);
          console.log(
            "rank 5",
            data
              .find((item) => item.Ranking === "Ranking 5")
              ?.Range.split("-")
              .map((r) => parseInt(r.trim(), 10))[1] + 1
          );
          console.log(
            "rank 4",
            data
              .find((item) => item.Ranking === "Ranking 4")
              ?.Range.split("-")
              .map((r) => parseInt(r.trim(), 10))[1] + 1
          );
          console.log(
            "rank 3",
            data
              .find((item) => item.Ranking === "Ranking 3")
              ?.Range.split("-")
              .map((r) => parseInt(r.trim(), 10))[1] + 1
          );
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
    if (listKriteria.length === 0 || listEmployee.length === 0) return;

    const distinctCreaby = [
      ...new Set(listKriteria.map((item) => item.Creaby).filter(Boolean)),
    ];

    const filteredEmployees = listEmployee.filter((emp) =>
      distinctCreaby.includes(emp.username)
    );

    setRecordListPenilaian(filteredEmployees);
  }, [listKriteria, listEmployee]);

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
          const matchingByNpk = data.find(
            (item) => String(item.Npk) === npkTarget
          );

          const strukturParentTarget = matchingByNpk["Struktur Parent"];

          const finalResult = data.filter(
            (item) =>
              item["Struktur Parent"] === strukturParentTarget &&
              (item.Jabatan === "Kepala Departemen" ||
                item.Jabatan === "Kepala Jurusan")
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [listRecordPenilaian]);

  const kadept = listAllDepartment.find(
    (detail) => detail["Npk"] === forPenilai.npk
  );
  const kaupt = listAllDepartment.find(
    (detail) => detail["Creaby"] === listKriteria[0].npk
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
    setHasUserSelectedTab(true);
  };

  useEffect(() => {
    if (!hasUserSelectedTab) {
      if (
        userInfo?.jabatan === "Kepala Departemen" ||
        userInfo?.jabatan === "Kepala Jurusan"
      ) {
        setSelectedTab(1);
      } else if (
        userInfo?.jabatan === "Kepala Seksi" ||
        userInfo?.jabatan === "Sekretaris Prodi"
      ) {
        setSelectedTab(0);
      } else if (userInfo?.jabatan === "Wakil Direktur") {
        setSelectedTab(2);
      }
    }
  }, [userInfo, hasUserSelectedTab]);

  const tabLabels = [
    "Facilitator",
    "Innovation Coordinator",
  ];

  const role = userInfo.role.slice(0, 5);
  const tabIndexUser = tabLabels.findIndex((label) => {
    if (
      role === "ROL36"
    )
      return label === "Innovation Coordinator";
  });

  const [selectedTab, setSelectedTab] = useState(tabIndexUser);
  const arrTextData = listNilaiDetailKriteria.map((item) => item);

  console.log("ARR TEXT DATA ", arrTextData);

  useEffect(() => {
    let tempTotal1 = 0;
    let tempTotal2 = 0;
    let tempTotal3 = 0;

    listKriteria.forEach((item) => {
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
      if (
        item["Jabatan Penilai"] !== "Kepala Departemen" &&
        item["Jabatan Penilai"] !== "Kepala Jurusan"
      ) {
        tempTotal2 = 0;
      } else {
        tempTotal2 += parseFloat(item.Nilai) || 0;
      }
    });

    listPenilaianWadir.forEach((item) => {
      if (
        item["Jabatan Penilai"] !== "Wakil Direktur" &&
        userInfo.jabatan !== "Wakil Direktur" &&
        userInfo.jabatan !== "Direktur"
      ) {
        tempTotal3 = 0;
      } else {
        tempTotal3 += parseFloat(item.Nilai) || 0;
      }
    });

    setTotalScoreforKaUpt(tempTotal1);
    setTotalScoreforKaDept(tempTotal2);
    setTotalScoreforWadir(tempTotal3);
  }, [listKriteria, listPenilaianKaDept, listPenilaianWadir]);

  useEffect(() => {
    if (listPenilaianWadir !== null && listPenilaianWadir.length > 0) {
      const firstData = listPenilaianWadir[0];

      if (firstData) {
        const namePosition = listEmployee.find(
          (item) => item.username === firstData["Creaby Username"]
        );
        setScoringPosition(namePosition?.name);
        setScoringPositionRole(firstData["Jabatan Penilai"]);
      }
    } else if (
      (listPenilaianKaDept !== null) &
      (listPenilaianKaDept.length > 0)
    ) {
      const firstData = listPenilaianKaDept[0];

      if (firstData) {
        const namePosition = listEmployee.find(
          (item) => item.username === firstData["Creaby"]
        );
        setScoringPosition(namePosition?.name);
        setScoringPositionRole(firstData["Jabatan Penilai"]);
      }
    } else if (
      (listKriteria !== null) &
      (listKriteria.length > 0)
    ) {
      const firstData = listKriteria[0];

      if (firstData) {
        const namePosition = listEmployee.find(
          (item) => item.username === firstData["Creaby"]
        );
        setScoringPosition(namePosition?.name);
        setScoringPositionRole(firstData["Jabatan Penilai"]);
      }
    }
  }, [listPenilaianWadir]);
  let [isChecked, setIsCheked] = useState(false);

  useEffect(() => {
    let jabatanTarget;
    
    if (selectedTab === 0) jabatanTarget = "ROL01";
    else if (selectedTab === 1)
    jabatanTarget = "ROL36"
    setActiveTab(selectedTab === tabIndexUser);
  }, [selectedTab, tabIndexUser]);

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
                                title="Name"
                                data={userData?.name || "-"}
                              />
                            </div>

                            <div className="col-md-4">
                              <Label
                                title="Section"
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
                        </div>
                        <div className={role === "ROL6" ? "card-body" : ""}>
                          {role === "ROL36" && (
                            <div>
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
                                      let jabatanTarget;

                                      if (index === 1)
                                        jabatanTarget = "ROL36"

                                      let isChecked = listAllPenilaian.some(
                                        (item) =>
                                          item["Jabatan Penilai"] &&
                                          jabatanTarget.some((jabatan) =>
                                            item["Jabatan Penilai"].includes(
                                              jabatan
                                            )
                                          )
                                      );

                                      return (
                                        <Tab
                                          key={index}
                                          label={
                                            isChecked ? (
                                              <div className="d-flex gap-2 align-items-center">
                                                <span
                                                  style={{
                                                    color: "green",
                                                    fontSize: "20px",
                                                  }}
                                                >
                                                  ✓
                                                </span>
                                                <span
                                                  style={{ fontSize: "14px" }}
                                                >
                                                  {label}
                                                </span>
                                              </div>
                                            ) : (
                                              label
                                            )
                                          }
                                          sx={{
                                            backgroundColor:
                                              selectedTab === index
                                                ? "#ffffff"
                                                : "#f0f0f0",
                                            borderRight:
                                              index !== 2
                                                ? "1px solid #ddd"
                                                : "none",
                                            fontWeight: "bold",
                                            color: "black",
                                            minHeight: "48px",
                                          }}
                                        />
                                      );
                                    })}
                                  </Tabs>
                                )}
                            </div>
                          )}
                          <div>
                            <div
                              className={role === "ROL6" ? "card" : ""}
                              style={{
                                borderTop: "none",
                                borderRadius: "0 0 12px 12px",
                              }}
                            >
                              <div className="card-body">
                                {listKriteriaPenilaian.map((item, index2) => {
                                  const matchingKriteria = listKriteria.filter(
                                    (detail) => detail.Kriteria === item.Value
                                  );
                                  const matchingListNilai = listNilaiDetailKriteria.filter((detail) =>
                                    matchingKriteria.length > 0 && detail.Deskripsi === matchingKriteria[0].Deskripsi
                                  );

                                  console.log("MATCHING KRITERIA", listKriteriaPenilaian);

                                  let content = null;

                                  content =
                                  matchingKriteria.length > 0 ? (
                                    matchingKriteria.map((detail, index) => {
                                      const nilai = listNilaiDetailKriteria.filter(
                                        (n) => n.Deskripsi === detail.Deskripsi
                                      );

                                      return (
                                        <div className="row mb-2" key={index}>
                                          <div className="col-lg-10">
                                            <Label data={detail.Deskripsi} />
                                          </div>
                                          <div className="col-lg-2 d-flex align-items-start">
                                            {index2 === 2 || index2 === 3 ? (
                                              <div className="form-control bg-light rounded-5">
                                                Not yet scored
                                              </div>
                                            ) : (
                                              <SearchDropdown
                                              forInput={detail.Value}
                                              isRound
                                              isPlaceHolder={false}
                                              selectedValued={
                                                arrTextData[
                                                  detail.Text - 1
                                                ]
                                              }
                                              arrData={nilai}
                                              value={formDataRef2.current[detail.Value]}
                                              onChange={handleInputChange}
                                              />
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <Label data="Not Found" />
                                  );

                                  return (
                                    <div className="card row mb-3 px-0 mx-0" key={item.Value} >
                                      <div className="card-header col-lg-12">
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "4px",
                                          }}
                                        >
                                          <h6>
                                            {item.Desc === "-" ? (
                                              item.Text
                                            ) : (
                                              <>
                                                {item.Desc} <strong>({item.Text})</strong>
                                              </>
                                            )}
                                          </h6>
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
                                      </div>
                                      <div className="card-body row col-lg-12">
                                        <div className="col-lg-12">
                                          {content}
                                        </div>
                                        <div className="col-lg-0">
                                          <div className="d-flex flex-column">
                                          <div className="mb-2">Comment</div>
                                          <div className="col-lg-12">
                                            {index2 === 2 || index2 === 3 ? (
                                              <div className="form-control bg-light">
                                                Not yet scored
                                              </div>
                                            ) : (
                                              <Input
                                              isDisabled={false}
                                              type="textarea"
                                              forInput="commentFase1"
                                              onChange={handleComment1}
                                              value={formCommentFase1}
                                              errorMessage={errors.formCommentFase1}
                                            />
                                            )}
                                          </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="ps-4">
                              <div
                                className="d-flex flex-column gap-3"
                              >
                                <>
                                  {/* <div
                                    className="card fw-medium text-center position-fixed bottom-0 end-0 m-3 p-2 bg-white shadow rounded"
                                    style={{
                                      width: "200px",
                                      minHeight: "250px",
                                      color:
                                        selectedTab === 0 ? "white" : "black",
                                      backgroundColor:
                                        selectedTab === 0 ? "#0d6efd" : "white",
                                      boxShadow:
                                        selectedTab === 0
                                          ? "0 2px 10px rgba(13, 110, 253, 0.75)"
                                          : "none",
                                      transform:
                                        selectedTab === 0
                                          ? "scale(1.05)"
                                          : "scale(1)",
                                      transition:
                                        "all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <div className="mt-2 ">Total Score</div>
                                    <hr style={{ margin: "0.5rem 0" }} />

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

                                      <h1
                                        style={{ margin: 0, fontSize: "40px" }}
                                      >
                                        {totalScoreforKaUpt}
                                      </h1>
                                    </div>
                                  </div> */}
                                    <FloatingCard />
                                </>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      {activeTab && !submitOnly ? (
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="flex-grow-1 m-2">
                            <Button
                              classType="danger me-2 px-4 py-2"
                              label="CANCEL"
                              onClick={handleCancel}
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
                      ) : (
                        <div className="my-3">
                          <Button
                            classType="primary"
                            iconName={"angle-left"}
                            label="Back"
                            onClick={handleCancel}
                            // style={{ borderRadius: "16px" }}
                          />
                        </div>
                      )}
                    </div>
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
