<template>
  <div class="app-layout">
    <!-- Header -->
    <header class="site-header">
      <div class="container">
        <h1 class="logo">HomeHealthCare</h1>

        <router-link
          v-if="!isLoggedIn"
          to="/signup"
          class="nav-link signup"
        >
          Sign In
        </router-link>

        <button
          v-else
          class="nav-link signup"
          @click="logout"
        >
          Logout
        </button>

        <button class="hamburger" @click="toggleMenu">☰</button>

        <nav :class="{ 'nav-links': true, open: menuOpen }">
          <router-link to="/" class="nav-link" @click="closeMenu">Home</router-link>
          <router-link to="/about" class="nav-link" @click="closeMenu">About</router-link>
          <router-link to="/policy" class="nav-link" @click="closeMenu">Policy</router-link>


          <a
  v-if="isLoggedIn"
  href="#"
  class="nav-link"
  @click.prevent="goToDashboard"
>
  Dashboard
</a>


          
          <router-link
            v-if="isLoggedIn"
            to="/editprovider"
            class="nav-link"
            @click="closeMenu"
          >
            Settings
          </router-link>
        </nav>
      </div>
    </header>

    <!-- 🔑 THIS WAS MISSING -->
    <main class="page-content">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="footer-container">
        <p>© 2025 Home Healthcare. All rights reserved.</p>
        <p>Email: info@homehealthcare.com | Phone: +123SS</p>
      </div>
    </footer>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from "vue-router"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase"

const router = useRouter()
const menuOpen = ref(false)
const isLoggedIn = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
function closeMenu() {
  menuOpen.value = false
}

const auth = getAuth()

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user
  })
})
async function logout() {
  try {
    await signOut(auth)   // ✅ wait for sign out
    closeMenu()
    router.replace('/')    // ✅ go to landing page
  } catch (error) {
    console.error("Logout failed:", error)
  }
}

async function goToDashboard() {
  closeMenu()

  const user = auth.currentUser
  if (!user) return

  try {
    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      router.push("/dashboard")
      return
    }

    const role = userSnap.data().role

    if (role === "provider") {
      router.push("/providerdashboard")
    } else {
      router.push("/dashboard")
    }

  } catch (err) {
    console.error("Dashboard redirect failed:", err)
    router.push("/dashboard")
  }
}

</script>


<style>
/* Header Styles */
.site-header {
  background: #9ec9a5ff;
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}
html, body {
  margin: 0;
  padding: 0;
}

.site-footer {
  margin-top: 0;
}


.site-header .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.site-header .logo {
  color: #1e7f43;
  font-size: 1.6rem;
  font-weight: bold;
}

/* Nav Links */
.site-header .nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.site-header .nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.site-header .nav-link:hover {
  background-color: #f0fff6;
  color: #1e7f43;
}

/* Sign Up button */
.site-header .signup {
  background-color: #ffffffff;
  color: #166534;
  font-weight: 700;
  padding: 8px 15px;
}
.site-header .signup:hover {
  background-color: #c7e1d1ff;
}

/* Hamburger button for mobile */
.hamburger {
  display: none;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .hamburger {
    display: block;
    color: black;
    width: 200px;
  }

  .site-header .nav-links {
    position: absolute;
    top: 60px;
    right: 0;
    background: white;
    flex-direction: column;
    width: 200px;
    padding: 10px 0;
    gap: 0;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    display: none;
  }

  .site-header .nav-links.open {
    display: flex;
  }

  .site-header .nav-link {
    padding: 10px 20px;
    width: 100%;
    text-align: left;
    border-radius: 0;
  }
  /* Make logout button behave exactly like Sign In link */
.site-header button.signup {
  background-color: #ffffff;
  color: #166534;
  font-weight: 700;
  padding: 8px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  /* 🔑 Critical fixes */
  width: auto;
  min-width: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.site-header button.signup:hover {
  background-color: #c7e1d1ff;
}

  
}
/* ================= FOOTER ONLY ================= */
.site-footer {
  background-color: #000;
  color: #82afc0ff;
  padding: 25px 0;
  margin-top: 0;
}

.site-footer .footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

.site-footer p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
}

html, body {
  height: 100%;
  margin: 0;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
}

</style>
