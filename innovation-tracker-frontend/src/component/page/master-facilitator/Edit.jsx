import { useRef, useState, useEffect } from "react";
import { number, object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import Icon from "../../part/Icon";
import SearchDropdown from "../../part/SearchDropdown";

const listTypeFacilitator = [
  { Value: "Jenis Improvement", Text: "Jenis Improvement" },
  { Value: "Kategori Keilmuan", Text: "Kategori Keilmuan" },
];

export default function MasterFacilitatorEdit({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const [listEmployee, setListEmployee] = useState([]);
  const [listPeriod, setListPeriod] = useState([]);
  const [listCategory, setListCategory] = useState([]);

  const formDataRef = useRef({
    Key: "",
    kryID: "",
    perID: "",
    role: "",
  });

  const userSchema = object({
    Key: string().required("required"),
    kryID: string().required("required"),
    perID: string().required("required"),
    role: string().required("required"),
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "MasterSetting/GetListSetting", {
          p1: "Innovation Role Category",
        });

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          setListCategory(data);
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
          formDataRef.current.perID = selected.Value;
          window.scrollTo(0, 0);
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListPeriod({});
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      setIsLoading(true);
      try {
        const data = await UseFetch(
          API_LINK + "RencanaCircle/GetListKaryawan",
          {}
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          setListEmployee(data);
          window.scrollTo(0, 0);
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

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(
          API_LINK + "MasterFacilitator/GetFacilitatorById",
          {
            id: withID,
          }
        );

        if (data === "ERROR" || data.length === 0) {
          throw new Error("Terjadi kesalahan: Gagal mengambil data periode.");
        } else {
          formDataRef.current = {
            Key: data[0].Key,
            kryID: data[0].kryID,
            perID: data[0].perID,
            role: data[0].role,
          };
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
  }, [withID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(value);
    const validationError = validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    console.log(formDataRef.current);

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError((prevError) => ({ ...prevError, error: false }));
      setErrors({});

      try {
        const data = await UseFetch(
          API_LINK + "MasterFacilitator/UpdateFacilitator",
          formDataRef.current
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to update the data.");
        } else {
          SweetAlert("Success", "Data successfully updated", "success");
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

  if (isLoading) return <Loading />;

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
          Edit Data
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
        <form onSubmit={handleEdit}>
          <div className="card mb-5">
            <div className="card-header py-3">
              <h3 className="fw-bold text-center">FACILITATOR FORM</h3>
            </div>
            <div className="card-body">
              <div className="row p-4">
                <div className="col-lg-4">
                  <SearchDropdown
                    forInput="kryID"
                    label="Employee"
                    placeHolder="Employee"
                    arrData={listEmployee}
                    isRequired
                    isRound
                    value={formDataRef.current.kryID}
                    onChange={handleInputChange}
                    errorMessage={errors.kryID}
                  />
                </div>
                <div className="col-lg-4">
                  <DropDown
                    forInput="perID"
                    label="Period"
                    arrData={listPeriod}
                    isRequired
                    value={formDataRef.current.perID}
                    onChange={handleInputChange}
                    errorMessage={errors.perID}
                  />
                </div>
                <div className="col-lg-4">
                  <DropDown
                    forInput="role"
                    label="Role"
                    arrData={listCategory}
                    isRequired
                    value={formDataRef.current.role}
                    onChange={handleInputChange}
                    errorMessage={errors.role}
                  />
                </div>
              </div>
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
