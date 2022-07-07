<script setup lang="ts">

import type { NavItem } from '../types/NavItem';

const navItems: NavItem[] = [
  { name: 'Home', route: '/' },
  { name: 'Path Finding', route: '/path-finding' },
]

</script>

<template>
  <div id="navbar-outer">
    <img id="navbar-logo" src="./icons/logo-white.png" alt="logo" id="navbar-logo" />
    <div id="navbar-container">
      <router-link class="navbar-item" v-for="(navItem, index) in navItems" :key="index" :to="navItem.route">{{ navItem.name }}</router-link>
    </div>
  </div>
</template>

<style scoped>
#navbar-outer {
  display: flex;
  margin-top: 20px;
}

#navbar-container {
  height: 50px;
  display: flex;
  justify-content: left;
  align-items: center;
}

#navbar-logo {
  height: 50px;
  width: 50px;
  margin-right: 10px;
}

.navbar-item {
  margin-left: 20px;
}
</style>