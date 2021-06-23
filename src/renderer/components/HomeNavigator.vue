<template>
  <div class="sidebar">
    <router-link class="clickable" replace to="/"> Home </router-link>
    <router-link class="clickable" replace to="/about/"> A propos </router-link>
    <router-link class="clickable" replace to="/welcome"> Plus... </router-link>
  </div>
</template>

<style scoped>
.sidebar {
  display: flex;
  background: #13131A;
}
.sidebar a {
  flex-grow: 1;
  color: #BFC9D4;
  text-decoration: none;
  padding: 10px;
  transition-duration: 0.25s;
}

.sidebar a:hover {
  background: rgba(0, 0, 0, 0.5);
}

.sidebar a:last-child {
  border-right: none;
}
</style>
