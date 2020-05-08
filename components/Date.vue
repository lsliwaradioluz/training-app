<template>
  <div class="date">
    <h4>{{ day }}</h4>
    <h4>{{ month }}</h4>
  </div>
</template>

<script>
  export default {
    props: {
      date: {
        type: String, 
        required: true, 
      }
    }, 
    computed: {
      day() {
        const date = new Date(this.date);
        let day = date.getDate();
        return day < 10 ? `0${day}` : day;
      },
      month() {
        const date = new Date(this.date);
        let month = date.getMonth() + 1;
        return month < 10 ? `0${month}` : month;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .date {
    height: 40px;
    width: 40px;
    display: flex;
    overflow: hidden;
    position: relative;
    &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        height: 1.5px;
        width: 100px;
        background-color: white;
        transform: rotate(-46deg);
        transform-origin: 0;
      }
  }

  h4 {
    width: 50%;
    height: 100%;
    color: white;
    margin: 0;
    display: flex;
    line-height: 1;
    &:nth-child(1) {
      justify-content: flex-start;
      align-items: flex-start;
    }
    &:nth-child(2) {
      justify-content: flex-end;
      align-items: flex-end;
    }
  }
</style>