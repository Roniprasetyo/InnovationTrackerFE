import { useRef, useState, useEffect } from "react";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import Label from "../../part/Label";
import Icon from "../../part/Icon";

export default function MasterPerusahaanDetail({ onChangePage, withID }) {
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const formDataRef = useRef({
    prs_nama: "",
    prs_alamat: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError({ error: false, message: "" });

      try {
        const data = await UseFetch(
          API_LINK + "MasterPerusahaan/GetPerusahaanById", 
          { id: withID }
        );

        if (data === "ERROR" || !data) {
          throw new Error("Terjadi kesalahan: Gagal mengambil data perusahaan.");
        } else {
          
          formDataRef.current.prs_alamat=data[0].prs_alamat;
          formDataRef.current.prs_nama=data[0].prs_nama;
        }
      } catch (error) {
        window.scrollTo(0, 0);
        setIsError({ error: true, message: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [withID]);

  return (
    <>
      <div className="row my-3" style={{ display: "flex", alignItems: "center" }}>
        <h2 className="fw-bold" style={{ color: "rgb(0, 89, 171)", margin: "0" }}>
          <Icon
            type="Bold"
            name="angle-left"
            cssClass="btn me-1 py-0 text"
            onClick={() => onChangePage("index")}
            style={{ fontSize: "22px", cursor: "pointer", color: "rgb(0, 89, 171)" }}
          />
          Detail Data
        </h2>
      </div>
      <div className="mt-3">
        {isError.error && (
          <Alert
            type="danger"
            message={isError.message}
            handleClose={() => setIsError({ error: false, message: "" })}
          />
        )}
        <div className="card mb-5">
          <div className="card-header p-2">
            <h2 className="fw-bold text-center">COMPANY DETAIL</h2>
          </div>
          <div className="card-body p-4">
            {isLoading ? (
              <Loading />
            ) : (
              <div className="row">
                <div className="col-lg-6">
                  <Label forLabel="prsName" title="Name" data={formDataRef.current.prs_nama} />
                </div>
                <div className="col-lg-12">
                  <Label forLabel="prsAddress" title="Address" data={formDataRef.current.prs_alamat} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
