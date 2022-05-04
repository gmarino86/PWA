const API_KEY = "ac313d72ccbe79ebc1acf7fff480f5be";
const URL_WEATHER = "http://api.openweathermap.org/geo/1.0/direct?";
const URL_WEATHER_CITY = "https://api.openweathermap.org/data/2.5/weather?"

const BTN_BUSCAR = document.getElementById('btnBuscar')
const INPUT_TEXT = document.getElementById('inputText')


BTN_BUSCAR.addEventListener("click", () => {
    let ciudad = INPUT_TEXT.value

    fetchCiudad(ciudad)
        .then(function (ciudades) {
            armarInfo(ciudades)
        })
        .catch(function (err) {
            console.log("Terminé con error: ", err);
        });
});

function fetchCiudad(ciudad)
{
    return fetch(`${URL_WEATHER}q=${ciudad}&limit=6&appid=${API_KEY}`)
        .then(function (data) {
            return data.json()
        })
}

function armarInfo(ciudades) {
    let main = document.getElementById('main')
    let view = ''
    view += '<div class="row">'
    
    for (let i = 0; i < ciudades.length; i++) {
        view += `
        <div class="col-sm-4 mb-3">
            <div class="card" onClick=listarCard(`
        view += i
        view += `)>
                <div class="card-body">
                    <h3 class="card-title">${ciudades[i].name}</h3>
                    <p class="card-text">${ciudades[i].state}</p>
                    <p class="card-text">${ciudades[i].country}</p>
                </div>
            </div>
        </div>
        `
    }
    view += '</div>'

    main.innerHTML = view
}

function listarCard(i) {
    
    let ciudad = INPUT_TEXT.value

    fetchCiudad(ciudad)
    .then(function (ciudades) {
        return fetch(`${ URL_WEATHER_CITY }lat=${ciudades[i].lat}&lon=${ciudades[i].lon}&appid=${API_KEY}&units=metric&lang=es`)
    })
    .then(function (data){
        return data.json()
    })
    .then(function (c) {
        crearModal(c)
    })
    .catch(function (err) {
        console.log("Terminé con error: ", err);
    });
}

function crearModal(c) 
{
    let data = c
    console.log(c)
    let divModal = document.getElementById('insertModal')
    
    let modal = ''
    modal += `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-dark bg-gradient text-white"">
                    <h4 class="modal-title" id="staticBackdropLabel">${c.name}</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p><b>Temperatura:</b> ${c.main.temp} °C</p>
                    <p>Hay ${c.weather[0].description}</p> 
                    
                    <div class="text-center">
                        <img src="http://openweathermap.org/img/wn/${c.weather[0].icon}@2x.png" alt="${c.weather[0].description}">
                    </div>

                    <p><b>Temperatura Máxima:</b> ${c.main.temp_max}</p>
                    <p><b>Temperatura Minima:</b> ${c.main.temp_min}</p>
                    <p><b>Humedad:</b> ${c.main.humidity}</p>
                    <p><b>Sensacion Térmica:</b> ${c.main.feels_like}</p>
                    <p><b>Presión atmosférica:</b> ${c.main.pressure}</p>
                    <p><b>Velocidad del viento:</b> ${c.wind.speed} km/h</p>
                    
                    </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Salir</button>
                </div>
            </div>
        </div>
    </div>
    `

    divModal.innerHTML = modal

    var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {
        keyboard: false
    })

    myModal.show()
}
