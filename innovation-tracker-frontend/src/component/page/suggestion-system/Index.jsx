import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { PAGE_SIZE, API_LINK, EMP_API_LINK } from "../../util/Constants";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Loading from "../../part/Loading";
import {
  decodeHtml,
  formatDate,
  maxCharDisplayed,
  separator,
} from "../../util/Formatting";
import { decryptId } from "../../util/Encryptor";
import Cookies from "js-cookie";
import { exportExcel } from "../../util/ExportExcel";
import Modal from "../../part/Modal";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    "Project Title": null,
    "Start Date": null,
    "End Date": null,
    Period: null,
    Category: null,
    Status: null,
    Creaby: null,
    Count: 0,
  },
];

const dataFilterSort = [
  { Value: "[NPK] asc", Text: "[NPK] [↑]" },
  { Value: "[NPK] desc", Text: "[NPK] [↓]" },
  { Value: "[Name] asc", Text: "[Name] [↑]" },
  { Value: "[Name] desc", Text: "[Name] [↓]" },
  { Value: "[Project Title] asc", Text: "[Project Title] [↑]" },
  { Value: "[Project Title] desc", Text: "[Project Title] [↓]" },
  { Value: "[Creadate] asc", Text: "[Submit Time] [↑]" },
  { Value: "[Creadate] desc", Text: "[Submit Time] [↓]" },
  { Value: "[Period] asc", Text: "[Period] [↑]" },
  { Value: "[Period] desc", Text: "[Period] [↓]" },
  { Value: "[Category] asc", Text: "[Category] [↑]" },
  { Value: "[Category] desc", Text: "[Category] [↓]" },
];

const dataFilterStatus = [
  { Value: "Draft", Text: "Draft" },
  { Value: "Waiting Approval", Text: "Waiting Approval" },
  { Value: "Approved", Text: "Approved" },
  { Value: "Rejected", Text: "Rejected" },
];

// const dataFilterJenis = [
//   { Value: "Jenis Improvement", Text: "Jenis Improvement" },
//   { Value: "Kategori Keilmuan", Text: "Kategori Keilmuan" },
//   { Value: "Kategori Peran Inovasi", Text: "Kategori Peran Inovasi" },
// ];

export default function SuggestionSytemIndex({
  onChangePage,
  onScoring,
  onEditScoring,
}) {
  const cookie = Cookies.get("activeUser");
  let userInfo = "";
  if (cookie) userInfo = JSON.parse(decryptId(cookie));
  const location = useLocation();
  const type = location.state?.type;
  // console.log(location.state);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listEmployee, setListEmployee] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [listSettingRanking, setListSettingRanking] = useState([]);
  const [listReviewer, setListReviewer] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Creadate] desc",
    status: "",
    jenis: "SS",
    role: userInfo.role.slice(0, 5),
    npk: userInfo.npk,
  });
  const [penJabatan, setPenJabatan] = useState([]);
  // console.log("user info", userInfo);

  const searchQuery = useRef();
  const searchFilterSort = useRef();
  const searchFilterStatus = useRef();
  const modalRef = useRef();
  const batchRef = useRef();

  const handleSelectionChange = (data = []) => {
    setSelectedKeys(data);
    console.log(data);
  };

  function handleSetCurrentPage(newCurrentPage) {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => {
      return {
        ...prevFilter,
        page: newCurrentPage,
      };
    });
  }

  function handleSearch() {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => {
      return {
        ...prevFilter,
        page: 1,
        query: searchQuery.current.value,
        sort: searchFilterSort.current.value,
        status: searchFilterStatus.current.value,
      };
    });
  }

  const getStatusByKey = (key) => {
    const data = currentData.find((item) => item.Key === key);
    return data ? data.Status : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await UseFetch(API_LINK + "RencanaSS/GetListSettingRanking", {});
  
        if (data === "ERROR") {
          throw new Error("Error: Failed to get the GetPenilaianById.");
        } else {
          console.log("INI DATA KA UPTddd: ", data);
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
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleSubmit = async (id) => {
    setIsError(false);
    console.log("rankingnnnn", listSettingRanking);

    setIsError((prevError) => ({ ...prevError, error: false }));

    let tempTotal1 = 0;
    let tempTotal2 = 0;
    let tempTotal3 = 0;

    let statusKupt = [];
    let statusKdept = [];
    let statusDir = [];

    let detailSS = [];

    let totalScore1 = 0;
    let totalScore2 = 0;
    let totalScore3 = 0;

    if (
      userInfo.jabatan === "Kepala Seksi" ||
      userInfo.jabatan === "Sekretaris Prodi"
    ) {
      try {
        const data = await UseFetch(API_LINK + "RencanaSS/GetPenilaianByIDScoring", {
          id: id,
          jab: userInfo.jabatan
        });

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the GetPenilaianById.");
        } else {
          console.log("INI DATA KA UPT: ", data);
          const dataDetail = data.map((item) => {
            const deskripsiPendek =
              item.Deskripsi.length > 65
                ? item.Deskripsi.substring(0, 65) + "..."
                : item.Deskripsi;

            return {
              Keys: item.Key,
              Deskripsi: `${deskripsiPendek}`,
              Value: item.Value,
              Nilai: item.Nilai,
              Kriteria: item.Kriteria,
              jab : item["Jabatan Penilai"], 
              Creaby: item.Creaby,
              Creadate: item.Creadate,
            };
          });

          statusKupt = dataDetail;
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

      statusKupt.forEach((item) => {
        if (
          item.jab !== "Kepala Seksi" &&
          item.jab !== "Sekretaris Prodi"
        ) {
          console.log("kddd", statusKupt);
          tempTotal1 = 0;
        } else {
          console.log("total nilai k sek: ", item.Nilai);
          tempTotal1 += parseFloat(item.Nilai) || 0;
        }
      });
    } else if (userInfo.jabatan === "Kepala Departemen") {
      try {
        const data = await UseFetch(API_LINK + "RencanaSS/GetPenilaianByIDScoring", {
          id: id,
          jab: userInfo.jabatan
        });

        console.log("2999", data);
        if (data === "ERROR") {
          throw new Error("Error: Failed to get the GetPenilaianById.");
        } else {
          console.log("INI DATA KA UPT: ", data);
          const dataDetail = data.map((item) => {
            const deskripsiPendek =
              item.Deskripsi.length > 65
                ? item.Deskripsi.substring(0, 65) + "..."
                : item.Deskripsi;

            return {
              Keys: item.Key,
              Deskripsi: `${deskripsiPendek}`,
              Value: item.Value,
              Nilai: item.Nilai,
              Kriteria: item.Kriteria,
              jab: item["Jabatan Penilai"], 
              Creaby: item.Creaby,
              Creadate: item.Creadate,
            };
          });

          statusKdept = dataDetail;
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

      statusKdept.forEach((item) => {
        if (
          item.jab !== "Kepala Departemen"
        ) {
          console.log("kddd", statusKdept);
          tempTotal2 = 0;
        } else {
          console.log("total nilai k sek: ", item.Nilai);
          tempTotal2 += parseFloat(item.Nilai) || 0;
        }
      });
    } else if (
      userInfo.jabatan === "Wakil Direktur" ||
      userInfo.jabatan === "Direktur"
    ) {
      try {
        const data = await UseFetch(API_LINK + "RencanaSS/GetPenilaianByIDScoring", {
          id: id,
          jab: userInfo.jabatan
        });

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the GetPenilaianById.");
        } else {
          console.log("INI DATA KA UPT: ", data);
          const dataDetail = data.map((item) => {
            const deskripsiPendek =
              item.Deskripsi.length > 65
                ? item.Deskripsi.substring(0, 65) + "..."
                : item.Deskripsi;

            return {
              Keys: item.Key,
              Deskripsi: `${deskripsiPendek}`,
              Value: item.Value,
              Nilai: item.Nilai,
              Kriteria: item.Kriteria,
              jab: item["Jabatan Penilai"], 
              Creaby: item.Creaby,
              Creadate: item.Creadate,
            };
          });

          statusDir = dataDetail;
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

      statusDir.forEach((item) => {
        if (item.jab !== "Wakil Direktur") {
          tempTotal3 = 0;
        } else {
          tempTotal3 += parseFloat(item.Nilai) || 0;
        }
      });
    }

    try {
      const data = await UseFetch(API_LINK + "RencanaSS/GetRencanaSSByIdV2", {
        id: id,
      });

      if (data === "ERROR") {
        throw new Error("Error: Failed to get the GetPenilaianById.");
      } else {
        console.log("INI DATA KA UPTddd: ", data);
        detailSS = data[0];
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
    

    console.log("NIHH", detailSS);
    totalScore1 = tempTotal1;
    totalScore2 = tempTotal2;
    totalScore3 = tempTotal3;

    let ranking = 0;
    let status1 = null;

    if (
      userInfo.jabatan === "Kepala Seksi" ||
      userInfo.jabatan === "Sekretaris Prodi"
    ) {
      const item = listSettingRanking.find((s) => s.Ranking === "Ranking 5");
      // console.log("TRR", statusKupt);
      if (item && item.Range) {
        const parts = item.Range.split("-").map((p) => parseInt(p.trim(), 10));
        ranking = parts.length > 1 ? parts[1] : parts[0]; // ambil nilai terakhir
      }
      console.log("AA ", totalScore1, listSettingRanking);
      if(detailSS.Status === "Draft"){
        status1 = "Waiting Approval";
      }
      else if (totalScore1 < ranking ) {
        status1 = "Final";
      }
      else {
        status1 = "Scoring";
      }

    } else if (userInfo.jabatan === "Kepala Departemen") {
      const item = listSettingRanking.find((s) => s.Ranking === "Ranking 4");
      if (item && item.Range) {
        const parts = item.Range.split("-").map((p) => parseInt(p.trim(), 10));
        ranking = parts.length > 1 ? parts[1] : parts[0]; // ambil nilai terakhir
      }
      if(detailSS.Status === "Draft"){
        status1 = "Waiting Approval";
      } 

      else if (totalScore2 < ranking) {
        status1 = "Final";
      } else {
        status1 = "Scoring";
      }
    } else if (
      userInfo.jabatan === "Wakil Direktur" ||
      userInfo.jabatan === "Direktur"
    ) {
      status1 = "Final";
    }

    console.log("Status", status1);
    console.log("total score1", totalScore1);
    console.log("total score2", totalScore2);
    console.log("total score3", totalScore3);
    console.log("ranking", ranking);
    const tempStatus = getStatusByKey(id);

    const confirm = await SweetAlert(
      "Confirm",
      "Are you sure about this value?",
      "info",
      "Submit",
      null,
      "",
      true
    );

    if (confirm) {
      console.log(1, id);
      if (tempStatus !== "Approved") {
        UseFetch(API_LINK + "RencanaSS/UpdateStatusPenilaian", {
          id: id,
          status: status1,
        })
          .then((data) => {
            if (!data) {
              setIsError(true);
            } else {
              SweetAlert(
                "Success",
                "Thank you for your rating. Please wait until the next update",
                "success"
              );
              handleSetCurrentPage(currentFilter.page);
            }
          })
          .then(() => setIsLoading(false));
      }
    }
  };

  const handleApprove = async (id) => {
    setIsError(false);
    const confirm = await SweetAlert(
      "Confirm",
      "Are you sure you want to approve this submission?",
      "success",
      "Approve",
      null,
      "",
      true
    );

    if (confirm) {
      UseFetch(API_LINK + "RencanaSS/SetApproveRencanaSS", {
        id: id,
        set: "Approved",
        reason: null,
      })
        .then((data) => {
          if (data === "ERROR" || data.length === 0) setIsError(true);
          else {
            handleSetCurrentPage(currentFilter.page);
          }
        })
        .then(() => setIsLoading(false));
    }
  };
  const handleSubmitBatch = (id) => {
    setIsError(false);
    setIsLoading(true);
    let arrId = [];
    selectedKeys.map((value) => {
      arrId.push(value.Key);
    });
    const param = {
      id: Object.values(arrId).join(","),
      batch: batchRef.current,
    };
    console.log(param);
    UseFetch(API_LINK + "RencanaSS/SetBatchRencanaSS", param)
      .then((data) => {
        if (data === "ERROR" || data.length === 0) setIsError(true);
        else {
          handleSetCurrentPage(currentFilter.page);
          batchRef.current = "";
          setSelectedKeys([]);
          SweetAlert(
            "Success",
            "Successfully assign batch the submissions",
            "success"
          );
        }
      })
      .then(() => setIsLoading(false));
    modalRef.current.close();
  };

  const handleAssign = (arrData) => {
    console.log(arrData);
    if (arrData.length === 0) {
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

  const handleExport = async (param) => {
    setIsError(false);
    const response = await UseFetch(API_LINK + "RencanaSS/getAllDataSS", param);
    console.log(response);
    if (response === "ERROR") {
      window.scrollTo(0, 0);
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: "Failed to download data",
      }));
    } else {
      const byteCharacters = atob(response.fileContents);
      const byteNumbers = new Array(byteCharacters.length)
        .fill()
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], { type: response.contentType });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = response.fileDownloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleReject = async (id) => {
    setIsError(false);
    const confirm = await SweetAlert(
      "Confirm",
      "Are you sure you want to reject this submission?",
      "warning",
      "Reject",
      null,
      "",
      true
    );

    if (confirm) {
      UseFetch(API_LINK + "RencanaSS/SetApproveRencanaSS", {
        id: id,
        set: "Rejected",
        reason: confirm,
      })
        .then((data) => {
          if (data === "ERROR" || data.length === 0) setIsError(true);
          else {
            handleSetCurrentPage(currentFilter.page);
          }
        })
        .then(() => setIsLoading(false));
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
            nama: value.nama,
            upt: value.upt_bagian,
            jabatan: value.jabatan,
            departmen: value.departemen_jurusan,
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
    const fetchDataPenilaian = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(API_LINK + "RencanaSS/GetPenilaian2");

        // console.log("SIS ID: ", data);
        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          setPenJabatan({
            sis_id: data.map((value) => value["Id Sis"]),
            pen_created_by: data.map((value) => value.CreatedBy),
          });
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListReviewer({});
      }
    };
    fetchDataPenilaian();
  }, []);
  // console.log("Jabatannn: ", penJabatan);

    useEffect(() => {
      const fetchDataPenilaian = async () => {
        setIsLoading(true);
        setIsError((prevError) => ({ ...prevError, error: false }));
        try {
          const data = await UseFetch(API_LINK + "RencanaSS/GetPenilaian2");
  
          // console.log("SIS ID: ", data);
          if (data === "ERROR") {
            throw new Error("Error: Failed to get the category data.");
          } else {
            setPenJabatan({
              sis_id: data.map((value) => value["Id Sis"]),
              pen_created_by: data.map((value) => value.CreatedBy)
            });
          }
        } catch (error) {
          window.scrollTo(0, 0);
          setIsError((prevError) => ({
            ...prevError,
            error: true,
            message: error.message,
          }));
          setListReviewer({});
        }
      };
      fetchDataPenilaian();
    }, [])
    // console.log("Jabatannn: ", penJabatan);

    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        setIsError((prevError) => ({ ...prevError, error: false }));
        try {
          const data = await UseFetch(API_LINK + "RencanaSS/GetListReviewer");
  
          if (data === "ERROR") {
            throw new Error("Error: Failed to get the category data.");
          } else {
            setListReviewer(data);
          }
        } catch (error) {
          window.scrollTo(0, 0);
          setIsError((prevError) => ({
            ...prevError,
            error: true,
            message: error.message,
          }));
          setListReviewer({});
        }
      }
      fetchData();
    }, []);

    console.log("User Info ", userInfo);
    
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        setIsError((prevError) => ({ ...prevError, error: false }));
        try {
          const data = await UseFetch(API_LINK + "MasterSetting/GetListSetting", {
            p1: "Innovation Category",
          });
  
          if (data === "ERROR") {
            throw new Error("Error: Failed to get the category data.");
          } else {
            setListCategory(data.filter((item) => item.Text.includes("Batch")));
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
      setIsError(false);
      setIsLoading(true);

      try {
        const data = await UseFetch(
          type === "mySubmission"
            ? API_LINK + "RencanaSS/GetMyRencanaSS"
            : API_LINK + "RencanaSS/GetRencanaSS",
          currentFilter
        );
        console.log("DATA SS:", data);

        if (data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const hanifData = listEmployee.find(
            (value) => value.username === currentData.Creaby
          );
          // console.log("DATA HANIF:", hanifData);
          const role = userInfo.role.slice(0, 5);
          const inorole = userInfo.inorole;
          const formattedData = data.map((value, index) => {
            const foundEmployee = listEmployee.find(
              (emp) => emp.username === value["Creaby"]
            );

            const jabatanTarget = userInfo.upt === "Pusat Sistem Informasi" 
            ? "Kepala Departemen" 
            : userInfo.jabatan;
          
            // console.log("FOUND KEY: ", listEmployee);
            // console.log("1",userInfo)
            console.log("v",value);
            console.log("us",userInfo);
            console.log("2",foundEmployee)
            console.log("3",penJabatan)
            console.log("4",data)
            const uniqueKeys = [...new Set(data.map(item => item.Key))];

            if (role === "ROL01") {
              return {
                Key: value.Key,
                No: value["No"],
                NPK: value["NPK"] || "-",
                Name: value["Name"] || "-",
                "Project Title": maxCharDisplayed(
                  decodeHtml(
                    decodeHtml(decodeHtml(value["Project Title"]))
                  ).replace(/<\/?[^>]+(>|$)/g, ""),
                  50
                ),
                Category: value["Category"],
                Period: value["Period"],
                Batch: value["Batch"] || "-",
                "Submitted On": formatDate(value["Creadate"]),
                Score: value["Score"] || 0,
                "Scoring Position": value["Scoring Position"] || "-",
                Status: value["Status"],
                Count: value["Count"],
                Action:
                  role === "ROL03" &&
                  value["Status"] === "Draft" &&
                  value["Creaby"] === userInfo.username
                    ? ["Detail", "Edit", "Submit"]
                    : inorole === "Facilitator" &&
                      value["Status"] === "Waiting Approval"
                    ? ["Detail", "Reject", "Approve"]
                    : role === "ROL03" &&
                      value["Status"] === "Rejected" &&
                      value["Creaby"] === userInfo.username
                    ? ["Detail", "Edit", "Submit"]
                    : userInfo.upt === foundEmployee.upt &&
                      userInfo.jabatan === "Kepala Seksi" &&
                      value["Status"] === "Waiting Approval"
                    ? ["Detail", "Reject", "Approve"]
                    : role === "ROL01" && value["Status"] === "Approved"
                    ? ["Detail", "Submit"]
                    : userInfo.upt === foundEmployee.upt &&
                      userInfo.jabatan === "Kepala Seksi" &&
                      (value["Status"] === "Approved" ||
                        value["Status"] === "Scoring")
                    ? ["Detail", "Scoring"]
                    : userInfo.jabatan === "Sekretaris Prodi" ||
                      userInfo.jabatan === "Kepala Departemen" ||
                      userInfo.jabatan === "Wakil Direktur" ||
                      userInfo.jabatan === "Direktur"
                    ? ["Detail", "Scoring"]
                    : // Status Approved By Role 03
                    // : userInfo.upt === foundEmployee.upt && userInfo.jabatan === "Kepala Seksi" && (value["Status"] === "Approved" || value["Status"] === "Draft Scoring") && uniqueKeys.some(key => penJabatan.sis_id.includes(key)) && value.Creaby === userInfo.username ? ["Detail"]
                    userInfo.upt === foundEmployee.upt &&
                      userInfo.jabatan === "Kepala Seksi" &&
                      value["Status"] === "Approved"
                    ? ["Detail", "Scoring"]
                    : userInfo.upt === foundEmployee.upt &&
                      userInfo.jabatan === "Kepala Seksi" &&
                      value["Status"] === "Draft Scoring"
                    ? ["Detail", "EditScoring", "Submit"]
                    : ["Detail"],
                Alignment: [
                  "center",
                  "left",
                  "left",
                  "left",
                  "left",
                  "right",
                  "left",
                  "left",
                  "right",
                  "center",
                  "center",
                ],
              };
            } else if (
              (userInfo.jabatan === "Kepala Departemen" ||
                userInfo.jabatan === "Sekretaris Prodi" ||
                userInfo.jabatan === "Direktur" ||
                userInfo.jabatan === "Wakil Direktur" ||
                userInfo.jabatan === "Kepala Seksi") &&
              type !== "mySubmission"
            ) {
              return {
                Key: value.Key,
                No: value["No"],
                NPK: value["NPK"] || "-",
                Name: value["Name"] || "-",
                "Project Title": maxCharDisplayed(
                  decodeHtml(
                    decodeHtml(decodeHtml(value["Project Title"]))
                  ).replace(/<\/?[^>]+(>|$)/g, ""),
                  50
                ),
                Category: value["Category"],
                Period: value["Period"],
                Batch: value["Batch"] || "-",
                "Submitted On": formatDate(value["Creadate"]),
                Score: value["Score"] || 0,
                Status: value["Status"],
                Count: value["Count"],
                Action:
                  role === "ROL03" &&
                  value["Status"] === "Draft" &&
                  value["Creaby"] === userInfo.username
                    ? ["Detail", "Edit", "Submit"]
                    : inorole === "Facilitator" &&
                      value["Status"] === "Waiting Approval"
                    ? ["Detail", "Reject", "Approve"]
                    : role === "ROL03" &&
                      value["Status"] === "Rejected" &&
                      value["Creaby"] === userInfo.username
                    ? ["Detail", "Edit", "Submit"]
                    : userInfo.upt === foundEmployee.upt &&
                      userInfo.jabatan === "Kepala Seksi" &&
                      value["Status"] === "Waiting Approval"
                    ? ["Detail", "Reject", "Approve"]
                    : role === "ROL01" && value["Status"] === "Approved"
                    ? ["Detail", "Submit"]
                    : userInfo.upt === foundEmployee.upt &&
                      userInfo.jabatan === "Kepala Seksi" &&
                      (value["Status"] === "Approved" ||
                        value["Status"] === "Awaiting Scoring")
                    ? ["Detail", "Scoring"]
                    : userInfo.jabatan === "Kepala Departemen" && value["Status"] === "Draft Scoring" ? ["Detail", "EditScoring", "Submit"] 
                    : userInfo.jabatan === "Wakil Direktur" && value["Status"] === "Draft Scoring" ? ["Detail", "EditScoring", "Submit"] 
                    : userInfo.jabatan === "Kepala Seksi" && value["Status"] === "Draft Scoring" ? ["Detail", "EditScoring", "Submit"] 
                    : (userInfo.jabatan === "Kepala Seksi" ||
                      userInfo.jabatan === "Sekretaris Prodi" ||
                      userInfo.jabatan === "Kepala Departemen" ||
                      userInfo.jabatan === "Wakil Direktur" ||
                      userInfo.jabatan === "Direktur") && (value["Status"] === "Scoring" || value["Status"] === "Approved")
                    ? ["Detail", "Scoring"]
                    :userInfo.upt === foundEmployee.upt &&
                      userInfo.jabatan === "Kepala Seksi" &&
                      value["Status"] === "Approved"
                    ? ["Detail", "Scoring"]
                    : userInfo.upt === foundEmployee.upt &&
                      userInfo.jabatan === "Kepala Seksi" &&
                      value["Status"] === "Draft Scoring"
                    ? ["Detail", "EditScoring", "Submit"]
                    : userInfo.jabatan === "Kepala Departemen" &&
                    value["Status"] === "Waiting Approval"
                    ? ["Detail", "Reject", "Approve"]
                    :userInfo.jabatan === "Wakil Direktur" &&
                    value["Status"] === "Waiting Approval"
                    ? ["Detail", "Reject", "Approve"]
                    :["Detail"],
                Alignment: [
                  "center",
                  "left",
                  "left",
                  "left",
                  "left",
                  "right",
                  "left",
                  "left",
                  "right",
                  "center",
                  "center",
                ],
              };
            }else {
              return {
                Key: value.Key,
                No: value["No"],
                "Project Title": maxCharDisplayed(
                  decodeHtml(
                    decodeHtml(decodeHtml(value["Project Title"]))
                  ).replace(/<\/?[^>]+(>|$)/g, ""),
                  50
                ),
                Category: value["Category"],
                Batch: value["Batch"] || "-",
                Period: value["Period"],
                "Submitted On": formatDate(value["Creadate"]),
                Status: value["Status"],
                Count: value["Count"],
                Action:
                  role === "ROL03" &&
                  value["Status"] === "Draft" &&
                  value["Creaby"] === userInfo.username
                    ? ["Detail", "Edit", "Submit"]
                    : inorole === "Facilitator" &&
                      value["Status"] === "Waiting Approval" && value.Creaby !== userInfo.username
                    ? ["Detail", "Reject", "Approve"]
                    : role === "ROL03" &&
                      value["Status"] === "Rejected" &&
                      value["Creaby"] === userInfo.username
                    ? ["Detail", "Edit", "Submit"]
                    : role === "ROL01" &&
                    value["Status"] === "Approved"
                    ? ["Detail", "Submit"]
                    // : userInfo.upt === foundEmployee.upt && (jabatanTarget === "Kepala Seksi" || jabatanTarget === "Sekretaris Prodi") && (value["Status"] === "Approved" || value["Status"] === "Scoring") 
                    // ? ["Detail", "Scoring"]
                    // : (jabatanTarget === "Kepala Departemen") && (value["Status"] !== "Draft Scoring")
                    // ? ["Detail", "Scoring"]
                    : (jabatanTarget === "Kepala Departemen") && (value["Status"] === "Waiting Approval")
                    ? ["Detail"]
                    : (jabatanTarget === "Wakil Direktur" || jabatanTarget === "Direktur") && (value["Status"] !== "Draft Scoring")
                    ? ["Detail", "Scoring"]
                    : (jabatanTarget === "Wakil Direktur" || jabatanTarget === "Direktur") && (value["Status"] === "Scoring")
                    ? ["Detail", "Scoring"]
                    // : userInfo.upt === foundEmployee.upt && jabatanTarget === "Kepala Seksi" && value["Status"] === "Approved"  ? ["Detail", "Scoring"] 
                    : userInfo.upt === foundEmployee.upt && (jabatanTarget === "Kepala Seksi" || jabatanTarget === "Sekretaris Prodi") && value["Status"] === "Draft Scoring" ? ["Detail", "EditScoring", "Submit"]
                    : jabatanTarget === "Kepala Departemen" && value["Status"] === "Draft Scoring" ? ["Detail", "EditScoring", "Submit"] 
                    : jabatanTarget === "Wakil Direktur" && value["Status"] === "Draft Scoring" ? ["Detail", "EditScoring", "Submit"] 
                    : ["Detail"],
                Alignment: [
                  "center",
                  "left",
                  "left",
                  "center",
                  "center",
                  "center",
                  "center",
                  "center",
                  "center",
                  "center",
                ],
              };
            }
          });
          console.log(formattedData);
          setCurrentData(formattedData);
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    // console.log("COOKIE", JSON.parse(decryptId(cookie)));
    fetchData();
  }, [currentFilter, listEmployee]);

  useEffect(() => {
    const shouldRefresh = localStorage.getItem('refreshAfterSubmit');
  
    if (shouldRefresh === 'true') {
      localStorage.removeItem('refreshAfterSubmit');
      window.location.reload();
    }
  }, []);
  
  if (isLoading) return <Loading />;

  console.log("DeptArrData:", userInfo);

  return (
    <>
      <div className="my-3">
        {isError.error && (
          <div className="flex-fill ">
            <Alert
              type="danger"
              message={isError.message}
              handleClose={() => setIsError({ error: false, message: "" })}
            />
          </div>
        )}
        <div className="mb-4 color-primary text-center">
          <div className="d-flex gap-3 justify-content-center">
            <h2 className="display-1 fw-bold">Suggestion</h2>
            <div className="d-flex align-items-end mb-2">
              <h2 className="display-5 fw-bold align-items-end">System</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-fill">
        <div className="input-group">
          {
          type === "mySubmission" &&
          // ["Kepala Seksi", "Kepala Departemen", "Sekretaris Prodi"].includes(
          //   userInfo.jabatan
          // ) &&
          userInfo.role.slice(0, 5) !== "ROL01" ? (
            <Button
              iconName="add"
              label="Register"
              classType="success"
              onClick={() => onChangePage("add")}
            />
          ) : userInfo.peran === "Innovation Coordinator" ? (
            <Button
              iconName="file-excel"
              label="Export"
              classType="success"
              onClick={() => {
                const param = {
                  query: currentFilter.query,
                  sort: currentFilter.sort,
                  status: currentFilter.status,
                  jenis: "SS",
                  role: userInfo.role.slice(0, 5),
                  npk: userInfo.npk,
                  kryData: listEmployee,
                };
                handleExport(param);
              }}
            />
          ) : (
            ""
          )}
          <Input
            ref={searchQuery}
            forInput="pencarianSetting"
            isRound
            placeholder="Search"
          />
          <Button
            iconName="search"
            classType="primary px-3"
            title="Search"
            onClick={handleSearch}
          />
          <Filter>
            <DropDown
              ref={searchFilterSort}
              forInput="ddUrut"
              label="Sort By"
              type="none"
              arrData={dataFilterSort}
              defaultValue="[Creadate] desc"
            />
            <DropDown
              ref={searchFilterStatus}
              forInput="ddStatus"
              label="Status"
              type="semua"
              arrData={
                userInfo.role.slice(0, 5) === "ROL01"
                  ? dataFilterStatus.filter((item) => item.Value != "Draft")
                  : dataFilterStatus
              }
              defaultValue=""
            />
          </Filter>
          {userInfo.role.slice(0, 5) === "ROL01" ? (
            <Button
              iconName="paper-plane-top"
              classType="primary px-3 border-start"
              title="Assign"
              onClick={() => handleAssign(selectedKeys)}
            />
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="mt-3 mb-5">
        <div className="d-flex flex-column">
          {!isLoading && (
            <Table
              checkboxTable={
                userInfo.role.slice(0, 5) === "ROL01" 
                // || userInfo.jabatan === "Kepala Departemen"
              }
              data={currentData}
              onDetail={onChangePage}
              onSubmit={handleSubmit}
              onApprove={handleApprove}
              onReject={handleReject}
              onEdit={onChangePage}
              onScoring={onScoring}
              userInfo={userInfo?.username}
              onEditScoring={onEditScoring}
            />
          )}
          <Paging
            pageSize={PAGE_SIZE}
            pageCurrent={currentFilter.page}
            totalData={currentData[0]["Count"]}
            navigation={handleSetCurrentPage}
          />
        </div>
      </div>
      <Modal
        title="Select Submission Batch"
        ref={modalRef}
        centered
        size="small"
        Button1={
          <Button
            title="Assign to batch..."
            classType="primary ms-2"
            label="SUBMIT"
            onClick={handleSubmitBatch}
          />
        }
      >
        <div
          className="mb-3"
          style={{
            maxHeight: "250px",
            overflowY: "auto",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none",
          }}
        >
          <table className="table table-hover table-striped border">
            <thead className="text-center">
              <tr>
                <th>No</th>
                <th>NPK</th>
                <th>Name</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {selectedKeys.map((item, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{item.NPK}</td>
                  <td>{maxCharDisplayed(item.Name, 10)}</td>
                  <td>{maxCharDisplayed(item["Project Title"], 20)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center">Assign To</p>
        <DropDown
          arrData={listCategory}
          forInput="batch"
          value={batchRef.current}
          onChange={(e) => (batchRef.current = e.target.value)}
          showLabel={false}
        />
      </Modal>
    </>
  );
}
