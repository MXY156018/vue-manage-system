<template>
    <div class="sidebar">
        <el-menu
                class="sidebar-el-menu"
                :default-active="onRoutes"
                :collapse="collapse"
                background-color="#324157"
                text-color="#bfcbd9"
                active-text-color="#20a0ff"
                unique-opened>
            <template v-for="(item,index) in menuItems">
                <template v-if="item.subs">
                    <el-submenu :index="index+''">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title" >{{ item.titel }}</span>
                        </template>
                        <template v-for="(subItem,index2) in item.subs">
                            <el-submenu
                                    v-if="subItem.subs"
                                    :index="index2+''"
                                    :key="subItem.id"

                            >
                                <template slot="titel" >{{ subItem.titel }}</template>
                                <el-menu-item
                                        v-for="(threeItem,i) in subItem.subs"
                                        :key="threeItem.id"
                                        :index="i+''"
                                >{{ threeItem.titel }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                    v-else
                                    :index="index2+''"
                                    :key="subItem.id"
                                    @click="goPage(subItem.url)"
                            >{{ subItem.titel }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="index+''" :key="item.id">
                        <i :class="item.icon"></i>
                        <span slot="titel">{{ item.titel }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>

    </div>
</template>

<script>
    import bus from '../common/bus';
    let Base64 = require('js-base64').Base64;

    export default {
        data() {
            return {
                collapse: false,
                menuItems: []
            };
        },
        methods: {
            getMenuList() {

                let info = JSON.parse(Base64.decode(sessionStorage.getItem('loginData')));
                this.$http.post(
                    sessionStorage.getItem('httpUrl') + 'Communal/menu',
                    {
                        'user': info.user,
                        'token': info.token
                    },
                    { emulateJSON: true }
                ).then(function(res) {
                    console.log(res)
                    let result = JSON.parse(Base64.decode(res.data.retdata));
                    this.menuItems = result;
                    console.log(result)
                });
            },
            goPage(name) {

                this.$router.push({path: '/home/' + name});
            },
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }

        },
        created() {

            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
                bus.$emit('collapse-content', msg);
            });
            this.getMenuList();
        }
    };
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 180px;
    }

    .sidebar > ul {
        height: 100%;
    }
</style>
