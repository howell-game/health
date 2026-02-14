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
        <button class="action-btn primary" @click="goToContact">
          💬 Contact Support
        </button>
      </section>
      
     <!-- Matching Status Bar -->
<div class="matching-wrapper" v-if="showMatchingBar">
  <span class="matching-text">{{ matchingText }}</span>
  <div class="matching-line">
    <div class="matching-progress" :class="matchingClass"></div>
  </div>
</div>



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
             <span
  class="status"
  :class="{
    confirmed: upcomingAppointment.matchingStatus === 'accepted',
    completed: upcomingAppointment.matchingStatus === 'completed'
  }"
>
  {{ bookingStatus(upcomingAppointment) }}
</span>

            </p>
            <div class="appointment-actions">
              <a
  v-if="upcomingAppointment?.providerPhone"
  class="small-btn"
  :href="`tel:${upcomingAppointment.providerPhone}`"
>
  📞 Call Provider
</a>

<span
  v-else
  class="small-btn"
  style="opacity: 0.6; pointer-events: none;"
>
  📞 Call Unavailable
</span>

              <button class="small-btn danger">Cancel</button>
            </div>
          </div>
          <div class="appointment-actions">
  <button class="small-btn" @click="prevAppointment" :disabled="!hasPrev">
    ◀ Prev
  </button>

  <button class="small-btn" @click="nextAppointment" :disabled="!hasNext">
    Next ▶
  </button>
</div>

        </div>

       <div class="card">
  <h2>Services</h2>

  <ul class="history">
    <li
      v-for="booking in paginatedServices"
      :key="booking.id"
      class="service-item"
    >
      <div class="service-info">
        <strong>{{ booking.provider }}</strong>
        <small>{{ booking.service }}</small>
      </div>

      <button
  class="small-btn"
  :disabled="booking.matchingStatus === 'completed'"
  @click="openRating(booking)"
>
  {{ booking.matchingStatus === 'completed'
      ? 'Completed'
      : 'Complete & Rate' }}
</button>




      
    </li>
  </ul>

  <div class="appointment-actions">
    <button class="small-btn" @click="prevServicePage" :disabled="!hasPrevService">
      ◀ Prev
    </button>
    <button class="small-btn" @click="nextServicePage" :disabled="!hasNextService">
      Next ▶
    </button>
  </div>
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
import { reactive, ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  limit
} from "firebase/firestore"
import { db } from "@/firebase"

const router = useRouter()
const auth = getAuth()

/* ================= STATE ================= */
const acceptedBookings = ref([])
const currentPage = ref(0)
const matchingStatus = ref(null) // only declare once

const upcomingAppointment = computed(() => {
  return acceptedBookings.value[currentPage.value] || null
})

const hasNext = computed(() => currentPage.value < acceptedBookings.value.length - 1)
const hasPrev = computed(() => currentPage.value > 0)
function nextAppointment() { if (hasNext.value) currentPage.value++ }
function prevAppointment() { if (hasPrev.value) currentPage.value-- }

/* ================= USER PROFILE ================= */
const user = reactive({ name: "", email: "", phone: "" })

/* ================= MATCHING BAR ================= */
const showMatchingBar = computed(() => ["matched", "accepted"].includes(matchingStatus.value))
const matchingText = computed(() => {
  if (matchingStatus.value === "matched") return "Provider matched. Awaiting acceptance…"
  if (matchingStatus.value === "accepted") return "Provider accepted your booking"
  return ""
})
const matchingClass = computed(() => ({
  matched: matchingStatus.value === "matched",
  accepted: matchingStatus.value === "accepted"
}))

/* ================= AUTH + FIRESTORE ================= */
onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) return

    /* ---- Fetch user profile ---- */
    const userSnap = await getDoc(doc(db, "users", currentUser.uid))
    if (userSnap.exists()) Object.assign(user, userSnap.data())

    /* ---- Listen for latest booking for this user (matching bar) ---- */
    const statusQuery = query(
      collection(db, "bookings"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc"),
      limit(1)
    )
    onSnapshot(statusQuery, (snapshot) => {
      if (snapshot.empty) {
        matchingStatus.value = null
        return
      }
      const latestBooking = snapshot.docs[0].data()
      matchingStatus.value = latestBooking.matchingStatus || null
    })

    /* ---- Listen for ACCEPTED bookings (appointments card) ---- */
    const acceptedQuery = query(
      collection(db, "bookings"),
      where("userId", "==", currentUser.uid),
      where("matchingStatus", "in", ["accepted", "completed"]),
      orderBy("acceptedAt", "desc")
    )
    onSnapshot(acceptedQuery, async (snapshot) => {
      const results = []

      for (const docSnap of snapshot.docs) {
        const booking = docSnap.data()

        let providerName = "Provider"
        let providerPhone = null

        if (booking.providerId) {
          const providerSnap = await getDoc(doc(db, "users", booking.providerId))
          if (providerSnap.exists()) {
            providerName = providerSnap.data().name
            providerPhone = providerSnap.data().phone
          }
        }

        results.push({
          id: docSnap.id,
          service: booking.serviceType,
          provider: providerName,
          providerPhone,
          date: booking.date,
          providerId: booking.providerId,
          time: booking.time,
          matchingStatus: booking.matchingStatus
        })
      }

      acceptedBookings.value = results
      currentPage.value = 0
    })
  })
})

/* ================= SERVICE PAGINATION ================= */
const servicePage = ref(0)
const pageSize = 3
const paginatedServices = computed(() => {
  const start = servicePage.value * pageSize
  return acceptedBookings.value.slice(start, start + pageSize)
})
const hasNextService = computed(() => (servicePage.value + 1) * pageSize < acceptedBookings.value.length)
const hasPrevService = computed(() => servicePage.value > 0)
function nextServicePage() { if (hasNextService.value) servicePage.value++ }
function prevServicePage() { if (hasPrevService.value) servicePage.value-- }

/* ================= RATING MODAL ================= */
const showRating = ref(false)
const rating = ref(0)
const reviewText = ref("")
const selectedBooking = ref(null)
function openRating(booking) {
  selectedBooking.value = booking
  rating.value = 0
  reviewText.value = ""
  showRating.value = true
}
function closeModal() { showRating.value = false }

async function submitReview() {
  if (!selectedBooking.value) return
  if (rating.value < 1 || rating.value > 5) return
  try {
    const bookingId = selectedBooking.value.id
    const providerId = selectedBooking.value.providerId

    await updateDoc(doc(db, "bookings", bookingId), {
      rating: rating.value,
      review: reviewText.value.trim(),
      matchingStatus: "completed",
      completedAt: serverTimestamp()
    })
    await updateDoc(doc(db, "providers", providerId), { activeBooking: false })

    selectedBooking.value.status = "Completed"
    selectedBooking.value.completed = true

    showRating.value = false
    rating.value = 0
    reviewText.value = ""
    selectedBooking.value = null
  } catch (error) {
    console.error("Submit review failed:", error)
  }
}

/* ================= OTHER UTILS ================= */
function bookingStatus(booking) {
  if (booking.matchingStatus === "accepted") return "In Progress"
  if (booking.matchingStatus === "completed") return "Completed"
  return "Pending"
}
function goToBooking() { router.push("/book") }
function goToContact() { router.push("/contact") }

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

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.service-info {
  display: flex;
  flex-direction: column;
}

.service-info small {
  font-size: 0.8rem;
  color: #6b7280;
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
/* ===== MATCHING STATUS ===== */
.matching-wrapper {
  margin-bottom: 14px;
}

.matching-text {
  font-size: 0.85rem;
  color: #6b7280;
  display: block;
  margin-bottom: 6px;
}

/* Base line */
.matching-line {
  width: 100%;
  height: 4px;
  background: #fef3c7;
  border-radius: 10px;
  overflow: hidden;
}

/* Base progress */
.matching-progress {
  height: 100%;
  border-radius: 10px;
}

/* 🟡 MATCHED (animated shimmer) */
.matching-progress.matched {
  width: 100%;
  background: linear-gradient(
    90deg,
    #fbbf24 25%,
    #fde68a 50%,
    #fbbf24 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s linear infinite;
}

/* 🟢 ACCEPTED (solid green) */
.matching-progress.accepted {
  width: 100%;
  background: #22c55e;
  animation: none;
}

/* Animation keyframes */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
