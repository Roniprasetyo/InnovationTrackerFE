import { useEffect, useRef, useState } from "react";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

export default function BerandaIndex() {
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const formDataRef = useRef({
    countTotalPermintaan: 0,
    countTerlambat: 0,
    countBatal: 0,
    countSelesai: 0,
    countMenungguAnalisa: 0,
    countBelumDibuatRAK: 0,
    countBelumDibuatPenawaran: 0,
    countDalamProsesNegosiasi: 0,
    countBelumDibuatSPK: 0,
    countDalamProsesProduksi: 0,
    countDalamProsesQC: 0,
    countDalamProsesDelivery: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(
          API_LINK + "Utilities/GetDataCountingDashboard",
          {}
        );

        if (data === "ERROR" || data.length === 0) {
          throw new Error("Terjadi kesalahan: Gagal mengambil data dashboard.");
        } else {
          formDataRef.current = { ...formDataRef.current, ...data[0] };
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <div>
        <div className="carousel slide">
          <div className="carousel-inner">
            <div className="active carousel-item">
              <img
                sizes="(max-width: 575px) 100vw, (max-width: 767px) 50vw, (max-width: 991px) 33vw, 25vw"
                loading="lazy"
                className="d-block w-100 blur-load blur-load-loaded"
                src="https://api.polytechnic.astra.ac.id:2906/operational_api/Uploads/MOB_2024626102616Web Training.jpg"
                alt="Slide 0"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container p-3">
        {/* {isError.error && (
          <div className="flex-fill ">
            <Alert
              type="danger"
              message={isError.message}
              handleClose={() => setIsError({ error: false, message: "" })}
            />
          </div>
        )} */}
        <div className="container-sm my-3">
          <div className="mb-4 color-primary text-center">
            <div className="d-flex gap-3 justify-content-center">
              <h2 className="display-3 fw-bold">WELCOME</h2>
              <div className="d-flex align-items-end mb-2">
                <h2 className="display-6 fw-medium align-items-end text-start">
                  TO ASTRATECH
                </h2>
              </div>
            </div>
            <div className="display-4 fw-medium">INNOVATION LIBRARY</div>
          </div>
        </div>
      </div>
    </>
  );
}
