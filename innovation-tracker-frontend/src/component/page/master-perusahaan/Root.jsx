import { useState } from "react";
import MasterPerusahaanIndex from "./Index";
import MasterPerusahaanAdd from "./Add";
import MasterPerusahaanDetail from "./Detail";
import MasterPerusahaanEdit from "./Edit";

export default function MasterPerusahaan() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterPerusahaanIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterPerusahaanAdd onChangePage={handleSetPageMode} />;
      case "edit":
        return (
          <MasterPerusahaanEdit onChangePage={handleSetPageMode} withID={dataID} />
        );
      case "detail":
        return (
          <MasterPerusahaanDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
    }
  }

  function handleSetPageMode(mode) {
    setPageMode(mode);
  }

  function handleSetPageMode(mode, withID) {
    setDataID(withID);
    setPageMode(mode);
  }

  return <div className="container min-vh-100">{getPageMode()}</div>;
}
