<template>
  <Window
    :id="window.id"
    :title="window.title"
    :transparent="window.transparent"
    :icon="window.icon"
    @window-close="$emit('window-close', window.id)"
  >
    <div class="flex h-full w-full"
      @mousedown="onPanelMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
    >
      <div ref="panel" class="w-auto h-full border-r">
        <h2 class="p-1 border-b font-bold">Options</h2>
        <ul>
          <li
            v-for="(tab, index) in tabs"
            :key="index"
            :class="[
              'list-none rounded-sm px-1 py-1 cursor-pointer hover:bg-blue-600',
              active_tab === index ? 'bg-blue-600' : '',
            ]"
            @click="active_tab = index">
            {{ tab }}
          </li>
        </ul>
      </div>
      <div class="flex-col w-full h-full">
        <h3 class="w-full border-b p-1">{{ tabs[active_tab] }}</h3>
        
        
      </div>
    </div>
  </Window>
</template>

<script>
import Window from "./Window.vue";

export default {
  name: "Options",
  components: {
    Window,
  },
  props: {
    window: Object,
  },
  data() {
    return {
      tabs: ["Backgrounds", "Stations", "About"],
      active_tab: 0,
      mouse_down: false,
    };
  },
  methods: {
    onPanelMouseDown(e) {
      var x = e.layerX;
      var areaX = this.$refs.panel.offsetLeft + this.$refs.panel.offsetWidth;
      if (x >= areaX - 5 && x<= areaX +5) {
        this.mouse_down = true;
        this.$refs.panel.style.cursor = "ew-resize";
      }
    },
    onMouseMove(e) {
      if (this.mouse_down) {
        this.$refs.panel.style.width = e.layerX + "px";
      }
    },
    onMouseUp() {
      this.$refs.panel.style.cursor = "";
      this.mouse_down = false;
    },
  },
};
</script>

<style scoped>
.border-b,
.border-r {
  border-color: gray;
}
</style>