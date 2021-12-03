import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import './assets/css/fontello.css'

const app = createApp(App);

app.directive('toggler',{
    beforeMount(el,binding,vnode){
        console.log(el);
        el.addEventListener('click', function(e){
            let element = e.target.getAttribute('data-toggle');
            console.log(e);
            element = document.querySelector(element);
            element.classList.toggle('hidden');
            element.setAttribute('popup',"1");
        });
    }
});

app.mount('#app');