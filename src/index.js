import characters from "./characters.js";

// import characters from "./charcaters.json" assert { type: "json" };  // Currently, this works only on Chromium based browsers

const gifList = [
  "assets/images/gif/mc01_a01anm01.gif",
  "assets/images/gif/mc02_a01anm01.gif",
  "assets/images/gif/mc03_a01anm01.gif",
  "assets/images/gif/mc04_a01anm01.gif",
  "assets/images/gif/mc05_a01anm01.gif",
  "assets/images/gif/mc06_a01anm01.gif",
  "assets/images/gif/mc07_a01anm01.gif",
];

const regions = document.querySelectorAll("#region li label");

regions.forEach((region) => {
  const checkbox = region.previousElementSibling;
  region.addEventListener("keydown", (e) => {
    if (e.code === "Enter" || e.code === "Space") {
      checkbox.click();
    }
  });
});

const cities = document.querySelectorAll(".city-name");

cities.forEach((city) => {
  city.addEventListener("click", () => {
    let cityInput = city.id;
    fetchApi(cityInput);
    // document.cookie = `name=${cityInput}; expires=${getFutureDate(5)}`;
    localStorage.setItem("selectedCity", cityInput);
  });
  city.addEventListener("mouseenter", () => {
    city.previousElementSibling.style.visibility = "visible";
  });
  city.addEventListener("mouseleave", () => {
    city.previousElementSibling.style.visibility = "hidden";
  });
  city.addEventListener("keydown", (e) => {
    if (e.code === "Enter" || e.code === "Space") {
      let cityInput = city.id;
      fetchApi(cityInput);
      localStorage.setItem("selectedCity", cityInput);
    }
  });
});

// if (navigator.cookieEnabled === true && document.cookie !== "") {
//   fetchApi(document.cookie.split("=")[1]);
// }

// function getFutureDate(days = Number()) {
//   const timeSpan = days * 24 * 60 * 60 * 1000;
//   const futureTime = Date.now() + timeSpan;
//   const futureDate = new Date(futureTime);
//   return futureDate;
// }

if (!localStorage === false && localStorage.getItem("selectedCity") !== null) {
  fetchApi(localStorage.selectedCity);
}

async function fetchApi(cityId) {
  const url = `https://weather.tsukumijima.net/api/forecast/city/${cityId}`;
  const res = await fetch(url, {
    method: "GET",
    headers: new Headers({
      "Api-User-Agent": "zunkoweather/1.0",
      "User-Agent": "zunkoweather/1.0",
    }),
  });
  const data = await res.json();
  const location = data.title;
  const abstract = data.description.text;
  const announcedTime = data.description.publicTimeFormatted;
  const data1 = data.forecasts[0];
  const data2 = data.forecasts[1];
  const data3 = data.forecasts[2];
  const image1 = data1.image.url;
  const image2 = data2.image.url;
  const image3 = data3.image.url;
  const weather1 = data1.detail.weather;
  const weather2 = data2.telop;
  const weather3 = data3.telop;
  const maxTemp1 = data1.temperature.max.celsius;
  const maxTemp2 = data2.temperature.max.celsius;
  const maxTemp3 = data3.temperature.max.celsius;
  const minTemp1 = data1.temperature.min.celsius;
  const minTemp2 = data2.temperature.min.celsius;
  const minTemp3 = data3.temperature.min.celsius;
  const rainto6 = data1.chanceOfRain.T00_06;
  const rainto12 = data1.chanceOfRain.T06_12;
  const rainto18 = data1.chanceOfRain.T12_18;
  const rainto24 = data1.chanceOfRain.T18_24;
  const wind = data1.detail.wind;
  const wave = data1.detail.wave;
  const today = new Date().toLocaleDateString();
  document.querySelector("#location").textContent = location;
  document.querySelector("#today").textContent = today;
  document.querySelector("#today").setAttribute("datetime", today);
  document.querySelectorAll("#title img").forEach((image) => {
    image.src = gifList[getRandomIndex(gifList.length)];
  });
  document.querySelector(
    "#bulletin"
  ).textContent = `${abstract}(${announcedTime})`;
  document.querySelector("#bulletin").style.animation = `marquee ${
    abstract.length * 200
  }ms linear infinite`;
  document.querySelector("#image1").src = image1;
  document.querySelector("#image2").src = image2;
  document.querySelector("#image3").src = image3;
  document.querySelector("#weather1").textContent = weather1;
  document.querySelector("#weather2").textContent = weather2;
  document.querySelector("#weather3").textContent = weather3;
  document.querySelector("#temperature2 .max").textContent = maxTemp2;
  document.querySelector("#temperature3 .max").textContent = maxTemp3;
  document.querySelector("#temperature2 .min").textContent = minTemp2;
  document.querySelector("#temperature3 .min").textContent = minTemp3;
  document.querySelector("#rainto6").textContent = `${rainto6}`;
  document.querySelector("#rainto12").textContent = `${rainto12}`;
  document.querySelector("#rainto18").textContent = `${rainto18}`;
  document.querySelector("#rainto24").textContent = `${rainto24}`;
  document.querySelector("#wind .content").textContent = wind;
  setAlt(maxTemp1, minTemp1, wave);
  const region = data.location.area;
  setCharacter(region, data1.telop);
  document.querySelector("#bg-img").style.cssText = "display: none;";
  document.querySelector("#content").style.cssText = "display: block;";
}

function setAlt(maxTemp, minTemp, wave) {
  if (maxTemp !== null) {
    document.querySelector("#temperature1 .max").textContent = maxTemp;
  } else {
    document.querySelector("#temperature1 .max").textContent = "--";
  }
  if (minTemp !== null) {
    document.querySelector("#temperature1 .min").textContent = minTemp;
  } else {
    document.querySelector("#temperature1 .min").textContent = "--";
  }
  if (wave !== null) {
    document.querySelector("#wave .content").textContent = wave;
  } else {
    document.querySelector("#wave .content").textContent = "N/A";
  }
}

function setCharacter(region, weather) {
  const characterImage = document.querySelector("#character-image");
  const speech = document.querySelector("#speech");

  const condition = String(weather);
  const hours = new Date().getHours();
  const month = new Date().getMonth() + 1;

  let character = null;

  if (region === "北海道") {
    character = characters.melon;
    characterImage.alt = "北海道めろん";
  } else if (region === "東北") {
    const tohoku = [
      characters.zunko,
      characters.itako,
      characters.kiritan,
      characters.zundamon,
    ];
    const index = getRandomIndex(tohoku.length);
    character = tohoku[index];
    if (index === 0) {
      characterImage.alt = "東北ずん子";
    } else if (index === 1) {
      characterImage.alt = "東北イタコ";
    } else if (index === 2) {
      characterImage.alt = "東北きりたん";
    } else if (index === 3) {
      characterImage.alt = "ずんだもん";
    }
  } else if (region === "関東") {
    character = characters.chanko;
    characterImage.alt = "大江戸ちゃんこ";
  } else if (region === "中部") {
    character = characters.tsurugi;
    characterImage.alt = "中部つるぎ";
  } else if (region === "近畿") {
    character = characters.shinobi;
    characterImage.alt = "関西しのび";
  } else if (region === "中国") {
    character = characters.usagi;
    characterImage.alt = "中国うさぎ";
  } else if (region === "四国") {
    character = characters.metan;
    characterImage.alt = "四国めたん";
  } else if (region === "九州") {
    character = characters.sora;
    characterImage.alt = "九州そら";
  } else {
    character = characters.awamo;
    characterImage.alt = "沖縄あわも";
  }

  if ((0 <= hours && hours <= 4) || 22 <= hours) {
    characterImage.src = character.night.image;
    speech.textContent = character.night.phrase;
  } else if (condition.includes("雨") === true) {
    characterImage.src = character.rain.image;
    speech.textContent = character.rain.phrase;
  } else if (3 <= month && month <= 5) {
    characterImage.src = character.spring.image;
    speech.textContent = character.spring.phrase;
  } else if (6 <= month && month <= 8) {
    characterImage.src = character.summer.image;
    speech.textContent = character.summer.phrase;
  } else if (9 <= month && month <= 11) {
    characterImage.src = character.autumn.image;
    speech.textContent = character.autumn.phrase;
  } else {
    characterImage.src = character.winter.image;
    speech.textContent = character.winter.phrase;
  }
}

function getRandomIndex(arrayLength = Number()) {
  return Math.floor(Math.random() * arrayLength);
}
