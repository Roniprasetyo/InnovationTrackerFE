import { useRef, useState } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import Icon from "../../part/Icon";

export default function MasterPerusahaanAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const formDataRef = useRef({
    prsName: "",
    prsAddress: "",
  });

  
  const userSchema = object({
    prsName: string().max(50, "50 characters max").required("required"),
    prsAddress: string().max(200, "required").required("required"), 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validationError = validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validationError.error, 
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError({ error: false, message: "" });
      setErrors({});

      try {
        const data = await UseFetch(
          API_LINK + "MasterPerusahaan/CreatePerusahaan",
          formDataRef.current
        );
        if (data === "ERROR") {
          throw new Error("Error: Gagal mengirim data.");
        } else {
          SweetAlert("Success", "Data berhasil disimpan", "success");
          onChangePage("index");
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError({ error: true, message: error.message });
      } finally {
        setIsLoading(false);
      }
    } else {
      window.scrollTo(0, 0);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="row my-3" style={{ display: "flex", alignItems: "center" }}>
        <h2 className="fw-bold" style={{ color: "rgb(0, 89, 171)", margin: "0" }}>
          <Icon
            type="Bold"
            name="angle-left"
            cssClass="btn me-1 py-0 text"
            onClick={() => onChangePage("index")}
            style={{ fontSize: "22px", cursor: "pointer", color: "rgb(0, 89, 171)" }}
          />
          Add Data
        </h2>
      </div>
      <div className="mt-3">
        {isError.error && (
          <Alert
            type="danger"
            message={isError.message}
            handleClose={() => setIsError({ error: false, message: "" })}
          />
        )}
        <form onSubmit={handleAdd}>
          <div className="card mb-5">
            <div className="card-header py-3">
              <h3 className="fw-bold text-center">COMPANY FORM</h3>
            </div>
            <div className="card-body">
              <div className="row p-4">
                <div className="col-lg-6">
                  <Input
                    type="text"
                    forInput="prsName"
                    label="Name"
                    isRequired
                    value={formDataRef.current.prsName}
                    onChange={handleInputChange}
                    errorMessage={errors.prsName}
                  />
                </div>
                <div className="col-lg-12">
                  <Input
                    type="textarea"
                    forInput="prsAddress" 
                    isRequired
                    label="Address"
                    value={formDataRef.current.prsAddress}
                    onChange={handleInputChange}
                    errorMessage={errors.prsAddress}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <Button
                  classType="danger me-2 px-4 py-2"
                  label="CANCEL"
                  onClick={() => onChangePage("index")}
                  style={{ width: "100%", borderRadius: "16px" }}
                />
                <Button
                  classType="primary ms-2 px-4 py-2"
                  type="submit"
                  label="SUBMIT"
                  style={{ width: "100%", borderRadius: "16px" }}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
