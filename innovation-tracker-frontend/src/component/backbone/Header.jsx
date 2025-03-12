import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { decryptId } from "../util/Encryptor";
import { API_LINK, APPLICATION_ID } from "../util/Constants";
import { formatDate } from "../util/Formatting";
import logo from "../../assets/IMG_Logo.png";
import UseFetch from "../util/UseFetch";
import Menu from "./Menu";
import Icon from "../part/Icon";

export default function Header({ displayName, roleName, listMenu }) {
  const [countNotifikasi, setCountNotifikasi] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const activeUser = Cookies.get("activeUser");
  useEffect(() => {
    if (activeUser) {
      setIsLoggedIn(true);
    }
  }, [activeUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await UseFetch(
          API_LINK + "Utilities/GetDataCountingNotifikasi",
          { application: APPLICATION_ID }
        );

        if (data === "ERROR") {
          throw new Error();
        } else {
          setCountNotifikasi(data[0].counting);
        }
      } catch {
        setCountNotifikasi("");
      }
    };

    fetchData();
  }, []);

  return (
    <header role="banner">
      <div
        className="bg-p"
        style={{ position: "sticky", top: "0px", zIndex: "1000" }}
      >
        <div
          className="nav-mobile"
          style={{ backgroundColor: "rgb(0, 89, 171)" }}
        >
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid px-5">
              <div className="navbar-brand">
                <img
                  sizes="(max-width: 575px) 100vw, (max-width: 767px) 50vw, (max-width: 991px) 33vw, 28vw"
                  loading="lazy"
                  src={logo}
                  className="blur-load"
                  alt="Logo Politeknik Astra"
                  style={{ height: "48px" }}
                />
              </div>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
                style={{ borderColor: "white" }}
              >
                <span
                  className="navbar-toggler-icon"
                  style={{ filter: "invert(1)" }}
                ></span>
              </button>
              <div
                className="collapse navbar-collapse justify-content-center"
                id="navbarNav"
              >
                <ul className="navbar-nav">
                  <Menu listMenu={listMenu} />
                </ul>
                <div className="my-3">
                  <div className="flex-fill ">
                    <div className="input-group">
                      <input
                        id="search"
                        name="search"
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        style={{ borderRadius: "16px 0px 0px 16px" }}
                      />
                      <button
                        className="btn input-group-text bg-white border-0 end-0 me-1"
                        style={{ borderRadius: "0px 16px 16px 0px" }}
                      >
                        <Icon name="search" cssClass="" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center">
                    <div className="">
                      <div className="dropdown">
                        <a
                          href="#"
                          id="profileDropdown"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i
                            className="fi fi-rr-circle-user"
                            style={{ color: "white", fontSize: "28px" }}
                          ></i>
                        </a>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="profileDropdown"
                        >
                          <li>
                            <a className="dropdown-item" href="/profile">
                              PROFILE
                            </a>
                          </li>
                          <li className="m-0">
                            <a className="dropdown-item" href="/notification">
                              NOTIFICATION
                              <span
                                className="badge rounded-pill bg-danger ms-1"
                                style={{
                                  fontSize: ".8em",
                                }}
                              >
                                {countNotifikasi}
                              </span>
                            </a>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <a
                              className="dropdown-item text-danger"
                              href="/logout"
                            >
                              LOGOUT
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="">
                      <p className="text-start text-white ms-3 mt-2">
                        {displayName || "John Doe"} ({roleName || "Admin"})
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
        <div className="nav-dekstop">
          <div id="toogleMenu" style={{ backgroundColor: "rgb(0, 89, 171)" }}>
            <nav className="navbar navbar-expand-lg">
              <div className="container d-flex justify-content-between align-items-center">
                <div className="navbar-brand">
                  <img
                    sizes="(max-width: 575px) 100vw, (max-width: 767px) 50vw, (max-width: 991px) 33vw, 25vw"
                    loading="lazy"
                    src={logo}
                    className="blur-load"
                    alt="Logo Politeknik Astra"
                    style={{ height: "45px", marginLeft: "2rem" }}
                  />
                </div>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  aria-controls="navbarNav"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                  style={{ borderColor: "white" }}
                >
                  <span
                    className="navbar-toggler-icon"
                    style={{ filter: "invert(1)" }}
                  ></span>
                </button>
                <div
                  className="collapse navbar-collapse justify-content-end"
                  id="navbarNav"
                >
                  <ul className="navbar-nav">
                    <Menu listMenu={listMenu} />
                  </ul>
                </div>
                <div className="ms-4">
                  <div className="flex-fill ">
                    <div className="input-group">
                      <input
                        id="search"
                        name="search"
                        type="text"
                        className="form-control"
                        placeholder="Search..."
                        style={{ borderRadius: "16px 0px 0px 16px" }}
                      />
                      <button
                        className="btn input-group-text bg-white border-0 end-0 me-1"
                        style={{ borderRadius: "0px 16px 16px 0px" }}
                      >
                        <Icon name="search" cssClass="" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="ms-3" style={{ marginRight: "2rem" }}>
                  {isLoggedIn ? (
                    <div className="dropdown mt-1">
                      <a
                        href="#"
                        id="profileDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ textDecoration: "none" }}
                      >
                        <i
                          className="fi fi-rr-circle-user"
                          style={{ color: "white", fontSize: "32px" }}
                        ></i>
                      </a>
                      <ul
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby="profileDropdown"
                      >
                        <li>
                          <a className="dropdown-item" href="/profile">
                            PROFILE
                          </a>
                        </li>
                        <li className="m-0">
                          <a className="dropdown-item" href="/notification">
                            NOTIFICATION
                            <span
                              className="badge rounded-pill bg-danger ms-1"
                              style={{
                                fontSize: ".8em",
                              }}
                            >
                              {countNotifikasi}
                            </span>
                          </a>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <a
                            className="dropdown-item text-danger"
                            href="/logout"
                          >
                            LOGOUT
                          </a>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <a className="btn bg-white rounded-5 fw-bold" href="/login">
                      LOGIN
                    </a>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
