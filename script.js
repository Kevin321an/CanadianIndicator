/* Categories 1.population; 2.unemploymentRate; 3,realStateAverage; 4, buyHomeAverageTime; 5. daysAbove24C; 6.crimeRate */
var category;
var maxNumber;
var minNumber;
var title;
var dataType;

category=1;
maxNumber=canadaData.population.max;
minNumber=canadaData.population.min;
title=canadaData.population.title;
dataType=canadaData.population.dataType;

//Function drawMap() {
var map = L.map('map').setView([55, -96], 4);
map.attributionControl.addAttribution('Data from <a href="http://www.moneysense.ca/canadas-best-places-to-live-2015-full-ranking/">Money Sense</a>');

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                 '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                 'Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.light'
}).addTo(map);

// control that shows province info on hover
var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};
info.update = function (props) {
    switch (category) {
        case 1:
            var content=(props ?
                '<b>' + props.NAME + '</b><br />' + props.population + ' ' + canadaData.population.dataType
                : 'Hover over a province');    	
            break;

        case 2:
            var content =props ?
            '<b>' + props.NAME + '</b><br />' + props.unemploymentRate + ' ' + canadaData.unemploymentRate.dataType
            : 'Hover over a province';
            break;

        case 3:
            var content =props ?
            '<b>' + props.NAME + '</b><br />' + props.realStateAverage + ' ' + canadaData.realStateAverage.dataType
            : 'Hover over a province';
            break;

        case 4:
            var content =props ?
            '<b>' + props.NAME + '</b><br />' + props.buyHomeAverageTime + ' ' + canadaData.buyHomeAverageTime.dataType
            : 'Hover over a province';
            break;

        case 5:
            var content =props ?
            '<b>' + props.NAME + '</b><br />' + props.daysAbove24C + ' ' + canadaData.daysAbove24C.dataType
            : 'Hover over a province';
            break;

        case 6:
            var content =props ?
            '<b>' + props.NAME + '</b><br />' + props.crimeRate + ' ' + canadaData.crimeRate.dataType
            : 'Hover over a province';
            break;
    }

    if (content.indexOf("-")==-1) {
        this._div.innerHTML = '<h4>'+ title +'</h4>' + content;
    }
    else {
        this._div.innerHTML = '<h4>'+ title +'</h4>' + "No Data";
    }
};
info.addTo(map);

// get color depending on population value
function getColor(d) {
    var col=Math.round(120-(d-minNumber)/(maxNumber-minNumber)*120);
    var hslColor="hsl("+col+",75%,50%)";
    return hslColor;
}

function style(feature) {
    switch (category) {
        case 1:
            var col=getColor(feature.properties.population)
            break;
        case 2:
            var col=getColor(feature.properties.unemploymentRate)
            break;
        case 3:
            var col=getColor(feature.properties.realStateAverage)
            break;
        case 4:
            var col=getColor(feature.properties.buyHomeAverageTime)
            break;
        case 5:
            var col=getColor(feature.properties.daysAbove24C)
            break;
        case 6:
             var col=getColor(feature.properties.crimeRate)
            break;
    }

    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,         
        fillColor: col
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var geojson;
geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [maxNumber/100*10,maxNumber/100*20,maxNumber/100*30,maxNumber/100*40,maxNumber/100*50,maxNumber/100*60,maxNumber/100*70,maxNumber/100*80,maxNumber/100*90,maxNumber],
        labels = [],
        from, to;

    for (var i = grades.length-1; i >=0 ; i--) {
        from = grades[i];
        to = grades[i];

        switch (category) {
            case 1:
                 labels.push(
                '<i style="background:' + getColor(from) + '"></i> ' +
                Math.round(from/1000000)+"M");
                break;
            case 2:
                labels.push(
               '<i style="background:' + getColor(from) + '"></i> ' +
                Math.round(from)+"%");
                break;
            case 3:
                 labels.push(
                '<i style="background:' + getColor(from) + '"></i> ' +
                Math.round(from/1000)+"K");
                break;
            case 4:
                  labels.push(
                '<i style="background:' + getColor(from) + '"></i> ' +
                Math.round(from)+" Years");
                break;
            case 5:

                labels.push(
                '<i style="background:' + getColor(from) + '"></i> ' +
                Math.round(from)+" Days");
                break;
            case 6:
                  labels.push(
                '<i style="background:' + getColor(from) + '"></i> ' +
                Math.round(from/1000));
                break;
        }
    }     

    div.innerHTML = labels.join('<br>');
    return div;
};
legend.addTo(map);

var options = L.control({position: 'bottomleft'});
options.onAdd = function (map) {
    var div = L.DomUtil.create('div');
    div.innerHTML = '<div class=row>' +
                        '<div class="col m4">' +
                            '<div class="card whites">' +
                                '<div class="card-content black-text">' +
                                    '<p class="card-title">Indicators</p>' +
                                    '<p>Canada\'s best place to live - 2015. Based on the best cities to live according to Money Sense report, grouped by provinces.</p>' +
                                    '<form action="#">' +
                                        '<p>' +
                                            '<input class="with-gap white" name="group1" type="radio" id="test1" onclick="showPopulation()" checked/>' +
                                            '<label for="test1">Population</label>' +
                                        '</p>' +
                                        '<p>' +
                                            '<input class="with-gap white" name="group1" type="radio" id="test2" onclick="showUnemploymentRate()"/>' +
                                            '<label for="test2">Unemployment Rate</label>' +
                                        '</p>' +
                                        '<p>' +
                                            '<input class="with-gap white" name="group1" type="radio" id="test3" onclick="showRealStateAverage()"/>' +
                                            '<label for="test3">Real State Average</label>' +
                                        '</p>' +
                                        '<p>' +
                                            '<input class="with-gap white" name="group1" type="radio" id="test4" onclick="showBuyHomeAverageTime()"/>' +
                                            '<label for="test4">Buy Home Average Time</label>' +
                                        '</p>' +
                                        '<p>' +
                                            '<input class="with-gap white" name="group1" type="radio" id="test5" onclick="showDaysAbove24C()"/>' +
                                            '<label for="test5">Days Above 24C</label>' +
                                        '</p>' +
                                        '<p>' +
                                            '<input class="with-gap white" name="group1" type="radio" id="test6" onclick="showCrimeRate()"/>' +
                                            '<label for="test6">Crime Rate</label>' +
                                        '</p>' +
                                    '</form>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
    return div;
};
options.addTo(map);

function showPopulation() {
    category=1;
    maxNumber=canadaData.population.max;
    minNumber=canadaData.population.min;
    title=canadaData.population.title;
    dataType=canadaData.population.dataType;
    updateMap();
}

function showUnemploymentRate() {
    category=2;
    maxNumber=canadaData.unemploymentRate.max;
    minNumber=canadaData.unemploymentRate.min;
    title=canadaData.unemploymentRate.title;
    updateMap();
}

function showRealStateAverage() {
    category=3;
    maxNumber=canadaData.realStateAverage.max;
    minNumber=canadaData.realStateAverage.min;
    title=canadaData.realStateAverage.title;
    updateMap();
}

function showBuyHomeAverageTime() {
    category=4;
    maxNumber=canadaData.buyHomeAverageTime.max;
    minNumber=canadaData.buyHomeAverageTime.min;
    title=canadaData.buyHomeAverageTime.title;
    updateMap();
}

function showDaysAbove24C() {
    category=5;
    maxNumber=canadaData.daysAbove24C.max;
    minNumber=canadaData.daysAbove24C.min;
    title=canadaData.daysAbove24C.title;
    updateMap();
}

function showCrimeRate() {
    category=6;
    maxNumber=canadaData.crimeRate.max;
    minNumber=canadaData.crimeRate.min;
    title=canadaData.crimeRate.title;
    updateMap();
}

function updateMap() {
    geojson.setStyle(style);
    if (legend != undefined) {
        legend.removeFrom(map);
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [maxNumber/100*10,maxNumber/100*20,maxNumber/100*30,maxNumber/100*40,maxNumber/100*50,maxNumber/100*60,maxNumber/100*70,maxNumber/100*80,maxNumber/100*90,maxNumber],
                labels = [],
                from, to;

            for (var i = grades.length-1; i >=0 ; i--) {
                from = grades[i];
                to = grades[i];

                switch (category) {
                    case 1:
                         labels.push(
                        '<i style="background:' + getColor(from) + '"></i> ' +
                        Math.round(from/1000000)+"M");
                        break;
                    case 2:
                        labels.push(
                       '<i style="background:' + getColor(from) + '"></i> ' +
                        Math.round(from)+"%");
                        break;
                    case 3:
                         labels.push(
                        '<i style="background:' + getColor(from) + '"></i> ' +
                        Math.round(from/1000)+"K");
                        break;
                    case 4:
                          labels.push(
                        '<i style="background:' + getColor(from) + '"></i> ' +
                        Math.round(from)+" Years");
                        break;
                    case 5:

                        labels.push(
                        '<i style="background:' + getColor(from) + '"></i> ' +
                        Math.round(from)+" Days");
                        break;
                    case 6:
                          labels.push(
                        '<i style="background:' + getColor(from) + '"></i> ' +
                        Math.round(from/1000));
                        break;
                }
            }     

            div.innerHTML = labels.join('<br>');
            return div;
        };
        legend.addTo(map);
    }
    info.update();
}
