import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Cookies from "js-cookie";
import { decryptId } from "./component/util/Encryptor";
import { BASE_ROUTE, ROOT_LINK } from "./component/util/Constants";
import CreateMenu from "./component/util/CreateMenu";
import CreateRoute from "./component/util/CreateRoute.jsx";

import Container from "./component/backbone/Container";
import Header from "./component/backbone/Header";
import SideBar from "./component/backbone/SideBar";
import Footer from "./component/backbone/Footer.jsx";

import Login from "./component/page/login/Index";
import Logout from "./component/page/logout/Index";
import NotFound from "./component/page/not-found/Index";

export default function App() {
  const [listMenu, setListMenu] = useState([]);
  const [listRoute, setListRoute] = useState([]);
  const isLoginPage = window.location.pathname.includes("login");
  const isLogoutPage = window.location.pathname.includes("logout");
  const cookie = Cookies.get("activeUser");
  let userInfo = "";
  if (isLogoutPage) return <Logout />;
  else if (!cookie) return <Login />;
  else {
    if (cookie) userInfo = JSON.parse(decryptId(cookie));

    useEffect(() => {
      const getMenu = async () => {
        const menu = await CreateMenu(userInfo.role || "ROL01");
        const route = CreateRoute.filter((routeItem) => {
          const pathExistsInMenu = menu.some((menuItem) => {
            if (menuItem.link.replace(ROOT_LINK, "") === routeItem.path) {
              return true;
            }
            if (menuItem.sub && menuItem.sub.length > 0) {
              return menuItem.sub.some(
                (subItem) =>
                  subItem.link.replace(ROOT_LINK, "") === routeItem.path
              );
            }
            return false;
          });

          return pathExistsInMenu;
        });

        route.push(
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/*",
            element: <NotFound />,
          }
        );

        setListMenu(menu);
        setListRoute(route);
      };

      getMenu();
    }, []);

    return (
      <>
        {listRoute.length > 0 && (
          <>
            {!isLoginPage && (
              <Header
                displayName={userInfo.nama}
                roleName={userInfo.peran}
                listMenu={listMenu}
              />
            )}

            <main role="main">
              <RouterProvider
                router={createBrowserRouter(listRoute, {
                  basename: BASE_ROUTE,
                })}
              />
            </main>
            {!isLoginPage && <Footer />}
          </>
        )}
      </>
    );
  }
}
