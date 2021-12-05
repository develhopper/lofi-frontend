<template>
  <div class="hidden">
    <audio
      ref="player"
      name="media"
      controls
      autoplay
      @play="onPlay"
      @pause="onPause"
      @playing="onPlaying"
      @volumechange="onVolumeChange"
    >
      <source
        src="https://boxradio-edge-07.streamafrica.net/lofi"
        type="audio/aac"
      />
    </audio>
  </div>
</template>

<script>
export default {
  name: "Player",
  data() {
    return {
      player: "",
      playing: false,
      station_change:false
    };
  },
  mounted() {
    this.player = this.$refs.player;
  },
  methods: {
    toggle() {
      if (this.playing) this.player.pause();
      else this.player.play();
      this.playing = !this.playing;
    },
    setVolume(value){
        this.player.volume = value;
    },
    toggleMute(){
        this.player.muted = !this.player.muted;
        return this.player.muted;
    },
    changeVolume(y){
        let volume = parseInt(this.player.volume * 100);
            if(y < 0){
                volume += 10;
                this.player.volume=parseFloat(volume/100);
            }
            else {
                volume -= 10;
                this.player.volume=parseFloat(volume/100);
        }
    },
    changeStation(url){
      this.station_change = true;
      console.log(this.station_change)
      this.$refs.player.pause();
      this.$refs.player.src = url;
      this.$refs.player.load();
      // this.$refs.player_source.src = url;
      this.$refs.player.play();
    },
    onPlay() {
      this.playing = true;
      this.$emit('player-state', this.playing);
    },
    onPause() {
      this.playing = false;
      this.$emit("player-state", this.playing);
    },
    onPlaying(){
      if(this.station_change == true){
        this.$emit("station-changed");
        this.station_change = false;
      }
    },
    onVolumeChange() {
      this.$emit('volume-change', this.player.volume);
    },
  },
};
</script>