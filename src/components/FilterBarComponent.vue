<template>
  <section class="filter-bar">
    <h1>help</h1>
    <ul id="food-options">
      <li v-for="item in options.food" v-bind:key="item">
        {{item}}
      </li>
    </ul>
  </section>
</template>

<style lang="scss">
  .filter {

  }
</style>

<script>
  export default {
    name: 'FilterBarComponent',
    props () {
      return {
        options: []
      }
    },
    data () {
      return {
      }
    },
    methods: {
      filter () {
      }
    },
    created () {
    },
    mounted () {
    }
  }
</script>
