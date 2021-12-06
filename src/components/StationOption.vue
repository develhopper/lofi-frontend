<template>
 <div v-if="render">
  <h2 class="text-center text-red-400" v-if="error">{{error}}</h2>
  <div class="grid grid-cols-3 gap-3">
    <div v-for="station in stations" :key="station.id" class="m-1 relative option-item">
      <img :src="station.thumbnail" class="w-full"/>
      <h2 class="font-bold absolute bottom-0 bg-gray-900 bg-opacity-50">
        {{station.title}}
      </h2>
      <button 
      :class="[this.current_station === station.url?'block bg-blue-500':'hidden','option-set-button icon-play bg-white']" 
      @click="onClick(station.url)"></button>
    </div>
  </div>
 </div>
</template>

<script>
export default {
    name:"StationOption",
    data(){
        return {
            stations: '',
            error:'',
            render:false,
            current_station:''
        }
    },
    async created(){
        const resp = await fetch('/api/stations');
        if(resp.status == 200){
            this.error = '';
            this.stations = await resp.json();
        }else{
            this.error = "Unable to connect to database";
        }
        this.render = true;
        this.current_station = this.$cookies.get('current_station');
    },
    methods:{
      onClick(url){
        this.current_station = url;
        this.$emit('set-station', url);
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