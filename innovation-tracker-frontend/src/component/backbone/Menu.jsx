import { useEffect } from "react";
import Icon from "../part/Icon";
import { Link } from "react-router-dom";

let active_menu;
// let active_collapse;

const activeURL = location.protocol + "//" + location.host + location.pathname;

function checkIcon(menu) {
  let menuIcon = "angle-down";

  switch (menu) {
    case "Logout":
      menuIcon = "sign-out-alt";
      break;
    case "Beranda":
      menuIcon = "home";
      break;
  }

  return menuIcon;
}

function setActiveMenu(menu) {
  active_menu = menu;
}

// function setActiveCollapse(id) {
//   active_collapse = id;
// }

export default function Menu({ listMenu }) {
  useEffect(() => {
    if (document.getElementById("spanMenu")) {
      document.getElementById("spanMenu").innerHTML = active_menu;
      // if (active_collapse)
      //   document.getElementById(active_collapse).classList.add("show");
    }
  }, [listMenu]);

  return (
    <>
      {listMenu.map((menu, index) => {
        if (activeURL === menu["link"]) setActiveMenu(menu["head"]);
        if (!menu.isHidden) {
          return (
            <li
              key={index}
              className={`nav-item ${menu.sub.length > 0 ? "dropdown" : ""}`}
            >
              {menu.sub.length > 0 ? (
                <>
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ color: "white" }}
                  >
                    {menu.head}
                  </a>
                  <ul className="dropdown-menu">
                    {menu.sub.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <a
                          className={
                            "dropdown-item " +
                            (activeURL === subItem.link ? "active" : "")
                          }
                          href={subItem.link}
                        >
                          {subItem.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <a
                  className={
                    "nav-link " + (activeURL === menu.link ? "active fw-bold" : "")
                  }
                  style={{ color: "white" }}
                  href={menu.link}
                >
                  {menu.head}
                </a>
              )}
            </li>
          );
        }
      })}
    </>
  );
}
