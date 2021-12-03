<template>
  <div class="flex bg-gray-900 text-white w-full">
    <div class="flex-none w-1/12">
      <button @click="$emit('onPlayClicked')">
        <i :class="this.playing ? 'icon-pause' : 'icon-play'"></i>
      </button>
    </div>

    <div class="flex-1"></div>

    <div class="flex flex-none">
      <button
        id="volume_button"
        class="mx-1 text-yellow-300"
        style="width: 70px"
        @wheel="onWheel"
      >
        <i
          @click="$emit('toggle-mute')"
          :class="
            this.volume_value == 0 || this.muted
              ? 'icon-volume-off'
              : 'icon-volume-up'
          "
        ></i>
        <span v-toggler="'toggler'" data-toggle="#range-container">{{
          volume
        }}</span>
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
        <Menu
          :id="'main-menu'"
          :items="this.menu_items"
          :style="'right:0'"
          @item-clicked="onMenuItemClick"
        />
      </button>
    </div>
  </div>
</template>

<script>
import Menu from "./Menu";

export default {
  name: "Toolbar",
  created() {
    setInterval(this.get_time, 1000);
  },
  data() {
    return {
      time: "",
      menu_items: [
        { id: 1, text: "Fullscreen" },
        { id: 2, text: "Terminal" },
        { id: 3, text: "Options" },
      ],
      fullscreen:false
    };
  },
  components: {
    Menu,
  },
  props: {
    playing: Boolean,
    volume: String,
    volume_value: Number,
    muted: Boolean,
  },
  computed: {
    volumeValue: {
      get() {
        return this.volume_value;
      },
      set(value) {
        this.voluem_value = value;
      },
    },
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

    onWheel(e) {
      if (e.deltaY !== 0) {
        this.$emit("change-volume", e.deltaY);
      }
    },
    onInput(e) {
      this.$emit("volume-slider-input", e);
    },
    onMenuItemClick(id) {
      if (id == 1) {
        if(this.fullscreen){
          this.menu_items[0].text = "Fullscreen"
          this.closeFullScreen();
          }else{
          this.menu_items[0].text = "Exit Fullscreen"
          this.openFullScreen();
        }

        this.fullscreen = !this.fullscreen;
      }
      if(id == 2){
          this.$emit('open-window',{
            type:"terminal",
            multiple: true,
            title:"Terminal",
            icon:"icon-terminal",
            transparent:true
          });
        }
        if(id == 3){
          this.$emit('open-window',{
            type:"options",
            multiple: false,
            title:"Options"
          });
        }
    },
    openFullScreen() {
      let elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
      }
    },
    closeFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
      }
    },
  },
};
</script>