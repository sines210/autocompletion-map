const cl = console.log


var searchBar = document.querySelector('#search');
var selectButton = document.querySelector('#selectButton');
var searchList = document.querySelector('#searchList');
var searchBlock = document.querySelector('#searchBlock')
var cityList;
var mapBox = document.querySelector('#mapBox')
var mapId = document.querySelector('#mapid');
var closeMap = document.querySelector('#closeMap')
var temperature = document.querySelector('#temperature');
var main = document.querySelector('main');
var ctx = document.querySelector('#myChart');


// dissimulation du bouton close de la carte 
closeMap.style.display='none'




var getDataCompletion = (parameters) => {
    var url = 'https://places-dsn.algolia.net/1/places/query';
    fetch(url, {
        method : 'POST',
        body:JSON.stringify({query: parameters, "type":'city',  'language':'fr', 'hitsPerPage':'8'})

        
    })
    .then(response=>response.json())  
    .then((data)=>{ 

        //clear la liste des villes avant l'éxécution (et rééxécution du code) permet de ne pas avoir les résultats qui s'accumulent à chaque lettre tapée
        searchList.innerHTML='';

        data.hits.forEach(element => {
 
             cityListing = element.locale_names
             searchList.insertAdjacentHTML('beforeend', `<button class='clickResult'><i class="fas fa-map-marker-alt"></i>${(cityListing)}  </button>`); 
             
             resultToClick = document.querySelectorAll('.clickResult');
           


            resultToClick.forEach(element => {
                //le domctivate event te permet d'activer les liens à la navigation clavier au clic et à l'entrée
                element.addEventListener('DOMActivate', (event)=>{
                        searchList.innerHTML='';
                        closeMap.style.display='block';
                        currentMeteo(element.innerText);
                        
            });
        });
            
    })

})
}



var getMap = (el) => {

    var token ='https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2luZXMyMTAiLCJhIjoiY2trc3AwOGVqMHE2MzJwcGM1MWN5eXp1YiJ9.PwluY1DxHPpffk2eql7-pg'


    var container = L.DomUtil.get('mapid');
    if(container != null){
      container._leaflet_id = null;
    }

    var mymap = L.map('mapid').setView(el, 13);    

        L.tileLayer(token, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        watch: true,
        setView: true,
        accessToken: 'pk.eyJ1Ijoic2luZXMyMTAiLCJhIjoiY2trc3AwOGVqMHE2MzJwcGM1MWN5eXp1YiJ9.PwluY1DxHPpffk2eql7-pg'
       
    }).addTo(mymap);
    //popup exemple=>
//  L.popup()
//     .setLatLng(el)
//     .setContent('<p>popup example.</p>')
//     .openOn(mymap);

}


var getChart = (temp, date)=>{
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
        //    labels: date,
            datasets: [{
                label: '5 days temperatures',
                data: temp, 
                backgroundColor: [
                    'blue',
                    'yellow',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            layout: {
                padding: {
                    left: 20,
                    right: 800,
                    top: 0,
                    bottom: 500
                }
              
            }
        }
    });
    }

var currentMeteo = (parameters) =>{
  var url =  `http://api.openweathermap.org/data/2.5/forecast?q=${parameters}&units=metric&lang=fr&appid=9d785e4be242978d5c675be91bd50019` 
//icons : //   var urlImg= 'http://openweathermap.org/img/wn/10d@2x.png'
    
    fetch(url)
    .then(response=>response.json())
    .then((data)=>{
        cl(data)
            var getTemper = data.list[0].main.temp
            temperature.innerHTML= Math.round(getTemper)+"°"
            // cl(data.list[0].weather[0].icon)

            var forecast = [data.list[0].main.temp, data.list[8].main.temp, data.list[16].main.temp, data.list[24].main.temp, data.list[32].main.temp ]
            // var dateForecast = 
            var coordinates = data.city.coord

            getMap(coordinates)
            getChart(forecast)


            if(getTemper<=-15)
            {document.body.style.background='#bad6d0'}
            else if (getTemper<0 && getTemper>-15)
            {document.body.style.background='#81c7b9'}
            else if (getTemper<10 && getTemper>=0  )
            {document.body.style.background='#89e3e8'}
            else if (getTemper<20 && getTemper>=10 )
            {document.body.style.background='#74e8a8'}
            else if (getTemper<30 && getTemper>=20)
            {document.body.style.background='#e8ac46'}
            else if (getTemper>=30)
            {document.body.style.background='#db663b'}

        //voir pour mettre des img en bg
    })
}



//event autocomplétion
searchBar.addEventListener('keyup', (event)=>{
    if(!searchBar.value){
        event.preventDefault();
        searchList.innerHTML=""; 
    }
    else{  getDataCompletion(searchBar.value);
        currentMeteo()}
})



//event réinitialisation barre de recherche et dissimulation de la liste
searchBar.addEventListener('DOMActivate', (event)=>{
    searchBar.value='';
    searchList.innerHTML='';
})

//reload la page à la fermeture de la carte
closeMap.addEventListener('DOMActivate', (event)=>{
    document.location.reload();
})





//TODO


//ce qui pourrait etre intéressant c'est de rajouter la carte à l'appli météo et que au clic sur une ville on accède aux données météo sinon ya pas d'intérêt à rajouter une carte


//voir circle et polygon pour récupérer des données sur la carte

