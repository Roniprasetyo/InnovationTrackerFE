import { useState } from "react";
import MasterStepIndex from "./Index";
import MasterStepAdd from "./Add";
import MasterStepDetail from "./Detail";
import MasterStepEdit from "./Edit";

export default function MasterStep() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterStepIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterStepAdd onChangePage={handleSetPageMode} />;
      case "edit":
        return (
          <MasterStepEdit onChangePage={handleSetPageMode} withID={dataID} />
        );
      case "detail":
        return (
          <MasterStepDetail
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
