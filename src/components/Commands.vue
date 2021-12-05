<script>
export default {
    data(){
        return {
            commands:[
                {name:'clear',function:this.clear,description:"clear terminal screen"},
                {name:'help', function:this.help,description:"see this guide"},
                {name:'ls', function:this.list,
                description:"list of available paths:\n\tls stations #for view list of stations\n\tls backgrounds #for view list of backgrounds"},
                {name:'set', function:this.setBackground,description:"set background:\n\tset {background id}\n\tset 1"},
                {name:'play', function:this.playStation,description:"change station:\n\tplay {station id}"},
                {name:"ascii",function:this.ascii,description:"Print ascii art of given input text:\n\t" +
                "ascii {text} {color name or code} {fontname}\n\tascii lo-fi red binary\n\t ascii lo-fi #000000 binary"+
                "list of <a href='https://artii.herokuapp.com/fonts_list'>fonts</a>"},
                {name:'exit',function:this.exit,description:"close terminal"}
            ]
        };
    },
    methods:{
        clear(){
            this.$refs.content.innerHTML = "";
        },
        help(){
            var result= '<p class="font-bold text-blue-300">List of available commands</p><br>';
            this.commands.forEach(item => {
                result += `<span class="font-bold text-yellow-400">${item['name']}</span>`
                result += `<p>\t${item['description']}</p>`;
                result += "<br>";
            });
            return result;
        },
        async list(args = []){
            if(args.length === 0){
                return this.renderList(["stations", "backgrounds"]);
            }else{
                const res = await fetch('/api/'+ args[0]);
                if(res.status == 200){
                    const data = await res.json();
                    return this.renderList(data, {id:"id",text:"title"});
                }
                else{
                    return {class:"danger",text:"Unable to connect to database"}
                }
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
            console.log(res);
            if(res.status == 200){
                const data = await res.json();
                console.log(data);
                if(data){
                    this.$emit('set-background', data['url']);
                }
            }else{
                return {class:"danger", text:"Background not found"};
            }
        },
        async playStation(args = []){
            if(args.length == 0)
                return "Invalid arg: send station id";
            const res = await fetch(`/api/stations/${args[0]}`)
            if(res.status == 200){
                const data = await res.json();
                if(data){
                    this.$emit('set-station', data['url']);
                }
            }else{
                return {class:"danger", text:"Station not found"};
            }
        },
        async ascii(args = []){
            if(args.length == 0)
                return "invalid args, see help";
            var url = "api/ascii?text="+encodeURIComponent(args[0])
            var style = "";
            
            if(args.length == 2)
                style = "color:"+args[1];    
            
            if(args.length == 3)
                url += "&font="+encodeURIComponent(args[2])
            
            const resp = await fetch(url,{referrerPolicy: 'no-referrer'});

            if(resp.status == 200){
                const text = await resp.text();
                return `<span style='${style}'>${text}</span>`
            }
            else{
                return {class:"danger",text:"command not available"}
            }
        },
        exit(){
            this.$emit('window-close',this.window.id);
        }
    }
}
</script>