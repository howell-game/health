<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2 class="logo">Admin Panel</h2>
      <nav>
        <a class="active">Dashboard</a>
        <a>Users</a>
        <a>Providers</a>
        <a>Bookings</a>
        <a>Payments</a>
        <a>Reviews</a>
        <a>Disputes</a>
        <a>Settings</a>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main">
      <!-- Header -->
      <header class="header">
        <h1>Dashboard Overview</h1>
        <div class="admin-info">
          <span>Admin</span>
          <img src="https://via.placeholder.com/40" />
        </div>
      </header>

      <!-- Stats -->
      <section class="stats">
        <div class="stat-card">
          <h3>Total Users</h3>
          <p>1,248</p>
        </div>
        <div class="stat-card">
          <h3>Active Providers</h3>
          <p>342</p>
        </div>
        <div class="stat-card">
          <h3>Bookings Today</h3>
          <p>87</p>
        </div>
        <div class="stat-card">
          <h3>Revenue</h3>
          <p>₦1,230,000</p>
        </div>
      </section>

      <!-- Content Grid -->
      <section class="grid">
        <!-- Pending Provider Approvals -->
        <div class="card">
          <h2>Pending Provider Approvals</h2>

          <ul>
            <li v-for="p in pendingProviders" :key="p.uid">
              <span
                class="provider-name"
                @click="viewProvider(p)"
              >
                {{ p.name }}
              </span>

              <div class="actions">
                <button
                  class="approve"
                  @click="approveProvider(p.uid)"
                >
                  Approve
                </button>
                <button
                 class="reject"
                 @click="openRejectModal(p)">
                  Reject
                </button>

              </div>
            </li>
          </ul>
        </div>

        <!-- Provider Details -->
        <div v-if="selectedProvider" class="card">
          <h2>Provider Details</h2>

          <p><strong>Name:</strong> {{ selectedProvider.name }}</p>
          <p><strong>Address:</strong> {{ selectedProvider.address }}</p>
          <p><strong>City:</strong> {{ selectedProvider.city }}</p>
          <p><strong>Coverage Area:</strong> {{ selectedProvider.coverageArea }}</p>

          <div class="docs">
            <div>
              <h4>Photo</h4>
              <img :src="selectedProvider.passportUrl" />
            </div>
            <div>
              <h4>License</h4>
              <img :src="selectedProvider.licenseUrl" />
            </div>

            <div v-if="selectedProvider.idUrl">
              <h4>ID Document</h4>
              <img :src="selectedProvider.idUrl" />
            </div>
          </div>
        </div>

        <!-- Recent Bookings -->
        <div class="card">
          <h2>Recent Bookings</h2>
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John</td>
                <td>Wound Care</td>
                <td class="confirmed">Confirmed</td>
              </tr>
              <tr>
                <td>Aisha</td>
                <td>Injection</td>
                <td class="pending">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- System Alerts -->
        <div class="card">
          <h2>System Alerts</h2>
          <ul class="alerts">
            <li>⚠️ Emergency booking unassigned</li>
            <li>⚠️ Payment dispute pending</li>
            <li>⚠️ Provider rating below threshold</li>
          </ul>
        </div>
      </section>
    </main>
  </div>
  <!-- Reject Modal -->
<div v-if="showRejectModal" class="modal-backdrop">
  <div class="modal">
    <h3>Reject Provider</h3>

    <p>
      Rejecting:
      <strong>{{ providerToReject?.name }}</strong>
    </p>

    <textarea
      v-model="rejectReason"
      placeholder="Enter rejection reason..."
      rows="4"
    ></textarea>

    <div class="modal-actions">
      <button class="cancel" @click="showRejectModal = false">
        Cancel
      </button>
      <button class="reject" @click="confirmReject">
        Confirm Reject
      </button>
    </div>
  </div>
</div>

</template>

<script setup>
import { ref, onMounted } from "vue"
import { serverTimestamp } from "firebase/firestore"
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore"
import { getAuth } from "firebase/auth"
const auth = getAuth()


const db = getFirestore()

const pendingProviders = ref([])
const selectedProvider = ref(null)
const showRejectModal = ref(false)
const rejectReason = ref("")
const providerToReject = ref(null)
async function loadPendingProviders() {
  const q = query(
    collection(db, "providers"),
    where("status", "==", "pending_review"),
    orderBy("createdAt", "asc"),
    limit(3)
  )

  const snap = await getDocs(q)

  pendingProviders.value = snap.docs.map(d => ({
    uid: d.id,
    ...d.data()
  }))
}

onMounted(loadPendingProviders)

function viewProvider(provider) {
  selectedProvider.value = provider
}

async function approveProvider(uid) {
  if (!confirm("Approve this provider?")) return

  await updateDoc(doc(db, "providers", uid), {
    status: "approved"
  })

  selectedProvider.value = null
  loadPendingProviders()
}
function openRejectModal(provider) {
  providerToReject.value = provider
  rejectReason.value = ""
  showRejectModal.value = true
}

async function confirmReject() {
  if (!rejectReason.value.trim()) {
    alert("Please enter a rejection reason")
    return
  }

  try {
    const token = await auth.currentUser.getIdToken()

    await fetch("http://localhost:8000/api/providers/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        providerId: providerToReject.value.uid,
        reason: rejectReason.value
      })
    })

    showRejectModal.value = false
    providerToReject.value = null
    rejectReason.value = ""
    selectedProvider.value = null

    await loadPendingProviders()

  } catch (err) {
    alert("Failed to reject provider")
    console.error(err)
  }
}


</script>


<style scoped>
/* Layout */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f4f6f8;
  font-family: system-ui, sans-serif;
}

/* Sidebar */
.sidebar {
  width: 240px;
  background: #0f3d2e;
  color: white;
  padding: 24px;
}

.logo {
  margin-bottom: 30px;
  font-size: 1.4rem;
}

.sidebar nav a {
  display: block;
  padding: 12px 10px;
  margin-bottom: 6px;
  color: #cfe9dc;
  text-decoration: none;
  border-radius: 6px;
  cursor: pointer;
}

.sidebar nav a.active,
.sidebar nav a:hover {
  background: #166534;
  color: white;
}

/* Main */
.main {
  flex: 1;
  padding: 24px;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-info img {
  border-radius: 50%;
}

/* Stats */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.06);
}

.stat-card h3 {
  font-size: 0.9rem;
  color: #6b7280;
}

.stat-card p {
  font-size: 1.6rem;
  font-weight: 700;
  color: #166534;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

/* Cards */
.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
}

.card h2 {
  margin-bottom: 16px;
  color: #166534;
  font-size: 1.1rem;
}

/* Provider list */
.card ul {
  list-style: none;
  padding: 0;
}

.card li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.card li:last-child {
  border-bottom: none;
}

/* Buttons */
button {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
}

.approve {
  background: #dcfce7;
  color: #166534;
}

.reject {
  background: #fee2e2;
  color: #b91c1c;
}

/* Table */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th, td {
  text-align: left;
  padding: 8px;
}

thead {
  background: #f0fdf4;
}

.confirmed {
  color: #166534;
  font-weight: 600;
}

.pending {
  color: #b45309;
}

/* Alerts */
.alerts li {
  padding: 8px 0;
  font-size: 0.9rem;
}
/* ============================= */
/* 📱 MOBILE RESPONSIVENESS */
/* ============================= */

@media (max-width: 768px) {

  /* Layout becomes vertical */
  .admin-layout {
    flex-direction: column;
  }

  /* Sidebar becomes top nav */
  .sidebar {
    width: 92%;
    padding: 16px;
  }

  .sidebar nav {
    display: flex;
    overflow-x: auto;
    gap: 8px;
  }

  .sidebar nav a {
    white-space: nowrap;
    padding: 8px 14px;
    font-size: 0.85rem;
  }

  .logo {
    margin-bottom: 12px;
    text-align: center;
  }

  /* Main content */
  .main {
    padding: 16px;
  }

  /* Header stacks */
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  /* Stats: 2 per row */
  .stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  .stat-card p {
    font-size: 1.3rem;
  }

  /* Content grid becomes single column */
  .grid {
    grid-template-columns: 1fr;
  }

  /* Tables scroll safely */
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}

/* Extra small devices */
@media (max-width: 420px) {

  .stats {
    grid-template-columns: 1fr;
  }

  .sidebar nav a {
    font-size: 0.8rem;
  }

  .header h1 {
    font-size: 1.2rem;
  }
}
.provider-name {
  cursor: pointer;
  color: #166534;
  font-weight: 600;
}
.provider-name:hover {
  text-decoration: underline;
}
.docs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.docs img {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ddd;
}
/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 420px;
}

.modal h3 {
  margin-bottom: 10px;
  color: #166534;
}

.modal textarea {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  resize: none;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}

.cancel {
  background: #e5e7eb;
  color: #374151;
}


</style>
