import { createRouter, createWebHashHistory } from 'vue-router'
import Landing from '@/pages/Landing.vue'
import BookingForm from '@/pages/BookingForm.vue'
import ClientDashboard from '@/pages/ClientDashboard.vue'
import ProviderDashboard from '@/pages/ProviderDashboard.vue'
import Signup from '@/pages/Signup.vue'
import Login from '@/pages/Login.vue'
import AdminDashboard from '@/pages/AdminDashboard.vue'
import Policy from '@/pages/Policy.vue'
import About from '@/pages/About.vue'
import Payment from '@/pages/Payment.vue'
import EditProviderProfile from '@/pages/EditProviderProfile.vue'
import ProviderSignup from '@/pages/ProviderSignup.vue'
import Manage from '@/pages/Manage.vue'
import Contact from '@/pages/Contact.vue'
import PaymentSuccess from '@/pages/PaymentSuccess.vue'
import VerifyEmail from '@/pages/VerifyEmail.vue'

const router = createRouter({
  // 🔑 Use hash mode for GitHub Pages
  history: createWebHashHistory('/health/'),
  routes: [
    { path: '/', name: 'Landing', component: Landing },
    { path: '/editprovider', name: 'EditProviderProfile', component: EditProviderProfile },
    { path: '/payment-success', name: 'PaymentSuccess', component: PaymentSuccess },
    { path: '/verify-email', name: 'VerifyEmail', component: VerifyEmail },
    { path: '/payment', name: 'Payment', component: Payment },
    { path: '/contact', name: 'Contact', component: Contact },
    { path: '/admin', name: 'AdminDashboard', component: AdminDashboard },
    { path: '/manage', name: 'Manage', component: Manage },
    { path: '/dashboard', name: 'ClientDashboard', component: ClientDashboard },
    { path: '/providerdashboard', name: 'ProviderDashboard', component: ProviderDashboard },
    { path: '/about', name: 'About', component: About },
    { path: '/policy', name: 'Policy', component: Policy },
    { path: '/providersignup', name: 'ProviderSignup', component: ProviderSignup },
    { path: '/book', name: 'BookingForm', component: BookingForm },
    { path: '/signup', name: 'Signup', component: Signup },
    { path: '/login', name: 'Login', component: Login },
  ],
})

export default router
