export default function Footer() {
  return (
    <footer role="contentinfo">
      <footer>
        <div className="footer" style={{ backgroundColor: " rgb(0, 89, 171)" }}>
          <div className="container">
            <div className="row" style={{ color: "white" }}>
              <div
                className="col-lg-4"
                style={{
                  padding: "20px 40px",
                  textAlign: "left",
                  fontSize: "15px",
                }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    marginBottom: "15px",
                    fontSize: "18px",
                  }}
                >
                  ASTRA POLYTECHNIC
                </p>
                <p>
                  <b>Cikarang Campus :</b>
                  <br />
                  Jl. Gaharu Blok F-3 Delta Silicon 2 Lippo Cikarang, Kel.
                  Cibatu, Kec. Cikarang Selatan, Bekasi, West Java 17530
                </p>
                <p>
                  <b>Sunter Campus : </b>
                  <br />
                  PT Astra International Tbk. Complex, Building B, Jl. Gaya
                  Motor Raya No. 8, Sunter II, Jakarta 14330
                </p>
              </div>
              <div
                className="col-lg-4"
                style={{
                  padding: "20px 40px",
                  textAlign: "left",
                  fontSize: "15px",
                }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    marginBottom: "15px",
                    fontSize: "18px",
                  }}
                >
                  SERVICE HOURS
                </p>
                <p>Monday - Friday (08:00 - 16:00 WIB)</p>
                <br />
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  QUICK LINKS
                </p>
                <a
                  href="https://goo.gl/maps/5VCNFxoCRRUwBF547"
                  target="_blank"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <p>- Campus Location</p>
                </a>
              </div>
              <div
                className="col-lg-4"
                style={{
                  padding: "20px 40px",
                  textAlign: "left",
                  fontSize: "15px",
                }}
              >
                <p style={{ marginBottom: "20px" }}>
                  <span style={{ fontWeight: "bold" }}>Email</span>
                  : fajar.lestari@polytechnic.astra.ac.id
                  <br />
                  <span style={{ fontWeight: "bold" }}>Website</span>:
                  https://www.polytechnic.astra.ac.id
                </p>
                <p className="mt-3 mb-0">© 2025 Politeknik Astra</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </footer>
  );
}
