<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        beforeCreate() {
            let dns = window.location.hostname;
            let ym = '';
            let reg = RegExp(/test/);
            if (dns == 'localhost') {
                dns = 'test.hyg525.com'
            }
            if (dns.match(reg)) {
                ym = 'https://' + dns + '/HashWorld2';
            } else {
                ym = 'https://' + dns
            }
            var url = ym + '/back/index.php/back/';

            sessionStorage.setItem('httpUrl', url);
            //   //编译路劲
            // var url = 'http://localhost/tangguo/index.php/back/';

            //  sessionStorage.setItem('httpUrl',url);
        }
    }
</script>
<style>
    @import "./assets/css/main.css";
    @import "./assets/css/color-dark.css";     /*深色主题*/
    /*@import "./assets/css/theme-green/color-green.css";   !*浅绿色主题*!*/
</style>
