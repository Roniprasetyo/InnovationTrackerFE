import { useState } from "react";
import MasterTypeIndex from "./Index";
import MasterTypeAdd from "./Add";
import MasterTypeEdit from "./Edit";
import MasterTypeDetail from "./Detail";

export default function MasterType() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterTypeIndex onChangePage={handleSetPageMode} />;
      case "add":
        return <MasterTypeAdd onChangePage={handleSetPageMode} />;
      case "edit":
        return (
          <MasterTypeEdit onChangePage={handleSetPageMode} withID={dataID} />
            );

      case "detail":
                return (
                  <MasterTypeDetail
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
