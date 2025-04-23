export default function Label({ title, data, forLabel }) {
  return (
    <>
      <div className="mb-3">
      {title && (
        <>
          <label htmlFor={forLabel} className="form-label fw-bold">
            {title}
          </label>
          <br />
        </>
      )}
        <span
          style={{ whiteSpace: "pre-wrap" }}
          dangerouslySetInnerHTML={{ __html: data }}
        ></span>
      </div>
    </>
  );
}
