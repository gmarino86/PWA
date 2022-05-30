const API_KEY = "ac313d72ccbe79ebc1acf7fff480f5be";
const URL_WEATHER = "https://api.openweathermap.org/geo/1.0/direct?";
const URL_WEATHER_CITY = "https://api.openweathermap.org/data/2.5/weather?";

const BTN_BUSCAR = document.getElementById("btnBuscar");
const INPUT_TEXT = document.getElementById("inputText");

BTN_BUSCAR.addEventListener("click", () => {
  let ciudad = INPUT_TEXT.value;
  if (ciudad) {
    fetchCiudad(ciudad)
      .then(function (ciudades) {
        localStorage.setItem("city", JSON.stringify(ciudades));
        armarInfo(ciudades);
      })
      .catch(function (err) {
        console.log("Terminé con error: ", err);
      });
  } else {
    let main = document.getElementById("main");
    main.innerText = "Ingrese un valor";
  }
});

function fetchCiudad(ciudad) {
  return fetch(`${URL_WEATHER}q=${ciudad}&limit=6&appid=${API_KEY}`).then(
    function (data) {
      return data.json();
    }
  );
}

function armarInfo(ciudades) {
  console.log(ciudades);
  let main = document.getElementById("main");
  let view = "";
  view += '<div class="row">';

  for (let i = 0; i < ciudades.length; i++) {
    view += `
        <div class="col-sm-4 mb-3">
            <div class="card" onClick=listarCard(`;
    view += i;
    view += `,${ciudades[i].lat},${ciudades[i].lon}`;
    view += `)>
        <div class="card-body">
            <h3 class="card-title">${ciudades[i].name}</h3>
            `;
    if (ciudades[i].state) {
      view += `<p class="card-text">${ciudades[i].state}</p>`;
    }
    view += `
                    <p class="card-text">${ciudades[i].country}</p>
                </div>
            </div>
        </div>
        `;
  }
  view += "</div>";

  main.innerHTML = view;
}

function listarCard(lat, lon) {
  return fetch(
    `${URL_WEATHER_CITY}lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
  )
    .then(function (data) {
      return data.json();
    })
    .then(function (c) {
      crearModal(c);
    })
    .catch(function (err) {
      console.log("Terminé con error: ", err);
    });
}

function crearModal(c) {
  let data = c;
  console.log(c);
  let divModal = document.getElementById("insertModal");

  let modal = "";
  modal += `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-dark bg-gradient text-white"">
                    <h4 class="modal-title" id="staticBackdropLabel">${c.name}</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body fondo`
                
                modal +=`">
                <video autoplay="autoplay" loop="loop" id="video_background" preload="auto" volume="50"/>
                `    
                    switch (c.weather[0].main) {
                        case 'Clouds':
                            modal += `<source src="img/clouds.mp4" type="video/mp4" />`
                            break;

                        case 'Thunderstorm':
                            modal += `<source src="img/rain.mp4" type="video/mp4" />`
                            break;
                        case 'Drizzle':
                            modal += `<source src="img/rain.mp4" type="video/mp4" />`
                            break;
                        case 'Rain':
                            modal += `<source src="img/rain.mp4" type="video/mp4" />`
                            break;
                        
                        case 'Snow':
                            modal += `<source src="img/snow.mp4" type="video/mp4" />`
                            break;

                        case 'Clear':
                            modal += `<source src="img/sun.mp4" type="video/mp4" />`
                            break;
                        
                        default:
                            modal += `<source src="img/mist.mp4" type="video/mp4" />`
                            break;
                    }

                modal +=`</video/>
                    <p><b>Temperatura:</b> ${Math.round(c.main.temp)} °C</p>
                    <p>Hay ${c.weather[0].description}</p> 
                    
                    <div class="text-center">
                        <img src="http://openweathermap.org/img/wn/${c.weather[0].icon}@2x.png" alt="${c.weather[0].description}">
                    </div>

                    <p><b>Temperatura Máxima:</b> ${Math.round(c.main.temp_max)}</p>
                    <p><b>Temperatura Minima:</b> ${Math.round(c.main.temp_min)}</p>
                    <p><b>Humedad:</b> ${c.main.humidity}</p>
                    <p><b>Sensacion Térmica:</b> ${Math.round(c.main.feels_like)}</p>
                    <p><b>Presión atmosférica:</b> ${c.main.pressure}</p>
                    <p><b>Velocidad del viento:</b> ${Math.round(c.wind.speed)} km/h</p>
                    
                    </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Salir</button>
                </div>
            </div>
        </div>
    </div>
    `;

  divModal.innerHTML = modal;

  var myModal = new bootstrap.Modal(document.getElementById("staticBackdrop"), {
    keyboard: false,
  });

  myModal.show();
}

init();

function init() {
  verLocalStorage();
}

function verLocalStorage() {
  let ciudades = localStorage.getItem("city");
  if (ciudades != null) {
    armarInfo(JSON.parse(ciudades));
  } else {
    let main = document.getElementById("main");
    main.innerText = "Busque la temperatura de la ciudad que desee";
  }
}
