<template>
  <div class="flex bg-gray-900 text-white w-full">
    <div class="flex-none w-1/12">
      <button @click="$emit('onPlayClicked')"><i :class="this.playing ? 'icon-pause' : 'icon-play'"></i></button>
    </div>

    <div class="flex-1"></div>

    <div class="flex flex-none">
      <button
        id="volume_button"
        class="mx-1 text-yellow-300"
        style="width: 70px"
        @wheel="onWheel"
      >
        <i @click="$emit('toggle-mute')" :class="this.volume_value==0 || this.muted? 'icon-volume-off' : 'icon-volume-up'"></i>
        <span v-toggler="'toggler'"  data-toggle="#range-container">{{volume}}</span>
        <div
          id="range-container"
          class="absolute w-12 bg-gray-900 mt-0.5 toggleable hidden"
        >
          <input
            type="range"
            id="volume_slider"
            class="m-1"
            min="0"
            max="1"
            step="0.1"
            ref="volume_slider"
            v-model="volumeValue"
            @input="onInput"
          />
        </div>
      </button>

      <p class="inline" style="width: 95px">
        <i class="icon-clock"></i> <span id="time">{{ time }}</span>
      </p>

      <button v-toggler="'toggler'" data-toggle="#main-menu" class="icon-menu">
        <Menu :id="'main-menu'" :items="this.menu_items" :style="'right:0'"/>
      </button>
    </div>
  </div>
</template>

<script>
import Menu from './Menu'

export default {
  name: "Toolbar",
  created() {
      setInterval(this.get_time, 1000);
  },
  data() {
    return {
      time: "",
      menu_items:[
        {id:1, text:"Full Screen"},
        {id:2, text:"Terminal"},
        {id:3, text:"Options"}
      ]
    };
  },
  components:{
    Menu
  },
  props:{
      playing:Boolean,
      volume:String,
      volume_value:Number,
      muted:Boolean
  },
  computed:{
      volumeValue:{
          get(){
              return this.volume_value
          },
          set(value){
              this.voluem_value = value
          }
      }
  },
  methods: {
    get_time() {
      const time = new Date();
      let h = time.getHours();
      let m = time.getMinutes();
      let s = time.getSeconds();

      m = this.check_time(m);
      s = this.check_time(s);
      this.time = `${h}:${m}:${s}`;
    },

    check_time(i) {
      if (i < 10) i = "0" + i;
      return i;
    },
    
    onWheel(e){
        if(e.deltaY !== 0){
            this.$emit('change-volume',e.deltaY);
          }
    },
    onInput(e){
        this.$emit('volume-slider-input',e)
    }
  },
};
</script>