import { useState } from "react";
import MasterTypeIndex from "./Index";
import MasterTypeAdd from "./Add";

export default function MasterType() {
  const [pageMode, setPageMode] = useState("index");

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterTypeIndex onChangePage={handleSetPageMode} />;

        case "add":
                return <MasterTypeAdd onChangePage={handleSetPageMode} />;
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
