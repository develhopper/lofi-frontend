<template>
    <Window
    :id="window.id"
    :title="window.title"
    :transparent="window.transparent"
    :icon="window.icon"
    @window-close="$emit('window-close',window.id)">
        <div ref="terminal" class="terminal w-full h-full pl-1" @keypress="onKeyPress" tabindex="0"></div>
    </Window>
</template>

<script>
import Window from './Window.vue'
export default {
    name:"Terminal",
    components:{
        Window

    },
    props:{
        window:Object
    },
    data(){
        return {
            terminal:'',
            prompt:'➜',
            path:'~',
            command:'',
        };
    },
    mounted(){
        this.terminal = this.$refs.terminal;
        this.displayPrompt();
    },
    methods:{
        displayPrompt(){
            this.terminal.innerHTML+="<span class='prompt'> "+this.prompt+" </span>";
            this.terminal.innerHTML+="<span class='path'> "+this.path+" </span>";
        },
        onKeyPress(e){
            var keyCode = e.keyCode;

            switch(keyCode){
                case 13:
                    this.terminal.innerHTML +="\n";
                    this.processCommand();
                    this.displayPrompt();
                    break;
                default:
                    this.appendCommand(String.fromCharCode(keyCode));
            }
        },
        appendCommand(str){
            this.terminal.innerHTML += str;
            this.command += str;
        },
        processCommand(){
            var isValid = false;

            if(!isValid){
                this.terminal.innerHTML += "lsh: command not found: "+this.command+"\n";
            }
            this.command = "";
        }
    }
}
</script>

<style>
.prompt {
	color: rgb(189, 227, 113);
}

.path {
	color: rgb(94, 215, 255);
}
.terminal{
    outline: none;
    white-space: pre-wrap;
	white-space: -moz-pre-wrap;
	white-space: -pre-wrap;
	white-space: -o-pre-wrap;
	word-wrap: break-word;
    overflow-y: auto;
}
.terminal::after{
    content: "_";
    animation: blink 2s steps(1) infinite;
    font-weight: bolder;
}
@keyframes blink { 50% { color: transparent; } }
@keyframes bounceIn {
  0% {
    transform: translateY(-1000px);
  }
  60% {
    transform: translateY(200px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>