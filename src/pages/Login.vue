<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Welcome Back</h1>
      <p class="subtitle">Log in to your account</p>

      <form @submit.prevent="login">
        <label>
          Email Address
          <input type="email" v-model="email" required />
        </label>

        <label>
          Password
          <input type="password" v-model="password" required />
        </label>

        <button class="login-btn" :disabled="loading">
          {{ loading ? "Logging in..." : "Login" }}
        </button>

        <p class="error" v-if="error">{{ error }}</p>
      </form>

      <p class="signup-link">
        Don’t have an account?
        <router-link to="/signup">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase"

const router = useRouter()

const email = ref("")
const password = ref("")
const loading = ref(false)
const error = ref("")

async function login() {
  error.value = ""
  loading.value = true

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push("/dashboard") // 🔥 redirect after login
  } catch (err) {
    error.value = "Invalid email or password"
  } finally {
    loading.value = false
  }
}
</script>

<style>
.login-page {
  min-height: 100vh;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  background: white;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.login-card h1 {
  color: #1e7f43;
  margin-bottom: 5px;
}

.subtitle {
  color: #555;
  margin-bottom: 25px;
}

label {
  display: block;
  margin-bottom: 15px;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 12px;
  margin-top: 6px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: #1e7f43;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  color: #b91c1c;
  margin-top: 10px;
}

.signup-link {
  margin-top: 20px;
  text-align: center;
}
</style>
