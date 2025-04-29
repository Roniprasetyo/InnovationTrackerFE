import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { decodeHtml, formatDate, separator } from "../../util/Formatting";
import { API_LINK, EMP_API_LINK, FILE_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Loading from "../../part/Loading";
import { date, number, object, string } from "yup";
import Alert from "../../part/Alert";
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

const inisialisasiData = [
  {
    Key: null,
    No: null,
    Name: null,
    Count: 0,
  },
];

export default function MiniConventionScoring({ onChangePage, WithID }) {
  const cookie = Cookies.get("activeUser");
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  let userInfo = "";
  if (cookie) userInfo = JSON.parse(decryptId(cookie));
  const [errors, setErrors] = useState({});
  const [listEmployee, setListEmployee] = useState([]);
  const [listKriteriaPenilaian, setListKriteriaPenilaian] = useState([]);
  const [listDetailKriteriaPenilaian, setListDetailKriteriaPenilaian] = useState([]);
  const [userData, setUserData] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [formattedValue, setFormattedValue] = useState("");

  const formDataRef = useRef({
    Key: "",
    NPK:"",
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
        const data = await UseFetch(
          API_LINK + "MiniConvention/GetMiniConventionById",
          {
            id: WithID,
          }
        );

        console.log(WithID, data);
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
        (value) =>
          value.npk === formDataRef.current["NPK"]
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
    Object.values(formDataRef2.current).forEach((val) => {
      const matched = listDetailKriteriaPenilaian.find((item) => item.Value === val);

      console.log("val dari formDataRef2:", val);
      console.log("matched item:", matched);

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
      const fetchData = async () => {
        setIsError((prevError) => ({ ...prevError, error: false }));
        try {
          const data = await UseFetch(API_LINK + "MiniConvention/GetListKriteriaPenilaian");
  
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
      const fetchData = async () => {
        setIsError((prevError) => ({ ...prevError, error: false }));
        try {
          const data = await UseFetch(API_LINK + "MiniConvention/GetListDetailKriteriaPenilaian");
  
          if (data === "ERROR") {
            throw new Error("Error: Failed to get the category data.");
          } else {
            const dataDetail = data.map((item) => ({
              Text: `${item.Desc} - (${item.Score})`,
              Value: item.Value,
              Score: item.Score,
              Id: item.Value2
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
        }
      };
  
      fetchData();
    }, []);

    console.log("DATA ", listDetailKriteriaPenilaian);
    const formatNumber = (value) => {
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleChange = (e) => {
      const rawValue = e.target.value.replace(/[^\d]/g, "");
      setFormattedValue(formatNumber(rawValue)); 
      setUserInput(rawValue);
      // handleInputChange({ target: { name: "budget", value: rawValue } });
    };

    console.log("LIST KRITERIA ", listKriteriaPenilaian);

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
                          <div className="pe-4 border-end" style={{ width: '80%' }}>
                            {listKriteriaPenilaian.map((item) => {
                              const selectedItem = listDetailKriteriaPenilaian.find(
                                (detail) => detail.Id === item.Value
                              );

                              const filteredArrData = listDetailKriteriaPenilaian.filter(
                                (detail) => detail.Id === item.Value
                              );

                              return (
                                <div className="row mb-3" key={item.Value}>
                                  <div className="col-lg-4">
                                    <Label data={item.Text} />
                                  </div>
                                  <div className="col-lg-8">
                                    <SearchDropdown
                                      forInput={item.Value}
                                      arrData={filteredArrData}
                                      isRound
                                      value={formDataRef2.current[item.Value] || ""}
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="ps-4 d-flex flex-column gap-3" style={{ width: '20%' }}>
                            <div className="card text-center">
                              <div className="card-header">
                                <h8 className="fw-medium">Score</h8>
                              </div>
                              <div className="card-body d-flex flex-column gap-3">
                                <div className="card fw-medium text-center">
                                  Ka.Unit/Ka.UPT
                                  <hr />
                                  <h5>{totalScore}</h5>
                                </div>
                                <div className="card fw-medium text-center">
                                  Ka.Prodi/Ka.Dept
                                  <hr />
                                  <h5>{0}</h5>
                                </div>
                                <div className="card fw-medium text-center">
                                  WaDIR/DIR
                                  <hr />
                                  <h5>{0}</h5>
                                </div>
                              </div>
                            </div>
                            <div className="card fw-medium text-center">
                              <div className="card-header">
                                <h7 className="fw-medium">Total Scores</h7>
                              </div>
                              <h5>{totalScore}</h5>
                            </div>
                            {/* {listKriteriaPenilaian.slice(Math.ceil(listKriteriaPenilaian.length / 2)).map((item) => {
                              const selectedItem = listDetailKriteriaPenilaian.find(
                                (detail) => detail.Id === item.Value
                              );

                              const filteredArrData = listDetailKriteriaPenilaian.filter(
                                (detail) => detail.Id === item.Value
                              );

                              return (
                                <div className="row mb-3" key={item.Value}>
                                  <div className="col-lg-4">
                                    <Label data={item.Text} />
                                  </div>
                                  <div className="col-lg-8">
                                    <SearchDropdown
                                      forInput={item.Value}
                                      arrData={filteredArrData}
                                      isRound
                                      value={formDataRef2.current[item.Value] || ""}
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                </div>
                              );
                            })} */}
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
                          type="submit"
                          label="SUBMIT"
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}