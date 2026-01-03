<template>
  <div class="dashboard">
    <div class="container">

      <!-- Greeting -->
      <section class="greeting">
        <h1>Hello, {{ user.name }} 👋</h1>
        <p>Welcome back to your home healthcare dashboard</p>
      </section>

      <!-- Quick Actions -->
      <section class="quick-actions">
        <button class="action-btn primary" @click="goToBooking">
          ➕ Book New Service
        </button>
        <button class="action-btn primary">
          📅 My Appointments
        </button>
        <button class="action-btn primary">
          💬 Contact Support
        </button>
      </section>

      <!-- Services Row -->
      <section class="services-row">

        <!-- Upcoming Appointment -->
        <div class="card" v-if="upcomingAppointment">
          <h2>Upcoming Visit</h2>

          <div class="appointment">
            <p><strong>Service:</strong> {{ upcomingAppointment.service }}</p>
            <p><strong>Provider:</strong> {{ upcomingAppointment.provider }}</p>
            <p><strong>Date:</strong> {{ upcomingAppointment.date }}</p>
            <p><strong>Time:</strong> {{ upcomingAppointment.time }}</p>
            <p>
              <strong>Status:</strong>
              <span class="status confirmed">{{ upcomingAppointment.status }}</span>
            </p>
            <div class="appointment-actions">
              <button class="small-btn">Message Provider</button>
              <button class="small-btn danger">Cancel</button>
            </div>
          </div>
        </div>

        <!-- Past Services -->
        <div class="card">
          <h2>Past Services</h2>
          <ul class="history">
            <li v-for="(item, index) in pastServices" :key="index">
              <span>{{ item.service }}</span>
              <span class="completed">{{ item.completed ? 'Completed' : 'Pending' }}</span>
              <button v-if="!item.completed" class="small-btn" @click="markComplete(index)">
                Complete & Rate
              </button>
            </li>
          </ul>
        </div>

      </section>

      <!-- Rating Modal -->
      <div v-if="showRating" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <h3>Rate {{ ratingProvider }}</h3>
          <div class="stars">
            <span v-for="star in 5" :key="star" class="star" 
                  :class="{ selected: star <= rating }" 
                  @click="rating = star">★</span>
          </div>
          <textarea v-model="reviewText" placeholder="Leave a comment..." rows="3"></textarea>
          <button class="action-btn primary" @click="submitReview">Submit</button>
        </div>
      </div>

    </div>
  </div>
</template>


<script setup>
import { reactive, ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase"

const router = useRouter()

const user = reactive({
  name: "",
  email: "",
  phone: ""
})

onMounted(() => {
  const auth = getAuth()

  // Listen for auth state
  onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) {
      console.log("User not logged in")
      return
    }

    try {
      const docRef = doc(db, "users", currentUser.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        user.name = data.name || ""
        user.email = data.email || ""
        user.phone = data.phone || ""
      } else {
        console.log("No such user document!")
      }
    } catch (err) {
      console.error("Error fetching user:", err)
    }
  })
})



const upcomingAppointment = reactive({
  service: "Wound Care",
  provider: "Nurse Amina",
  date: "June 20, 2025",
  time: "10:00 AM",
  status: "Confirmed"
})

// Rating modal state
const showRating = ref(false)
const rating = ref(0)
const reviewText = ref("")
const ratingProvider = ref("")
let currentIndex = null

function goToBooking() {
  router.push("/book")
}

function markComplete(index) {
  currentIndex = index
  ratingProvider.value = pastServices[index].provider
  showRating.value = true
}

function closeModal() {
  showRating.value = false
  rating.value = 0
  reviewText.value = ""
}

function submitReview() {
  if (currentIndex !== null) {
    pastServices[currentIndex].completed = true
    pastServices[currentIndex].rating = rating.value
    pastServices[currentIndex].review = reviewText.value
  }
  closeModal()
}

const pastServices = reactive([
  { service: "Injection & Drip" },
  { service: "Elderly Care" }
])

</script>

<style scoped>
/* ===== PAGE ===== */
.dashboard {
  background: #f9fafb;
  min-height: 100vh;
  padding: 40px 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.container {
  max-width: 920px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ===== GREETING ===== */
.greeting h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #166534;
}

.greeting p {
  margin-top: 6px;
  color: #6b7280;
  font-size: 0.95rem;
}

/* ===== QUICK ACTIONS ===== */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin: 32px 0;
}

.action-btn {
  padding: 16px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: #166534;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
}

.action-btn.primary {
  background: #166534;
  color: white;
}

/* ===== SERVICES ROW (CENTERED BLOCK) ===== */
/* ===== SERVICES ROW (TRULY CENTERED) ===== */
.services-row {
  display: flex;
  justify-content: center;   /* 🔑 TRUE centering */
  gap: 24px;
  margin-bottom: 30px;
}

/* ===== CARD ===== */
.card {
  width: 100%;
  max-width: 360px;          /* 🔑 fixed visual width */
  background: #bfdfcbff;
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);
}


.card h2 {
  margin-bottom: 16px;
  color: #166534;
  font-size: 1.2rem;
}

/* ===== APPOINTMENT ===== */
.appointment {
  background: #f0fdf4;
  border-radius: 10px;
  padding: 16px;
}

.appointment p {
  margin: 6px 0;
  font-size: 0.95rem;
  color: #374151;
}

.status.confirmed {
  color: #166534;
  font-weight: 700;
}

.appointment-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

/* ===== BUTTONS ===== */
.small-btn {
  padding: 9px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #dcfce7;
  color: #166534;
  font-weight: 600;
  font-size: 0.85rem;
}

.small-btn:hover {
  background: #bbf7d0;
}

.small-btn.danger {
  background: #fee2e2;
  color: #b91c1c;
}

.small-btn.danger:hover {
  background: #fecaca;
}

/* ===== HISTORY ===== */
.history {
  list-style: none;
  padding: 0;
  margin: 0;
}

.history li {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
}

.history li:last-child {
  border-bottom: none;
}

.completed {
  color: #166534;
  font-weight: 600;
}
@media (max-width: 768px) {
  .services-row {
    flex-direction: column;
    align-items: center;
  }
}

/* ===== MOBILE ===== */
@media (max-width: 768px) {
  .services-row {
    grid-template-columns: 1fr;
    max-width: 100%;
  }

  .greeting h1 {
    font-size: 1.5rem;
  }
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Box */
.modal {
  background: white;
  border-radius: 12px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

/* Stars */
.stars {
  font-size: 1.5rem;
  margin: 12px 0;
}

.star {
  cursor: pointer;
  color: #ccc;
}

.star.selected {
  color: #fbbf24; /* yellow for selected stars */
}

/* Textarea */
.modal textarea {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 12px;
  resize: none;
}

/* Button hover */
.modal button:hover {
  transform: translateY(-2px);
}
</style>
