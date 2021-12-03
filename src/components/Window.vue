<template>
  <div class="flex flex-col window">
    <div class="flex window-toolbar bg-black text-white">
      <div class="p-0.5 flex-none title"><i>icon</i> Window Title</div>
      <div class="flex-auto"></div>
      <div class="p-0.5 toolbar">
        <button>-</button>
        <button>o</button>
        <button>X</button>
      </div>
    </div>

    <div class="flex window-content bg-gray-900 w-full h-full"></div>
  </div>
</template>

<script>
export default {
  name: "Window",
};
</script>

<style scoped>
.window {
  max-width: 100%;
  max-height: 100%;
  min-width: 400px;
  min-height: 300px;
  width: 400px;
  height: 300px;
  border-radius: 5px;
  overflow: hidden;
}
</style>