<template>
  <Toolbar ref="Toolbar" @onPlayClicked="onPlayClicked" 
  :playing="playing" 
  :volume="volume" 
  :volume_value="volume_value"
  :muted="muted" 
  @change-volume="changeVolume"
  @toggle-mute="mute"
  @volume-slider-input="onRangeChanged"/>
  <Player @player-state="onStateChange" @volume-change="onVolumeChanged" ref="Player"/>
</template>

<script>
import Toolbar from './components/Toolbar'
import Player from './components/Player.vue'

export default {
  name: 'App',
  components: {
    Toolbar,Player
  },

  data(){
    return {
      playing:false,
      volume:"100%",
      volume_value:1,
      muted:false
    }
  },

  methods:{
    onPlayClicked(){
      this.$refs.Player.toggle();
    },

    onStateChange(state){
      this.playing = state;
    },

    onVolumeChanged(value){
      this.volume_value = value;
      value = value*100;

      if (value == 0 || this.muted) {
        this.volume = "Mute";
      } else {
        this.volume = value + "%";
      }
    },
    onRangeChanged(e){
      this.$refs.Player.setVolume(e.target.value);
    },
    changeVolume(y){
      this.$refs.Player.changeVolume(y);
    },
    mute(){
      this.muted = this.$refs.Player.toggleMute();
    }
  }
}
</script>

<style>
body{
    background: url('./assets/background.gif');
    background-position:center;
    background-repeat:no-repeat;
    background-size: cover;
    height: 100%;
}

html{
    height: 100%;
}
#volume_slider{
    writing-mode: bt-lr; /* IE */
    -webkit-appearance: slider-vertical; /* WebKit */
    width: 8px;
    height: 100px;
    padding: 0 5px;
}

.bg-gray-900{
    --tw-bg-opacity:0.9;
}
</style>
