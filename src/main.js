import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import iView from 'view-design';
import 'view-design/dist/styles/iview.css'
import VueResource from 'vue-resource'
import VueClipboard from 'vue-clipboard2'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'


Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
})
Vue.use(VueClipboard)

Vue.use(VueResource);
Vue.use(iView);
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (sessionStorage.getItem('loginData')) {
            next();
        }
        else {
            next({
                path: '/login'
            })
        }
    }
    else {
        next();
    }
});

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');
