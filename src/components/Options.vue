<template>
    <Window
    :id="window.id"
    :title="window.title"
    :transparent="window.transparent"
    :icon="window.icon"
    @window-close="$emit('window-close',window.id)">
    test
    </Window>
</template>

<script>
import Window from './Window.vue'

export default {
    name:"Options",
    components:{
        Window
    },
    props:{
        window:Object
    }
}
</script>