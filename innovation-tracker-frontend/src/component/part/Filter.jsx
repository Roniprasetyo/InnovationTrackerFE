import Button from "./Button";

export default function Filter({ children }) {
  return (
    <>
      <Button
        iconName="apps-sort"
        classType="primary dropdown-toggle px-3 border-start"
        title="Saring atau Urutkan Data"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
      />
      <div className="dropdown-menu p-4" style={{ width: "350px" }}>
        {children}
      </div>
    </>
  );
}
