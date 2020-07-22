<template>
    <div class="content">
        <myTitle></myTitle>
        <p>
            状态：
            <Select v-model="state" style="width:200px" size="large" clearable>
                <Option v-for="item in stateList" :value="item.typeid" :key="item.typeid">{{ item.name }}</Option>
            </Select>
            等级：
            <Select v-model="typeValue" style="width:200px" size="large" clearable>
                <Option v-for="item in typeList" :value="item.typeid" :key="item.typeid">{{ item.name }}</Option>
            </Select>
            账号:
            <Input placeholder="请输入" style="width: 200px" size="large" v-model="username"></Input>
            <Button type="primary" @click="search">查询</Button>
        </p>
        <p v-if="jurisdiction['50']">
            <router-link to="add" tag="button" class="btn btn-warning" style="color: #FFFFFF">添加管理员</router-link>
        </p>


        <table cellspacing="0" cellpadding="0">
            <thead>
            <tr>
                <th>ID</th>
                <th>账号</th>
                <th>等级</th>
                <th>上级ID</th>
                <th>状态</th>
                <th>时间</th>
                <th v-if="jurisdiction['3'] || jurisdiction['4'] || jurisdiction['51']">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(value,index) in historyData" v-if="historyData.length > 0">
                <td>{{value.id}}</td>
                <td>{{value.username}}</td>
                <td>{{value.uid > 1 ? '代理':'管理员'}}</td>
                <td>{{value.s_id == '0'?'无':value.s_id}}</td>
                <td>{{value.state == '0'?'冻结':'正常'}}</td>
                <td>{{value.addtime}}</td>
                <td v-if="jurisdiction['3'] || jurisdiction['4'] || jurisdiction['51']">
                    <router-link :to="{path: 'allot',query:{ id: value.id}}" v-if="jurisdiction['3'] && value.uid <= 1">分派权限</router-link>
                    <a href="javascript:;" @click="editstate(value.id)" v-if="jurisdiction['4']">{{value.state == '1'?'冻结':'解冻'}}</a>
                    <a href="javascript:;" @click="reset(value.username)" v-if="jurisdiction['51']">重置密码</a>
                </td>
            </tr>
            <tr>
                <td colspan="90" v-if="historyData.length == 0">暂无数据</td>
            </tr>
            </tbody>
        </table>
        <Page class="page" :current="1" @on-change="changepage" :total="page.dataCount" :pageSize="page.pageSize" show-elevator></Page>
    </div>
</template>

<script>
    import myTitle from 'views/tool/title'
    let Base64 = require('js-base64').Base64;


    export default {
        components:{
            myTitle
        },
        data(){
            return{
                jurisdiction:{
                    3: false,
                    4 : false,
                    50 : false,
                    51: false
                },
                historyData: [],
                page:{
                    dataCount: 0,
                    pageSize: 15,
                },
                p: 1,
                qx: 0,
                username: '',
                typeValue: '',
                typeList: [
                    {
                        typeid: 1,
                        name: '管理员'
                    }
                ],
                state: 1,
                stateList: [
                    {
                        typeid: 'all',
                        name: '全部'
                    },
                    {
                        typeid: 0,
                        name: '冻结'
                    },
                    {
                        typeid: 1,
                        name: '正常'
                    }
                ],
            }
        },
        created(){
            this.showTable();
            this.limits();
        },
        methods:{
            editstate(id){
                let info = JSON.parse(Base64.decode(sessionStorage.getItem('loginData')));
                this.$http.post(
                    sessionStorage.getItem('httpUrl')+'Management/editstate',
                    {
                        'user': info.user,
                        'token': info.token,
                        'id': id
                    },
                    {emulateJSON: true}
                ).then(function (res) {
                    alert(res.data.msg);
                    this.showTable();
                })
            },
            limits(){
                let info = JSON.parse(Base64.decode(sessionStorage.getItem('loginData')));
                this.$http.post(
                    sessionStorage.getItem('httpUrl')+'Communal/limits',
                    {
                        'user': info.user,
                        'token': info.token,
                        'jurisdiction': this.jurisdiction,
                    },
                    {emulateJSON: true}
                ).then(function (res) {
                    let result = JSON.parse(Base64.decode(res.data.retdata));
                    this.jurisdiction = result;
                })
            },
            showTable(){
                let info = JSON.parse(Base64.decode(sessionStorage.getItem('loginData')));
                this.$http.post(
                    sessionStorage.getItem('httpUrl')+'Management/index',
                    {
                        'user': info.user,
                        'token': info.token,
                        'p': this.p,
                        'page': this.page.pageSize,
                        'username': this.username,
                        'type': this.typeValue,
                        'state': this.state
                    },
                    {emulateJSON: true}
                ).then(function (res) {
                    if(res.data.state == 404){
                        alert(res.data.msg);
                        sessionStorage.removeItem('loginData');
                        this.$router.push('/login');
                    }else {
                        let result = JSON.parse(Base64.decode(res.data.retdata));
                        //console.log(result);
                        this.historyData = result.arr;
                        this.qx = result.qx;
                        this.page.dataCount = result.count;
                    }

                })
            },
            changepage(index){
                this.p = index;
                this.showTable(this.$store.state.dateComponent[0],this.$store.state.dateComponent[1]);
                let _start = ( index - 1 ) * this.page.pageSize;
                let _end = index * this.page.pageSize;
                this.historyData.slice(_start,_end);
            },
            search(){
                this.p = 1;
                this.showTable(this.$store.state.dateComponent[0],this.$store.state.dateComponent[1]);
            },
            reset(username){
                let info = JSON.parse(Base64.decode(sessionStorage.getItem('loginData')));
                this.$http.post(
                    sessionStorage.getItem('httpUrl')+'Management/reset',
                    {
                        'user': info.user,
                        'token': info.token,
                        'username': username
                    },
                    {emulateJSON: true}
                ).then(function (res) {
                    alert(res.data.msg);
                })
            }
        }
    }
</script>

<style scoped>

    .page{
        width: 80%;
        margin-top: 30px;
        text-align: center;
    }

    p{
        margin-bottom: 20px;

    }

    table{
        width: 97%;
    }


    th{
        background-color: #f5f7fa;
    }

    th,td{
        height: 35px;
        border: 1px solid #c0c0c0;
        text-align: center;
        color: #909399;
    }

    td{
        border-top: none;
    }

    tbody tr:hover{
        background-color: #f5f7fa;
    }

    #sort{
        display: inline-block;
        position: relative;
    }

    #sort span:first-child{
        position: absolute;
        cursor: pointer;
        width: 0;
        height: 0;
        top: -15px;
        left: 5px;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 10px solid #909399;
    }

    #sort span:last-child{
        position: absolute;
        cursor: pointer;
        width: 0;
        height: 0;
        top: 0;
        left: 5px;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 10px solid #909399;
    }

</style>


// WEBPACK FOOTER //
// src/components/home/content/Management/index.vue
