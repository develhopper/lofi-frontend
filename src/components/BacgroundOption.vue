<template>
 <div v-if="render">
  <h2 class="text-center text-red-400" v-if="error">{{error}}</h2>
  <div class="grid grid-cols-3 gap-3">
    <div v-for="background in backgrounds" :key="background.id" class="m-1 relative option-item">
      <img :src="background.thumbnail" class="w-full"/>
      <h2 class="font-bold absolute bottom-0 bg-gray-900 bg-opacity-50">
        {{background.title}}
      </h2>
      <button :class="[current_background === background.url?'block icon-ok bg-green-700':'hidden icon-sliders', 'option-set-button bg-white']" 
      @click="onClick(background.url)"></button>
    </div>
  </div>
 </div>
</template>

<script>
export default {
    name:"BackgroundOption",
    data(){
        return {
            backgrounds: '',
            error:'',
            render:false,
            current_background:''
        }
    },
    async created(){
        const resp = await fetch('/api/backgrounds');
        if(resp.status == 200){
            this.error = '';
            this.backgrounds = await resp.json();
        }else{
            this.error = "Unable to connect to database";
        }
        this.render = true;
        this.current_background = this.$cookies.get('current_background')
    },
    methods:{
      onClick(url){
        this.current_background = url;
        this.$emit('set-background', url);
      }
    }
}
</script>
<style scoped>
.option-item {
  box-shadow: 3px 3px 7px black;
  border-radius: 7px;
  overflow: hidden;
  --tw-bg-opacity: 0.8;
}

.option-item:hover .option-set-button {
  display: block;
}

.option-set-button {
  cursor: pointer;
  border-radius: 50%;
  padding: 7px;
  position: absolute;
  color: black;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 3px 3px 4px black;
}

.option-set-button:hover {
  background: #2563eb;
  color: white;
}
</style>