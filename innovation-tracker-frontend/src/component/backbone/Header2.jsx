import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { decryptId } from "../util/Encryptor";
import { API_LINK, APPLICATION_ID } from "../util/Constants";
import { formatDate } from "../util/Formatting";
import logo from "../../assets/IMG_Logo.png";
import UseFetch from "../util/UseFetch";
import Icon from "../part/Icon";

export default function Header2({ displayName, roleName }) {
  const [countNotifikasi, setCountNotifikasi] = useState("");

  function handleGetLastLogin() {
    return formatDate(
      JSON.parse(decryptId(Cookies.get("activeUser"))).lastLogin
    );
  }

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
        style={{ position: "sticky", top: "0px", zIndex: 1000 }}
      >
        <div
          className="nav-mobile"
          style={{ backgroundColor: "rgb(0, 89, 171)" }}
        >
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid px-5">
              <div className="navbar-brand">
                <img
                  sizes="(max-width: 575px) 100vw, (max-width: 767px) 50vw, (max-width: 991px) 33vw, 25vw"
                  loading="lazy"
                  src={logo}
                  className="blur-load"
                  alt="Logo Politeknik Astra"
                  style={{ height: "45px" }}
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
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse justify-content-center"
                id="navbarNav"
              >
                <ul className="navbar-nav">
                  <li className="nav-item active">
                    <a className="nav-link active" href="/">
                      HOME
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/training">
                      EVENTS
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/instructor">
                      EXPERT
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/product">
                      PRODUCT &amp; FACILITY
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/article">
                      ARTICLE
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/gallery">
                      GALLERY
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/contact">
                      CONTACT
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/faq">
                      TUTORIAL
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/login-participant">
                      LOGIN
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <div className="nav-dekstop">
          <div id="toogleMenu" style={{ backgroundColor: "rgb(0, 89, 171)" }}>
            <nav className="navbar navbar-expand-lg">
              <div className="container d-flex justify-content-between align-items-center">
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  aria-controls="navbarNav"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div
                  className="collapse navbar-collapse justify-content-center"
                  id="navbarNav"
                >
                  <ul className="navbar-nav">
                    <li className="nav-item active">
                      <a className="nav-link text-white active" href="/">
                        HOME
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link text-white" href="/training">
                        EVENTS
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link text-white" href="/instructor">
                        EXPERT
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link text-white" href="/product">
                        PRODUCT &amp; FACILITY
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link text-white" href="/article">
                        ARTICLE
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link text-white" href="/gallery">
                        GALLERY
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link text-white" href="/contact">
                        CONTACT
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link text-white" href="/faq">
                        TUTORIAL
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link text-white"
                        href="/login-participant"
                      >
                        LOGIN
                      </a>
                    </li>
                  </ul>
                </div>
                <button
                  aria-label="Search"
                  className="btn"
                  style={{ marginLeft: "10px" }}
                >
                  <i className="fi fi-br-search"></i>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
