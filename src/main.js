import { createApp } from 'vue'
import App from './App.vue'
import Cookies from 'universal-cookie'
import './index.css'
import './assets/css/fontello.css'

const app = createApp(App);

app.config.globalProperties.$cookies = {
    cookies: new Cookies(),
    set(key,value){
        try {
            var expires = new Date;
            expires.setFullYear(expires.getFullYear() + 1);
            console.log(expires);
            this.cookies.set(key,value,{expires:expires});
        } catch (error) {}
    },
    get(key){
        return this.cookies.get(key);
    }
};

app.directive('toggler',{
    beforeMount(el,binding,vnode){
        el.addEventListener('click', function(e){
            if(e.target !== el)
                return;
            let element = e.target.getAttribute('data-toggle');
            element = document.querySelector(element);
            element.classList.toggle('hidden');
            element.setAttribute('popup',"1");
        });
    }
});

app.mount('#app');