import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { decodeHtml, formatDate, separator } from "../../util/Formatting";
import {
  API_LINK,
  ROOT_LINK,
  EMP_API_LINK,
  FILE_LINK,
} from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Loading from "../../part/Loading";
import { date, number, object, Schema, string } from "yup";
import Alert from "../../part/Alert";
import Icon from "../../part/Icon";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import Table from "../../part/Table";
import { decryptId } from "../../util/Encryptor";
import Cookies from "js-cookie";
import Label from "../../part/Label";
import Input from "../../part/Input";
import TextArea from "../../part/TextArea";
import SearchDropdown from "../../part/SearchDropdown";
import DropDown from "../../part/Dropdown";
import Button from "../../part/Button";
import SweetAlert from "../../util/SweetAlert";
import * as Yup from "yup";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    Name: null,
    Count: 0,
  },
];
function deobfuscateId(obfuscated) {
  const parts = obfuscated.split(".");
  if (parts.length === 2) {
    return atob(parts[1]); // hanya ambil bagian Base64
  }
  return null;
}

export default function EditScoring({ onChangePage }) {
  const cookie = Cookies.get("activeUser");
  const [searchParams] = useSearchParams();
  const encodedId = searchParams.get("id");

  if (parseInt(encodedId)) {
    // Redirect ke halaman lain jika tidak bisa dikonversi ke integer
    window.location.href = "/*"; // ganti "/" dengan URL tujuanmu
  }

  let userInfo = "";
  const id = deobfuscateId(encodedId);
  console.log("ID", id);
  if (cookie) userInfo = JSON.parse(decryptId(cookie));
  const [errors, setErrors] = useState({});
  const [listEmployee, setListEmployee] = useState([]);
  const [listKriteriaPenilaian, setListKriteriaPenilaian] = useState([]);
  const [listDetailKriteriaPenilaian, setListDetailKriteriaPenilaian] =
    useState([]);
  const [userData, setUserData] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [formattedValue, setFormattedValue] = useState("");

  // VARIABLE UNTUK UPDATE LIST DETAIL KRITERIA PENILIAN
  const [listPenilaian, setListPenilaian] = useState([]);

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
  const formDataRef3 = useRef([]);
  const key = useRef({});
  const formComment = useRef(null);

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

  useEffect(() => {
    let total = 0;
    let data = [];
    // console.log("DATA", formDataRef2.current);
    console.log("Key", key.current);
    let i = 0;
    Object.values(listPenilaian).forEach((d) => {
      console.log("ssd", d);
      key.current[i] = d.Keys;
      i++; // increment i
    });

    Object.values(formDataRef2.current).forEach((val) => {
      const matched = listDetailKriteriaPenilaian.find(
        (item) => item.Value === val
      );

      formDataRef3.current[val] = matched?.Score;

      // console.log(listDetailKriteriaPenilaian);
      // console.log("val dari formDataRef2:", formDataRef3.current);
      // console.log("matched score:", matched?.Score);

      const parsed = parseFloat(matched?.Score);
      if (!isNaN(parsed)) total += parsed;
    });
    console.log("Key", key.current);

    setTotalScore(total);
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
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

      console.log("val:", val);
      console.log("matched item:", matched?.Score);
      console.log("formdataref3:", formDataRef3.current);

      const parsed = parseFloat(matched?.Score);
      if (!isNaN(parsed)) total += parsed;
    });

    // formComment.current = e.target.value;
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
            Authorization: Bearer `${localStorage.getItem("jwtToken")}`,
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
    console.log("P, punya saya", errors);
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Comment: ", decodeHtml(formComment.current));
    console.log(
      "Comment value: ",
      `${formComment.current}  - ${userInfo.username}`
    );
    // console.log(formComment.current.value);

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

    console.log("STATUS", status1);

    const payload = {
      dkp_id: Object.values(formDataRef2.current).join(", "), // "12, 2, 4,  7"
      sis_id: id,
      pen_nilai: Object.values(formDataRef3.current).join(", "), // "34, 44, 66, 12"
      jabatan: userInfo.jabatan,
      status: "-",
      pen_createby: listPenilaian[0].creaby,
      pen_createdate: listPenilaian[0].creadate,
      pen_modif_by: userInfo.username,
      pen_comment:
        formComment.current && formComment.current.trim() !== ""
          ? `${formComment.current} - ${userInfo.username}`
          : "",
      sis_status: status1
    };

    const payloadSchema = Yup.object().shape({
      dkp_id: Yup.string()
        .matches(
          /^(\d+\s*,\s*)*\d+$/,
          "dkp_id must be a comma-separated list of numbers"
        )
        .test(
          "length-9",
          "All Assessment schemes must be filled!",
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
        .matches(
          /^(\d+\s*,\s*)*\d+$/,
          "pen_nilai must be a comma-separated list of numbers"
        )
        .test(
          "length-9",
          "All Assessment schemes must be filled!",
          function (value) {
            if (!value) return false;
            const items = value
              .split(",")
              .map((v) => v.trim())
              .filter((v) => v !== "");
            return items.length === listKriteriaPenilaian.length;
          }
        ),

      jabatan: Yup.string().required("jabatan is required"),

      status: Yup.string()
        .oneOf(["-"], 'status must be "-"')
        .required("status is required"),

      pen_createby: Yup.string().required("pen_created is required"),

      pen_createdate: Yup.string().required("pen_createdate is required"),

      pen_modif_by: Yup.string().required("pen_modif_by is required"),

      pen_comment: Yup.string().nullable(),
      sis_status: Yup.string().nullable()
    });

    console.log("payload: ", payload);

    const validationErrors = await validateAllInputs(
      payload,
      payloadSchema,
      setErrors
    );

    console.log(
      "VALIDASI: ",
      Object.values(validationErrors).every((error) => !error)
    );
    console.log("VALIDASI: ", validationErrors);
    console.log("VALIDASI: ", errors);

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError((prevError) => ({ ...prevError, error: false }));
      setErrors({});

      console.log("FormDataRef: ", formDataRef2.current);
      console.log("Payload: ", payload);
      console.log("Payload nilai: ", formDataRef3.current);

      try {
        const data = await UseFetch(
          API_LINK + "RencanaSS/UpdateNilaiSS",
          payload
        );

        // console.log("tes", data);
        if (!data) {
          throw new Error("Error: Failed to Submit the data.");
        } else {
          // window.location.href = ROOT_LINK + "/submission/ss";
          SweetAlert("Success", "Data Successfully Submitted", "success");

          setTimeout(function () {
            window.close();
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
      console.log("356 error", errors);
      SweetAlert("Error", Object.values(validationErrors).join("\n"), "error");
      // window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "MiniConvention/GetListKriteriaPenilaian"
        );

        // console.log("")
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
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataDetailByID = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(API_LINK + "RencanaSS/GetDetailPenilaian", {
          sis_id: id,
          creaby: userInfo.username,
        });

        console.log("INI DATA SISIA: ", data);
        if (!data) {
          throw new Error("Error: Failed to get the category data.");
        } else {
          const dataDetail = data.map((item) => {
            const deskripsiPendek =
              item.Deskripsi.length > 70
                ? item.Deskripsi.substring(0, 71) + "...."
                : item.Deskripsi;

            return {
              Keys: item.Key,
              Text: `${item.Deskripsi} - (Point ${item.Nilai})`,
              Value: item.Value,
              Score: item.Nilai,
              KrpId: item.Kriteria,
              creaby: item.Creaby,
              creadate: item.Creadate,
            };
          });

          setListPenilaian(dataDetail);
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
    fetchDataDetailByID();
  }, []);

  // console.log("INI DATA 377: ", listDetailKriteriaPenilaian);

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "MiniConvention/GetListDetailKriteriaPenilaian"
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          const dataDetail = data.map((item) => ({
            Text:`(Poin: ${item.Score}) - ${item.Desc}`,
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
        // setListCategory({});
      }
    };

    fetchData();
  }, []);

  // const arrTextData = listDetailKriteriaPenilaian.map(item => item.Text);
  // console.log("TEXT ", listDetailKriteriaPenilaian);
  const formatNumber = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    setFormattedValue(formatNumber(rawValue));
    setUserInput(rawValue);
    // handleInputChange({ target: { name: "budget", value: rawValue } });
  };

  const handleComment = (e) => {
    formComment.current = e.target.value;
  };

  // console.log("NILAI: ", listPenilaian);
  // console.log("LIST KRITERIA ", listDetailKriteriaPenilaian);

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
                          <div
                            className="pe-4 border-end"
                            style={{ width: "80%" }}
                          >
                            {listKriteriaPenilaian.map((item) => {
                              const selectedItem =
                                listDetailKriteriaPenilaian.find(
                                  (detail) => detail.Id === item.Value
                                );

                              const filteredArrData =
                                listDetailKriteriaPenilaian.filter(
                                  (detail) => detail.Id === item.Value
                                );

                              const arrTextData = listPenilaian.map(
                                (item) => item
                              );

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
                                          material, consumable, man hour, dll...
                                        </small>
                                      </div>
                                    )}
                                  </div>
                                  <div className="col-lg-8">
                                    <SearchDropdown
                                      forInput={item.Value}
                                      // placeholder={arrTextData[item.Value] || ''}
                                      arrData={filteredArrData}
                                      isRound
                                      isRequired
                                      value={
                                        formDataRef2.current[item.Value] || ""
                                      }
                                      selectedValued={
                                        arrTextData[item.Value - 1]
                                      }
                                      disableTyping
                                      onChange={handleInputChange}
                                      // errorMessage={errors.formDataRef2.current[item.Value]}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                            <div className="col-lg-4">
                              <Label data="Comment" />
                            </div>
                            <div className="col-lg-12">
                              <Input
                                type="textarea"
                                forInput="comment"
                                // ref={formComment}
                                // isRequired
                                onChange={handleComment}
                                selectedValued={listPenilaian.komment || ""}
                                value={formComment.current}
                                errorMessage={errors.formComment}
                              />
                            </div>
                          </div>
                          <div className="ps-4" style={{ width: "20%" }}>
                            <div
                              className="card fw-medium text-center"
                              style={{
                                width: "200px",
                                minHeight: "180px",
                              }}
                            >
                              {/* HEADER DI ATAS */}
                              <h3
                                className="w-100 text-center"
                                style={{
                                  textAlign: "center",
                                  background: "transparent",
                                  // border: "none",
                                  padding: 0,
                                  fontWeight: "bold",
                                }}
                              >
                                Total Score
                              </h3>

                              <hr />

                              {/* ISI DI TENGAH */}
                              <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                                <h1 className="fw-medium fw-bold">
                                  {totalScore}
                                </h1>
                              </div>
                            </div>
                          </div>
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