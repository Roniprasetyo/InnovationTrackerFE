import swal from "sweetalert";

const SweetAlert = (
  title,
  text,
  icon,
  confirmText = "",
  data = null,
  status = null,
  reviewer = null,
  inputType = null,
  placeholder = "",
  html = null,
) => {
  if (confirmText === "") {
    return swal({
      title: title,
      text: text,
      icon: icon,
      content: html
        ? { element: "div", attributes: { innerHTML: html } }
        : undefined,
    });
  } else {
    let inputElement = null;

    if (confirmText === "Reject") {
      inputElement = document.createElement("textarea");
      inputElement.placeholder = placeholder || "Please enter a reason for rejection...";
      inputElement.rows = 4;
      inputElement.style.width = "100%";
      inputElement.style.padding = "8px";
      inputElement.style.border = "1px solid #ccc";
      inputElement.style.borderRadius = "5px";
      inputElement.style.fontSize = "16px";
      inputElement.style.boxSizing = "border-box";
      inputElement.style.resize = "vertical";
      inputElement.style.marginTop = "10px";
    }

    else if (confirmText === "Submit" && status === "Approved") {
      inputElement = document.createElement("div");
      inputElement.style.display = "flex";
      inputElement.style.flexDirection = "column";
    
      const createRadioGroup = (title, name, items) => {
        const groupWrapper = document.createElement("div");
        groupWrapper.style.display = "flex";
        groupWrapper.style.flexDirection = "column";
        groupWrapper.style.flex = "1";
        groupWrapper.style.border = "1px solid #ccc";
        groupWrapper.style.borderRadius = "8px";
        groupWrapper.style.padding = "20px 15px 15px";
        groupWrapper.style.position = "relative";
    
        const labelSpan = document.createElement("span");
        labelSpan.textContent = title;
        labelSpan.style.position = "absolute";
        labelSpan.style.top = "-10px";
        labelSpan.style.left = "15px";
        labelSpan.style.backgroundColor = "#fff";
        labelSpan.style.padding = "0 8px";
        labelSpan.style.fontSize = "16px";
    
        groupWrapper.appendChild(labelSpan);
    
        if (Array.isArray(items) && items.length > 0) {
          items.forEach((item, index) => {
            const wrapper = document.createElement("div");
            wrapper.style.display = "flex";
            wrapper.style.alignItems = "center";
            wrapper.style.marginBottom = "8px";
    
            const option = document.createElement("input");
            option.type = "radio";
            option.name = name;
            option.value = item.Value || item.value;
            option.id = `${name}-${index}`;
            option.style.marginRight = "8px";
    
            const label = document.createElement("label");
            label.htmlFor = `${name}-${index}`;
            label.textContent = item.Text || item.label;
    
            wrapper.appendChild(option);
            wrapper.appendChild(label);
            groupWrapper.appendChild(wrapper);
          });
        } else {
          const emptyLabel = document.createElement("p");
          emptyLabel.textContent = "No options available.";
          groupWrapper.appendChild(emptyLabel);
        }
    
        return groupWrapper;
      };
    
      const batchGroup = createRadioGroup("Select Batch", "reviewOption", data);
      
      const radioGroup = document.createElement("div");
      radioGroup.style.display = "flex";
      radioGroup.style.flexDirection = "row";
      radioGroup.style.gap = "15px";
      radioGroup.appendChild(batchGroup);
      inputElement.appendChild(radioGroup);
    
      if (Array.isArray(reviewer) && reviewer.length > 0) {
        const reviewerGroup = document.createElement("div");
        reviewerGroup.style.marginTop = "20px";
        
        const reviewerLabel = document.createElement("label");
        reviewerLabel.textContent = "Select Reviewer";
        reviewerLabel.style.fontSize = "16px";
        reviewerLabel.style.marginBottom = "8px";
        
        const reviewerSelect = document.createElement("select");
        reviewerSelect.style.width = "100%";
        reviewerSelect.name = "reviewerOption";
        reviewerSelect.style.padding = "8px";
        reviewerSelect.style.border = "1px solid #ccc";
        reviewerSelect.style.borderRadius = "5px";
        reviewerSelect.style.fontSize = "16px";
        
        reviewer.forEach((reviewerOption, index) => {
          const option = document.createElement("option");
          option.value = reviewerOption.Value;
          option.textContent = reviewerOption.Text;
          reviewerSelect.appendChild(option);
        });
    
        reviewerGroup.appendChild(reviewerLabel);
        reviewerGroup.appendChild(reviewerSelect);
        inputElement.appendChild(reviewerGroup);
      }
    }    

    return new Promise((resolve) => {
      swal({
        title: title,
        text: text,
        icon: icon,
        content: inputElement || undefined,
        buttons: {
          cancel: "Cancel",
          confirm: {
            text: confirmText,
            value: true,
          },
        },
        dangerMode: icon === "warning",
      }).then((value) => {
        if (value) {
          if (confirmText === "Reject") {
            const result = inputElement.value.trim();
            if (result === "") {
              swal("Reason is required!", "Please enter a reason for rejection.", "error").then(() => {
                SweetAlert(title, text, icon, confirmText, inputType, placeholder, html).then(resolve);
              });
              return;
            }
            resolve(result);
          } 
          else if (confirmText === "Submit" && status === "Approved") {
            const selectedBatch = inputElement.querySelector('input[name="reviewOption"]:checked');
            const selectedReviewer = inputElement.querySelector('select[name="reviewerOption"]');
          
            if (!selectedBatch || !selectedReviewer || selectedReviewer.value === "") {
              swal("Please complete the form!", "Batch and reviewer must be selected.", "error").then(() => {
                SweetAlert(title, text, icon, confirmText, data, inputType, placeholder, html).then(resolve);
              });
              return;
            }
          
            resolve({
              batch: selectedBatch.value,
              reviewer: selectedReviewer.value,
            });
          }          
          else {
            resolve(value);
          }
        } else {
          resolve(null);
        }
      });
    });
  }
};

export default SweetAlert;