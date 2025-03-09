import { useState } from "react";
import QualityControlProjectIndex from "./Index";
import QualityControlProjectAdd from "./Add";

export default function QualityControlProject() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <QualityControlProjectIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <QualityControlProjectAdd onChangePage={handleSetPageMode} />;
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
