import Icon from "../../part/Icon";

export default function UnderConstruction() {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "95vh" }}
    >
      <div className="text-center">
        <Icon name="tools text-danger" style={{ fontSize: "10rem" }} />
        <h2 className="display-5">Under Construction</h2>
        <p className="lead">Something exciting is coming!</p>
        <a href="/" className="btn btn-primary mt-3">
          Back to home
        </a>
      </div>
    </div>
  );
}
