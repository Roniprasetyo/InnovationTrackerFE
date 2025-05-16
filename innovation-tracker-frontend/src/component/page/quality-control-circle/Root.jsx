import { useState } from "react";
import QualityControlCircleIndex from "./Index";
import QualityControlCircleAdd from "./Add";
import QualityControlCircleEdit from "./Edit";
import QualityControlCircleDetail from "./Detail";
import QualityControlCircleFillStep from "./FillStep";

export default function QualityControlCircle() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <QualityControlCircleIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <QualityControlCircleAdd onChangePage={handleSetPageMode} />;
      case "edit":
        return (
          <QualityControlCircleEdit
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "fillthestep":
        return (
          <QualityControlCircleFillStep
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "detail":
        return (
          <QualityControlCircleDetail
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
