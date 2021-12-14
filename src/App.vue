<template>
  <Toolbar
    ref="Toolbar"
    @onPlayClicked="onPlayClicked"
    :playing="playing"
    :volume="volume"
    :volume_value="volume_value"
    :muted="muted"
    @change-volume="changeVolume"
    @toggle-mute="mute"
    @volume-slider-input="onRangeChanged"
    @open-window="openWindow"
  />
  <Player
    @player-state="onStateChange"
    @volume-change="onVolumeChanged"
    @station-changed="onStationChanged"
    ref="Player"
  />

  <div>
    <transition-group name="fade">
    <div v-for="window in activeWindows" :key="window.id">
      <Options
        v-if="window.type == 'options'"
        :window="window"
        @window-close="closeWindow"
        @set-background="setBackground"
        @set-station="setStation"
        @minimize-window="minimizeWindow"
      />

      <Terminal
        v-if="window.type == 'terminal'"
        :window="window"
        @window-close="closeWindow"
        @set-background="setBackground"
        @set-station="setStation"
        @minimize-window="minimizeWindow"
      />
    </div>
    </transition-group>
  </div>

  <div class="flex flex-col flex-wrap m-4">
    <div v-for="window in minimizedWindows" :key="window.id" 
    class="flex flex-col w-16 mt-4 desktop-icon"
    @click="onIconClick(window.id)">
      <i :class="[window.icon||'icon-window','text-center']"></i>
      <p class="text-center">{{window.title}}</p>
    </div>
  </div>
</template>

<script>
import Toolbar from "./components/Toolbar";
import Player from "./components/Player.vue";
import Terminal from "./components/Terminal.vue";
import Options from "./components/Options.vue";
export default {
  name: "App",
  mounted() {
    let current_background = this.$cookies.get('current_background');
    let current_station = this.$cookies.get('current_station');
    if(current_background){
      document.body.style.backgroundImage =`url('${current_background}')`;
      this.current_background = current_background;
    }

    if(current_station){
      this.$refs.Player.changeStation(current_station);
    }

    document.body.addEventListener("click", function () {
      let elements = document.querySelectorAll(".toggleable");
      elements.forEach(function (el) {
        if (el.getAttribute("popup") == "0") {
          el.classList.add("hidden");
        }
        if (el.getAttribute("popup") == "1") {
          el.setAttribute("popup", 0);
        }
      });
    });
    document.onselectstart = function(){return false;}
    document.oncontextmenu = function(){return false;}
    this.noise_gif = new Image();
    this.noise_gif.src = require("./assets/images/1.gif").default;
    this.click_sound = new Audio(require("./assets/audio/1.mp3"));
    this.noise_sound = new Audio(require("./assets/audio/2.mp3"));
    this.noise_sound.loop = true;
  },
  components: {
    Toolbar,
    Player,
    Terminal,
    Options,
  },

  data() {
    return {
      playing: false,
      volume: "100%",
      volume_value: 1,
      muted: false,
      windows: [],
      current_background: "",
      noise_gif: "",
      click_sound: "",
      noise_sound: ""
    };
  },

  computed:{
    minimizedWindows:{
      get(){
        return this.windows.filter((window) => window.minimized == true)
      }
    },
    activeWindows:{
      get(){
        return this.windows.filter((window) => window.minimized == false)
      }
    }
  },
  methods: {
    onPlayClicked() {
      this.$refs.Player.toggle();
    },

    onStateChange(state) {
      this.playing = state;
    },

    onVolumeChanged(value) {
      this.volume_value = value;
      value = value * 100;

      if (value == 0 || this.muted) {
        this.volume = "Mute";
      } else {
        this.volume = value + "%";
      }
    },
    onRangeChanged(e) {
      this.$refs.Player.setVolume(e.target.value);
    },
    changeVolume(y) {
      this.$refs.Player.changeVolume(y);
    },
    mute() {
      this.muted = this.$refs.Player.toggleMute();
    },
    openWindow(window) {
      window.id = "id" + new Date().getTime();
      window.minimized = false;
      this.windows.push(window);
    },
    closeWindow(id) {
      this.windows = this.windows.filter((window) => window.id != id);
    },
    setBackground(url) {
      document.body.style.backgroundImage = `url('${this.noise_gif.src}')`;
      this.$cookies.set("current_background", url);
      this.click_sound.play();
      setTimeout(function () {
        var image = new Image();
        image.onload = function () {
          document.body.style.backgroundImage = `url('${url}')`;
        };
        image.src = url;
      }, 300);
    },
    async setStation(url) {
      document.body.style.backgroundImage = `url('${this.noise_gif.src}')`;
      this.$cookies.set('current_station',url);
      this.click_sound.play();
      this.noise_sound.play();
      const res = await fetch("/api/backgrounds/random");
      const data = await res.json();
      if (res.status == 200) {
        this.current_background = data["url"];
      }
      this.$refs.Player.changeStation(url);
    },
    onStationChanged() {
      this.noise_sound.pause();
      document.body.style.backgroundImage = `url('${this.current_background}')`;
    },
    minimizeWindow(id){
      this.windows.forEach(function(window){
        if(window.id === id){
          window.minimized = true;
        }
      });
    },
    onIconClick(id){
      this.windows.forEach(function(window){
        if(window.id == id)
          window.minimized = false;
      });
    }
  },
};
</script>

<style>
body {
  background: url("./assets/background.gif");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  overflow: hidden;
}

html {
  height: 100%;
}
#volume_slider {
  writing-mode: bt-lr; /* IE */
  -webkit-appearance: slider-vertical; /* WebKit */
  width: 8px;
  height: 100px;
  padding: 0 5px;
}
.desktop-icon{
  color:white;
  padding:2px;
  text-shadow: 2px 2px 7px black;
  cursor:pointer;
}
.desktop-icon:hover{
  color:gray
}
.fade-enter-from{
  transform: scale(0);
  transform-origin: top left;
}
.fade-enter-to{
  transform: scale(1);
  transform-origin: center;
}
.fade-enter-active{
  transition: all 0.3s ease;
}
.fade-leave-from{
  opacity: 1;
}
.fade-leave-to{
  opacity: 0;
  transform: scale(0);
  transform-origin: top left;
}
.fade-leave-active{
  transition: all 0.3s ease;
}

</style>
