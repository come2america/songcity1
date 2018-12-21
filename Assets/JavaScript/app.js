var street = ''
var city = '';
var state = '';
var zip = '';
var selectedTrackname = '';
var selectedArtist = '';
var selectedTrackId = '';
var assigntrack='';
var image=''
function songlistgetter(songlist) {


    //console.log("songlist", songlist)
    $.ajax({

        url: "https://cors-anywhere.herokuapp.com/http://en.wikipedia.org/w/api.php?action=parse&format=json&page=" + songlist.title + "&prop=links",
        method: "GET"
    }).then(function (result) {
        //console.log(result.parse.links.length)
        var songtitle = songlist.title
        //console.log("artist", result);
        //  console.log(songtitle);


        // for (var y = 0; y < songtitle.length; y++) {


        // console.log(result);
        var song = result.parse.links[Math.floor((Math.random() * 100) + 1)]["*"]
        //  console.log(song)
        // }



        var songArray = [];

        var queryURL = "https://itunes.apple.com/search?term=" + song + "&limit=200";
        $.ajax({
            url: queryURL,
            dataType: "jsonp",
            success: function (response) {

                console.log(response)


                var queryURL = "https://itunes.apple.com/lookup?id=" + response.results[0].trackId + " &limit=200";
                $.ajax({
                    url: queryURL,
                    dataType: "jsonp",
                    success: function (response) {


                        console.log(response)
                        var image = $("<img>").attr({ src: response.results[0].artworkUrl100 })

                        selectedTrackname = response.results[0].trackName
                        selectedArtist = response.results[0].artistName
                        selectedTrackId = response.results[0].trackId
                        $('#title').html(selectedTrackname);
                        $('#artist').html(selectedArtist);
                        $('#wiki').html(selectedTrackId);
                        $("#linkhere").html(image);



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
        console.log(americancat);

        for (var i = 0; i < americancat.length; i++) {




            var songlist = americancat[3]
            songlistgetter(songlist)
        }


    })

};


$("#submit").on("click", function (event) {
    event.preventDefault();
    street = $("#street").val().trim().toLowerCase();
    city = $("#city").val().trim().toLowerCase();
    state = $("#state").val().trim().toLowerCase();
    // artistGetter();
    var ref = firebase.database().ref();

    ref.orderByChild("userstreet").equalTo(street).on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            console.log(childSnapshot)
            var value = childSnapshot.val();
            assigntrack =value.usertrackid;
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

                }
            });
        

        }
        else {
            console.log("else executed");
            artistGetter();
            mappingApi()
       
       
       
        }

    });




});

// Address inputs


// console.log(street + ", " + city + ", " + state + " " + zip);


//Song info html





function mappingApi() {
    var apiKey = "jqnjIbmIDCL7UaGiP6SPvbfGTlGTs9z0";
    //     street = "";
    //      city = "";
    //  state = "";



    var queryURL = " https://www.mapquestapi.com/geocoding/v1/address?key=" + apiKey + "&adminArea3=" + state + "&adminArea1=US&adminArea5=" + city + "&street=" + street;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        $("#displayDiv").html("Latitude: " + response.results[0].locations[0].latLng.lat + " Longitude: " + response.results[0].locations[0].latLng.lng);
        $("#displayDiv").append("<div>" + (street + ", " + city + ", " + state) + "</div>");
        console.log(response);
        var postalCode = response.results[0].locations[0].postalCode;
        var longitude = response.results[0].locations[0].latLng.lng;
        var latitude = response.results[0].locations[0].latLng.lat;
        $("#displayDiv").append(" Zip Code: " + postalCode)
        getIndex();
        L.mapquest.key = "jqnjIbmIDCL7UaGiP6SPvbfGTlGTs9z0";
        // 'map' refers to a <div> element with the ID map
        var map = L.mapquest.map('map', {
            center: [latitude, longitude],
            layers: L.mapquest.tileLayer('map'),
            zoom: 15
        });
        L.marker([latitude, longitude], {
            icon: L.mapquest.icons.marker(),
            draggable: false
        }).addTo(map);

        function getIndex() {
            var addressID = (Math.abs(longitude % latitude)) * 100000000;
            console.log(addressID);
            var test = addressID;
            var addressIDArray = test.toString().split('');
            var stripVal = [
                addressIDArray[5], addressIDArray[6], addressIDArray[7]
            ];
            var convVal = stripVal.join('');
            var indexVal = parseInt(convVal);
            console.log(convVal);

        };
    });
}
mappingApi();
// });




var database = firebase.database();

// Capture Button Click
$("#loveit").on("click", function (event) {
    // Don't refresh the page!
    event.preventDefault();

    //    // Address inputs
    street = $("#street").val().trim().toLowerCase();
    city = $("#city").val().trim().toLowerCase();
    state = $("#state").val().trim().toLowerCase();
    var titles = $("#title")
    var artists = $("#artist")
    database.ref().push({
        userstreet: street,
        usercity: city,
        userstate: state,
        usertrackid: selectedTrackId,
        usertitle: selectedTrackname,
        userartist: selectedArtist,

    })



});

database.ref().on("child_added", function (snapshot) {
    var data = snapshot.val()
    // console.log(data);

    var tdstreet = "<P>" + data.userstreet + "</P>"
    var tdcity = "<P>" + data.usercity + "</P>"
    var tdstate = "<P>" + data.userstate + "</P>"
    var tdtitle = "<P>" + data.usertitle + "</p>"
    var tdartist = "<P>" + data.userartist + "</p>"
    var tdtrackid = "<P>" + data.usertrackid + "</p>"

    $("#displayDiv").html(tdstreet, tdcity, tdstate)

    $('#title').html(tdtitle);
    $('#artist').html(tdartist);
    $('#wiki').html(tdtrackid);



})






$("#hateit").on("click", function () {
    $('#title').empty();
    $('#artist').empty();
    $('#wiki').empty();
    $("#linkhere").empty();
    artistGetter();
})