<template>
  <div class="provider-dashboard">
    <div class="container">

      <!-- ===== Greeting / Profile ===== -->
      <section class="profile-section">
        <img :src="provider.photo" alt="Provider Photo" class="profile-photo" />
        <div class="profile-info">
          <h1>Hello, {{ provider.name }} 👋</h1>
          <p>Rating: {{ averageRating.toFixed(1) }} ⭐ ({{ totalReviews }} reviews)</p>
         <div class="availability">
  <span>Status: </span>
  <span class="provider-status">
    {{ provider.status || "Not set" }}
  </span>
</div>

        </div>
      </section>

      <section class="appointments-section">
  <h2>Appointment</h2>

  <div v-if="!activeAppointment" class="empty">
    No active appointment
  </div>

  <div v-else class="appointments-row">
    <div class="card">
      <h3>{{ activeAppointment.patientName }}</h3>

      <p><strong>Service:</strong> {{ activeAppointment.serviceType }}</p>
      <p><strong>Time:</strong> {{ activeAppointment.time }}</p>
      <p><strong>Address:</strong> {{ activeAppointment.address }}</p>
      <p>
        <strong>Status:</strong>
        <span :class="statusClass(activeAppointment.matchingStatus)">
          {{ activeAppointment.matchingStatus }}
        </span>
      </p>

      <div class="card-actions">
        <a
          class="small-btn"
          :href="`tel:${activeAppointment.clientPhone}`"
        >
          Call Client
        </a>
        <button class="small-btn navigate-btn" @click="navigateToClient">
  Navigate
</button>


        
      </div>
    </div>
  </div>
</section>


      <!-- ===== Booking Request ===== -->
<section class="requests-section">
  <h2>Booking Request</h2>

  <div v-if="!matchedBooking" class="empty">
    No booking requests
  </div>

  <div v-else class="horizontal-card">
    <!-- LEFT -->
    <div class="left">
      <h3
        class="clickable-name"
        @click="showDetails = !showDetails"
      >
        {{ matchedBooking.patientName }}
      </h3>
      <span class="service">
        {{ matchedBooking.serviceType }}
      </span>
    </div>

    <!-- RIGHT -->
    <div class="right">
      <button class="small-btn primary" @click="acceptBooking">
        Accept
      </button>
      <button class="small-btn danger" @click="rejectBooking">
        Reject
      </button>
    </div>
  </div>

  <!-- DROPDOWN DETAILS -->
  <div v-if="showDetails && matchedBooking" class="dropdown">
    <p><strong>Gender:</strong> {{ matchedBooking.patientGender }}</p>
    <p><strong>Age:</strong> {{ matchedBooking.patientAge }}</p>
    <p><strong>Health Concern:</strong> {{ matchedBooking.healthConcern }}</p>
    <p><strong>Description:</strong> {{ matchedBooking.careDescription }}</p>
    <p><strong>Date:</strong> {{ matchedBooking.date }}</p>
    <p><strong>Time:</strong> {{ matchedBooking.time }}</p>
    <p><strong>Duration:</strong> {{ matchedBooking.duration }}</p>
    <p><strong>Urgent:</strong> {{ matchedBooking.urgent ? "Yes" : "No" }}</p>
    <p><strong>Distance:</strong> {{ matchedBooking.distanceKm }} km</p>
    <p><strong>Price:</strong> ₦{{ matchedBooking.price }}</p>
    <p><strong>Address:</strong> {{ matchedBooking.address }}</p>
    <p><strong>Client Phone:</strong> {{ matchedBooking.clientPhone }}</p>

    <p v-if="matchedBooking.doctorInstructions">
      <strong>Doctor Instructions:</strong>
      {{ matchedBooking.doctorInstructions }}
    </p>
  </div>
</section>


      <section class="history-section">
  <h2>Past Services</h2>

  <div v-if="pastServices.length === 0" class="empty">
    No past services
  </div>

  <ul class="past-list">
    <li     
  v-for="service in paginatedPastServices"

      :key="service.id"
      class="past-item"
      @click="togglePast(service.id)"
    >
      <!-- MAIN ROW -->
      <div class="past-main">
        <span class="name">{{ service.patientName }}</span>
        <span class="service">{{ service.serviceType }}</span>
      </div>

      <!-- DROPDOWN -->
      <div
        v-if="openPastId === service.id"
        class="past-dropdown"
      >
        <p><strong>Date:</strong> {{ service.date }}</p>
        <p><strong>Time:</strong> {{ service.time }}</p>
        <p><strong>Patient Name:</strong> {{ service.patientName }}</p>
        <p><strong>Gender:</strong> {{ service.patientGender }}</p>
        <p><strong>Service:</strong> {{ service.serviceType }}</p>
        <p><strong>Address:</strong> {{ service.address }}</p>
      </div>
    </li>
  </ul>
  <div class="pagination">
  <button
    class="small-btn"
    :disabled="!hasPrevPast"
    @click="prevPastPage"
  >
    Previous
  </button>

  <button
    class="small-btn"
    :disabled="!hasNextPast"
    @click="nextPastPage"
  >
    Next
  </button>
</div>

</section>


      

      <!-- ===== Settings ===== -->
      <section class="settings-section">
        <h2>Settings</h2>
        <div class="settings-row">
         <router-link to="/editprovider" class="small-btn">
  Edit Profile
</router-link>
<router-link to="/manage" class="small-btn">
  Manage Service
</router-link>
          
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue"
import { useRouter } from "vue-router"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc
} from "firebase/firestore"
import { db } from "@/firebase"

const router = useRouter()
const auth = getAuth()

const pastServices = ref([])
const ratedBookings = computed(() => {
  return pastServices.value.filter(
    b => typeof b.rating === "number"
  )
})

const openPastId = ref(null)

/* pagination */
const pastPage = ref(0)
const pastPageSize = 3

function togglePast(id) {
  openPastId.value = openPastId.value === id ? null : id
}


/* ===== PROVIDER ===== */
const provider = reactive({
  name: "",
  photo: null,
  status: ""   // 🔑 comes from providers.status
})



function toggleAvailability() {
  provider.isOnline = !provider.isOnline
}

/* ===== MATCHED BOOKING (REAL-TIME) ===== */
const matchedBooking = ref(null)
const showDetails = ref(false)

onAuthStateChanged(auth, async (user) => {
  if (!user) return

  /* ===== FETCH LOGGED-IN PROVIDER PROFILE ===== */
  const providerSnap = await getDoc(doc(db, "providers", user.uid))

if (providerSnap.exists()) {
  const data = providerSnap.data()

  provider.name = data.name || "Provider"
  provider.photo = data.passportUrl || provider.photo
  provider.status = data.status || ""
}


  /* ===== EXISTING MATCHED BOOKING LISTENER ===== */
  const q = query(
    collection(db, "bookings"),
    where("providerId", "==", user.uid),
    where("matchingStatus", "==", "matched")
  )

  onSnapshot(q, (snap) => {
    if (snap.empty) {
      matchedBooking.value = null
      return
    }

    matchedBooking.value = {
      id: snap.docs[0].id,
      ...snap.docs[0].data()
    }
  })
  /* ===== ACTIVE APPOINTMENT (LATEST ACCEPTED) ===== */
const activeQuery = query(
  collection(db, "bookings"),
  where("providerId", "==", user.uid),
  where("matchingStatus", "in", ["accepted", "completed"])

)

/* ===== PAST SERVICES (COMPLETED + SORTED) ===== */
const pastQuery = query(
  collection(db, "bookings"),
  where("providerId", "==", user.uid),
  where("matchingStatus", "==", "completed")
)

onSnapshot(pastQuery, (snap) => {
  const sorted = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      if (!a.completedAt || !b.completedAt) return 0
      return b.completedAt.seconds - a.completedAt.seconds
    })

  pastServices.value = sorted
  pastPage.value = 0 // reset page on update
})


onSnapshot(activeQuery, (snap) => {
  if (snap.empty) {
    activeAppointment.value = null
    return
  }

  // sort manually by acceptedAt (latest first)
  const sorted = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      if (!a.acceptedAt || !b.acceptedAt) return 0
      return b.acceptedAt.seconds - a.acceptedAt.seconds
    })

  activeAppointment.value = sorted[0] // 🔑 ONLY ONE
})

})

const activeAppointment = ref(null)


/* ===== ACTIONS ===== */
async function acceptBooking() {
  if (!matchedBooking.value) return

  await updateDoc(
    doc(db, "bookings", matchedBooking.value.id),
    {
      matchingStatus: "accepted",
      acceptedAt: serverTimestamp()
    }
  )
}

async function rejectBooking() {
  if (!matchedBooking.value) return

  await updateDoc(
    doc(db, "bookings", matchedBooking.value.id),
    {
      matchingStatus: "rejected",
      providerId: null
    }
  )

  await updateDoc(
    doc(db, "providers", matchedBooking.value.providerId),
    { activeBooking: false }
  )
}


const notifications = reactive([
  "New booking request received",
  "Appointment reminder",
  "Message from client"
])

const totalReviews = computed(() => ratedBookings.value.length)


const averageRating = computed(() => {
  if (!ratedBookings.value.length) return 0

  const total = ratedBookings.value.reduce(
    (sum, b) => sum + b.rating,
    0
  )

  return total / ratedBookings.value.length
})


function statusClass(status) {
  if (status === "Pending") return "pending"
  if (status === "Confirmed") return "confirmed"
  if (status === "Completed") return "completed"
  return ""
}
function navigateToClient() {
  if (!activeAppointment.value) return

  const destination = encodeURIComponent(activeAppointment.value.address)

  if (!navigator.geolocation) {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
      "_blank"
    )
    return
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const origin = `${pos.coords.latitude},${pos.coords.longitude}`

      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`,
        "_blank"
      )
    },
    () => {
      // fallback if permission denied
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
        "_blank"
      )
    }
  )
}

const paginatedPastServices = computed(() => {
  const start = pastPage.value * pastPageSize
  return pastServices.value.slice(start, start + pastPageSize)
})

const hasNextPast = computed(() => {
  return (pastPage.value + 1) * pastPageSize < pastServices.value.length
})

const hasPrevPast = computed(() => {
  return pastPage.value > 0
})

function nextPastPage() {
  if (hasNextPast.value) pastPage.value++
}

function prevPastPage() {
  if (hasPrevPast.value) pastPage.value--
}


</script>


<style scoped>
/* ===== GENERAL ===== */
.provider-dashboard {
  background: #f9fafb;
  min-height: 100vh;
  padding: 30px 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 20px;
}

h2 {
  color: #166534;
  margin-bottom: 16px;
}

/* ===== PROFILE SECTION ===== */
.profile-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.profile-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #166534;
}

.profile-info h1 {
  margin: 0;
  font-size: 1.5rem;
}

.availability {
  margin-top: 8px;
}

.toggle-btn {
  border: none;
  border-radius: 20px;
  padding: 6px 14px;
  font-weight: 600;
  cursor: pointer;
}

.toggle-btn.online {
  background: #16a34a;
  color: white;
}

.toggle-btn.offline {
  background: #facc15;
  color: black;
}

/* ===== APPOINTMENTS ROW ===== */
.appointments-row {
  display: flex;
  justify-content: center;   /* center the card */
  margin-bottom: 20px;
}

/* ===== APPOINTMENT CARD ===== */
.card {
  width: 100%;
  max-width: 420px;          /* 🔑 CONTROL CARD WIDTH */
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
@media (max-width: 768px) {
  .card {
    max-width: 100%;
  }
}


.card h3 {
  margin: 0 0 8px 0;
}

.card-actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
}

.small-btn {
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  background: #16a34a;
  color: white;
  transition: 0.2s;
}

.small-btn.danger {
  background: #dc2626;
}

.small-btn.primary {
  background: #16a34a;
}

.small-btn:hover {
  transform: translateY(-1px);
}

/* Status classes */
.pending {
  color: #fbbf24;
  font-weight: 600;
}
.confirmed {
  color: #16a34a;
  font-weight: 600;
}
.completed {
  color: #6b7280;
  font-weight: 600;
}

/* ===== BOOKING REQUEST PROGRESS BAR ===== */
.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  margin: 12px 0;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #fbbf24;
  transition: width 0.5s ease;
}

.matched {
  color: #16a34a;
  font-weight: 700;
}

/* ===== NOTIFICATIONS ===== */
.notifications-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notifications-list li {
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
}

/* ===== SETTINGS ===== */
.settings-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

/* ===== EMPTY STATES ===== */
.empty {
  color: #6b7280;
  font-style: italic;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .appointments-row {
    flex-direction: column;
    align-items: center; /* ✅ CENTER cards */
  }

  .card {
    width: 100%;          /* ✅ full width */
    max-width: 360px;     /* ✅ consistent centered size */
  }

  .profile-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
/* ===== HORIZONTAL BOOKING CARD ===== */
.horizontal-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  margin-bottom: 10px;
}

.horizontal-card .left h3 {
  margin: 0;
}

.service {
  font-size: 0.85rem;
  color: #6b7280;
}

.horizontal-card .right {
  display: flex;
  gap: 10px;
}

/* CLICKABLE NAME */
.clickable-name {
  cursor: pointer;
  color: #166534;
  text-decoration: underline;
}

.clickable-name:hover {
  color: #15803d;
}

/* DROPDOWN */
.dropdown {
  background: #f0fdf4;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: inset 0 0 0 1px #bbf7d0;
}
/* ===== NAVIGATE BUTTON (GREY) ===== */
.navigate-btn {
  background: #e5e7eb;      /* light grey */
  color: #374151;           /* dark grey text */
}

.navigate-btn:hover {
  background: #d1d5db;      /* slightly darker on hover */
}

/* ===== PAST SERVICES LIST ===== */
.past-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.past-item {
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 0;
  cursor: pointer;
}

.past-main {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
}

.past-main .service {
  color: #6b7280;
}

.past-dropdown {
  margin-top: 10px;
  padding: 10px;
  background: #f9fafb;
  border-radius: 6px;
  font-size: 14px;
}
.pagination {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.provider-status {
  font-weight: 600;
  color: #166534;
  background: #dcfce7;
  padding: 4px 10px;
  border-radius: 12px;
  margin-left: 6px;
  font-size: 0.85rem;
}


</style>
