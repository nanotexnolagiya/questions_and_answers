<template>
  <div class="progress">
    <div
      id="progress"
      class="progress-bar bg-success" 
      role="progressbar"
      :style="{'width': now + '%'}"
      v-text="now + '%'"
      :aria-valuenow="now"
      :aria-valuemin="min"
      :aria-valuemax="max">
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: ['load'],
  data() {
    return {
      now: 0,
      min: 0,
      max: 100,
      speed: 5000
    };
  },
  methods: {
    progress () {
      if (this.now !== this.max) {
        this.now++;
        setTimeout(() => {
          if(this.now < 100) {
            this.progress();
          }
        }, this.speed / this.max);
      }
    }
  },
  watch: {
    load (newVal) {
      if (newVal) {
        this.progress()
      } else {
        this.now = 100
      }
    }
  },
  mounted () {
    this.progress()
  }
};
</script>
