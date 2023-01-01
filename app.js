const timeE1 = document.getElementById("time");
const dateE1 = document.getElementById("date");
const wrapper = document.getElementsByClassName("wrapper");
const timeZone = document.getElementById("time-zone");
const country = document.getElementById("country");
const weatherForecastE1 = document.getElementById("weather-forecast");
const currentTempE1 = document.getElementById("current-temp");

const weatherItem = document.getElementById("weather-items")



const days = ['Sunday,','Monday,','Tuesday,','Wednesday,','Thrusday,','Friday,','Saturday,']

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const API_KEY = "49cc8c821cd2aff9af04c9f98c36eb74"

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const hoursIn12  = hour >= 13 ? hour % 12: hour
    const amPm = hour >=12 ? "PM" : "AM"
    const minIn10 = minutes < 10 ? `0${minutes}` : minutes

    timeE1.innerHTML = hoursIn12 +":" + minIn10+ " " + `<span id="am-pm">${amPm}</span>`
    
      dateE1.innerHTML = days[day] +""+ date +" "+ months[month]

}, 1000);


getWeatherData();
function getWeatherData(){
    navigator.geolocation.getCurrentPosition((succes) => {
    
        let {latitude, longitude} = succes.coords

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            
        console.log(data)
        showWeatherData(data);

        })

    })
}

function showWeatherData(data){
    let {humidity,pressure,wind_speed,sunrise,sunset} = data.current;

    timeZone.innerHTML = data.timezone;
    country.innerHTML = data.lat + 'N' +" "+ data.lon+'E'

    weatherItem.innerHTML = `
           <div class="wrapper">
          <div class="weather-items" id="weather-items">
            <div>Humidity</div>
            <div>${humidity}%</div>
            <div>Pressure</div>
            <div>${pressure}</div>
            <div>Wind Speed</div>
            <div>${wind_speed}</div>
            <div>Sunrise</div>
            <div>${window.moment(sunrise * 1000).format('HH:mm a') }</div>
            <div>Sunset</div>
            <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
        </div>
        </div>
    `;
       
        
     
        let otherDayForecast = ''

        data.daily.forEach((day,idx)  => {
          if (idx == 0) {
            currentTempE1.innerHTML  = `
              <img src="http://openweathermap.org/img/wn/${day.weather[10].icon}@4x.png" alt="weather-icon" class="w-icon"/>
          <div class="other">
          <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
          <div class="temp">Night ${day.temp.night}&#176; C</div>
          <div class="temp">Day ${day.temp.day}&#176; C</div>
          </div>
         </div>
            `
              
          }else{
            otherDayForecast += `

             <div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[10].icon}@2x.png" alt="weather-icon" class="w-icon"/>
            <div class="temp">Night ${day.temp.night}&#176; C</div>
            <div class="temp">day ${day.temp.day}&#176; C</div>
            </div>
            `
          }
        })

        weatherForecastE1.innerHTML = otherDayForecast;

       
}


