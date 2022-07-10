//Elementos del DOM
    let ciudad = document.getElementById('city');
    //Partes de estadisticas del dia de hoy
    let wind = document.getElementById('wind');
    let hum = document.getElementById('hum');
    let visibility = document.getElementById('visibility');
    let prep = document.getElementById('prep');
        //Inputs
    let searchInput = document.getElementById('search__input');
    let searchForm = document.getElementById('search__submit');
        //Aside
    let temperatureDegrees = document.getElementById('degreeNumber');
    let informationDay = document.getElementById('informationDay');
    let weatherIcon = document.getElementById('weatherIcon');
    let minTemp = document.getElementById('minTemp');
    let maxTemp = document.getElementById('maxTemp');
        //Info de los siguientes dias
    let nextDayTime = document.getElementById('nextDayTime');
    let nextDay2Time = document.getElementById('nextDay2Time');
    let nextDayTemp = document.getElementById('nextDayTemp');
    let nextDay2Temp = document.getElementById('nextDay2Temp');
    let nextDay2MinTemp = document.getElementById('nextDay2MinTemp');
    let nextDayMinTemp = document.getElementById('nextDayMinTemp');
    let nextDay3Time = document.getElementById('nextDay3Time');
    let nextDay3Temp = document.getElementById('nextDay3Temp');
    let nextDay3MinTemp = document.getElementById('nextDay3MinTemp');
    let nextDayInfo = document.getElementById('nextDayInfo');
    let nextDay2Info = document.getElementById('nextDay2Info');
    let nextDay3Info = document.getElementById('nextDay3Info');
    
//Globales  
let InformarDia;
let timerInterval;
const dias = [];
let temps = [];
let myChart;
//Trabajamos Mostrando Dia y Horario con luxon
const DateTime = luxon.DateTime
dt = DateTime.now()
let Dates = document.getElementById('DiaYHoraActual')
Dates.innerText = dt.toLocaleString(DateTime.DATETIME_SHORT)


//definimos la clase que construirá a los días y sus atributos
class Dia{
    constructor(dia,temperaturaMax,temperaturaMin,viento,humedad,visibilidad,precipitaciones){
        this.dia=dia;
        this.temperaturaMax=temperaturaMax;
        this.temperaturaMin=temperaturaMin;
        this.viento=viento;
        this.humedad=humedad;
        this.visibilidad=visibilidad;
        this.precipitaciones=precipitaciones;
    }
}
//llenamos el array de los dias
const NewInfoArrays=(obj)=>{
    dias.push(new Dia( obj.forecast.forecastday[0].date, Math.floor(obj.forecast.forecastday[0].day.maxtemp_c),
    Math.floor(obj.forecast.forecastday[0].day.mintemp_c),obj.forecast.forecastday[0].day.maxwind_kph,
    obj.forecast.forecastday[0].day.maxwind_kph, obj.forecast.forecastday[0].day.avghumidity,
    obj.forecast.forecastday[0].day.daily_chance_of_rain));

    dias.push(new Dia( obj.forecast.forecastday[1].date, Math.floor(obj.forecast.forecastday[1].day.maxtemp_c),
    Math.floor(obj.forecast.forecastday[1].day.mintemp_c),obj.forecast.forecastday[1].day.maxwind_kph,
    obj.forecast.forecastday[1].day.maxwind_kph, obj.forecast.forecastday[1].day.avghumidity,
    obj.forecast.forecastday[1].day.daily_chance_of_rain));
    
    dias.push(new Dia(obj.forecast.forecastday[2].date, Math.floor(obj.forecast.forecastday[2].day.maxtemp_c),
    Math.floor(obj.forecast.forecastday[2].day.mintemp_c),obj.forecast.forecastday[2].day.maxwind_kph,
    obj.forecast.forecastday[2].day.maxwind_kph, obj.forecast.forecastday[2].day.avghumidity,
    obj.forecast.forecastday[2].day.daily_chance_of_rain));
}

//Iteramos las temperaturas
const tempPromedios = () => {
    let temperaturas = 0;
    for (const dia of dias){
        temperaturas= (temperaturas + dia.temperatura)/3
    }
    return "El promedio de temperatura semanal será "+Math.round(temperaturas)+ " grados"
}
tempPromedios();

//DOM

//Mediante la ciudad recibida en el input se hace la solicitud a la API y se ejecutan las funciones
const getWeatherData = async (city) => {
   try{
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=24fe6c35c3c64a97929234427222306&q=${city}&days=7&aqi=no&alerts=no&lang=es`);
    const data = await res.json();
    (Swal.fire({
        icon: 'success',
        title: 'Cargando Ciudad',
        timer: 2000,
        color: '#bbbbc4',
        background: '#100e1d',
      }));
    DisplayData(data);
    NewInfoArrays(data);
    Grafico(data);
   }
   catch(err){
    (Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Datos no encontrados',
        color: '#bbbbc4',
        background: '#100e1d',
      }));
   }
}
//cargamos una ciudad al iniciar
getWeatherData("Argentina");

//cargar la información del display de la pagina
const DisplayData=(obj)=>{
    console.log(obj);
    ciudad.innerText = `${obj.location.name}, ${obj.location.region} `
    temperatureDegrees.innerText = ` ${Math.floor(obj.current.temp_c)} °C `; 
    informationDay.innerText = obj.current.condition.text;
    wind.innerText = `${obj.current.wind_kph} Km/h `;
    hum.innerText = `${obj.current.humidity} % `;
    visibility.innerText = `${obj.current.vis_km} Km `;
    prep.innerText = `${obj.forecast.forecastday[0].day.daily_chance_of_rain} % Probabilidades `;
    document.getElementById('weatherIcon').src = obj.current.condition.icon;
    minTemp.innerText = `Min: ${Math.floor(obj.forecast.forecastday[0].day.mintemp_c)} °C `;
    maxTemp.innerText = `Max: ${Math.floor(obj.forecast.forecastday[0].day.maxtemp_c)} °C `;
    nextDayTemp.innerText = `Max: ${Math.floor(obj.forecast.forecastday[0].day.maxtemp_c)} °C `;
    nextDayMinTemp.innerText = `Min: ${Math.floor(obj.forecast.forecastday[0].day.mintemp_c)} °C `;
    nextDayTime.innerText = obj.forecast.forecastday[0].date;
    nextDay2Temp.innerText = `Max: ${Math.floor(obj.forecast.forecastday[1].day.maxtemp_c)} °C `;
    nextDay2MinTemp.innerText = `Min: ${Math.floor(obj.forecast.forecastday[1].day.mintemp_c)} °C `;
    nextDay2Time.innerText = obj.forecast.forecastday[1].date;
    document.getElementById('nextDayIcon').src = obj.forecast.forecastday[0].day.condition.icon;
    document.getElementById('nextDay2Icon').src = obj.forecast.forecastday[1].day.condition.icon;
    document.getElementById('nextDay3Icon').src = obj.forecast.forecastday[2].day.condition.icon;
    nextDay3Temp.innerText = `Max: ${Math.floor(obj.forecast.forecastday[2].day.maxtemp_c)} °C `;
    nextDay3MinTemp.innerText = `Min: ${Math.floor(obj.forecast.forecastday[2].day.mintemp_c)} °C `;
    nextDay3Time.innerText = obj.forecast.forecastday[2].date;
    nextDayInfo.innerText = obj.forecast.forecastday[0].day.condition.text;
    nextDay2Info.innerText = obj.forecast.forecastday[1].day.condition.text;
    nextDay3Info.innerText = obj.forecast.forecastday[2].day.condition.text;
}
//llenamos el array de temperaturas y horas
const Grafico = (obj) =>{
    for (let index = 0; index < 24; index++) {
      temps[index] = Math.round(obj.forecast.forecastday[0].hour[index].temp_c);
    }
    let ctx = document.getElementById('myChart').getContext("2d");
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx,{
        type: "bar",
        data: {
            labels: ["0hs","2hs","4hs","6hs","8hs","10hs","12hs",
            "14hs","16hs","18hs","20hs","22hs","24hs"
            ],
            datasets: [{
                label:'Temperaturas°C',
                data:[temps[0],temps[2],temps[4],temps[6],temps[8],temps[10],temps[12],
                temps[14] ,temps[16] ,temps[18] ,temps[20] ,temps[22], temps[23]],
                backgroundColor:['rgb(187, 187, 196)']
            }]
        }
      })
  }

//Tomamos los datos del input
searchForm.addEventListener("submit", e=>{
    e.preventDefault();
    console.log(searchInput.value);
    getWeatherData(searchInput.value)
})   



//darkMode
let toggleTheme = document.getElementById("toggleTheme");
let theme = localStorage.getItem('theme')

const enableDarkTheme = () => {
    document.getElementById("section").classList.add('dark__theme');
    document.getElementById("main").classList.add('dark__theme');
    document.getElementById("aside").classList.add('dark__theme');
    document.getElementById("container").classList.add('dark__theme');
    document.getElementById("myChart").classList.add('dark__theme');
    toggleTheme.innerText = "Light";
    let ctx = document.getElementById('myChart').getContext("2d");
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx,{
        type: "bar",
        data: {
            labels: ["0hs","2hs","4hs","6hs","8hs","10hs","12hs",
            "14hs","16hs","18hs","20hs","22hs","24hs"
            ],
            datasets: [{
                label:'Temperaturas°C',
                data:[temps[0],temps[2],temps[4],temps[6],temps[8],temps[10],temps[12],
                temps[14] ,temps[16] ,temps[18] ,temps[20] ,temps[22], temps[23]],
                backgroundColor:['rgb(187, 187, 196)']
            }]
        }
      })
    localStorage.setItem('theme', 'darkTheme');
    

}

const disableDarkTheme = () => {
    document.getElementById("section").classList.remove('dark__theme');
    document.getElementById("main").classList.remove('dark__theme');
    document.getElementById("aside").classList.remove('dark__theme');
    document.getElementById("container").classList.remove('dark__theme');
    document.getElementById("myChart").classList.remove('dark__theme');
    toggleTheme.innerText = "Light";
    let ctx = document.getElementById('myChart').getContext("2d");
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx,{
        type: "bar",
        data: {
            labels: ["0hs","2hs","4hs","6hs","8hs","10hs","12hs",
            "14hs","16hs","18hs","20hs","22hs","24hs"
            ],
            datasets: [{
                label:'Temperaturas°C',
                data:[temps[0],temps[2],temps[4],temps[6],temps[8],temps[10],temps[12],
                temps[14] ,temps[16] ,temps[18] ,temps[20] ,temps[22], temps[23]],
                backgroundColor:['rgb(187, 187, 196)']
            }]
        }
      })
    localStorage.setItem('theme', 'normal');
}

if (theme === 'darkTheme'){
    enableDarkTheme()
}

toggleTheme.addEventListener('click', () => {
    theme = localStorage.getItem("theme")
    if (theme != 'darkTheme'){
        enableDarkTheme();
    }else{
        disableDarkTheme();
    }
});