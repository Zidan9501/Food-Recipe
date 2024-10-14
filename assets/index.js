// Variabler för HTML-element
let searchBtn = document.getElementById("search");
let mealList = document.getElementById("meal");
let mealDetailsContent = document.querySelector(".meals-detali-content");
let recipeCloseBtn = document.getElementById("recipe-close-btn");
let ctx = document.getElementById("myChart");

// Arrayer för data
let labels = [];
let categoryVotes = [];
let mealVotes = [];

// Lägg till eventlyssnare för knappar och maträtter
searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
    mealDetailsContent.parentElement.classList.remove("showRecipe");
});

// Funktion för att hämta maträtter baserat på en ingrediens
function getMealList() {
    let searchInputText = document.getElementById("search-input").value.trim();
    if (searchInputText === "") {
        // Om sökfältet är tomt, visa meddelande
        mealList.innerHTML = "Vi hittade inga maträtter";
        mealList.classList.add("notFound");
    } else {
        // Gör en API-anrop för att hämta maträtter baserat på användarens ingrediens
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputText}`)
            .then((response) => response.json())
            .then((data) => {
                let mealElement = "";
                if (data.meals) {
                    // Om maträtter finns, skapas HTML-element för varje maträtt
                    data.meals.forEach((meal) => {
                        mealElement += `
                            <div class="meal-item" id="${meal.idMeal}">
                                <div class="meal-img">
                                    <img src="${meal.strMealThumb}" alt="meal" />
                                </div>
                                <div class="meal-name">
                                    <h3>${meal.strMeal}</h3>
                                    <a href="#" class="recipe-btn">Hämta recept</a>
                                </div>
                            </div>`;
                    });
                    mealList.classList.remove("notFound");
                } else {
                    // Om inga maträtter hittades, visa meddelande
                    mealElement = "Vi hittade inga maträtter";
                    mealList.classList.add("notFound");
                }
                // Visa maträtter på webbsidan
                mealList.innerHTML = mealElement;
            });
    }
}

// Funktion för att hämta receptet för den valda maträtten
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains("recipe-btn")) {
        // Om användaren klickar på "Ditt recept", hämtas detaljerna om maträtten
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.id}`)
            .then((response) => response.json())
            .then((data) => mealRecipeModal(data.meals));
    }
}

// Funktion för att visa receptet på den valda maträtten i webbläsaren
function mealRecipeModal(meal) {
    meal = meal[0];
    let mealElement = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-image">
            <img src="${meal.strMealThumb}" alt="meal" />
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Titta Här</a>
        </div>`;
    mealDetailsContent.innerHTML = mealElement;
    mealDetailsContent.parentElement.classList.add("showRecipe");
}

// Fetch-anrop för att hämta matkategorierna
fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    .then((response) => response.json())
    .then((data) => {
        data.categories.forEach((category) => {
            labels.push(category.strCategory);
        });

        // Fetch för att hämta antal maträtter för varje kategori
        Promise.all(
            labels.map((category) =>
                fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
                    .then((response) => response.json())
                    .then((data) => data.meals.length)
            )
        ).then((votes) => {
            categoryVotes = votes;
            // Skapa diagrammet med data
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels,
                    datasets: [
                        {
                            label: "# of Votes (Categories)",
                            data: categoryVotes,
                            borderWidth: 3,
                        },
                        {
                            label: "# of Votes (Meals)",
                            data: mealVotes,
                            borderWidth: 3,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        });
    });
