<template>
    <div>
        <div>{{title}}</div>
    </div>

</template>

<script>
    let Base64 = require('js-base64').Base64;
    export default {
        data(){
            return{
                title: ''
            }
        },
        methods:{
            changeTitle(){
                let path = this.$route.path;
                let title = path.substr(6);
                if (title == 'Inform/list' || title == 'Inform/newslists') {
                    title = title + '?type=' + this.$route.query.type;
                };
                let info = JSON.parse(Base64.decode(sessionStorage.getItem('loginData')));
                this.$http.post(
                    sessionStorage.getItem('httpUrl')+'Communal/programa',
                    {
                        'user': info.user,
                        'token': info.token,
                        'title': title
                    },
                    {emulateJSON: true}
                ).then(function (res) {
                    let result = JSON.parse(Base64.decode(res.data.retdata));
                    this.title = result;
                })
            }
        },
        mounted(){
            this.changeTitle();
        },
        watch:{
            '$route'(to,from) {
                this.changeTitle();
            },
        }
    }
</script>

<style scoped>
    div{
        height: 30px;
        margin-bottom: 30px;
        line-height: 30px;
        font-size: 20px;
        color: black;
    }
</style>



// WEBPACK FOOTER //
// src/components/tool/title.vue
