<template>
  <div class="main">
    <div id="banner">
      <a href="http://jjadamsband.com" target="_blank"><img src="https://res.cloudinary.com/ia-interactive/image/upload/v1644252818/favicon_uz3xb8.png"/></a>
      <h1>NOLA Fish Fries</h1>
      <h2>Lent 2023</h2>
    </div>
    <gmap-map :center="center" :zoom="12" :options="mapConfig">
      <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen"
                        @closeclick="infoWinOpen=false">
        <div class="info-container">
          <h1>{{infoContent.title}}</h1>
          <hr>
          <h3 v-if="infoContent.street">{{infoContent.street}}</h3>
<!--          <ul v-if="infoContent.dates && infoContent.dates.length" id="dates">-->
<!--            <li v-if="infoContent.dates.length === 1">-->
<!--              {{infoContent.dates[0]}}-->
<!--            </li>-->
<!--            <li v-if="infoContent.dates.length > 1" v-for="(date, index) in infoContent.dates" v-bind:key="date">-->
<!--              <span v-if="index === infoContent.dates.length - 1">and {{date}}</span>-->
<!--              <span v-if="index !== infoContent.dates.length - 1">{{date}},&nbsp;</span>-->
<!--            </li>-->
<!--          </ul>-->
          <p class="start" v-if="infoContent.startTime && infoContent.endTime">{{infoContent.startTime}} until {{infoContent.endTime}}</p>
          <ul id="snacks" v-if="infoContent.food && infoContent.food.length">
            <li class="md-chip" v-for="item in infoContent.food" v-bind:key="item">
              {{item}}
            </li>
          </ul>
          <p v-if="!infoContent.food || !infoContent.food.length">No description of sides reported.</p>
        </div>
      </gmap-info-window>
      <gmap-marker
        :key="index"
        :icon="{ url: 'https://ijadams.s3.amazonaws.com/fish-fry-web/map-marker-sm.svg'}"
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
      padding: 0.4rem 0;
      z-index: 1;
      position: absolute;
      width: 100%;
      top: 0;
      img {
        position: absolute;
        left: 0;
        top: 0;
        height: calc(100% - 10px);
        padding: 5px;
      }
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

    .gm-style-iw.gm-style-iw-c {
      border-radius: 0.4rem;
      padding: 0;
      min-width: 300px;
      min-height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;

      button.gm-ui-hover-effect {
        top: 0 !important;
        right: 0 !important;
      }
      &:after {
        top: -5px !important;
      }

      .gm-style-iw-d {
        padding: 0.4rem;
        overflow: scroll !important;
      }

      .gm-style-iw-d > div {
        width: 100%;
        height: 100%;
        overflow: scroll;

        h1 {
          font-size: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        h3 {
          font-weight: 700;
        }

        hr {
          border: 1px solid rgba(0, 0, 0, 0.3);
          width: 1rem;
        }

        ul {
          margin: 0 auto;
          padding: 0;

          li {
            padding: 0;
            margin: 0 auto;
            list-style: none;
          }
        }

        #dates {
          display: block;
          li {
            font-weight: bold;
            display: inline-block;
          }
        }
        ul#snacks {
          border-radius: 0.4rem;
          padding: 1rem;
          li {
            font-weight: 100;
            box-sizing: border-box;
            padding: 0.4rem;
            text-transform: capitalize;
            margin: 4px;
          }
          li.md-chip {
            display: inline-block;
            background: #e0e0e0;
            padding: 4px 12px;
            border-radius: 32px;
            font-size: 14px;
            text-transform: lowercase !important;
            &.md-chip-hover:hover {
              background: #ccc;
            }
          }

        }

        .start, .end {
          font-weight: bold;
          display: inline-block;
        }
      }
    }

    .info-container {
      padding: 0 2rem;
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
