import { useRef, useState } from "react";
import { object, string } from "yup";
import Cookies from "js-cookie";
import {
  API_LINK,
  APPLICATION_ID,
  APPLICATION_NAME,
  ROOT_LINK,
} from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import { encryptId } from "../../util/Encryptor";
import logo from "../../../assets/Logo-blue.png";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import Modal from "../../part/Modal";
import Building from "../../../assets/elements/bangunan.png";

export default function Login() {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [listRole, setListRole] = useState([]);

  const formDataRef = useRef({
    username: "",
    password: "",
  });

  const modalRef = useRef();

  const userSchema = object({
    username: string().max(50, "maximum 50 characters").required("required"),
    password: string().required("required"),
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

  const handleAdd = async (e) => {
    e.preventDefault();

    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError((prevError) => {
        return { ...prevError, error: false };
      });
      setErrors({});

      try {
        const data = await UseFetch(
          API_LINK + "Utilities/Login",
          formDataRef.current
        );

        if (data === "ERROR") throw new Error("Error: Failed to authenticate.");
        else if (data.Status && data.Status === "LOGIN FAILED")
          throw new Error("Wrong username or password.");
        else {
          setListRole(data);
          modalRef.current.open();
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

  async function handleLoginWithRole(role, nama, peran, npk) {
    try {
      const ipAddress = await UseFetch(
        "https://api.ipify.org/?format=json",
        {},
        "GET"
      );

      if (ipAddress === "ERROR")
        throw new Error("Error: Failed to get IP address.");
      else {
        const token = await UseFetch(API_LINK + "Utilities/CreateJWTToken", {
          username: formDataRef.current.username,
          role: role,
          nama: nama,
        });

        if (token === "ERROR")
          throw new Error("Error: Filed to get authentication token.");
        else {
          localStorage.setItem("jwtToken", token.Token);

          const data = await UseFetch(API_LINK + "Utilities/CreateLogLogin", {
            username: formDataRef.current.username,
            role: role,
            ipAddress: ipAddress.ip,
            agent: navigator.userAgent,
            application: APPLICATION_ID,
          });
          console.log("sampe sini");
          if (data === "ERROR")
            throw new Error("Error: Failed to select role.");
          else {
            const userInfo = {
              username: formDataRef.current.username,
              role: role,
              nama: nama,
              peran: peran,
              npk: npk,
              lastLogin: data[1]
                ? data[1].lastLogin
                : new Date().toISOString().split("T")[0] +
                  " " +
                  new Date().toISOString().split("T")[1],
            };

            let user = encryptId(JSON.stringify(userInfo));
            Cookies.set("activeUser", user, { expires: 1 });
            window.location.href = ROOT_LINK;
          }
        }
      }
    } catch (error) {
      window.scrollTo(0, 0);
      modalRef.current.close();
      setIsError((prevError) => ({
        ...prevError,
        error: true,
        message: error.message,
      }));
    }
  }

  if (Cookies.get("activeUser")) window.location.href = "/";
  else {
    return (
      <div
        style={{
          background:
            "linear-gradient(to bottom, #2654a1, #2654a1, #4989c2, #42abdc)",
          height: "100vh",
          width: "100%",
        }}
      >
        {isLoading && <Loading />}
        {isError.error && (
          <div className="flex-fill ">
            <Alert
              type="danger"
              message={isError.message}
              handleClose={() => setIsError({ error: false, message: "" })}
            />
          </div>
        )}
        <Modal title="Pilih Peran" ref={modalRef} size="small">
          <div className="list-group">
            {listRole.map((value, index) => {
              return (
                <button
                  key={index}
                  type="button"
                  className="list-group-item list-group-item-action"
                  aria-current="true"
                  onClick={() =>
                    handleLoginWithRole(value.RoleID, value.Nama, value.Role, value.Npk)
                  }
                >
                  Login sebagai {value.Role}
                </button>
              );
            })}
          </div>
        </Modal>
        <img
          sizes="(max-width: 575px) 100vw, (max-width: 767px) 50vw, (max-width: 991px) 33vw, 25vw"
          loading="lazy"
          className="d-block w-100 rounded blur-load blur-load-loaded"
          src={Building}
          alt="Building"
          style={{
            position: "absolute",
            bottom: "0",
            width: "100%",
            left: "0",
            zIndex: 0,
          }}
        />
        <div
          className="container-fluid d-flex justify-content-center align-items-center"
          style={{ height: "70vh" }}
        >
          <div
            className="card w-50"
            style={{ minWidth: "360px", maxWidth: "600px" }}
          >
            <div className="card-body p-4 text-center">
              <img src={logo} alt="Logo AstraTech" className="w-75 px-4 py-4" />
              <p className="lead fw-medium fs-5 text-nowrap">
                {APPLICATION_NAME.toUpperCase()}
              </p>
              <form onSubmit={handleAdd}>
                <div className="py-2 px-1">
                  <Input
                    type="text"
                    forInput="username"
                    placeholder="Username"
                    textAlign="center"
                    isRequired
                    value={formDataRef.current.username}
                    onChange={handleInputChange}
                    errorMessage={errors.username}
                  />
                </div>
                <div className="py-2 px-1">
                  <Input
                    type="password"
                    forInput="password"
                    placeholder="Password"
                    textAlign="center"
                    isRequired
                    value={formDataRef.current.password}
                    onChange={handleInputChange}
                    errorMessage={errors.password}
                  />
                </div>
                <Button
                  classType="primary my-3 w-100 fw-bold"
                  type="submit"
                  label="LOGIN"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
