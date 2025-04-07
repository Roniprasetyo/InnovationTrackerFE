import { useState } from "react";
import BusinessPerformaceImprovementIndex from "./Index";
import BusinessPerformaceImprovementAdd from "./Add";
import BusinessPerformaceImprovementEdit from "./Edit";
import BusinessPerformaceImprovementDetail from "./Detail";

export default function BusinessPerformaceImprovement() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <BusinessPerformaceImprovementIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <BusinessPerformaceImprovementAdd onChangePage={handleSetPageMode} />;
      case "edit":
        return (
          <BusinessPerformaceImprovementEdit
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "detail":
        return (
          <BusinessPerformaceImprovementDetail
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