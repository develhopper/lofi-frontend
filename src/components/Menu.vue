<template>
  <div :id="id" class="absolute menu bg-gray-900 text-white hidden toggleable" :style="[style,'z-index:100']">
    <ul class="list-none">
      <li class="item" @click="$emit('item-clicked', item.id)" v-for="item in items" :key="item.id">{{item.text}}</li>
    </ul>
  </div>
</template>

<script>
export default {
    name:"Menu",
    props:{
        items:Array,
        style:String,
        id:String
    }
}
</script>


<style scoped>
.menu{
    min-width: 200px;
    width: auto;
    border-radius: 4px;
    box-shadow: 3px 3px 7px black;
    border:1px solid cyan;
  }
.menu .item{
    padding:3px;
  }
  
.menu .item:hover{
    background: #1F2937;
    cursor: pointer;
    border:1px solid cyan;
  }
</style>