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

      <!-- Payment Method -->
      <section>
        <h3>Payment Method</h3>

        <label class="radio">
          <input type="radio" value="card" v-model="paymentMethod" />
          Debit / Credit Card
        </label>

        <label class="radio">
          <input type="radio" value="transfer" v-model="paymentMethod" />
          Bank Transfer
        </label>
      </section>

      <!-- Card Fields -->
      <section v-if="paymentMethod === 'card'" class="card-form">
        <input placeholder="Card Number" />
        <div class="two">
          <input placeholder="MM / YY" />
          <input placeholder="CVV" />
        </div>
        <input placeholder="Card Holder Name" />
      </section>

      <!-- Transfer Info -->
      <section v-if="paymentMethod === 'transfer'" class="transfer">
        <p>
          Transfer the exact amount to:
        </p>
        <ul>
          <li><strong>Bank:</strong> Zenith Bank</li>
          <li><strong>Account Name:</strong> HomeCare Ltd</li>
          <li><strong>Account Number:</strong> 1234567890</li>
        </ul>
        <small>Payment will be verified automatically.</small>
      </section>

      <p v-if="error" class="error">{{ error }}</p>

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
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const paymentMethod = ref('card')

// Example booking data (replace with props / route params later)
const booking = ref({
  service: 'Home Nursing Care',
  provider: 'Nurse Grace',
  date: '12 Aug 2026',
  amount: 25000
})

async function pay() {
  loading.value = true
  error.value = ''

  try {
    // 🔜 Later:
    // - Call Paystack / Flutterwave / Stripe here
    // - Save payment record to Firestore

    await new Promise(r => setTimeout(r, 1500))

    router.push('/payment-success')
  } catch (e) {
    error.value = 'Payment failed. Please try again.'
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
