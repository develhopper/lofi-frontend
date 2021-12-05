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
    <div v-for="window in windows" :key="window.id">
      <Options
        v-if="window.type == 'options'"
        :window="window"
        @window-close="closeWindow"
      />

      <Terminal
        v-if="window.type == 'terminal'"
        :window="window"
        @window-close="closeWindow"
        @set-background="setBackground"
        @set-station="setStation"
      />
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
    this.noise_gif = new Image();
    this.noise_gif.src = require("./assets/images/1.gif");
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
      this.windows.push(window);
    },
    closeWindow(id) {
      console.log(id);
      this.windows = this.windows.filter((window) => window.id != id);
    },
    setBackground(url) {
      document.body.style.backgroundImage = `url('${this.noise_gif.src}')`;
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

.bg-gray-900 {
  --tw-bg-opacity: 0.9;
}
</style>
