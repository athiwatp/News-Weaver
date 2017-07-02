import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/components/Home';
import Dashboard from '@/components/Dashboard';
import All from '@/components/All';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            children: [
                {
                    path: 'all',
                    name: 'all',
                    component: All
                }
            ]
        }
    ]
});