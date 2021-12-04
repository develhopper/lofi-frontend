<script>
export default {
    data(){
        return {
            commands:[
                {name:'clear',function:this.clear}
            ]
        };
    },
    methods:{
        clear(){
            this.$refs.content.innerHTML = "";
        }
    }
}
</script>