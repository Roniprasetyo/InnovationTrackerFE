import { useState } from "react";
import ValueChainInnovationIndex from "./Index";
import ValueChainInnovationAdd from "./Add";
import ValueChainInnovationEdit from "./Edit";
import ValueChainInnovationDetail from "./Detail";
import ValueChainInnovationFillStep from "./FillStep";
import ValueChainInnovationEditFillStep from "./EditFillTheStep";

export default function ValueChainInnovation() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <ValueChainInnovationIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <ValueChainInnovationAdd onChangePage={handleSetPageMode} />;
      case "edit":
        return (
          <ValueChainInnovationEdit
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "editfts":
        return (
          <ValueChainInnovationEditFillStep
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "fillthestep":
        return (
          <ValueChainInnovationFillStep
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "detail":
        return (
          <ValueChainInnovationDetail
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
