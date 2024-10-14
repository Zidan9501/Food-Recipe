// URL till API:et för städer
let apiUrl = "https://avancera.app/cities/";

// Funktion för att hämta städer från API:et och visa dem på sidan
function fetchCities() {
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            let cityList = document.getElementById("cityList");
            cityList.innerHTML = "";

            // Loopar igenom varje stad i den mottagna datan och skapar listelement för varje stad
            data.forEach((city) => {
                let listItem = document.createElement("li");
                listItem.textContent = `- ID:${city.id} - Namn: ${city.name} - Befolkning:${city.population}`;
                cityList.classList.add("cityList");
                cityList.appendChild(listItem);
            });
        });
}

// Funktion för att lägga till en stad till API:et
function addCity() {
    let newCityPopulation = document.getElementById("newCityPopulation").value;
    newCityPopulation = parseInt(newCityPopulation);
    let newCityName = document.getElementById("newCityName").value;

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: newCityName,
            population: newCityPopulation,
        }),
    })
        .then((response) => response.json())
        .then(() => {
            alert("City added successfully");
            fetchCities();
        });
}

// Funktion för att ta bort en stad från API:et
function deleteCity() {
    let deleteCityId = document.getElementById("deleteCityId").value;

    fetch(apiUrl + deleteCityId, {
        method: "DELETE",
    }).then(() => {
        alert("City deleted successfully");
        fetchCities();
    });
}

// Funktion för att redigera information om en stad i API:et
function editCity() {
    let editCityId = document.getElementById("editCityId").value;
    let editedCityName = document.getElementById("editedCityName").value;
    let editedCityPopulation = document.getElementById("editedCityPopulation").value;
    editedCityPopulation = parseInt(editedCityPopulation);

    // Skickar en PATCH-förfrågan till API:et med den nya informationen om staden som JSON-data
    fetch(apiUrl + editCityId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: editedCityName,
            population: editedCityPopulation,
        }),
    })
        .then((response) => response.json())
        .then(() => {
            alert("City edited successfully");
            fetchCities();
        });
}
