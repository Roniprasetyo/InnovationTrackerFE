import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import Label from "../../part/Label";
import Icon from "../../part/Icon";
import { decryptId } from "../../util/Encryptor";
import Cookies from "js-cookie";

const listTypeSetting = [
  { Value: "Jenis Improvement", Text: "Jenis Improvement" },
  { Value: "Kategori Keilmuan", Text: "Kategori Keilmuan" },
];

export default function Submission() {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [waitingApproval, setWaitingApproval] = useState(0);
  const [needScoring, setNeedScoring] = useState(0);
  const navigate = useNavigate();
  const cookie = Cookies.get("activeUser");

  const formDataRef = useRef({
    setId: "",
    setName: "",
    setType: "",
    setDesc: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "MasterSetting/GetSettingById", {
          id: withID,
        });

        if (data === "ERROR" || data.length === 0) {
          throw new Error(
            "Terjadi kesalahan: Gagal mengambil data setting."
          );
        } else {
          formDataRef.current = { ...formDataRef.current, ...data[0] };
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

    const fetchDataInfo = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "RencanaSS/GetCountStatusSS", {
          id: userInfo.jabatan,
        });

        if (data === "ERROR" || data.length === 0) {
          throw new Error(
            "Terjadi kesalahan: Gagal mengambil data setting."
          );
        } else {
          console.log("data",data)
          setNeedScoring(data[0]["Need Scoring"])
          setWaitingApproval(data[0]["Waiting Approval"])
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

    

      let userInfo = "";
      if (cookie) userInfo = JSON.parse(decryptId(cookie));

    console.log(userInfo.jabatan)

    fetchData();
    fetchDataInfo();
  }, []);

  return (
    <>
      <div className="container mb-5">
        <div className="p-3 mt-3">
          <div className="row bg-second rounded-5 shadow-sm mb-3">
          <div className="col-lg-3 bg-main rounded-5 d-flex align-items-center p-3 sub"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/submission/ss")}
          >
            <div className="mb-2 ms-3">
              <div className="display-3 fw-bold">SS</div>
              <div className="fw-medium">
                <i>(Suggestion System)</i>
              </div>
            </div>
          </div>

          <div className="col-sm-9">
            <div className="p-4">
              <p className="lead fw-medium">
                Suggestion System (SS) is an improvement or innovation that
                carried out by individuals within the scope of their work and
                the benefits of Instantly felt by changemakers
              </p>
              <div className="row">
                <div className="col-sm-4 bg-success rounded-5 me-3" onClick={() => navigate("/submission/ss")}>
                  <div className="d-flex align-items-center mx-3" style={{ cursor: "pointer" }}>
                    <p className="fw-small text-white my-1">
                      <small>
                        <Icon name="plus me-2 text-white" />
                        <i>System Suggestion</i>
                      </small>
                    </p>
                  </div>
                </div>

                <div className="col-sm-3 bg-warning rounded-5 me-3 position-relative">
                  <div className="d-flex align-items-center mx-3">
                    <p className="fw-small text-dark my-1 mb-0">
                      <small>
                        <Icon name="star me-2 text-dark" />
                        <i>Need Scoring</i>
                      </small>
                    </p>
                    <strong className="text-dark position-absolute end-0 me-3">({needScoring})</strong>
                  </div>
                </div>

                <div className="col-sm-3 bg-info rounded-5 position-relative">
                  <div className="d-flex align-items-center mx-3">
                    <p className="fw-small text-white my-1 mb-0">
                      <small>
                        <Icon name="clock me-2 text-white" />
                        <i>Waiting Approval</i>
                      </small>
                    </p>
                    <strong className="text-white position-absolute end-0 me-3">({waitingApproval})</strong>
                  </div>
                </div>


              </div>
            </div>

            </div>
          </div>
          <div className="row bg-second rounded-5 shadow-sm mb-3">
            <div
              className="col-lg-3 bg-main rounded-5 d-flex align-items-center p-3 sub"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/submission/qcc")}
            >
              <div className="mb-2 ms-3">
                <div className="display-3 fw-bold">QCC</div>
                <div className="fw-medium">
                  <i>(Quality Control Circle)</i>
                </div>
              </div>
            </div>
            <div className="col-sm-9">
              <div className="p-4">
                <p className="lead fw-medium">
                  Quality Control Circle (QCC) is a group innovation within the
                  Study Program/UPT/Unit, where the target project is relate
                  with the KPIs of each Study Program/UPT/Unit.
                </p>
                <div className="col-sm-4 bg-success rounded-5" onClick={() => navigate("/submission/qcc")}>
                  <div
                    className="d-flex align-items-center mx-3"
                    style={{ cursor: "pointer" }}
                  >
                  
                    <p className="fw-small text-white my-1">
                      <small>
                        <Icon name="plus me-2 text-white" />
                        <i>Quality Control Circle</i>
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row bg-second rounded-5 shadow-sm mb-3">
            <div
              className="col-lg-3 bg-main rounded-5 d-flex align-items-center p-3 sub"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/submission/qcp")}
            >
              <div className="mb-2 ms-3">
                <div className="display-3 fw-bold">QCP</div>
                <div className="fw-medium">
                  <i>(Quality Control Project)</i>
                </div>
              </div>
            </div>
            <div className="col-sm-9">
              <div className="p-4">
                <p className="lead fw-medium">
                  Quality Control Project (QCP) is an innovation that is a group
                  across Study Programs/UPTs/Units where the project target is
                  in accordance with the KPIs of each WaDir.
                </p>
                <div className="col-sm-4 bg-success rounded-5" onClick={() => navigate("/submission/qcp")}>
                  <div
                    className="d-flex align-items-center mx-3"
                    style={{ cursor: "pointer" }}
                  >
                    
                    <p className="fw-small text-white my-1">
                      <small>
                        <Icon name="plus me-2 text-white" />
                        <i>Quality Control Project</i>
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row bg-second rounded-5 shadow-sm mb-3">
            <div
              className="col-lg-3 bg-main rounded-5 d-flex align-items-center p-3 sub"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/submission/bpi")}
            >
              <div className="mb-2 ms-3">
                <div className="display-3 fw-bold">BPI</div>
                <div className="fw-medium">
                  <i>(Business Performance Improvement)</i>
                </div>
              </div>
            </div>
            <div className="col-sm-9">
              <div className="p-4">
                <p className="lead fw-medium">
                Business Performance Improvement (BPI) is an innovation that is cross-Division/Vice Director in ASTRAtech, which is a new business that impacts the increase of tangible value at Poltek ASTRA as an educational institution that is part of the ASTRA business unit.
                </p>
                <div className="col-sm-4 bg-success rounded-5" onClick={() => navigate("/submission/bpi")}>
                  <div
                    className="d-flex align-items-center mx-3"
                    style={{ cursor: "pointer" }}
                  >
                    
                    <p className="fw-small text-white my-1">
                      <small>
                        <Icon name="plus me-2 text-white" />
                        <i>Business Performance Improvement </i>
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row bg-second rounded-5 shadow-sm mb-3">
            <div
              className="col-lg-3 bg-main rounded-5 d-flex align-items-center p-3 sub"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/submission/vci")}
            >
              <div className="mb-2 ms-3">
                <div className="display-3 fw-bold">VCI</div>
                <div className="fw-medium">
                  <i>(Value Chain Innovation)</i>
                </div>
              </div>
            </div>
            <div className="col-sm-9">
              <div className="p-4">
                <p className="lead fw-medium">
                  Value Chain Innovation (VCI) is an innovation that crosses
                  ASTRA companies/business units that has an impact on
                  increasing tangible value in each ASTRA business unit,
                  including ASTRA Polytechnic as an educational institution that
                  is part of ASTRA's business unit
                </p>
                <div className="col-sm-4 bg-success rounded-5" onClick={() => navigate("/submission/vci")}>
                  <div
                    className="d-flex align-items-center mx-3"
                    style={{ cursor: "pointer" }}
                  >
                    
                    <p className="fw-small text-white my-1">
                      <small>
                      <Icon name="plus me-2 text-white" />
                        <i>Value Chain Innovation </i>
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
