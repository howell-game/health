<template>
  <div class="support-page">
    <div class="support-card">
      <h1>Contact Support</h1>
      <p class="subtitle">
        Need help? Our support team is here for you. Fill the form below and we’ll get back to you as soon as possible.
      </p>

      <form @submit.prevent="submitSupport">
        <div class="form-group">
          <label>Full Name</label>
          <input v-model="form.name" type="text" placeholder="Enter your full name" required />
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input v-model="form.email" type="email" placeholder="Enter your email" required />
        </div>

        <div class="form-group">
          <label>Phone Number</label>
          <input v-model="form.phone" type="tel" placeholder="Optional" />
        </div>

        <div class="form-group">
          <label>Issue Category</label>
          <select v-model="form.category" required>
            <option value="">Select an option</option>
            <option value="booking">Booking Issue</option>
            <option value="payment">Payment Issue</option>
            <option value="provider">Provider Issue</option>
            <option value="account">Account Problem</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label>Message</label>
          <textarea v-model="form.message" rows="5" placeholder="Describe your issue clearly" required></textarea>
        </div>

        <button class="submit-btn" :disabled="loading">
          {{ loading ? 'Sending…' : 'Submit Request' }}
        </button>
      </form>

      <div v-if="success" class="success-msg">
        ✅ Your message has been sent. Support will contact you shortly.
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const loading = ref(false)
const success = ref(false)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  category: '',
  message: ''
})

async function submitSupport() {
  loading.value = true
  success.value = false

  try {
    // Later you can send this to Firestore / API
    console.log('Support request:', { ...form })

    success.value = true
    Object.assign(form, {
      name: '',
      email: '',
      phone: '',
      category: '',
      message: ''
    })
  } catch (err) {
    console.error('Support request failed', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.support-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f7fb;
  padding: 20px;
}

.support-card {
  background: #fff;
  width: 100%;
  max-width: 520px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

h1 {
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  font-size: 13px;
  margin-bottom: 5px;
  font-weight: 600;
}

input,
select,
textarea {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #4f46e5;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  border: none;
  background: #4f46e5;
  color: #fff;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-msg {
  margin-top: 15px;
  color: #0f766e;
  font-size: 14px;
  text-align: center;
}
</style>
