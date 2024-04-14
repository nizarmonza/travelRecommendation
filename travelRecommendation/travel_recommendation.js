(async function main(){
    //global variable
    const recommendation =  document.querySelector(".recommendation")
    const searchElement = document.querySelector("input")
    const formElement = document.getElementById("form");
    const raiseEvent = new Event("input");
    let searchArray = [];

    function getTimeZoneForCountry(country){
        switch (country) {
            case "Australia":
              return "Australia/Sydney";
            case "Japan":
              return "Asia/Tokyo";
            case "Brazil":
              return "America/Sao_Paulo";
            case "Cambodia":
              return "Asia/Phnom_Penh";
            case "India":
              return "Asia/Kolkata";
            case "French Polynesia":
              return "Pacific/Tahiti";
            default:
              return "UTC";
        }
    }

    async function fetchData(){
        try{
            const res = await fetch("travel_recommendation_api.json")
            const data = await res.json()
            return data;
        }catch(e){
            console.log(e);
        }
    }

    const data = await fetchData();
    const originalSearchArray = (() => {
        let arr = [];
        for (let [key, value] of Object.entries(data)) {
          if (key !== "countries") {
            arr.push(key);
          }
          value.map((ele) => {
            if (key === "countries") {
              ele.cities.map((city) => {
                arr.push(city.name);
              });
            } else {
              arr.push(ele.name);
            }
          });
        }
        return arr;
      })();

      searchElement.addEventListener("input", () => {
        let val = searchElement.value;
        if (document.getElementById("options")) {
          document.getElementById("options").remove();
        }
        if (val === "") return;
        searchArray = originalSearchArray.filter((ele) => ele.toLowerCase().includes(val.toLowerCase()));
        if (searchArray.length === 0) {
          return;
        } else if (searchArray.length > 8) {
          searchArray.length = 8;
        }
        let optionsElement = document.createElement("ul");
        optionsElement.setAttribute("id", "options");
        searchArray.forEach((e) => {
          let li = document.createElement("li");
          li.addEventListener("click", (e) => {
            searchElement.value = e.target.textContent;
            searchElement.dispatchEvent(raiseEvent);
          });
          li.textContent = e;
          optionsElement.appendChild(li);
        });
        searchElement.insertAdjacentElement("afterend", optionsElement);
      });
})