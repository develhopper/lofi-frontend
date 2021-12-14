<template>
    <Window
    :id="window.id"
    :title="window.title"
    :transparent="window.transparent"
    :icon="window.icon"
    @window-close="$emit('window-close',window.id)"
    @minimize-window="$emit('minimize-window',window.id)">
        <div ref="terminal" 
        class="terminal w-full h-full pl-1" 
        tabindex="0" 
        @click="onClick">
        <span ref="content"></span>
        <span ref="cursor" class="cursor" contenteditable="true" @keypress="onKeyPress" @keydown="onKeyDown"></span>
        </div>
    </Window>
</template>

<script>
import Window from './Window.vue'
import Commands from './Commands.vue'

export default {
    name:"Terminal",
    components:{
        Window

    },
    mixins:[Commands],
    props:{
        window:Object
    },
    data(){
        return {
            terminal:'',
            prompt:'➜',
            path:'~',
            command:'',
            history:[],
            historyIndex:0,
            
        };
    },
    mounted(){
        this.terminal = this.$refs.terminal;
        this.displayPrompt();
    },
    methods:{
        async onKeyPress(e){
            e.preventDefault();
            var keyCode = e.keyCode;

            switch(keyCode){
                case 13:
                    this.$refs.content.innerHTML += this.$refs.cursor.innerHTML;
                    this.$refs.content.innerHTML +="\n";
                    await this.processCommand();
                    this.displayPrompt();
                    break;
                default:
                    this.appendCommand(String.fromCharCode(keyCode));
            }
        },
        onKeyDown(e){
            var keyCode = e.keyCode;
            if(keyCode === 8){
                e.preventDefault();
                this.erase(1);
            }

            if(keyCode === 38 || keyCode === 40){
                e.preventDefault();
                if(keyCode == 38){
                    this.historyIndex--;
                    if(this.historyIndex<0)
                        this.historyIndex++;
                }
                if(keyCode == 40){
                    this.historyIndex++;
                    if(this.historyIndex > this.history.length -1)
                        this.historyIndex--;
                }
                
                var cmd = this.history[this.historyIndex];
                if(cmd !== undefined){
                    this.clearCommand();
                    this.appendCommand(cmd);
                }
            }
            
        },
        onClick(){
            this.$refs.cursor.focus();
        },
        displayPrompt(){
            this.$refs.content.append(this.parseHtml("<span class='prompt'> "+this.prompt+" </span>"));
            this.$refs.content.append(this.parseHtml("<span class='path'> "+this.path+" </span>"));
            this.$refs.terminal.scrollTop = this.$refs.terminal.scrollHeight;
        },
        appendCommand(str){
            this.$refs.cursor.innerHTML += str;
            this.command += str;
        },
        clearCommand(){
            this.$refs.cursor.innerHTML ="";
            this.command = "";
        },
        async processCommand(){
            var isValid = false;
            if(this.command !== this.$refs.cursor.innerHTML)
                this.command = this.$refs.cursor.innerHTML;
            if(this.command.trim() === '')
                return;
            
            var args = this.command.split(' ');
            var cmd = args[0];
            args.shift();

            for(var i=0;i<this.commands.length; i++){
                if(cmd === this.commands[i].name){
                    isValid = true;
                    var result = await this.commands[i].function(args);
                    this.printResult(result);
                    break;
                }
            }

            if(!isValid){
                this.$refs.content.innerHTML += "sh: command not found: "+this.command+"\n";
            }
            this.$refs.cursor.innerHTML = "";
            this.history.push(this.command);
            this.historyIndex = this.history.length;
            this.command = "";
        },
        erase(count){
            this.$refs.cursor.innerHTML = this.$refs.cursor.innerHTML.slice(0, -count)
            this.command = this.command.slice(0, -count);
        },
        printResult(result){
            if(result){
                if(result instanceof Object){
                    result = `<span class="${result['class']}">${result['text']}</span>`;
                }
                this.$refs.content.innerHTML += result;
                this.$refs.content.innerHTML += "\n";
            }
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
	word-wrap: break-word;
    overflow-y: auto;  
}
.terminal::after{
    content: "_";
    animation: blink 2s steps(1) infinite;
    font-weight: bolder;
}
.cursor{
    caret-color: transparent;
    outline: none;
}
.danger{
    color:rgb(220, 38, 38)
}
.success{
    color:rgba(5, 150, 105)
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