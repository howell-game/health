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
            <button
              :class="['toggle-btn', provider.isOnline ? 'online' : 'offline']"
              @click="toggleAvailability"
            >
              {{ provider.isOnline ? 'Online' : 'Offline' }}
            </button>
          </div>
        </div>
      </section>

      <!-- ===== Active / Upcoming Appointments ===== -->
      <section class="appointments-section">
        <h2>Today's Appointments</h2>
        <div v-if="upcomingAppointments.length === 0" class="empty">
          No appointments for today
        </div>
        <div class="appointments-row">
          <div class="card" v-for="(appt, idx) in upcomingAppointments" :key="idx">
            <h3>{{ appt.clientName }}</h3>
            <p><strong>Service:</strong> {{ appt.service }}</p>
            <p><strong>Time:</strong> {{ appt.time }}</p>
            <p><strong>Address:</strong> {{ appt.address }}</p>
            <p><strong>Status:</strong> <span :class="statusClass(appt.status)">{{ appt.status }}</span></p>
            <div class="card-actions">
              <button class="small-btn">Start Visit</button>
              <button class="small-btn">Navigate</button>
              <button class="small-btn">Message Client</button>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== Booking Requests / New Clients ===== -->
      <section class="requests-section">
        <h2>New Booking Requests</h2>
        <div v-if="newRequests.length === 0" class="empty">No new requests</div>
        <div class="appointments-row">
          <div class="card request-card" v-for="(req, idx) in newRequests" :key="idx">
            <h3>{{ req.clientName }}</h3>
            <p><strong>Service:</strong> {{ req.service }}</p>
            <p><strong>Distance:</strong> {{ req.distance }} km</p>
            <p><strong>ETA:</strong> {{ req.eta }} mins</p>

            <!-- Animated searching bar -->
            <div class="progress-bar">
              <div class="progress" :style="{ width: req.matched ? '100%' : progressWidth(req) }"></div>
            </div>
            <div class="request-actions" v-if="!req.matched">
              <button class="small-btn primary" @click="acceptRequest(idx)">Accept</button>
              <button class="small-btn danger" @click="declineRequest(idx)">Decline</button>
            </div>
            <div v-else class="matched">Provider Matched ✅</div>
          </div>
        </div>
      </section>

      <!-- ===== Past Services / History ===== -->
      <section class="history-section">
        <h2>Past Services</h2>
        <div v-if="pastServices.length === 0" class="empty">No past services</div>
        <div class="appointments-row">
          <div class="card" v-for="(service, idx) in pastServices" :key="idx">
            <h3>{{ service.clientName }}</h3>
            <p><strong>Service:</strong> {{ service.service }}</p>
            <p><strong>Date:</strong> {{ service.date }}</p>
            <p><strong>Feedback:</strong> {{ service.review || 'No review yet' }}</p>
            <p><strong>Rating:</strong> {{ service.rating || 0 }} ⭐</p>
          </div>
        </div>
      </section>

      <!-- ===== Notifications ===== -->
      <section class="notifications-section">
        <h2>Notifications</h2>
        <ul class="notifications-list">
          <li v-for="(note, idx) in notifications" :key="idx">{{ note }}</li>
        </ul>
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
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";

const provider = reactive({
  name: "Nurse Amina",
  photo: "https://i.pravatar.cc/100",
  isOnline: true,
});

// Dummy data
const upcomingAppointments = reactive([
  {
    clientName: "John Doe",
    service: "Wound Care",
    time: "10:00 AM",
    address: "123 Main Street",
    status: "Pending",
  },
  {
    clientName: "Jane Smith",
    service: "Physiotherapy",
    time: "2:00 PM",
    address: "456 Elm Street",
    status: "Confirmed",
  },
]);

const newRequests = reactive([
  {
    clientName: "Alice Green",
    service: "Injection",
    distance: 5,
    eta: 15,
    matched: false,
    progress: 0,
  },
  {
    clientName: "Bob White",
    service: "Massage",
    distance: 2,
    eta: 10,
    matched: false,
    progress: 0,
  },
]);

const pastServices = reactive([
  { clientName: "John Doe", service: "Wound Care", date: "June 10, 2025", rating: 5, review: "Excellent service!" },
  { clientName: "Jane Smith", service: "Physiotherapy", date: "June 12, 2025", rating: 4, review: "Very professional." },
]);

const notifications = reactive([
  "New booking request from Alice Green",
  "Appointment reminder for John Doe at 10:00 AM",
  "Message from Jane Smith",
]);

const totalReviews = computed(() => pastServices.length);
const averageRating = computed(() => {
  if (pastServices.length === 0) return 0;
  return pastServices.reduce((sum, s) => sum + (s.rating || 0), 0) / pastServices.length;
});

// Toggle availability
function toggleAvailability() {
  provider.isOnline = !provider.isOnline;
}

// Accept / decline requests
function acceptRequest(idx) {
  newRequests[idx].matched = true;
  newRequests[idx].progress = 100;
}

function declineRequest(idx) {
  newRequests.splice(idx, 1);
}

// Animate progress for unmatched requests
function progressWidth(req) {
  return req.progress + "%";
}

function statusClass(status) {
  if (status === "Pending") return "pending";
  if (status === "Confirmed") return "confirmed";
  if (status === "Completed") return "completed";
  return "";
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

/* ===== APPOINTMENTS & REQUEST CARDS ===== */
.appointments-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  flex: 1 1 300px;
  width: 80px;
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

</style>
