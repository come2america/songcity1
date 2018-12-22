

// $("#submit").on("click", function (){

// // Address inputs
// var street = $("#street").val().trim();
// var city = $("#city").val().trim();
// var state = $("#state").val().trim();
// var zip = $("#zip").val().trim();

// console.log(street + ", " + city + ", " + state + " " + zip);


// //Song info html
// var title = $("#title");
// var artist = $("#artist");
// var wiki = $("#wiki");

// //test code
// title.text("Toes");
// artist.text("Glass Animals");
// wiki.html('<a href="https://www.wikipedia.org/" target="_blank">Wikipedia</a>')

// });



// $("#submit").on("click", function () {

//     // Address inputs
//     var street = $("#street").val().trim();
//     var city = $("#city").val().trim();
//     var state = $("#state").val().trim();
//     var zip = $("#zip").val().trim();

//     console.log(street + ", " + city + ", " + state + " " + zip);


//     //Song info html

// });








//$(".artist").append(artistname);


function songlistgetter(songlist) {

    //console.log("songlist", songlist)
    $.ajax({

        url: "https://en.wikipedia.org/w/api.php?action=parse&format=json&page=" + songlist.title + "&prop=links",
        method: "GET"
    }).then(function (result) {
        //console.log(result.parse.links.length)
        var songtitle = songlist.title
        //console.log("artist", result);
        //  console.log(songtitle);


        for (var y = 0; y < songtitle.length; y++) {


        // console.log(result);
        var song = result.parse.links[Math.floor((Math.random() * 100) + 1)]["*"]
        //  console.log(song)
         }

        $("#submit").on("click", function () {

            event.preventDefault();

            // var $form = $(this),
            //     term = $form.find('input[name="s"]').val(),


            var fmurl = "https://ws.audioscrobbler.com/2.0/?method=track.search&track=" + song + "&api_key=6708bbdc11823ca7aa45e4683b70ee1e&format=json&callback=?";

            $.getJSON(fmurl, function (data) {
                console.log(data)
                var songname = '';
                var artistname = '';
                var linkname = '';
                var imgdisplay = '';
                //  data.results.trackmatches.track, 
                

                  // $('#title').empty();
                songname += "<p>" + data.results.trackmatches.track[0].name + "</p>";
                artistname += "<p>" + data.results.trackmatches.track[0].artist + "</p>";
                linkname += "<p>" + data.results.trackmatches.track[0].url + "</p>";
                htmllink = $("<a>" + data.results.trackmatches.track[0].name + "</a>")
                $(htmllink).attr({ href: data.results.trackmatches.track[0].url })
                console.log(song);
                imgdisplay += "<img> src'" + data.results.trackmatches.track[0].image[0].text.large + "'>";


         


                $('#title').html(songname);
                $('#artist').html(artistname);
                $('#wiki').html(linkname);
                $("#linkhere").html(htmllink);
                





                
               

            })

    //          setTimeout(function(){ 
                    
                    
    //            location.reload();
    //   }, 10000);
        });






    })

    


}


$.ajax({
    url: " https://en.wikipedia.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:Lists_of_songs_recorded_by_American_artists",

    method: "GET"
}).then(function (response) {

    // console.log(response)
    var americancat = response.query.categorymembers
    //console.log(americancat);

    //for (var i = 0; i < americancat.length; i++) {




    var songlist = americancat[1]
    songlistgetter(songlist)
    // }
    

})
