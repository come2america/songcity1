var street = ''
var city = '';
var state = '';
var zip = '';
var selectedTrackname = '';
var selectedArtist = '';
var selectedTrackId = '';
var assigntrack = '';
var image = '';
var ituneurl = ''

var tags= [" A Song For Where You Are The Most" ,"A Song For The Road", "A Song For Your Destination", "A Song For Any Location"];
setInterval(function(){ 


$("#tagline").html("<h3>" + tags[Math.floor((Math.random() * 4))]+ "</h3>");
console.log(tags[y])

},6000)




function songlistgetter(songlist) {

    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/http://en.wikipedia.org/w/api.php?action=parse&format=json&page=" + songlist.title + "&prop=links",
        method: "GET"
    }).then(function (result) {

        var song = result.parse.links[Math.floor((Math.random() * 80) + 1)]["*"];

        var queryURL = "https://itunes.apple.com/search?term=" + song + "&limit=1";
        $.ajax({
            url: queryURL,
            dataType: "jsonp",
            success: function (response) {
                //console.log(response)
                var queryURL = "https://itunes.apple.com/lookup?id=" + response.results[0].trackId;
                $.ajax({
                    url: queryURL,
                    dataType: "jsonp",
                    success: function (response) {
                        // console.log(response)
                        var image = $("<img>").attr({ src: response.results[0].artworkUrl100 })
                        $("#buylink").attr({ href: " https://geo.itunes.apple.com/us/album/id" + response.results[0].collectionId + "?i=" + response.results[0].trackId + "&at=1000lR4Q" })
                        $("#amazonlink").attr({ href: "https://www.amazon.com/gp/search?ie=UTF8&tag=locationsong1-20&linkCode=ur2&linkId=a2760e14a2d286d92bc32fdeae1f4b8d&camp=1789&creative=9325&index=digital-music&keywords=" + response.results[0].artistName + " " + response.results[0].trackName })
                        selectedTrackname = response.results[0].trackName
                        selectedArtist = response.results[0].artistName
                        selectedTrackId = response.results[0].trackId
                        $('#title').html(selectedTrackname);
                        $('#artist').html(selectedArtist);
                        $('#wiki').html(selectedTrackId);
                        $("#linkhere").html(image);

                        gapi.load('auth2', function () {
                        });

                        var searchKey = selectedArtist + selectedTrackname;
                        var apiKey = "AIzaSyB6eT2et-bDuQ2u7rfBBsWkmxjTP--QqXw";

                        var queryURL = "https://www.googleapis.com/youtube/v3/search?key=" + apiKey +
                            "&part=snippet&q=" + searchKey + "&type=video"

                        console.log(queryURL);
                        var x = document.getElementById("#title");
                        console.log(x);

                        $.ajax({
                            url: queryURL,
                            method: "GET"
                        }).then(function (response) {
                            // console.log(response);
                            // console.log(response.items[0].id.videoId);
                            var videoID = response.items[0].id.videoId;
                            $('#vid').attr('src', 'https://www.youtube.com/embed/' + videoID);
                        });

                    }
                });
            }
        });

    })
}

function artistGetter() {

    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/http://en.wikipedia.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:Lists_of_songs_recorded_by_American_artists",

        method: "GET"
    }).then(function (response) {

        // console.log(response)
        var americancat = response.query.categorymembers
        //console.log(americancat);

        for (var i = 0; i < americancat.length; i++) {
            var songlist = americancat[Math.floor((Math.random() * 4))]
            songlistgetter(songlist)
        }
    })
};

function youtubeVid() {
    gapi.load('auth2', function () {
    });

    var searchKey = selectedArtist + selectedTrackname;
    var apiKey = "AIzaSyB6eT2et-bDuQ2u7rfBBsWkmxjTP--QqXw";

    var queryURL = "https://www.googleapis.com/youtube/v3/search?key=" + apiKey +
        "&part=snippet&q=" + searchKey + "&type=video"

    console.log(queryURL);
    var x = document.getElementById("#title");
    console.log(x);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // console.log(response);
        // console.log(response.items[0].id.videoId);
        var videoID = response.items[0].id.videoId;
        $('#vid').attr('src', 'https://www.youtube.com/embed/' + videoID);
    });

}

$("#submit").on("click", function (event) {

    event.preventDefault();
    street = $("#street").val().trim().toLowerCase();
    city = $("#city").val().trim().toLowerCase();
    state = $("#state").val().trim().toLowerCase();


    var ref = firebase.database().ref();

    ref.orderByChild("userstreet").equalTo(street).on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            console.log(childSnapshot)
            var value = childSnapshot.val();
            assigntrack = value.usertrackid;
        });

        if (snapshot.val()) {
            console.log("if statement executed");

            var queryURL = "https://itunes.apple.com/lookup?id=" + assigntrack + " &limit=200";


            $.ajax({
                url: queryURL,
                dataType: "jsonp",
                success: function (response) {

                    console.log(response)
                    image = $("<img>").attr({ src: response.results[0].artworkUrl100 })

                    selectedTrackname = response.results[0].trackName
                    selectedArtist = response.results[0].artistName
                    selectedTrackId = response.results[0].trackId
                    $('#title').html(selectedTrackname);
                    $('#artist').html(selectedArtist);
                    $('#wiki').html(selectedTrackId);
                    $("#linkhere").html(image);

                    $("#buylink").attr({ href: " https://geo.itunes.apple.com/us/album/id" + response.results[0].collectionId + "?i=" + response.results[0].trackId + "&at=1000lR4Q" })
                    $("#amazonlink").attr({ href: "https://www.amazon.com/gp/search?ie=UTF8&tag=locationsong1-20&linkCode=ur2&linkId=a2760e14a2d286d92bc32fdeae1f4b8d&camp=1789&creative=9325&index=digital-music&keywords=" + response.results[0].artistName + " " + response.results[0].trackName })
                    mappingApi();
                    youtubeVid();
                }
            });
        }
        else {
            console.log("else executed");
            artistGetter();
            mappingApi();

        }


    });
    // $("#wavesframe").attr('src', 'https://maps.google.com/maps?q='+street+city+state+'&z=10&output=embed')

    database.ref().on("child_added", function (snapshot) {
        var data = snapshot.val();
        var tdstreet = "<p>" + data.userstreet + "</p>";
        var tdcity = "<p>" + data.usercity + "</p>";
        var tdstate = "<p>" + data.userstate + "</p>";
        var tdtitle = "<p>" + data.usertitle + "</p>";
        var tdartist = "<p>" + data.userartist + "</p>";
        var tdtrackid = "<p>" + data.usertrackid + "</p>";
    
        //$("#displayDiv").html(tdstreet, tdcity, tdstate)
    
        $('#title').html(tdtitle);
        $('#artist').html(tdartist);
        $('#wiki').html(tdtrackid);
    
    })
    // Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("submit");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

});
$("#wavesframe").attr('src', 'https://maps.google.com/maps?q=' + street + city + state + '&z=10&output=embed')

function mappingApi() {
    var apiKey = "jqnjIbmIDCL7UaGiP6SPvbfGTlGTs9z0";
    var queryURL = " https://www.mapquestapi.com/geocoding/v1/address?key=" + apiKey + "&adminArea3=" + state + "&adminArea1=US&adminArea5=" + city + "&street=" + street;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        $(".placeholder").html("Latitude: " + response.results[0].locations[0].latLng.lat + " Longitude: " + response.results[0].locations[0].latLng.lng);
        var upperStreet = street.toUpperCase();
        var upperCity = city.toUpperCase();
        var upperState = state.toUpperCase();
        var postalCode = response.results[0].locations[0].postalCode;
        $(".placeholder").append("<div>" + (upperStreet + ", " + upperCity + ", " + upperState + " " + postalCode) + "</div>");

        console.log("mappingApi", selectedArtist + selectedTrackname);

        // $("#wavesframe").attr('src', "https://embed.waze.com/iframe?zoom=13&lat="+response.results[0].locations[0].latLng.lat+"&lon="+response.results[0].locations[0].latLng.lng+"&pin=1") 
        var mapProp = {
            center: new google.maps.LatLng(response.results[0].locations[0].latLng.lat, response.results[0].locations[0].latLng.lng),
            zoom: 15
        };
        var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(response.results[0].locations[0].latLng.lat, response.results[0].locations[0].latLng.lng),
            map: map,

       
       
        });
        marker.setMap(map);
        
        // var geocoder;
        // var map;
        // var address = street+city+state 

        // function initialize() {
        //   geocoder = new google.maps.Geocoder();
        //   var latlng = new google.maps.LatLng(response.results[0].locations[0].latLng.lat,  response.results[0].locations[0].latLng.lng);
        //   var myOptions = {
        //     zoom: 8,
        //     center: latlng,
        //     mapTypeControl: true,
        //     mapTypeControlOptions: {
        //       style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        //     },
        //     navigationControl: true,
        //     mapTypeId: google.maps.MapTypeId.ROADMAP
        //   };
        //   map = new google.maps.Map(document.getElementById("googleMap"), myOptions);
        //   if (geocoder) {
        //     geocoder.geocode({
        //       'address': address
        //     }, function(results, status) {
        //       if (status == google.maps.GeocoderStatus.OK) {
        //         if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
        //           map.setCenter(results[0].geometry.location);

        //           var infowindow = new google.maps.InfoWindow({
        //             content: '<b>' + address + '</b>',
        //             size: new google.maps.Size(150, 50)
        //           });

        //           var marker = new google.maps.Marker({
        //             position: results[0].geometry.location,
        //             map: map,
        //             title: address
        //           });
        //           google.maps.event.addListener(marker, 'click', function() {
        //             infowindow.open(map, marker);
        //           });

        //         } else {
        //           alert("No results found");
        //         }
        //       } else {
        //         alert("Geocode was not successful for the following reason: " + status);
        //       }
        //     });
        //   }
        // }
        // google.maps.event.addDomListener(window, 'load', initialize);


    });


}


$("#current").on("click", function () {
   // Get the modal
   var modal = document.getElementById("myModal");

   // Get the button that opens the modal
   var btn = document.getElementById("current");
   
   // Get the <span> element that closes the modal
   var span = document.getElementsByClassName("close")[0];
   
   // When the user clicks on the button, open the modal 
   btn.onclick = function() {
     modal.style.display = "block";
   }
   
   // When the user clicks on <span> (x), close the modal
   span.onclick = function() {
     modal.style.display = "none";
   }
   
   // When the user clicks anywhere outside of the modal, close it
   window.onclick = function(event) {
     if (event.target == modal) {
       modal.style.display = "none";
     }
   }
currentor()
artistGetter()
songlistgetter()
youtubeVid()


})
    function currentor() {
        // Note: This example requires that you consent to location sharing when
        // prompted by your browser. If you see the error "The Geolocation service
        // failed.", it means you probably did not give permission for the browser to
        var x = document.getElementById("displayDiv");

        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        function showPosition(position) {
            x.innerHTML = "Latitude: " + position.coords.latitude +
                "<br>Longitude: " + position.coords.longitude;
            var mapProp = {
                center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                zoom: 15
            };
            var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                map: map,

            });
            marker.setMap(map);


        }
        getLocation()
    }


var database = firebase.database();
$("#loveit").on("click", function (event) {
    event.preventDefault();

    street = $("#street").val().trim().toLowerCase();
    city = $("#city").val().trim().toLowerCase();
    state = $("#state").val().trim().toLowerCase();

    database.ref().push({
        userstreet: street,
        usercity: city,
        userstate: state,
        usertrackid: selectedTrackId,
        usertitle: selectedTrackname,
        userartist: selectedArtist,

    })

});



$("#hateit").on("click", function () {
    $('#title').empty();
    $('#artist').empty();
    $('#wiki').empty();
    $("#linkhere").empty();
    artistGetter();
})