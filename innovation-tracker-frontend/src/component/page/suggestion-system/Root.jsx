import { useState } from "react";
import SuggestionSytemIndex from "./Index";
import SuggestionSystemAdd from "./Add";
import SuggestionSystemEdit from "./Edit";
import SuggestionSystemDetail from "./Detail";
import Scoring from "./Scoring";

export default function SuggestionSystem() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return (
          <SuggestionSytemIndex
            onChangePage={handleSetPageMode}
            onScoring={handleScoring}
            onEditScoring={handleEditScoring}
          />
        );
      case "add":
        return <SuggestionSystemAdd onChangePage={handleSetPageMode} />;
      case "edit":
        return <SuggestionSystemEdit onChangePage={handleSetPageMode} withID={dataID} />;
      case "detail":
        // console.log("ini Root: ", dataID);
        return (
          <SuggestionSystemDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
    }
  }

  function handleScoring(_, id) {
    const scoringUrl = `/scoring?id=${id}`;
    // setDataID(id);
    window.open(scoringUrl, "_blank");
  }

  function handleEditScoring(_, id) {
    console.log("TES36");
    const scoringUrl = `/editScoring?id=${id}`;
    setDataID(id);
    window.open(scoringUrl, "_blank");
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
