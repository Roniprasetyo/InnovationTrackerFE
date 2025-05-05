import { useState } from "react";
import ListKriteriaIndex from "./Index";
import ListKriteriaAdd from "./Add";
import ListKriteriaDetail from "./Detail";
import ListKriteriaEdit from "./Edit";

export default function ListKriteria() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <ListKriteriaIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <ListKriteriaAdd onChangePage={handleSetPageMode} />;
      case "edit":
        return (
          <ListKriteriaEdit onChangePage={handleSetPageMode} withID={dataID} />
        );
      case "detail":
        return (
          <ListKriteriaDetail
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