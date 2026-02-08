<template>
  <div class="signup-wrapper">
    <h1>Create Account</h1>
    <p>Sign up to access home healthcare services</p>
    <p class="signup-link">
        Already have an account?
        <router-link to="/login">Login</router-link>
      </p>

    <form @submit.prevent="signUp">
      <label>
        Full Name
        <input v-model="form.name" required />
      </label>
      <label>
  Phone Number
  <input
    type="tel"
    v-model="form.phone"
    @input="filterNumbers"
    maxlength="11"
    placeholder="Enter phone number"
    required
  />
</label>


      <label>
        Email Address
        <input type="email" v-model="form.email" required />
      </label>

      <label>
        Password
        <input type="password" v-model="form.password" required />
      </label>

      <button :disabled="loading">
        {{ loading ? "Creating Account..." : "Sign Up" }}
      </button>
    </form>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue"
import { auth, db } from "@/firebase"
import { useRouter } from "vue-router"
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"

const loading = ref(false)
const router = useRouter()
const form = reactive({
  name: "",
  email: "",
  password: "",
  phone: ""
})

function filterNumbers(event) {
  const input = event.target
  input.value = input.value.replace(/\D/g, '')  // remove non-digits
  form.phone = input.value
}


async function signUp() {
  loading.value = true

  try {
    // 1️⃣ Create user in Firebase Auth
    const cred = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    )

    const user = cred.user

    // 2️⃣ Save user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: form.name,
      email: form.email,
      verified: false,
      createdAt: serverTimestamp(),
      phone: form.phone
    })

    // 3️⃣ Send verification email
    await sendEmailVerification(user)

    // 6️⃣ Redirect to email verification notice
    router.push('/verify-email')

  } catch (err) {
    alert(err.message)
  } finally {
    loading.value = false
  }
}
</script>
<style>
.signup-wrapper {
  max-width: 450px;
  margin: 60px auto;
  padding: 30px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #1e7f43;
  text-align: center;
}

p {
  text-align: center;
  margin-bottom: 30px;
}

label {
  display: block;
  margin-bottom: 15px;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 14px;
  background: #1e7f43;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

button:disabled {
  background: #94d3b0;
}
</style>
