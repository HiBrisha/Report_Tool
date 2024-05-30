// Function to process and send flagged positions to the server
const processFlagged = (domain) => {
  // Array to store flagged positions
  var flaggedPositions = [];
  // Set to store processed sTagNames
  var processedTags = new Set();

  // Function to process elements based on selector
  const processElements = (selector) => {
    var tdElements = document.querySelectorAll(`td[class*="${selector}"]`);
    tdElements.forEach(function (tdElement) {
      var paragraph = tdElement.querySelector(".editBox");
      if (paragraph && paragraph.id != null) { // Thêm kiểm tra paragraph tồn tại trước khi truy cập thuộc tính 'id'
        const idString = paragraph.id.split("-");
        let value = paragraph.value;
        if (paragraph.classList.contains("inputMode")) {
          // Add flagged position to the array
          flaggedPositions.push({
            sTagName: tdElement.className,
            iTime: parseInt(idString[2]),
            iDate: parseInt(idString[1]),
            EditedValue: value,
            state: 1,
          });
        }
      }
    });
};

  // Function to process data by finding elements not in child data
  const processData = (parentData, childData) => {
    const elementsNotInChildData = parentData.filter(
      (parentItem) =>
        !childData.some(
          (childItem) =>
            parentItem.sTagName === childItem.sTagName &&
            parentItem.iTime === childItem.iTime
        )
    );

    // Remove "Value" property and set "state" to 0 for elements not in child data
    elementsNotInChildData.forEach((item) => {
      delete item.Value;
      item.state = 0;
    });

    return elementsNotInChildData;
  };

  // Retrieve cached data from sessionStorage
  const cachedData = JSON.parse(sessionStorage.getItem("cachedData"));
  // Process cached data
  cachedData.forEach((item) => {
    if (!processedTags.has(item.sTagName)) {
      processElements(item.sTagName);
      processedTags.add(item.sTagName);
    }
  });
  console.log(flaggedPositions);
  // Send flagged positions to the server
  flaggedPositions.length > DataManipulator.editedObject.length ?
    sendFlaggedPositionsToServer(flaggedPositions,domain) :
    sendFlaggedPositionsToServer(flaggedPositions.concat(processData(DataManipulator.editedObject, flaggedPositions)),domain);
};

// Function to send data to the server asynchronously
const sendFlaggedPositionsToServer = async (flaggedPositions,domain) => {
  try {
    const url = "http://127.0.0.1:448/api/v1/data/update";
    const inDate  = document.getElementById('date').value;

    const bodyObject = {
      data: flaggedPositions,
      type: domain,
      date:inDate
  };

    // Send a POST request using fetch()
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "null", // Add this header
        "Access-Control-Allow-Credentials": "true", // Add this header
      },
      body: JSON.stringify(bodyObject),
    });

    // Check the response from the server
    if (response.ok) {
      const responseData = await response.json();
      console.log("Data saved successfully:", responseData);
    } else {
      console.error("Failed to save data:", response.statusText);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
