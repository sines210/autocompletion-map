var searchBar = document.querySelector('#search');
var selectButton = document.querySelector('#selectButton');
var searchList = document.querySelector('#searchList');
var searchBlock = document.querySelector('#searchBlock')
var cityList;
var mapId = document.querySelector('#mapid');
var closeMap = document.querySelector('#closeMap')
var geoLoc=[];
var geoLocTab=[]

//initialisation d'un bouléen qui pourrait servir par la suite et dissimulation du bouton close de la carte 
var isActive = false;
closeMap.style.display='none'




var getDataCompletion = () => {
    var url = 'https://places-dsn.algolia.net/1/places/query';
    fetch(url, {
        method : 'POST',
        body:JSON.stringify({"query":`${searchBar.value}`, "type":'city',"countries": ["fr"], 'language':'fr', 'hitsPerPage':'10'})
    })
    .then(response=>response.json())  
    .then((data)=>{ 
        console.log(data)
        data.hits.forEach(element => {
            // console.log(data.hits)
                geoLoc = element._geoloc
                console.log(geoLoc)
            
            // geoLocTab.push(geoLoc)
             cityListing = element.locale_names
             searchList.insertAdjacentHTML('beforeend', `<button class='clickResult'><i class="fas fa-map-marker-alt"></i>${(cityListing)}</button>`); 
             resultToClick = document.querySelectorAll('.clickResult');
           
            resultToClick.forEach(element => {

                //le domctivate event te permet d'activer les liens à la navigation clavier au clic et à l'entrée
                element.addEventListener('DOMActivate', ()=>{
                        getMap(geoLoc);
                        searchList.innerHTML='';
                        closeMap.style.display='block'

            });
        });
            
    })

})
}

      
//la map peut être custom de multiple maniere il faut aller voir l'API pour lui rajouter des fonctionnalités
var getMap = (el) => {

    var token ='https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2luZXMyMTAiLCJhIjoiY2trc3AwOGVqMHE2MzJwcGM1MWN5eXp1YiJ9.PwluY1DxHPpffk2eql7-pg'

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
 L.popup()
    .setLatLng(el)
    .setContent('<p>Here is an example of popup we can set on the map.</p>')
    .openOn(mymap);

}

//event autocomplétion
searchBar.addEventListener('keyup', (event)=>{
    getDataCompletion();
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

