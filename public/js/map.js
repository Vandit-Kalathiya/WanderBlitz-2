// let mapToken = "<%=process.env.MAP_TOKEN%>"
// console.log(mapToken)
mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
// console.log(coordinates)
const marker = new mapboxgl.Marker().setLngLat(listing.geometry.coordinates).setPopup(new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h3>${listing.location}</h3><p>Exact location will be provided after booking</p>`).setMaxWidth("200px"))
    .addTo(map);