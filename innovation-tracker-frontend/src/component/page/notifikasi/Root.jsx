import { useState } from "react";
import NotifikasiIndex from "./Index";
import SuggestionSystemDetail from "../suggestion-system/Detail";
import QualityControlCircleDetail from "../quality-control-circle/Detail";
import QualityControlProjectDetail from "../quality-control-project/Detail";
import BusinessPerformanceImprovementDetail from "../business-performance-improvement/Detail";
import ValueChainInnovationDetail from "../value-chain-innovation/Detail";

export default function Notifikasi() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function handleSetPageMode(mode) {
    setPageMode(mode);
  }

  function handleSetPageMode(mode, withID = null) {
    setDataID(withID);
    setPageMode(mode);
  }

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <NotifikasiIndex
          onChangePage={handleSetPageMode}
        />;
      case "detailSS":
        return (
          <SuggestionSystemDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "detailQCC":
        return (
          <QualityControlCircleDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "detailQCP":
        return (
          <QualityControlProjectDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "detailBPI":
        return (
          <BusinessPerformanceImprovementDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "detailVCI":
        return (
          <ValueChainInnovationDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      default:
        return <div>Halaman tidak ditemukan</div>;
    }
  }

  return <div>{getPageMode()}</div>;
}
