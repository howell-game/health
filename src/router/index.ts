import { createRouter, createWebHashHistory } from 'vue-router'
import { getAuth } from "firebase/auth"
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
import PaymentFailure from '@/pages/PaymentFailure.vue'
import PaymentProcessing from '@/pages/PaymentProcessing.vue'
import VerifyEmail from '@/pages/VerifyEmail.vue'
import Withdraw from '@/pages/Withdraw.vue'

const router = createRouter({
  // 🔑 Use hash mode for GitHub Pages
  history: createWebHashHistory('/health/'),
  routes: [
    { path: '/', name: 'Landing', component: Landing },
    { path: '/editprovider', name: 'EditProviderProfile', component: EditProviderProfile, meta: { requiresAuth: true } },
    { path: '/payment-success', name: 'PaymentSuccess', component: PaymentSuccess, meta: { requiresAuth: true } },
    { path: '/payment-failure', name: 'PaymentFailure', component: PaymentFailure, meta: { requiresAuth: true } },
    { path: '/payment-processing', name: 'PaymentProcessing', component: PaymentProcessing, meta: { requiresAuth: true } },
    { path: '/verify-email', name: 'VerifyEmail', component: VerifyEmail , meta: { requiresAuth: true }},
    { path: '/payment', name: 'Payment', component: Payment },
    { path: '/contact', name: 'Contact', component: Contact, meta: { requiresAuth: true } },
    { path: '/admin', name: 'AdminDashboard', component: AdminDashboard },
    { path: '/manage', name: 'Manage', component: Manage , meta: { requiresAuth: true }},
    { path: '/dashboard', name: 'ClientDashboard', component: ClientDashboard, meta: { requiresAuth: true }},
    { path: '/providerdashboard', name: 'ProviderDashboard', component: ProviderDashboard, meta: { requiresAuth: true } },
    { path: '/about', name: 'About', component: About },
    { path: '/policy', name: 'Policy', component: Policy },
    { path: '/providersignup', name: 'ProviderSignup', component: ProviderSignup },
    { path: '/book', name: 'BookingForm', component: BookingForm},
    { path: '/signup', name: 'Signup', component: Signup },
    { path: '/login', name: 'Login', component: Login },
    {path: '/withdraw', name: 'Withdraw', component: Withdraw },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = getAuth()
  const user = auth.currentUser

  if (to.meta.requiresAuth && !user) {
    next("/signup")   // 🔐 redirect to login
  } else {
    next()
  }
})

export default router
