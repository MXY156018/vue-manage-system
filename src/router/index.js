import Vue from 'vue';
import Router from 'vue-router';

import Login from 'components/page/Login';
import Home from 'components/common/Home';
import Main from 'components/page/Dashboard'
//后台管理员
import Management from 'views/content/Management/Management';
import Managementindex from 'views/content/Management/index'; //管理员列表
Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/login',
            component: Login,
            meta: { title: '登录' }
        },
        {
            path: '/',
            component: Home,
            meta: { title: '自述文件' },
            children:[
                {path: '/dashboard',component:Main,meta:{title:'系统首页',requireAuth:true}},
                {
                    path: '/home/Management',
                    component: Management,
                    title:'管理员',
                    children: [
                        {
                            path: '/home/Management/index',
                            meta: {
                                requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
                                title:'后台管理员'
                            },

                            component: Managementindex
                        }
                    ]
                }
            ]
        }
    ],
    mode: 'history'
});

