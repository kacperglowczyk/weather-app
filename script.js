function GetInfo() {
    const newName = document.getElementById("cityInput").value || "Krakow";  // Default to Krakow if no input
    document.getElementById("cityName").innerHTML = `---${newName}---`;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${newName}&appid=ef964b489562762fe1b88383e3c5a3ba`)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Inspect the data in the console
            if (data.cod === "200") {
                updateForecast(data);  // Update the UI with the forecast data
            } else {
                alert("City not found! Please try again.");
            }
        })
        .catch(() => alert("Something went wrong. Please check your internet connection and try again."));
}

function DefaultScreen() {
    document.getElementById("cityInput").defaultValue = "Krakow";  // Set default city to Krakow
    GetInfo();
}

function CheckDay(day) {
    const d = new Date();
    return (day + d.getDay()) % 7;
}

function updateForecast(data) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const container = document.getElementById("iconsContainer");
    container.innerHTML = ""; // Clear previous content

    // Filter the list to get roughly midday forecasts (3-hour intervals, 12:00 PM)
    const forecastList = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    for (let i = 0; i < 5; i++) {
        const dayIndex = CheckDay(i);
        const dayData = forecastList[i];

        const iconElement = `
            <div class="icons">
                <p class="weather">${days[dayIndex]}</p>
                <div class="image">
                    <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png" class="imgClass" alt="${dayData.weather[0].description}">
                </div>
                <p class="minValues">Min: ${(dayData.main.temp_min - 273.15).toFixed(1)}°C</p>
                <p class="maxValues">Max: ${(dayData.main.temp_max - 273.15).toFixed(1)}°C</p>
            </div>
        `;

        container.innerHTML += iconElement;
    }
}
