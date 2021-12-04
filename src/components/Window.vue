<template>
  <div ref="window" class="flex flex-col window">
    <div class="flex window-toolbar bg-black text-white w-full" 
      @mousedown="onMouseDown" 
      @mouseup="onMouseUp"
      @mousemove="this.onDrag"
      @touchstart="onMouseDown"
      @touchend="onMouseUp"
      @touchmove="onDrag">
      <div class="p-0.5 flex-none title"><i :class="this.icon"></i> <span class="pl-2">{{this.title}}</span></div>
      <div class="flex-auto"></div>
      <div class="p-0.5 toolbar">
        <button class="icon-min-icon"></button>
        <button class="icon-max-icon"></button>
        <button class="icon-cancel-circled text-red-400" @click="$emit('window-close',this.id)"></button>
      </div>
    </div>

    <div class="flex window-content bg-gray-900 w-full h-full text-white" :style="transparent?'--tw-bg-opacity: 0.8':''">
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: "Window",
  props:{
    title:String,
    icon:{type:String,default:"icon-window"},
    id:String,
    transparent:{type:Boolean, default:false}
  },
  mounted(){
    this.window = this.$refs.window;
    this.window.style.left = (this.window.offsetLeft /2) +"px";
    this.window.style.top = (this.window.offsetTop /2) +"px";
  },
  data(){
    return {
      mouseDown:false,
      position:{
        X:0,
        Y:0,
        mouseX:0,
        mouseY:0
      },
      window:''
    }
  },
  methods:{
    onMouseDown(e){
      e.target.style.cursor="grab";
      this.mouseDown = true;
      this.position['X'] = this.window.offsetLeft - (e.clientX || e.targetTouches[0].pageX);
      this.position['Y'] = this.window.offsetTop - (e.clientY || e.targetTouches[0].pageY);
      this.position['width'] = this.window.offsetWidth;
      this.position['height'] = this.window.offsetHeight;
    },
    onMouseUp(e){
      this.mouseDown = false;
      e.target.style.cursor = "default";
    },
    onDrag(e){
      e.preventDefault();
      if(this.mouseDown){
        var posX = ((e.clientX || e.targetTouches[0].pageX) + this.position['X']);
        var posY = ((e.clientY || e.targetTouches[0].pageY) + this.position['Y']);
        if(posX <= 0 || posX + this.position['width'] >= document.documentElement.offsetWidth)
          return
        if(posY <= 0 || posY + this.position['height'] >= document.documentElement.offsetHeight)
          return
        this.window.style.left = posX + 'px';
        this.window.style.top  = posY + 'px';
      }
    }
  }
};
</script>

<style scoped>
.window {
  max-width: 100%;
  max-height: 100%;
  min-width: 300px;
  min-height: 300px;
  width: 50%;
  height: 60%;
  border-radius: 5px;
  overflow: hidden;
  position: absolute;
  left: 50%;
  top:50%;
  resize: both;
}
.window-content{
  overflow: hidden;
}
</style>