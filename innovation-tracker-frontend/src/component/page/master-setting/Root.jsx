import { useState } from "react";
import MasterSettingIndex from "./Index";
import MasterSettingAdd from "./Add";

export default function MasterSetting() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterSettingIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterSettingAdd onChangePage={handleSetPageMode} />;
    }
  }

  function handleSetPageMode(mode) {
    setPageMode(mode);
  }

  function handleSetPageMode(mode, withID) {
    setDataID(withID);
    setPageMode(mode);
  }

  return <div className="container">{getPageMode()}</div>;
}
