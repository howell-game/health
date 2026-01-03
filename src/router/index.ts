import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/pages/Landing.vue'
import BookingForm from '@/pages/BookingForm.vue'
import ClientDashboard from '@/pages/ClientDashboard.vue'
import ProviderDashboard from '@/pages/ProviderDashboard.vue'
import Signup from '@/pages/Signup.vue'
import Login from '@/pages/Login.vue'
import Policy from '@/pages/Policy.vue'
import About from '@/pages/About.vue'
import Payment from '@/pages/Payment.vue'
import EditProviderProfile from '@/pages/EditProviderProfile.vue'
import ProviderSignup from '@/pages/ProviderSignup.vue'
import Manage from '@/pages/Manage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing,
    },
    {
      path: '/editprovider',
      name: 'EditProviderProfile',
      component: EditProviderProfile,
    },
    {
      path: '/payment',
      name: 'Payment',
      component: Payment,
    },
    {
      path: '/manage',
      name: 'Manage',
      component: Manage,
    },
    {
      path: '/dashboard',
      name: 'ClientDashboard',
      component: ClientDashboard,
    },
     {
      path: '/providerdashboard',
      name: 'ProviderDashboard',
      component: ProviderDashboard,
    },

    {
      path: '/about',
      name: 'About',
      component: About,
    },
    {
      path: '/policy',
      name: 'Policy',
      component: Policy,
    },
    {
      path: '/providersignup',
      name: 'ProviderSignup',
      component: ProviderSignup,
    },
    {
      path: '/book',
      name: 'BookingForm',
      component: BookingForm,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
    },
     {
      path: '/login',
      name: 'Login',
      component: Login,
    },

  ],
})

export default router
