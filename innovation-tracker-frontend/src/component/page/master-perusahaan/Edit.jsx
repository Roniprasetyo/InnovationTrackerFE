import { useRef, useState, useEffect } from "react";
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
import DropDown from "../../part/Dropdown";

const listStatus = [
  { Value: "Aktif", Text: "Aktif" },
  { Value: "Non-Aktif", Text: "Non-Aktif" },
];

export default function EditPerusahaan({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  const formDataRef = useRef({
    prs_id: "",
    prs_nama: "",
    prs_alamat: "",
  });

  const userSchema = object({
    prs_nama: string().max(100, "Maksimum 100 karakter").required("Harus diisi"),
    prs_alamat: string().max(255, "Maksimum 255 karakter").required("Harus diisi"),
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "MasterPerusahaan/GetPerusahaanById", { id: withID });
   

        if (data === "ERROR" || data.length === 0) {
          throw new Error("Terjadi kesalahan: Gagal mengambil data perusahaan.");
        } else {
          formDataRef.current.prs_id=withID;
          formDataRef.current.prs_alamat=data[0].prs_alamat;
          formDataRef.current.prs_nama=data[0].prs_nama;
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError({ error: true, message: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [withID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validationError = validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await validateAllInputs(formDataRef.current, userSchema, setErrors);
      
    setIsLoading(true);
      setIsError({ error: false, message: "" });
      setErrors({});
      try {
        const data = await UseFetch(API_LINK + "MasterPerusahaan/UpdatePerusahaan", formDataRef.current);

        if (data === "ERROR") {
          throw new Error("Error: Failed to submit the data.");
        } else {
          SweetAlert("Success", "Data successfully submitted", "success");
          onChangePage("index");
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError({ error: true, message: error.message });
      } finally {
        setIsLoading(false);
      }

  }

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
          Update Data Perusahaan
        </h2>
      </div>
      <div className="mt-3">
        {isError.error && <Alert type="danger" message={isError.message} handleClose={() => setIsError({ error: false, message: "" })} />}
        <form onSubmit={handleSubmit}>
  <div className="card mb-5">
    <div className="card-header p-2">
      <h2 className="fw-bold text-center">Company Form</h2>
    </div>
    <div className="card-body p-4">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="row mt-4">
          <div className="col-lg-6">
            <Input 
              type="text" 
              forInput="prs_nama" 
              label="Company Name" 
              isRequired 
              value={formDataRef.current.prs_nama} 
              onChange={handleInputChange} 
              errorMessage={errors.prs_nama} 
            />
          </div>
          <div className="col-lg-12">
            <Input 
              type="textarea" 
              forInput="prs_alamat" 
              label="Address" 
              value={formDataRef.current.prs_alamat} 
              onChange={handleInputChange} 
              errorMessage={errors.prs_alamat} 
            />
          </div>
        </div>
      )}
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
