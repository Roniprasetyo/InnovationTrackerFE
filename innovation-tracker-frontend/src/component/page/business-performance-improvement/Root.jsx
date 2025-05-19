import { useState } from "react";
import BusinessPerformanceImprovementIndex from "./Index";
import BusinessPerformanceImprovementAdd from "./Add";
import BusinessPerformanceImprovementEdit from "./Edit";
import BusinessPerformanceImprovementDetail from "./Detail";
import BussinessPerformanceImprovementEditFillStep from "./EditFillTheStep";
import BussinessPerformanceImprovementFillStep from "./FillStep";

export default function BusinessPerformanceImprovement() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return (
          <BusinessPerformanceImprovementIndex
            onChangePage={handleSetPageMode}
          />
        );
      case "add":
        return (
          <BusinessPerformanceImprovementAdd onChangePage={handleSetPageMode} />
        );
      case "edit":
        return (
          <BusinessPerformanceImprovementEdit
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "editfts":
        return (
          <BussinessPerformanceImprovementEditFillStep
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "fillthestep":
        return (
          <BussinessPerformanceImprovementFillStep
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "detail":
        return (
          <BusinessPerformanceImprovementDetail
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
