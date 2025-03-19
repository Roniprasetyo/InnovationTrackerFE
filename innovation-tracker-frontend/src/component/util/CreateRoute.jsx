import { lazy } from "react";

const Beranda = lazy(() => import("../page/beranda/Root"));
const Login = lazy(() => import("../page/login/Index"));
const Notifikasi = lazy(() => import("../page/notifikasi/Root"));
const Submission = lazy(() => import("../page/submission/Index"));
const QualityControlProject = lazy(() => import("../page/quality-control-project/Root"));
const MasterSetting = lazy(() => import("../page/master-setting/Root"));
const MasterPelanggan = lazy(() => import("../page/master-pelanggan/Root"));
const MasterProduk = lazy(() => import("../page/master-produk/Root"));
const MasterProses = lazy(() => import("../page/master-proses/Root"));
const MasterKursProses = lazy(() => import("../page/master-kurs-proses/Root"));
const MasterAlatMesin = lazy(() => import("../page/master-alat-mesin/Root"));
const MasterOperator = lazy(() => import("../page/master-operator/Root"));
const PermintaanPelanggan = lazy(() =>
  import("../page/permintaan-pelanggan/Root")
);
const RencanaAnggaranKegiatan = lazy(() =>
  import("../page/rencana-anggaran-kegiatan/Root")
);
const SuratPenawaran = lazy(() => import("../page/surat-penawaran/Root"));
const SuratPerintahKerja = lazy(() =>
  import("../page/surat-perintah-kerja/Root")
);
const MasterPeriod = lazy(() => import("../page/master-period/Root"));
const ValueChainInnovation = lazy(() => import("../page/value-chain-innovation/Root"));

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
    path: "/submission/qcp",
    element: <QualityControlProject />,
  },
  {
    path: "/setting",
    element: <MasterSetting />,
  },
  {
    path: "/notifikasi",
    element: <Notifikasi />,
  },
  {
    path: "/master_pelanggan",
    element: <MasterPelanggan />,
  },
  {
    path: "/master_produk",
    element: <MasterProduk />,
  },
  {
    path: "/master_proses",
    element: <MasterProses />,
  },
  {
    path: "/master_kurs_proses",
    element: <MasterKursProses />,
  },
  {
    path: "/master_alat_mesin",
    element: <MasterAlatMesin />,
  },
  {
    path: "/master_operator",
    element: <MasterOperator />,
  },
  {
    path: "/permintaan_pelanggan",
    element: <PermintaanPelanggan />,
  },
  {
    path: "/rencana_anggaran_kegiatan",
    element: <RencanaAnggaranKegiatan />,
  },
  {
    path: "/surat_penawaran",
    element: <SuratPenawaran />,
  },
  {
    path: "/surat_perintah_kerja",
    element: <SuratPerintahKerja />,
  },
  {
    path: "/period",
    element: <MasterPeriod />,
  },
  {
    path: "/submission/vci",
    element: <ValueChainInnovation />,
  }
];

export default routeList;
