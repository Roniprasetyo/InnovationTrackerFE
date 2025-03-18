import Icon from "./Icon";

export default function Table({
  data,
  onToggle = () => {},
  onCancel = () => {},
  onDelete = () => {},
  onDetail = () => {},
  onEdit = () => {},
  onApprove = () => {},
  onReject = () => {},
  onSubmit = () => {},
  onUpload = () => {},
  onFinal = () => {},
  onPrint = () => {},
  onRemove = () => {},
}) {
  let colPosition;
  let colCount = 0;

  function generateActionButton(columnName, value, key, id, status, rowValue) {
    if (columnName !== "Action") return value;
    const listButton = value.map((action) => {
      switch (action) {
        case "Toggle": {
          if (status === "Aktif") {
            return (
              <Icon
                key={key + action}
                name="toggle-on"
                type="Bold"
                cssClass="btn px-1 py-0 text-primary"
                title="Disable"
                onClick={() => onToggle(id)}
              />
            );
          } else if (status === "Tidak Aktif") {
            return (
              <Icon
                key={key + action}
                name="toggle-off"
                type="Bold"
                cssClass="btn px-1 py-0 text-secondary"
                title="Enable"
                onClick={() => onToggle(id)}
              />
            );
          }
        }
        case "Cancel":
          return (
            <Icon
              key={key + action}
              name="delete-document"
              type="Bold"
              cssClass="btn px-1 py-0 text-danger"
              title="Cancel"
              onClick={() => onCancel(id)}
            />
          );
        case "Delete":
          return (
            <Icon
              key={key + action}
              name="trash"
              type="Bold"
              cssClass="btn px-1 py-0 text-danger"
              title="Delete"
              onClick={() => onDelete(id)}
            />
          );
        case "Detail":
          return (
            <Icon
              key={key + action}
              name="overview"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Detail"
              onClick={() => onDetail("detail", id, rowValue)}
            />
          );
        case "Edit":
          return (
            <Icon
              key={key + action}
              name="edit"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Modify"
              onClick={() => onEdit("edit", id, rowValue)}
            />
          );
        case "Approve":
          return (
            <Icon
              key={key + action}
              name="check"
              type="Bold"
              cssClass="btn px-1 py-0 text-success"
              title="Approve"
              onClick={() => onApprove(id)}
            />
          );
        case "Reject":
          return (
            <Icon
              key={key + action}
              name="cross"
              type="Bold"
              cssClass="btn px-1 py-0 text-danger"
              title="Reject"
              onClick={() => onReject(id)}
            />
          );
        case "Remove":
          return (
            <Icon
              key={key + action}
              name="cross"
              type="Bold"
              cssClass="btn px-1 py-0 text-danger"
              title="Remove"
              onClick={() => onRemove(id)}
            />
          );
        case "Submit":
          return (
            <Icon
              key={key + action}
              name="paper-plane"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Submit"
              onClick={() => onSubmit(id)}
            />
          );
        case "Upload":
          return (
            <Icon
              key={key + action}
              name="file-upload"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Upload File"
              onClick={() => onUpload(id)}
            />
          );
        case "Final":
          return (
            <Icon
              key={key + action}
              name="gavel"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Finalize"
              onClick={() => onFinal(id)}
            />
          );
        case "Print":
          return (
            <Icon
              key={key + action}
              name="print"
              type="Bold"
              cssClass="btn px-1 py-0 text-primary"
              title="Print"
              onClick={() => onPrint(id)}
            />
          );
        default: {
          try {
            if (typeof action === "object") {
              return (
                <Icon
                  key={key + "Custom" + action.IconName}
                  name={action.IconName}
                  type="Bold"
                  cssClass="btn px-1 py-0 text-primary"
                  title={action.Title}
                  onClick={action.Function}
                />
              );
            } else return null;
          } catch (err) {
            return null;
          }
        }
      }
    });

    return listButton;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex-fill">
        <table className="table table-hover table-striped table table-light border">
          <thead>
            <tr>
              {Object.keys(data[0]).map((value, index) => {
                if (
                  value !== "Key" &&
                  value !== "Count" &&
                  value !== "Alignment"
                ) {
                  colCount++;
                  return (
                    <th key={"Header" + index} className="text-center">
                      {value}
                    </th>
                  );
                }
                if (value === "No") {
                  colCount++;
                  return (
                    <th
                      key={"Header" + index}
                      className="text-center"
                      style={{ maxWidth: "3rem" }}
                    >
                      {value}
                    </th>
                  );
                }
              })}
            </tr>
          </thead>
          <tbody>
            {data[0].Count !== 0 &&
              data.map((value, rowIndex) => {
                colPosition = -1;
                return (
                  <tr
                    key={value["Key"]}
                    className={
                      value["Status"] &&
                      (value["Status"] === "Draft" ||
                        value["Status"] === "Revision" ||
                        value["Status"] === "Belum Dikonversi" ||
                        value["Status"] === "Belum Dibuat Penjadwalan")
                        ? "fw-bold"
                        : undefined
                    }
                  >
                    {Object.keys(value).map((column, colIndex) => {
                      if (
                        column !== "Key" &&
                        column !== "Count" &&
                        column !== "Alignment"
                      ) {
                        colPosition++;
                        return (
                          <td
                            key={rowIndex + "" + colIndex}
                            style={{
                              textAlign: value["Alignment"][colPosition],
                            }}
                          >
                            {generateActionButton(
                              column,
                              value[column],
                              "Action" + rowIndex + colIndex,
                              value["Key"],
                              value["Status"],
                              value
                            )}
                          </td>
                        );
                      }
                    })}
                  </tr>
                );
              })}
            {data[0].Count === 0 && (
              <tr className="text-center">
                <td colSpan={colCount}>No data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
