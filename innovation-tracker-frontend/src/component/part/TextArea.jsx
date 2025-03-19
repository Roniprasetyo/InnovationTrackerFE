import { forwardRef, useState, useEffect } from "react";
import JoditEditor from "jodit-react";

const TextArea = forwardRef(
  (
    {
      label = "",
      forInput,
      placeholder = "",
      initialValue = "",
      isRequired = false,
      isDisabled = false,
      errorMessage = "",
      onChange,
      ...props  
    },
    ref
  ) => {
    const [content, setContent] = useState(initialValue);
    const [error, setError] = useState(errorMessage);

    useEffect(() => setContent(initialValue), [initialValue]);

    const handleEditorChange = (newContent) => {
      setContent(newContent);
      onChange?.({ target: { name: forInput, value: newContent } });
      setError(
        isRequired && !newContent.trim() ? "This field is required." : ""
      );
    };

    return (
      <div className="mb-3">
        {label && (
          <label htmlFor={forInput} className="form-label fw-bold ms-1">
            {label} {isRequired && <span className="text-danger"> *</span>}
            {errorMessage && <span className="fw-normal text-danger"> {errorMessage}</span>}
          </label>
        )}
        <JoditEditor
          ref={ref}
          value={content}
          config={{
            readonly: isDisabled,
            placeholder,
            toolbarButtonSize: "middle",
            buttons: [
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "|",
              "ul",
              "ol",
              "outdent",
              "indent",
              "|",
              "link",
              "|",
              "undo",
              "redo",
            ],
          }}
          onBlur={handleEditorChange}
          {...props}
        />
        {!label && errorMessage && <span className="small fw-normal text-danger">{errorMessage}</span>}
      </div>
    );
  }
);

export default TextArea;
