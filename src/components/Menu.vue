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