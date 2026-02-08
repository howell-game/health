<template>
  <div class="success-wrapper">
    <div class="card">
      <div class="icon">
        ✓
      </div>

      <h1>Payment Successful</h1>
      <p class="subtitle">
        Thank you for your payment. Your booking has been confirmed.
      </p>

      <div class="details">
        <div class="row">
          <span>Booking ID</span>
          <strong>{{ bookingId }}</strong>
        </div>
        <div class="row">
          <span>Amount Paid</span>
          <strong>₦{{ amount }}</strong>
        </div>
        <div class="row">
          <span>Status</span>
          <strong class="status">Confirmed</strong>
        </div>
      </div>

      <div class="info-box">
        <h3>What happens next?</h3>
        <ul>
          <li>✔ We are matching you with a qualified provider</li>
          <li>✔ You will be notified once a provider accepts</li>
          <li>✔ You can track this booking from your dashboard</li>
        </ul>
      </div>

      <div class="actions">
        <button class="primary" @click="goToBookings">
          View My Bookings
        </button>
        <button class="secondary" @click="goHome">
          Go Home
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

// These can come from query params or store
const bookingId = route.query.bookingId || "—"
const amount = route.query.amount || "0.00"

function goToBookings() {
  router.push("/bookings")
}

function goHome() {
  router.push("/")
}
</script>

<style scoped>
.success-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0fdf4;
  padding: 20px;
  font-family: system-ui, sans-serif;
}

.card {
  background: white;
  max-width: 460px;
  width: 100%;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  text-align: center;
}

.icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: #22c55e;
  color: white;
  font-size: 32px;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

h1 {
  color: #166534;
  margin-bottom: 6px;
}

.subtitle {
  color: #4b5563;
  font-size: 0.95rem;
  margin-bottom: 20px;
}

.details {
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  margin: 20px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 0.9rem;
}

.status {
  color: #16a34a;
}

.info-box {
  background: #f0fdf4;
  border-radius: 12px;
  padding: 16px;
  text-align: left;
  margin-bottom: 22px;
}

.info-box h3 {
  font-size: 0.95rem;
  margin-bottom: 8px;
  color: #166534;
}

.info-box ul {
  padding-left: 16px;
  font-size: 0.85rem;
  color: #374151;
}

.actions {
  display: flex;
  gap: 12px;
}

button {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.primary {
  background: #166534;
  color: white;
}

.secondary {
  background: #e5e7eb;
  color: #374151;
}

/* Mobile */
@media (max-width: 420px) {
  .actions {
    flex-direction: column;
  }
}
</style>
