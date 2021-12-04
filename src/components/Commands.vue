<script>
export default {
    data(){
        return {
            commands:[
                {name:'clear',function:this.clear},
                {name:'ls', function:this.list},
                {name:'set', function:this.setBackground},
                {name:'play', function:this.playStation}
            ]
        };
    },
    methods:{
        clear(){
            this.$refs.content.innerHTML = "";
        },
        async list(args = []){
            console.log(args.length);
            if(args.length === 0){
                return this.renderList(["stations", "backgrounds"]);
            }else{
                const res = await fetch('/api/'+ args[0]);
                const data = await res.json();
                return this.renderList(data, {id:"id",text:"title"});
            }
        },
        renderList(list, options={}){
            var result = '';
            list.forEach(item => {
                if(item instanceof Object){
                    result += "<span class='text-blue-300 ml-4'>"+item[options['id']]+"."+item[options['text']]+"</span>";  
                }else{
                    result += "<span class='text-blue-300 ml-4'>"+item+"</span>";
                }
            });
            return result;
        },
        parseHtml(html){
            return new DOMParser().parseFromString(html, 'text/html').body.childNodes[0];
        },
        async setBackground(args = []){
            if(args.length == 0)
                return "Invalid arg: send background id";
            const res = await fetch(`/api/backgrounds/${args[0]}`)
            if(res.status == 200){
                const data = await res.json();
                console.log(data);
                if(data){
                    document.body.style.backgroundImage = `url(${data['url']})`
                }
            }else{
                return "Background not found";
            }
        },
        playStation(args){

        }
        
    }
}
</script>