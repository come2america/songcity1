  
// [START maps_directions_draggable]
function initMap() {
  const map = new google.maps.Map(document.getElementById("googleMap"), {
    zoom: 4,
    center: { lat: -24.345, lng: 134.46 },
  });
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: true,
    map,
    panel: document.getElementById("right-panel"),
  });
  directionsRenderer.addListener("directions_changed", () => {
    computeTotalDistance(directionsRenderer.getDirections());
  });
  displayRoute(
    "Perth, WA",
    "Sydney, NSW",
    directionsService,
    directionsRenderer
  );
}

function displayRoute(origin, destination, service, display) {
  service.route(
    {
      origin: origin,
      destination: destination,
      waypoints: [
        { location: "Adelaide, SA" },
        { location: "Broken Hill, NSW" },
      ],
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true,
    },
    (result, status) => {
      if (status === "OK" && result) {
        display.setDirections(result);
      } else {
        alert("Could not display directions due to: " + status);
      }
    }
  );
}

function computeTotalDistance(result) {
  let total = 0;
  const myroute = result.routes[0];

  if (!myroute) {
    return;
  }

  for (let i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000;
  document.getElementById("total").innerHTML = total + " km";
}
// [END maps_directions_draggable]