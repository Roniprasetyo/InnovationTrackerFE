import { useState } from "react";
import MasterFacilitatorIndex from "./Index";
import MasterFacilitatorAdd from "./Add";
import MasterFacilitatorDetail from "./Detail";
import MasterFacilitatorEdit from "./Edit";

export default function MasterFacilitator() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterFacilitatorIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterFacilitatorAdd onChangePage={handleSetPageMode} />;
      case "edit":
        return (
          <MasterFacilitatorEdit onChangePage={handleSetPageMode} withID={dataID} />
        );
      case "detail":
        return (
          <MasterFacilitatorDetail
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
