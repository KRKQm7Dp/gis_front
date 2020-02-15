<template>
  <div style="width: 100%; height: 1000px">
    <iframe scrolling="auto" width="100%" height="100%" :src="src"></iframe>
  </div>
</template>

<script>
export default {
  data () {
    return {
      src: process.env.VUE_APP_BASE_API + '/druid/index.html'
    }
  },
}
</script>