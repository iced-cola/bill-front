import Vue from 'vue'
import Router from 'vue-router'
import Bill from '@/components/Bill'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'Bill',
        component: Bill
    }]
})