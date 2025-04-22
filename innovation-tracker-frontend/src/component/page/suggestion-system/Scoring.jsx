import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { decodeHtml, formatDate, separator } from "../../util/Formatting";
import { API_LINK, EMP_API_LINK, FILE_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import Icon from "../../part/Icon";
import Table from "../../part/Table";
import { decryptId } from "../../util/Encryptor";
import Cookies from "js-cookie";
import Label from "../../part/Label";
import Input from "../../part/Input";

const inisialisasiData = [
  {
    Key: null,
    No: null,
    Name: null,
    Count: 0,
  },
];

export default function MiniConventionScoring({ onChangePage, withID }) {
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

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      console.log("TES s77", withID);
      try {
        const data = await UseFetch(
          API_LINK + "RencanaSS/GetRencanaSSByIdV2",
          {
            id: withID,
          }
        );
        console.log("ini data: ", data);

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
    if (listEmployee.length > 0 && userInfo?.upt && userInfo?.npk) {
      const foundUser = listEmployee.find((value) => value.npk === userInfo.npk);
  
      if (foundUser) {
        setUserData(foundUser);
        console.log("User ditemukan di listEmployee", userData);
      } else {
        setUserData(null); // atau bisa juga kosongkan objek: {}
        console.warn("User tidak ditemukan di listEmployee");
      }
    }
  }, [listEmployee, userInfo]);

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
            setListDetailKriteriaPenilaian(data);
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

    const formatNumber = (value) => {
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleChange = (e) => {
      const rawValue = e.target.value.replace(/[^\d]/g, "");
      setFormattedValue(formatNumber(rawValue)); 
      setUserInput(rawValue);
      // handleInputChange({ target: { name: "budget", value: rawValue } });
    };

    console.log("LIST KRITERIA ", listDetailKriteriaPenilaian);

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
                              data={userInfo.npk || "-"}
                            />
                          </div>

                          <div className="col-md-4">
                            <Label
                              title="Name​"
                              data={userInfo?.nama || "-"}
                            />
                          </div>

                          <div className="col-md-4">
                            <Label
                              title="Section​"
                              data={userInfo?.upt || "-"}
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
                        <div className="card-body d-flex flex-row flex-wrap align-items-center">
                          {listKriteriaPenilaian.map((item, index) => (
                            <div className="card mb-3 col-lg-12">
                              <div className="card-header align-items-center d-flex gap-3">
                                <h5 className="fw-medium">{item["Text"] || "-"}</h5>
                                <div style={{ width: '1px', height: '30px', backgroundColor: 'black' }}></div>
                                <h6 className="fw-medium mt-1">{item["Desc"] || "-"}</h6>
                              </div>
                              {/* {index === 0 && (
                                <div>
                                    <div className="card align-items-center rounded-0 border-0" style={{ fontWeight: 'bold' }}>Scores</div>
                                    <hr />
                                </div>
                                )
                              } */}
                              <div className={`card-body d-flex ${index !== 0 ? 'flex-column align-items-left' : 'align-items-center'} `} style={{gap:'25px', marginBottom:'-15px'}} key={index}>
                                {listDetailKriteriaPenilaian
                                  .filter(item2 => item["Value"] === item2["Value2"])
                                  // .reduce((acc, curr) => {
                                  //   const existing = acc.find(item => item.Desc === curr.Desc);
                                  //   if (existing) {
                                  //     existing.Scores.push(curr.Score);
                                  //   } else {
                                  //     acc.push({ ...curr, Scores: [curr.Score] });
                                  //   }
                                  //   return acc;
                                  // }, [])
                                  .map((item2, index2, arr) => {
                                    const parseNumber = (desc) => {
                                      const match = desc.match(/\d+/);
                                      return match ? parseInt(match[0], 10) : 0;
                                    };

                                    const angkaBatas = parseNumber(item2["Desc"]);
                                    const batasBawah = index2 < arr.length - 1 ? parseNumber(arr[index2 + 1]["Desc"]) : Infinity;
                                    const inputUser = parseInt(userInput || '', 10);
                                    const isMasuk = (index2 === 0 && inputUser <= angkaBatas) || (inputUser > angkaBatas && inputUser <= batasBawah);
                                    return (
                                      <div key={index2}>
                                        {item["Value"] === item2["Value2"] && (
                                          <div className=" d-flex row col-lg-12">
                                            {/* {index === 0 && ( */}
                                              <>
                                                <div className={`small card align-items-center ${index2 !== 0 ? '' : ''}`} style={{minWidth:'45px', backgroundColor: isMasuk ? '#d4edda' : 'transparent', marginLeft:'11.5px'}}>
                                                  <Label
                                                  data={item2["Score"]}
                                                  />
                                                </div>
                                                {/* <div className={`small card justify-content-center align-items-center ${index2 !== 0 ? '' : ''}`} style={{minWidth:'45px', backgroundColor: isMasuk ? '#d4edda' : 'transparent', width:'58px'}}>
                                                  <Label
                                                  data={item2["Desc"]}
                                                  />
                                                </div> */}
                                              </>
                                            {/* )} */}
                                          </div>
                                        )}
                                        {isMasuk && index === 0 && (
                                          <div className="align-items-center d-flex justify-content-center" style={{ color: 'green', fontWeight: 'bold' }}>✓</div>
                                        )}
                                        {/* {index !== 0 && (
                                          <div className="d-flex">
                                            <div className="hover-card col-lg-12" style={{cursor: 'pointer'}} 
                                            // onMouseEnter={(e) => {
                                            //   e.currentTarget.style.backgroundColor = '#e9ecef';
                                            //   e.currentTarget.style.fontWeight = 'bold';
                                            // }}
                                            // onMouseLeave={(e) => {
                                            //   e.currentTarget.style.backgroundColor = '';
                                            //   e.currentTarget.style.fontWeight = '';
                                            // }}
                                            >
                                              <div className="d-flex justify-content-between border-bottom">
                                                <div>
                                                  <Label
                                                  data={item2["Desc"]}
                                                  />
                                                </div>
                                                <div>
                                                  <Label
                                                  data={item2["Score"]}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )} */}
                                      </div>
                                    )
                                  })}
                              </div>
                              {index === 0 && (<hr />) }
                              {index === 0 && ((
                                <div className="d-flex justify-content-between">
                                  <div className="d-flex align-items-center mb-3 ms-3 gap-3 flex-wrap flex-sm-nowrap" style={{width:'350px'}}>
                                      <div>
                                        <Input
                                        type="text"
                                        value={formattedValue}
                                        onChange={handleChange}
                                        />
                                      </div>
                                      <div style={{width:'200px', marginTop:'15px'}}>
                                        <Label
                                        data="X Rp. 1000/bulan"
                                        />
                                      </div>
                                  </div>
                                  <div className="card d-flex text-center me-3" style={{width:'150px', marginBottom:'15px'}}>
                                    <Label
                                    title="Score"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                  </div>
                  <div className="d-flex justify-content-end pe-3 mb-3">
                    <sub>
                      Submitted by{" "}
                      <strong>{formDataRef.current["Creaby"] || "-"}</strong>
                    </sub>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}