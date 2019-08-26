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
export default {
  name: "GoogleMap",
  data() {
    return {
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      places: [],
      currentPlace: null
    };
  },

  mounted() {
    this.geolocate();
  },

  methods: {
    // receives a place object via the autocomplete component
    setPlace(place) {
      this.currentPlace = place;
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
      }
    },
    geolocate: () => {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    }
  }
};
</script>
