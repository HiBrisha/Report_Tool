// Define an object to manage data manipulation
const DataManipulator = {
  editedObject: [],

  getCurrentDate: function () {
    return new Date().toISOString().split("T")[0];
  },

  formatDate: function (date) {
    return date.toISOString().split("T")[0];
  },

  selectDate: function (formattedDate) {
    const date_input = $('input[name="date"]');
    date_input.val(formattedDate);

    // Set up datepicker
    date_input.datepicker({
      format: "yyyy-mm-dd",
      container: $(".bootstrap-iso form").length > 0 ? $(".bootstrap-iso form").parent() : "body",
      todayHighlight: true,
      autoclose: true,
    });
  },

  reloadData: function (apiType) {
    const dateTime = $(".form-control").val();
    this.loadData(apiType, dateTime);
  },

  loadData: function (apiType, dateTime) {
    const apiUrl = `http://127.0.0.1:448/api/v1/data/${apiType}?datetime=${dateTime}`;
    //console.log(apiUrl);
    let index = 0;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        sessionStorage.setItem("cachedData", JSON.stringify(data));

        data.forEach((item) => {
          const tdElements = document.querySelectorAll(`td[class*="${item.sTagName}"]`);
          switch (apiType) {
            case "ACDC":
              index = (item.iTime - 2) / 2;
              break;
            case "TDD":
            case "TSVH_H1":
            case "TSVH_H2":
            case "TSVHD_H1":
            case "TSVHD_H2":
            case "T220":
              index = item.iTime - 1;
              break;
            default:
              // Handle default case
              console.error("Invalid dateTime value");
              return;
          }

          if (index >= 0 && index < tdElements.length) {
            const divElement = tdElements[index].querySelector("div");
            const imgElement = tdElements[index].querySelector("img");
            const existingInputElement = divElement.querySelector("input.editBox");
            const existingPElem = divElement.querySelector("p.editBox");

            existingInputElement ? existingInputElement.remove() : "";
            existingPElem ? existingPElem.remove() : "";

            if (item.state != 1) {
              const pElement = document.createElement("p");
              pElement.className = "editBox";
              pElement.id = `${item.sTagName}-${item.iDate}-${item.iTime}`;
              if(item.Value!=null){
                pElement.innerText = item.Value.toFixed(2);
                imgElement.src = "./assets/dcs_data.png"
              }else{
                pElement.innerText = '!';
                imgElement.src = "./assets/default.png"
              }
              divElement.appendChild(pElement);
            } else {
              const inputElement = document.createElement("input");
              inputElement.className = "editBox";
              inputElement.id = `${item.sTagName}-${item.iDate}-${item.iTime}`;
              inputElement.value = item.EditedValue.toFixed(2);
              inputElement.style.width = item.EditedValue.toFixed(2).length * 10 + "px";
              divElement.appendChild(inputElement);
              divElement.querySelector(".editBox").classList.add("inputMode");
              imgElement.src = "./assets/edited.png";
            }
          }
          item.state ? this.editedObject.push(item) : null;
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  },

  initialize: function () {
    const formattedDate = this.getCurrentDate();
    this.selectDate(formattedDate);
  },
};