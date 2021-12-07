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
        <button class="icon-min-icon" @click="minimize"></button>
        <button class="icon-max-icon" @click="maximize"></button>
        <button class="icon-cancel-circled text-red-400" @click="$emit('window-close',this.id)"></button>
      </div>
    </div>

    <div class="flex window-content bg-gray-900 w-full h-full text-white" :style="transparent?'--tw-bg-opacity: 0.7':''">
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
    this.window.style.left = ((document.documentElement.offsetWidth /2)-(this.window.offsetWidth /2)) +"px";
    this.window.style.top = ((document.documentElement.offsetHeight / 2) - (this.window.offsetHeight/2)) +"px";
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
      window:'',
      state:{
        type:'normal',
        width:0,
        height:0,
        top:0,
        left:0
      }
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
      e.target.style.cursor = "";
    },
    onDrag(e){
      e.preventDefault();
      if(this.mouseDown){
        var posX = ((e.clientX || e.targetTouches[0].pageX) + this.position['X']);
        var posY = ((e.clientY || e.targetTouches[0].pageY) + this.position['Y']);
        if(posX <= 0 && e.movementX<0  || posX + this.position['width'] >= document.documentElement.offsetWidth && e.movementX>0)
          return
        if(posY <= 0 || posY + this.position['height'] >= document.documentElement.offsetHeight)
          return
        this.window.style.left = posX + 'px';
        this.window.style.top  = posY + 'px';
      }
    },
    maximize(){
      if(this.state.type !== 'maximized'){
      this.state.width = this.$refs.window.offsetWidth+'px';
      this.state.height = this.$refs.window.offsetHeight+'px';
      this.state.top = this.$refs.window.offsetTop;
      this.state.left = this.$refs.window.offsetLeft;
      this.$refs.window.style.width = document.documentElement.offsetWidth+'px';
      this.$refs.window.style.height = (document.documentElement.offsetHeight - 24)+'px'
      this.$refs.window.style.left = 0;
      this.$refs.window.style.top = 24+"px";
      this.state.type = "maximized";
    }else if(this.state.type == "maximized" || this.state.type == "minimized"){
      this.$refs.window.style.width = this.state.width;
      this.$refs.window.style.height = this.state.height;
      this.$refs.window.style.top = this.state.top+'px';
      this.$refs.window.style.left = this.state.left+'px';
      this.state.type = "normal"
    }
    },
    minimize(){
      if(this.state.type !== "minimized"){
        this.state.width = this.$refs.window.offsetWidth+'px';
        this.state.height = this.$refs.window.offsetHeight+'px';
        this.state.top = this.$refs.window.offsetTop;
        this.state.left = this.$refs.window.offsetLeft;
        this.$emit('minimize-window',this.id);
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
  resize: both;
  box-shadow: 3px 3px 7px black;
}
.window-content{
  overflow: hidden;
}
</style>