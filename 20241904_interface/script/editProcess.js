// Function to switch between paragraph and input elements
const changeToInput = (button) => {
  // Find the closest parent div element of the pressed button
  const parentDiv = button.closest("div");
  // Find the paragraph element within the parent div
  const paragraph = parentDiv.querySelector(".editBox");

  // Create a separate flagMode variable for each element
  var flagMode = paragraph.classList.contains("inputMode");

  // Get data from sessionStorage
  const cachedData = JSON.parse(sessionStorage.getItem('cachedData'));

  // Find trueValue in cachedData
  let trueValue;
  cachedData.forEach((item) => {
    const idString = paragraph.id.split("-");
    if (item.sTagName === idString[0] && item.iTime === parseInt(idString[2])) {
      trueValue = {
        value: item.Value,
        editedValue: item.EditedValue,
        state:item.state
      };
    }
  });

  // Switch between paragraph and input elements
  if (paragraph.tagName === "P") {
    // Find the img element within the button
    const imgElement = button.querySelector("img");
    imgElement.src = "./assets/return_icon.png"; // Change the button image

    // Create an input element
    var inputElement = document.createElement("input");
    inputElement.type = "number";
    inputElement.setAttribute("inputmode", "numeric");
    inputElement.value = trueValue.editedValue ? trueValue.editedValue.toFixed(2) : '!'; // Use trueValue or default value if not available
    inputElement.className = paragraph.className;
    inputElement.id = paragraph.id;
    inputElement.style.width = paragraph.textContent.length * 10 + "px";
    parentDiv.replaceChild(inputElement, paragraph); // Replace paragraph element with input element
    parentDiv.querySelector(".editBox").classList.add("inputMode");

    // Use setTimeout to focus on the input element after replacement
    setTimeout(() => {
      inputElement.focus();
    }, 0);

    // Add input event listener to track input content changes
    inputElement.addEventListener("input", function () {
      // Recalculate input width based on new content
      this.style.width = this.value.length * 10 + "px";
    });
  } else if (paragraph.tagName === "INPUT") {
    // Find the img element within the button
    const imgElement = button.querySelector("img");

    // Create a paragraph element
    var pElement = document.createElement("p");
    if(trueValue.value){
      pElement.textContent = trueValue.value.toFixed(2);
      imgElement.src = "./assets/dcs_data.png";
    }else{
      pElement.textContent = "!   ";
      imgElement.src = "./assets/default.png";
    }
    //pElement.textContent = trueValue.value ? trueValue.value.toFixed(2) : '!'; // Use trueValue or default value if not available
    pElement.className = paragraph.className;
    pElement.id = paragraph.id;
    parentDiv.replaceChild(pElement, paragraph); // Replace input element with paragraph element
    parentDiv.querySelector(".editBox").classList.remove("inputMode");
  }
};
