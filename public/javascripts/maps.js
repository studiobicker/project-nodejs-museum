var map;
async function initMap() {
  var styledMapType = new google.maps.StyledMapType(
    [
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "poi",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "transit",
        stylers: [
          {
            visibility: "off"
          }
        ]
      }
    ],
    { name: "Styled Map" }
  );

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: new google.maps.LatLng(52.373169, 4.89066),
    mapTypeId: "styled_map"
  });

  map.mapTypes.set("styled_map", styledMapType);
  map.setMapTypeId("styled_map");

  const route = document.getElementById("route").value;
  debugger;
  let museumArray = await getMuseums(route);
  debugger;
  // Create a <script> tag and set the USGS URL as the source.
  //const script = document.createElement("script");
  //script.src = museumArray;
  // This example uses a local copy of the GeoJSON stored at
  // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
  //script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
  //document.getElementsByTagName('head')[0].appendChild(script);

  // Loop through the results array and place a marker for each
  // set of coordinates.
  //window.feed_callback = function(results) {
  for (let i = 0; i < museumArray.length; i++) {
    const location = museumArray[i].location;
    const museumTitle = museumArray[i].title;
    const latLng = new google.maps.LatLng(
      location.latitude.replace(/,/g, "."),
      location.longitude.replace(/,/g, ".")
    );
    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: "/images/marker.svg",
      title: museumTitle
    });

    const contentString = `<div>
    <h3>${museumTitle}</h3>
    <p>${location.address}, ${location.zipcode}</p>
    </div>`;
    const infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    marker.addListener("click", function() {
      infowindow.open(map, marker);
    });
  }
}
//};

async function getMuseums(route) {
  debugger;
  try {
    const response = await axios.get(`/${route}/feed/`);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
