import { lazy } from "react";

const Beranda = lazy(() => import("../page/beranda/Root"));
const Login = lazy(() => import("../page/login/Index"));
const Notifikasi = lazy(() => import("../page/notifikasi/Root"));
const Submission = lazy(() => import("../page/submission/Index"));
const QualityControlProject = lazy(() => import("../page/quality-control-project/Root"));
const QualityControlCircle = lazy(() => import("../page/quality-control-circle/Root"));
const SuggestionSystem = lazy(() => import("../page/suggestion-system/Root"));
const ValueChainInnovation = lazy(() => import("../page/value-chain-innovation/Root"));
const BusinessPerformaceImprovement = lazy(() => import("../page/business-performance-improvement/Root"));
const MasterSetting = lazy(() => import("../page/master-setting/Root"));
const MasterUser = lazy(() => import("../page/master-user/Root"));
const MasterFacilitator = lazy(() => import("../page/master-facilitator/Root"));
const MasterPeriod = lazy(() => import("../page/master-period/Root"));
const MasterPerusahaan = lazy(() => import("../page/master-perusahaan/Root"));
const MasterStep = lazy(() => import("../page/master-step/Root"));

const routeList = [
  {
    path: "/",
    element: <Beranda />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/submission",
    element: <Submission />,
  },
  {
    path: "/submission/ss",
    element: <SuggestionSystem />,
  },
  {
    path: "/submission/qcp",
    element: <QualityControlProject />,
  },
  {
    path: "/submission/qcc",
    element: <QualityControlCircle />,
  },
  {
    path: "/submission/vci",
    element: <ValueChainInnovation />,
  },
  {
    path: "/submission/bpi",
    element: <BusinessPerformaceImprovement />,
  },
  {
    path: "/setting",
    element: <MasterSetting />,
  },
  {
    path: "/facilitator",
    element: <MasterFacilitator />,
  },
  {
    path: "/company",
    element: <MasterPerusahaan />,
  },
  {
    path: "/user",
    element: <MasterUser />,
  },
  {
    path: "/notifikasi",
    element: <Notifikasi />,
  },
  {
    path: "/period",
    element: <MasterPeriod />,
  },
  {
    path: "/step",
    element: <MasterStep />,
  },
];

export default routeList;
