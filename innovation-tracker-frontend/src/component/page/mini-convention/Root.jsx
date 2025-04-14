import { useState } from "react";
import MiniConventionIndex from "./Index";
import MiniConventionAdd from "./Add";
import MiniConventionDetail from "./Detail";
import MiniConventionEdit from "./Edit";
import MiniConventionScoring from "./Scoring";

export default function MiniConvention() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MiniConventionIndex onChangePage={handleSetPageMode} onScoring={handleScoring}/>;
      case "add":
        return <MiniConventionAdd onChangePage={handleSetPageMode} />;
      case "edit":
        return (
          <MiniConventionEdit onChangePage={handleSetPageMode} withID={dataID} />
        );
      case "detail":
        return (
          <MiniConventionDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      // case "scoring":
      //   return (
      //     <MiniConventionScoring
      //       onChangePage={handleSetPageMode}
      //       withID={dataID}
      //     />
      //   );
    }
  }

  function handleScoring(_, id) {
    const scoringUrl = `/scoring?id=${id}`;
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
