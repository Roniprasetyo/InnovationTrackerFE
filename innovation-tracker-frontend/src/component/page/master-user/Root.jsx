import { useState } from "react";
import MasterUserIndex from "./Index";
import MasterUserAdd from "./Add";
import MasterUserDetail from "./Detail";
import MasterUserEdit from "./Edit";

export default function MasterUser() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterUserIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterUserAdd onChangePage={handleSetPageMode} />;
      case "edit":
        return (
          <MasterUserEdit onChangePage={handleSetPageMode} withID={dataID} />
        );
      case "detail":
        return (
          <MasterUserDetail
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
