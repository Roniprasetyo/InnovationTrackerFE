import { useState } from "react";
import SuggestionSytemIndex from "./Index";
import SuggestionSystemAdd from "./Add";
import SuggestionSystemEdit from "./Edit";
import SuggestionSystemDetail from "./Detail";
import Scoring from "./Scoring";
import CryptoJS from "crypto-js";

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
        return (
          <SuggestionSystemEdit
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "detail":
        return (
          <SuggestionSystemDetail 
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
      case "edit":
        return<SuggestionSystemEdit
        onChangePage={handleSetPageMode} withID={dataID}/>
    }
  }

  function generateRandomString(length) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  function obfuscateId(id) {
    const randomPrefix = generateRandomString(5); // acak 5 karakter
    const base64Id = btoa(id.toString());
    return `${randomPrefix}.${base64Id}`;
  }

  function handleScoring(_, id) {
    const obfuscatedId = obfuscateId(id);
    const scoringUrl = `/scoring?id=${encodeURIComponent(obfuscatedId)}`;
    window.open(scoringUrl, "_blank");
  }

  function handleEditScoring(_, id) {
    const obfuscatedId = obfuscateId(id);
    const scoringUrl = `/editScoring?id=${encodeURIComponent(obfuscatedId)}`;
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
