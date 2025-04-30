import { useState } from "react";
import MasterKriteriaNilaiIndex from "./Index";
import MasterKriteriaNilaiAdd from "./Add";
import MasterKriteriaNilaiDetail from "./Detail";
import MasterKriteriaNilaiEdit from "./Edit";

export default function MasterKriteriaNilai() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterKriteriaNilaiIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterKriteriaNilaiAdd onChangePage={handleSetPageMode} />;
      case "edit":
        return (
          <MasterKriteriaNilaiEdit onChangePage={handleSetPageMode} withID={dataID} />
        );
      case "detail":
        return (
          <MasterKriteriaNilaiDetail
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