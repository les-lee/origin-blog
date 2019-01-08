<template>
  <div>
    <header>
      
    </header>
    <Content />
  </div>
</template>

<script>
export default {
  mounted() {
    console.log("page", this.$page);
    console.log("site", this.$site);
    console.log('excerpt', this.$page.excerpt)
  }
};
</script>
<style>
</style>
