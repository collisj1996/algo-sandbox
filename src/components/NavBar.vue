<script setup lang="ts">

import type { NavItem } from '../types/NavItem';

const navItems: NavItem[] = [
  { name: 'Home', route: '/' },
  { name: 'Path Finding', route: '/path-finding' },
]

</script>

<template>
  <div id="navbar-container">
    <router-link class="navbar-item" v-for="(navItem, index) in navItems" :key="index" :to="navItem.route">{{ navItem.name }}</router-link>
  </div>
</template>

<style scoped>
#navbar-container {
  height: 50px;
  display: flex;
  justify-content: left;
  align-items: center;
}

.navbar-item {
  margin-left: 20px;
}
</style>