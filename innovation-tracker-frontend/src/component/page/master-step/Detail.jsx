import { useRef, useState, useEffect } from "react";
import { API_LINK } from "../../util/Constants";
import UseFetch from "../../util/UseFetch";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";
import Label from "../../part/Label";
import Icon from "../../part/Icon";

const listTypeSetting = [
  { Value: "Jenis Improvement", Text: "Jenis Improvement" },
  { Value: "Kategori Keilmuan", Text: "Kategori Keilmuan" },
];

export default function MasterStepDetail({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  const formDataRef = useRef({
    steId: "",
    steName: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError((prevError) => ({ ...prevError, error: false }));

      try {
        const data = await UseFetch(API_LINK + "MasterStep/GetStepById", {
          id: withID,
        });

        if (data === "ERROR" || data.length === 0) {
          throw new Error(
            "Terjadi kesalahan: Gagal mengambil data step."
          );
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

  return (
    <>
      <div
        className="row my-3"
        style={{ display: "flex", alignItems: "center" }}
      >
        <h2
          className="fw-bold"
          style={{ color: "rgb(0, 89, 171)", margin: "0" }}
        >
          <Icon
            type="Bold"
            name="angle-left"
            cssClass="btn me-1 py-0 text"
            onClick={() => onChangePage("index")}
            style={{
              fontSize: "22px",
              cursor: "pointer",
              color: "rgb(0, 89, 171)",
            }}
          />
          Detail Data
        </h2>
      </div>
      <div className="mt-3">
        {isError.error && (
          <div className="flex-fill ">
            <Alert
              type="danger"
              message={isError.message}
              handleClose={() => setIsError({ error: false, message: "" })}
            />
          </div>
        )}
        <div className="card mb-5">
          <div className="card-header p-2">
            <h2 className="fw-bold text-center">Setting Detail</h2>
          </div>
          <div className="card-body p-4">
            {isLoading ? (
              <Loading />
            ) : (
              <div className="row">
                <div className="col-lg-6">
                  <Label
                    forLabel="setName"
                    title="Name"
                    data={formDataRef.current.steName}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
