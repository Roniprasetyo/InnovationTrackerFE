import { useState } from "react";
import QualityControlProjectIndex from "./Index";
import QualityControlProjectAdd from "./Add";
import QualityControlProjectEdit from "./Edit";
import QualityControlProjectDetail from "./Detail";

export default function QualityControlProject() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <QualityControlProjectIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <QualityControlProjectAdd onChangePage={handleSetPageMode} />;
      case "edit":
        return (
          <QualityControlProjectEdit
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "detail":
        return (
          <QualityControlProjectDetail
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

  return <div className="container">{getPageMode()}</div>;
}
