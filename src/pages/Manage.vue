<template>
  <div class="manage-services">
    <div class="container">
      <h1>Manage Your Services & Availability</h1>
      <p>Adjust the services you provide, working hours, and emergency availability</p>

      <form @submit.prevent="updateServices">
        <!-- Services -->
        <section>
          <h2>Services You Provide</h2>
          <div class="checkbox-group">
            <label v-for="service in availableServices" :key="service">
              <input type="checkbox" :value="service" v-model="form.services" />
              {{ service }}
            </label>
          </div>
        </section>

        <!-- Working Days -->
        <section>
          <h2>Working Days</h2>
          <div class="checkbox-group">
            <label v-for="day in days" :key="day">
              <input type="checkbox" :value="day" v-model="form.days" />
              {{ day }}
            </label>
          </div>
        </section>

        <!-- Working Hours -->
        <section>
          <h2>Available Time Slots</h2>
          <div class="checkbox-group">
            <label v-for="slot in timeSlots" :key="slot">
              <input type="checkbox" :value="slot" v-model="form.timeSlots" />
              {{ slot }}
            </label>
          </div>
        </section>

        <!-- Emergency Availability -->
        <section>
          <h2>Emergency Availability</h2>
          <label class="radio">
            <input type="checkbox" v-model="form.emergency" />
            Available for Emergency Calls
          </label>
        </section>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Updating...' : 'Save Changes' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase'

const loading = ref(false)
const error = ref('')

const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const timeSlots = ['Morning','Afternoon','Evening']
const nurseServices = [
  'Wound Care','Injections & Drips','Elderly Care','Postnatal Care','Home Monitoring'
]

// Form state
const form = reactive({
  services: [],
  days: [],
  timeSlots: [],
  emergency: false,
  role: 'Nurse' // assuming this is for nurses
})

// Compute available services based on role
const availableServices = computed(() => {
  return form.role === 'Nurse' ? nurseServices : []
})

// Load existing data from Firestore
onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, async (user) => {
    if (!user) return
    try {
      const docRef = doc(db, 'providers', user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        form.services = data.services || []
        form.days = data.days || []
        form.timeSlots = data.timeSlots || []
        form.emergency = data.emergency || false
      }
    } catch (err) {
      console.error("Error fetching provider data:", err)
      error.value = "Failed to load your data."
    }
  })
})

// Save updates to Firestore
async function updateServices() {
  loading.value = true
  try {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) throw new Error("User not logged in")

    await setDoc(doc(db, 'providers', user.uid), {
      services: form.services,
      days: form.days,
      timeSlots: form.timeSlots,
      emergency: form.emergency,
      updatedAt: serverTimestamp()
    }, { merge: true })

    alert('Services updated successfully ✔️')
  } catch (err) {
    console.error(err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.manage-services {
  background: #f9fafb;
  min-height: 100vh;
  padding: 40px 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.container {
  max-width: 720px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
}

h1 {
  text-align: center;
  color: #166534;
}

section {
  margin-bottom: 25px;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 10px;
}

button {
  width: 100%;
  padding: 14px;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-bottom: 12px;
}
</style>
