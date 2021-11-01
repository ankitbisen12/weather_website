"use strict";

// -------------Selecting elements----------- -------\\
const showContainer = document.querySelector(".cover");
const fetchData = document.querySelector(".fetch_data");
const footer = document.querySelector(".footer");
const infoModal = document.querySelector(".info--modal");
const overlay = document.querySelector(".overlay");
const btnCloseInfoModal = document.querySelector(".close__info-modal");
const inserted = document.querySelector(".insertedHtml");
const loaderL = document.querySelector(".loader");
const loaderContainer = document.querySelector(".loader__container");

// -----------variables------------------------------\\
   let click = 0;
   
//-----------------Helping function-----------------\\
const closeInfo = () => {
  infoModal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const openInfo = () => {
  infoModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const getPosition = () => {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const getWeather = async () => {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    const getCountry = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en}`
    );
    if (!getCountry.ok) throw new Error("Problem getting location data");
    const dataGeo = await getCountry.json();
    console.log(dataGeo);

    const tempDetails = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=2c151e5dd6ef42ba854104408212910&q=${dataGeo.localityInfo.administrative[2].name}&aqi=yes`
    );
    if (!tempDetails.ok) throw new Error("Problem getting country data");
    const tempJson = await tempDetails.json();
    console.log(tempJson);

    const details = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=2c151e5dd6ef42ba854104408212910&q=${tempJson.location.name}&aqi=yes`
    );
    if (!details.ok) throw new Error("Problem getting country data");
    const detailsJson = await details.json();
    console.log(detailsJson);

    const nextDayDetails = await fetch(
      `https://goweather.herokuapp.com/weather/${tempJson.location.name}`
    );
    if (!tempDetails.ok) throw new Error("Problem getting weather data");
    const extractDetails = await nextDayDetails.json();
    console.log(extractDetails);

    const dateObject = new Date();
    const day = dateObject.toLocaleString("en-US", { day: "numeric" });
    const month = dateObject.toLocaleString("en-US", { month: "numeric" });
    const year = dateObject.toLocaleString("en-US", { year: "numeric" });
    const weekDay = dateObject.toLocaleString("en-US", { weekday: "long" });
    const date = `${weekDay}, ${day}/${month}/${year}`;
    console.log(date);
    console.log(day);

    const html = `<div class="cover">
                    <div class="crd_contain">
                      <div class="card1">
                       <div class="content">
                         <div class="innercol1">
                          <div class="country">
                             <h2>${tempJson.location.name},${dataGeo.countryName} <br /><label>Mostly ${detailsJson.current.condition.text}</label></h2>
                          </div>
                          <span class="now">Now</span>
                          <div class="temp">${detailsJson.current.temp_c}<span>°C</span></div>
                       </div>
                       <div class="innercol11">
                        <div class="cloud">
                            <i class="fab fa-4x fa-cloudversify"></i>
                        </div>
                        <div class="time">16:43:30</div>
                        <div class="day">${date}</div>
                       </div>
                      </div>
                    </div>
                   <div class="card2">
                       <div class="innercol2">
                          <div class="innerbox">
                            <div class="forecast">
                              <div class="box1">
                                <span>CLOUD</span>
                                <span>${detailsJson.current.cloud}%</span>
                              </div>
                              <div class="box2">
                                <span><i class="fas fa-2x fa-cloud"></i></span></span>
                              </div>
                            </div>
                          </div>
                          <div class="innerbox">
                            <div class="forecast">
                              <div class="box1">
                               <span>Humidity</span>
                               <span>${detailsJson.current.humidity}</span>
                              </div>
                              <div class="box2">
                                <span><i class="fas fa-2x fa-cloud-sun"></i></span>
                              </div>
                            </div>
                          </div>
                          <div class="innerbox">
                            <div class="forecast">
                              <div class="box1">
                                 <span>WIND</span>
                                 <span>${detailsJson.current.wind_kph} kph</span>
                              </div>
                              <div class="box2">
                                  <span><i class="fas fa-2x fa-wind"></i></span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="innercol22">
                           <div class="innerbox1">
                            <div class="tdy">
                              <span>Today</span>
                            </div>
                            <hr />
                           </div>
                          <div class="time_weath">
                           <div class="weath_inner">
                            <div class="shift">
                              <span>Tommorrow</span>
                            </div>
                            <div class="wth">
                               <span>${extractDetails.forecast[0].temperature}<br>${extractDetails.description}</span>
                            </div>
                           </div>
                            <div class="weath_inner">
                             <div class="shift">
                               <span>After 1 day</span>
                              </div>
                              <div class="wth">
                                  <span>${extractDetails.forecast[1].temperature}<br>${extractDetails.description}</span>
                               </div>
                            </div>
                            <div class="weath_inner">
                              <div class="shift">
                                <span>After 2 day</span>
                              </div>
                              <div class="wth">
                                  <span>${extractDetails.forecast[2].temperature}<br>${extractDetails.description}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                     </div>
                    </div>`;

    inserted.insertAdjacentHTML("beforeend", html);
  } catch (err) {
    console.error(`${err} 💥`);
    throw err;
  }
};

const fetchWeatherFunc = () => {
  click += 1;
  // console.log(e);
  if (click > 1) return;
  else {
    setTimeout(function () {
      getWeather();
      // showContainer.classList.remove('display');
      footer.classList.remove("display");
      console.log("5000");
    }, 5000);
  }
};

//------------------EventListeners--------------------\\
fetchData.addEventListener("click", fetchWeatherFunc);

window.addEventListener("load", openInfo);

btnCloseInfoModal.addEventListener("click", closeInfo);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !infoModal.classList.contains("hidden")) {
    closeInfo();
  }
});
