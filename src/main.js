import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import './assets/css/fontello.css'

const app = createApp(App);

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