<template>
  <div class="main">
    <div class="search-bar">
      <div>
        <h2>Search and add a pin</h2>
        <label>
          <gmap-autocomplete @place_changed="setPlace"></gmap-autocomplete>
          <button @click="addMarker">Add</button>
        </label>
      </div>
    </div>
    <gmap-map :center="center" :zoom="12">
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="center=m.position"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<style lang="scss">
  .main {
    height: 100%;
    width: 100%;
    position: relative;

    .search-bar {
      height: 20%;
      display: flex;
      align-items: center;
      justify-content: center;

      h2 {
        margin: 0 auto;
      }
    }

    .vue-map-container {
      height: 80%;
      width: 100%;
    }
  }
</style>

<script>
  import axios from 'axios'

  export default {
    name: 'GoogleMap',
    data () {
      return {
        // default to nola
        center: {lat: 30, lng: -90},
        markers: [],
        locations: [],
        currentPlace: null
      }
    },
    methods: {
      // receives a place object via the autocomplete component
      setPlace (place) {
        this.currentPlace = place
      },
      addMarker () {
        if (this.currentPlace) {
          const marker = {
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng()
          }
          this.markers.push({position: marker})
          this.locations.push(this.currentPlace)
          this.center = marker
          this.currentPlace = null
        }
      },
      addMarkers(locations) {
        let arr = [];
        locations.data.forEach(l => {
          arr.push({position: {lat: l.geo[0].latitude, lng: l.geo[0].longitude}})
        })
        this.markers = arr;
      },
      geolocate: () => {
        navigator.geolocation.getCurrentPosition(position => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        })
      }
    },
    created () {
      axios.get(`https://ijadams.s3.amazonaws.com/fish-fry-web/fish-fry.json`)
        .then(res => {
          this.locations = res.data
          this.addMarkers(res.data);
        }, err => {
          return new Error(err);
        });
    },
    mounted () {
      this.geolocate();
    }
  }
</script>
