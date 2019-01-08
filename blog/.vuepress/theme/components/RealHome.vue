<template>
  <div class="theme-container">
    <Navbar
      v-if="shouldShowNavbar"
      @toggle-sidebar="toggleSidebar"
    />
    <div class="banner">
      <!-- {{$site.title}} -->
    </div>
    <Main />
  </div>
</template>

<script>
import Main from "./components/Main";
export default {
  components: {
    Main: Main
  }
};
</script>

<style>
.banner {
  background: url("./img/lufei.jpg");
  background-size: cover;
  height: 400px;
}
</style>


<style src="prismjs/themes/prism-tomorrow.css"></style>
<style src="./styles/theme.styl" lang="stylus"></style>

