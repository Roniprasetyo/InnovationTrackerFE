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

const listTypeSetting = [
  { Value: "Jenis Improvement", Text: "Jenis Improvement" },
  { Value: "Kategori Keilmuan", Text: "Kategori Keilmuan" },
];

export default function Submission() {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
            "Terjadi kesalahan: Gagal mengambil data alat/mesin."
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

    fetchData();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row mb-5 mt-5">
          <div className="col-lg-3">
            <div className="card mt-3 border-0" style={{ cursor: "pointer" }}>
              <div className="card-body bg-primary bg-gradient rounded-2 text-white">
                <div className="lead fw-medium">Suggestion System</div>
                <div className="h1 fw-bold">(SS)</div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card mt-3 border-0" style={{ cursor: "pointer" }}>
              <div className="card-body bg-primary bg-gradient rounded-2 text-white">
                <div className="lead fw-medium">Quality Control Circle</div>
                <div className="h1 fw-bold">(QCC)</div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div
              className="card mt-3 border-0"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/submission/qcp", { state: {} })}
            >
              <div className="card-body bg-primary bg-gradient rounded-2 text-white">
                <div className="lead fw-medium">Quality Control Project</div>
                <div className="h1 fw-bold">(QCP)</div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card mt-3 border-0" style={{ cursor: "pointer" }}>
              <div className="card-body bg-primary bg-gradient rounded-2 text-white">
                <div className="lead fw-medium">Value Chain Innovation</div>
                <div className="h1 fw-bold">(VCI)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
