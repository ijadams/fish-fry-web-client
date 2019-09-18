<template>
  <div class="main">
    <div id="banner">
      <h1>NOLA Fish Fries</h1>
      <h2>Lent 2018</h2>
    </div>
    <gmap-map :center="center" :zoom="12" :options="mapConfig">
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
        :icon="{ url: 'https://ijadams.s3.amazonaws.com/map-marker-sm.svg'}"
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

    #banner {
      background: rgba(0, 0, 0, 0.66);
      padding: 1rem 1.316rem;
      z-index: 1;
      position: absolute;
      width: 100%;
      top: 0;

      h1 {
        margin: 0 auto;
        color: white;
        font-weight: 400;
        letter-spacing: 2px;
        text-transform: lowercase;
        font-size: 1.618rem;
      }
      h2 {
        font-size: 1rem;
        margin: 0 auto;
        color: white;
        font-weight: 100;
        text-transform: lowercase;
        letter-spacing: 1px;
      }
    }

    .search-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      h2 {
        margin: 0 auto;
      }
    }

    .vue-map-container {
      height: 100%;
      width: 100%;
      .gm-style img {
        height: 1rem;
        width: 1rem;
      }
    }
  }
</style>

<script>
  import axios from 'axios'
  import FilterBarComponent from './FilterBarComponent'
  import {mapConfig} from '../constants/map-config'

  export default {
    name: 'GoogleMap',
    components: {FilterBarComponent},
    data () {
      return {
        center: {lat: 29.9511, lng: -90.0715},
        markers: [],
        locations: [],
        infoWinOpen: false,
        infoContent: {},
        currentMidx: null,
        infoWindowPos: {lat: 29.9511, lng: -90.0715},
        mapConfig: mapConfig,
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
    }
  }
</script>
