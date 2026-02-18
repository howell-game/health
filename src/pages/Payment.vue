<template>
  <div class="payment-page">
    <div class="payment-card">
      <h1>Complete Your Payment</h1>
      <p class="subtitle">
        Secure payment to confirm your booking
      </p>

      <!-- Booking Summary -->
      <section class="summary">
        <h3>Booking Summary</h3>

        <div class="row">
          <span>Service</span>
          <strong>{{ booking.service }}</strong>
        </div>

        <div class="row">
          <span>Provider</span>
          <strong>{{ booking.provider }}</strong>
        </div>

        <div class="row">
          <span>Date</span>
          <strong>{{ booking.date }}</strong>
        </div>

        <div class="row total">
          <span>Total Amount</span>
          <strong>₦{{ booking.amount.toLocaleString() }}</strong>
        </div>
      </section>

     

      

      <button @click="pay" :disabled="loading">
        {{ loading ? 'Processing...' : 'Pay Now' }}
      </button>

      <small class="secure">
        🔒 Your payment is secure and encrypted
      </small>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { onMounted } from "vue"

const router = useRouter()
const route = useRoute()
const auth = getAuth()
const loading = ref(false)
const error = ref('')
const paymentMethod = ref('card')
const bookingId = route.query.bookingId

// ✅ ADD THIS LINE
const API = import.meta.env.VITE_API_BASE_URL

const booking = ref({
  service: "",
  provider: "Not matched",
  date: "",
  amount: 0
})

onMounted(async () => {
  if (!bookingId) {
    error.value = "Invalid booking reference"
    return
  }

  try {
    const bookingRef = doc(db, "bookings", bookingId)
    const bookingSnap = await getDoc(bookingRef)

    if (!bookingSnap.exists()) {
      throw new Error("Booking not found")
    }

    const data = bookingSnap.data()

    booking.value = {
      service: data.serviceType,
      provider: "Not matched",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      amount: data.price
    }

  } catch (e) {
    error.value = e.message
  }
})

async function pay() {
  loading.value = true
  error.value = ''

  try {
    const user = auth.currentUser
    if (!user) throw new Error("Not authenticated")

    const token = await user.getIdToken()

    // ✅ CHANGE ONLY THIS LINE
    const res = await fetch(`${API}/api/payment/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        bookingId,
        amount: booking.value.amount,
        email: user.email
      })
    })

    const data = await res.json()
    if (!res.ok) throw new Error("Payment init failed")

    window.location.href = data.paymentLink

  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.payment-card {
  background: white;
  width: 100%;
  max-width: 420px;
  padding: 30px;
  border-radius: 12px;
}

h1 {
  text-align: center;
  margin-bottom: 6px;
  color: #14532d;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 25px;
}

section {
  margin-bottom: 20px;
}

.summary {
  background: #f9fafb;
  padding: 15px;
  border-radius: 8px;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.total {
  border-top: 1px solid #e5e7eb;
  padding-top: 10px;
}

.radio {
  display: block;
  margin-top: 10px;
}

.card-form input,
.transfer {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
}

.two {
  display: flex;
  gap: 10px;
}

button {
  width: 100%;
  padding: 14px;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
}

.error {
  color: red;
  margin-bottom: 10px;
  text-align: center;
}

.secure {
  display: block;
  margin-top: 15px;
  text-align: center;
  color: #6b7280;
}
</style>
