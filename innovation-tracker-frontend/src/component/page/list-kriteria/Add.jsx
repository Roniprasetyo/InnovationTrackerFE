import { useEffect, useRef, useState } from "react";
import { number, object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import Icon from "../../part/Icon";
import SearchDropdown from "../../part/SearchDropdown";

export default function ListKriteriaAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [listKriteria, setListKriteria] = useState([]);

  const formDataRef = useRef({
    kriId: "",
    kriScore: "",
    kriDesk: "",
  });

  const userSchema = object({
    kriId: string().required("required"),
    kriScore: number().required("required"),
    kriDesk: string().max(100, "100 characters max").nullable(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validationError = validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));
      try {
        const data = await UseFetch(
          API_LINK + "MasterKriteriaNilai/GetListKriteriaNilai",
          {}
        );

        if (data === "ERROR") {
          throw new Error("Error: Failed to get the category data.");
        } else {
          setListKriteria(data);
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
        setListKriteria({});
      }
    };

    fetchData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError((prevError) => ({ ...prevError, error: false }));
      setErrors({});
      try {
        const data = await UseFetch(
          API_LINK + "MasterKriteriaNilai/CreateListKriteria",
          formDataRef.current
        );
        if (data === "ERROR") {
          throw new Error("Error: Failed to submit the data.");
        } else if (data[0].hasil === "EXIST") {
          throw new Error("Data already exists.");
        } else {
          SweetAlert("Success", "Data successfully submitted", "success");
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
          Add Data
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
        <form onSubmit={handleAdd}>
          <div className="card mb-5">
            <div className="card-header py-3">
              <h3 className="fw-bold text-center">KRITERIA NILAI FORM</h3>
            </div>
            <div className="card-body">
              <div className="row p-4">
                <div className="col-lg-6">
                  <SearchDropdown
                    forInput="kriId"
                    label="Knowledge Category"
                    placeHolder="Knowledge Category"
                    arrData={listKriteria}
                    isRequired
                    isRound
                    value={formDataRef.current.kriId}
                    onChange={handleInputChange}
                    errorMessage={errors.kriId}
                  />
                </div>
                <div className="col-lg-6">
                  <Input
                    type="number"
                    forInput="kriScore"
                    label="Score"
                    isRequired
                    value={formDataRef.current.kriScore}
                    onChange={handleInputChange}
                    errorMessage={errors.kriScore}
                  />
                </div>
                <div className="col-lg-12">
                  <Input
                    type="textarea"
                    forInput="kriDesk"
                    label="Description"
                    value={formDataRef.current.kriDesk}
                    onChange={handleInputChange}
                    errorMessage={errors.kriDesk}
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
