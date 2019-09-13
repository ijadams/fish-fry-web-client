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
      <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen"
                        @closeclick="infoWinOpen=false">
        <h1>{{infoContent.title}}</h1>
        <h3 v-if="infoContent.street">{{infoContent.street}}</h3>
        <p v-if="infoContent.email">Email: {{infoContent.email}}</p>
        <h3>{{ infoContent.everyFriday ? 'Every Friday Between' : 'Dates:' }}</h3>
        <ul id="dates">
          <li v-for="date in infoContent.dates" v-bind:key="date">
            {{date}}
          </li>
        </ul>
        <p v-if="infoContent.startTime">Start: {{infoContent.startTime}}</p>
        <p v-if="infoContent.endTime">End: {{infoContent.endTime}}</p>
        <h3>Food</h3>
        <ul id="snacks">
          <li v-for="item in infoContent.food" v-bind:key="item">
            {{item}}
          </li>
        </ul>
      </gmap-info-window>
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="toggleInfo(m, index)"
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
        center: {lat: 29.9511, lng: -90.0715},
        markers: [],
        locations: [],
        infoWinOpen: false,
        infoContent: {},
        currentMidx: null,
        infoWindowPos: {lat: 29.9511, lng: -90.0715},
        infoOptions: {
          pixelOffset: {
            width: 0,
            height: -35
          }
        },
        currentPlace: null
      }
    },
    methods: {
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
      addMarkers (locations) {
        let arr = []
        locations.data.forEach(l => {
          const lat = l.geo.length ? l.geo[0].latitude : 30
          const long = l.geo.length ? l.geo[0].longitude : -90
          arr.push({position: {lat: parseFloat(lat), lng: parseFloat(long)}, info: l})
        })
        this.markers = arr
      },
      geolocate () {
        navigator.geolocation.getCurrentPosition(position => {
          this.center = {
            lat: parseFloat(position.coords.latitude),
            lng: parseFloat(position.coords.longitude)
          }
        })
      },
      toggleInfo (marker, idx) {
        this.infoWindowPos = marker.position
        this.infoContent = marker.info
        if (this.currentMidx === idx) {
          this.infoWinOpen = !this.infoWinOpen
        } else {
          this.infoWinOpen = true
          this.currentMidx = idx
        }
      }
    },
    created () {
      axios.get(`https://ijadams.s3.amazonaws.com/fish-fry-web/fish-fry.json`)
        .then(res => {
          this.locations = res.data
          this.addMarkers(res.data)
        }, err => {
          return new Error(err)
        })
    },
    mounted () {
      this.geolocate()
    }
  }
</script>
