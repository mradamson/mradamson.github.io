const version = '?v=20170901';
const clientID = '&client_id=LYIFMOUHCNNCAIK2GRKOS52DBPYB1HTPEQHD0IIZXP4JC2OK';
const clientSecret = '&client_secret=UYYSESP0E0XNQOQ1IKRBGM0YG5V2ZEPW11DOWT4IARIHIOFU';
const key = version + clientID + clientSecret;

let map;
let markers = [];



var username = 'test2';
var password = 'c8gmrkkhwf7k';

$.ajax({
    url: 'get.php',
    data: { url: 'http://api.eventfinda.co.nz/v2/events.json?point=-36.78529801780085,174.76595878601074&radius=2' },
    success: function(res) {
        console.log(res);
    }
});



function searchEvent(icon) {

    let suburb = L.geoJSON(bound);

    $.ajax({
        url: 'get.php',
        data: { url: 'http://api.eventfinda.co.nz/v2/events.json?point=-36.78529801780085,174.76595878601074&radius=2' },
        dataType: 'json',
        success: function(res) {
            let data = res.events;
            let venues = _(data).map(function(event) {
                return {
                    latlng: [event.point.lat, event.point.lng],
                    lnglat: [event.point.lng, event.point.lat],
                    name: event.name,
                    description: event.description,
                    iconImage: icon,
                    address: event.address,
                    date: event.datetime_summary,
                    restrictions: event.restrictions,
                    link: event.url,
                    website: event.web_sites.web_sites[0].url
                };
            });
            _(venues).each(function(venue) {

                let serviceIcon = L.icon({
                    iconUrl: venue.iconImage,
                    iconSize: [40, 40]
                });

                let result = leafletPip.pointInLayer(venue.lnglat, suburb);


                if (result.length > 0) {
                    let marker = L.marker(venue.latlng, { icon: serviceIcon });
                    marker.addTo(map);
                    markers.push(marker);
                    marker.on('click', function() {

                        $.ajax({
                            url: 'get.php',
                            data: { url: 'http://api.eventfinda.co.nz/v2/events.json?point=-36.78529801780085,174.76595878601074&radius=2' },
                            dataType: 'json',
                            success: function(res) {

                                $('.modal-body1').empty();
                                $('.modal-body2').empty();
                                $('.modal-body3').empty();
                                $('.directions').empty();
                                $('.website').empty();
                                $('.modal-title').text(venue.name + ' at ' + venue.address);
                                $('.modal-body1').text(venue.description).append('<a target="#" href=' + venue.link + '>Read more</a>');
                                $('.modal-body2').text('For: ' + venue.restrictions);
                                $('.modal-body3').text('Available between: ' + venue.date);
                                $('.directions').append('<a target="#" href="https://maps.google.com?saddr=Current+Location&daddr=' + venue.latlng + '">Get Directions </a>');
                                if (venue.website == "undefined") {
                                    $('.website').empty();
                                } else {
                                    $('.website').append('<a target="#" href="' + venue.website + '">Their Website </a>');
                                }
                                $('#myModal').modal('show');

                            }
                        });
                    });
                }


            });
        }
    });
}







//-------- Search Function

function searchFunction(url, icon) {

    let suburb = L.geoJSON(bound);

    $.ajax({
        url: url,
        dataType: 'json',
        success: function(res) {
            let data = res.response.groups[0].items;
            let venues = _(data).map(function(item) {
                return {
                    latlng: [item.venue.location.lat, item.venue.location.lng],
                    lnglat: [item.venue.location.lng, item.venue.location.lat],
                    description: item.venue.name,
                    address: item.venue.location.address,
                    location: item.venue.location.city,
                    review: item.tips ? item.tips[0].text : 'No reviews',
                    iconImage: icon,
                    venueid: item.venue.id
                };
            });

            _(venues).each(function(venue) {

                let serviceIcon = L.icon({
                    iconUrl: venue.iconImage,
                    iconSize: [40, 40]
                });

                let result = leafletPip.pointInLayer(venue.lnglat, suburb);


                if (result.length > 0) {
                    let marker = L.marker(venue.latlng, { icon: serviceIcon });
                    marker.addTo(map);
                    marker.venueid = venue.venueid;
                    markers.push(marker);
                    marker.on('click', function() {

                        let venueUrl = 'https://api.foursquare.com/v2/venues/' + this.venueid + key;

                        $.ajax({
                            url: venueUrl,
                            dataType: 'json',
                            success: function(res) {

                                $('.modal-body1').empty();
                                $('.modal-body2').empty();
                                $('.modal-body3').empty();
                                $('.directions').empty();
                                $('.website').empty();
                                $('.modal-title').text(res.response.venue.name);
                                $('.modal-body2').text('Review: ' + venue.review);
                                $('.directions').append('<a target="#" href="https://maps.google.com?saddr=Current+Location&daddr=' + venue.latlng + '">Get Directions </a>');
                                if (venue.address == undefined) {
                                    $('.website').text(venue.location);
                                } else {
                                    $('.website').text(venue.address + ' ' + venue.location);

                                }





                                let photos = [];

                                if (res.response.venue.photos.groups[0]) {
                                    photos = res.response.venue.photos.groups[0].items;

                                    _(photos).each(function(photo) {
                                        let photoPath = photo.prefix + '150x150' + photo.suffix;
                                        $('<img src=' + photoPath + '>').appendTo('.modal-body1');

                                    });
                                } else {
                                    photos = ['img/placeholder.svg'];
                                    $('<img src=' + photos + '>').appendTo('.modal-body1');
                                }

                                $('#myModal').modal('show');


                            }
                        });
                    });
                }


            });
        }
    });
};
//------
$(function() {

    $.fn.extend({
        animateCss: function(animationName) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            this.addClass('animated ' + animationName).one(animationEnd, function() {
                $(this).removeClass('animated ' + animationName);
            });
            return this;
        }
    });

    let center = [-36.78529801780085, 174.76595878601074];
    let mapNE = L.latLng(-36.769728, 174.726492);
    let mapSE = L.latLng(-36.802551, 174.800564);
    let mapSW = L.latLng(-36.802792, 174.800564);
    let mapNW = L.latLng(-36.769625, 174.726492);
    let bounds = L.latLngBounds(mapNE, mapSE, mapSW, mapNW);
    map = L.map('map', { maxBounds: bounds, zoomControl: false }).setView(center, 15);
    let light = L.tileLayer('https://api.mapbox.com/styles/v1/kevinjack/cj7jtng386vbr2rp3gwu58vn4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2V2aW5qYWNrIiwiYSI6ImNqNmxncnVzYzBycGIzMnBkaG5zdGQ3c3cifQ.Q7hR9waEn5UHMWUQ1v4fGQ', { minZoom: 15 }).addTo(map);

    // zoom in function
    $('#in').click(function() {
        map.setZoom(map.getZoom() + 1);
    });
    // zoom out function
    $('#out').click(function() {
        map.setZoom(map.getZoom() - 1);
    });
    // center map function
    $('#center').click(function() {
        map.setView(center, 15);
    });

    // Takapuna 
    let takapunaPoly = {
        latlngs: [
            [-36.77993607001704, 174.74793434143066],
            [-36.79373545150328, 174.75709676742554],
            [-36.79535065870498, 174.7591781616211],
            [-36.79792804647051, 174.76211786270142],
            [-36.797721858640735, 174.76516485214233],
            [-36.79634725892455, 174.7668385505676],
            [-36.79655345045458, 174.7676968574524],
            [-36.79729229887935, 174.7680401802063],
            [-36.79718920417815, 174.768705368042],
            [-36.797275116438776, 174.7690486907959],
            [-36.79670809373787, 174.76975679397583],
            [-36.796123884140684, 174.76977825164795],
            [-36.79596923967795, 174.77089405059814],
            [-36.79706892685138, 174.7729754447937],
            [-36.7949554515793, 174.77685928344727],
            [-36.795848960435535, 174.77761030197144],
            [-36.79244669792634, 174.78029251098633],
            [-36.78878651955129, 174.77630138397217],
            [-36.78662126129863, 174.77503538131714],
            [-36.785401128504695, 174.77479934692383],
            [-36.78442157121647, 174.7754430770874],
            [-36.78473090644969, 174.77630138397217, ],
            [-36.78440438588912, 174.77673053741455],
            [-36.78373415511651, 174.77640867233276],
            [-36.782703019404906, 174.7772240638733],
            [-36.78218744634638, 174.77692365646362],
            [-36.780846940161865, 174.77694511413574],
            [-36.779626715429806, 174.77784633636475],
            [-36.77873301738629, 174.77763175964355],
            [-36.777942429661536, 174.7763442993164],
            [-36.773508112603324, 174.77587223052979],
            [-36.77199557370019, 174.77402687072754],
            [-36.77467687222591, 174.77295398712158],
            [-36.77594014383787, 174.77242827415466],
            [-36.77575967773931, 174.77149486541748],
            [-36.776077641532574, 174.7705614566803],
            [-36.777684627553455, 174.76943492889404],
            [-36.77711745986356, 174.76810455322266],
            [-36.77605186073361, 174.7668707370758],
            [-36.77551905561366, 174.76574420928955],
            [-36.77534718220434, 174.76428508758545],
            [-36.77567374135257, 174.76297616958618],
            [-36.77630966833312, 174.7609806060791],
            [-36.77704871197962, 174.75954294204712],
            [-36.77847521793724, 174.75922107696533],
            [-36.78057196163621, 174.75922107696533],
            [-36.78041728578198, 174.7580623626709],
            [-36.77916268120784, 174.75632429122922],
            [-36.781070359487515, 174.7542428970337],
            [-36.78263427653083, 174.75297689437866],
            [-36.78005637424152, 174.7497797012329],
            [-36.77993607001704, 174.74793434143066]
        ]
    };

    let polygon = L.polygon(takapunaPoly.latlngs, { color: '#394263', fillColor: '#394263', fillOpacity: 0.2, weight: 3 });
    let polygonZoom = L.polygon(takapunaPoly.latlngs, { color: '#394263', fillColor: '#394263', fillOpacity: 0, weight: 6 });

    map.addLayer(polygon);

    map.on('zoomend', function(e) {

        let zoomLevel = map.getZoom();

        if (zoomLevel == 15) {
            map.removeLayer(polygonZoom);
            map.addLayer(polygon);
            $('.logo').show();
        } else {
            map.removeLayer(polygon);
            map.addLayer(polygonZoom);
            $('.logo').hide();
        }
    });

    $('#dropdown').hide();
    $('.hamburger').click(function() {
        $('#dropdown').slideToggle('slow');
    });


    let suburb = L.geoJSON(bound, {
        style: function(feature) {
            return { color: "#394263", fillOpacity: 0 };
        }
    }).addTo(map);





    let exploreRestaurants = 'https://api.foursquare.com/v2/venues/explore' + key + '&ll=-36.78529801780085,174.76595878601074&query=food&radius=1000';
    let exploreAccommodation = 'https://api.foursquare.com/v2/venues/explore' + key + '&ll=-36.78529801780085,174.76595878601074&query=hotel&radius=1000';
    let exploreBar = 'https://api.foursquare.com/v2/venues/explore' + key + '&ll=-36.78529801780085,174.76595878601074&query=bar&radius=1000';
    let exploreShopping = 'https://api.foursquare.com/v2/venues/explore' + key + '&ll=-36.78529801780085,174.76595878601074&query=shopping&radius=1000';
    let exploreTransport = 'https://api.foursquare.com/v2/venues/explore' + key + '&ll=-36.78529801780085,174.76595878601074&query=transport&radius=1000';
    let explorePOI = 'https://api.foursquare.com/v2/venues/explore' + key + '&ll=-36.78529801780085,174.76595878601074&query=park+lake&radius=1000';
    let exploreEducation = 'https://api.foursquare.com/v2/venues/explore' + key + '&ll=-36.78529801780085,174.76595878601074&query=education+school+college&radius=1000';
    let exploreEntertainment = 'https://api.foursquare.com/v2/venues/explore' + key + '&ll=-36.78529801780085,174.76595878601074&query=cinemas&radius=1000';
    let exploreEvents = 'https://api.foursquare.com/v2/venues/explore' + key + '&ll=-36.78529801780085,174.76595878601074&query=events&radius=1000';


    const IconRestaurants = 'img/markers/food_marker.png';
    const IconAccommodation = 'img/markers/acc_marker.png';
    const IconBar = 'img/markers/bar_marker.png';
    const IconShopping = 'img/markers/shop_marker.png';
    const IconTransport = 'img/markers/bus_marker.png';
    const IconPOI = 'img/markers/poi_marker.png';
    const IconEducation = 'img/markers/edu_marker.png';
    const IconEntertainment = 'img/markers/ent_marker.png';
    const IconEvents = 'img/markers/event_marker.png';




    $('#accommodation').on('click', function() {
        _(markers).each(function(marker) {
            map.removeLayer(marker);
        });

        markers = [];
        searchFunction(exploreAccommodation, IconAccommodation);
    });
    $('#eateries').on('click', function() {
        _(markers).each(function(marker) {
            map.removeLayer(marker);
        });

        markers = [];
        searchFunction(exploreRestaurants, IconRestaurants);
    });
    $('#bar').on('click', function() {
        _(markers).each(function(marker) {
            map.removeLayer(marker);
        });

        markers = [];
        searchFunction(exploreBar, IconBar);
    });
    $('#shopping').on('click', function() {
        _(markers).each(function(marker) {
            map.removeLayer(marker);
        });

        markers = [];
        searchFunction(exploreShopping, IconShopping);
    });
    $('#transport').on('click', function() {
        _(markers).each(function(marker) {
            map.removeLayer(marker);
        });

        markers = [];
        searchFunction(exploreTransport, IconTransport);
    });
    $('#poi').on('click', function() {
        _(markers).each(function(marker) {
            map.removeLayer(marker);
        });

        markers = [];
        searchFunction(explorePOI, IconPOI);
    });
    $('#education').on('click', function() {
        _(markers).each(function(marker) {
            map.removeLayer(marker);
        });

        markers = [];
        searchFunction(exploreEducation, IconEducation);
    });
    $('#entertainment').on('click', function() {
        _(markers).each(function(marker) {
            map.removeLayer(marker);
        });

        markers = [];
        searchFunction(exploreEntertainment, IconEntertainment);
    });
    $('#events').on('click', function() {
        _(markers).each(function(marker) {
            map.removeLayer(marker);
        });

        markers = [];
        searchEvent(IconEvents);
    });









});