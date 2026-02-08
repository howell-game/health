<template>
  <div class="edit-profile">
    <div class="container">

      <!-- Header -->
      <section class="header">
        <h1>Edit Profile</h1>
        <p>Update your personal and contact information</p>
      </section>

      <!-- Profile Card -->
      <section class="card">

        <!-- Profile Image (READ ONLY) -->
        <div class="photo-section">
          <img
            v-if="form.passportUrl"
            :src="form.passportUrl"
            class="profile-photo"
          />
        </div>

        <!-- Form -->
        <form class="form" @submit.prevent="saveProfile">

          <div class="form-group">
            <label>Full Name</label>
            <input type="text" v-model="form.name" required />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="form.email" required />
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" v-model="form.phone" required />
          </div>

          <div class="form-group">
  <label>
    Address
     <div class="address-note">
      please confirm your address using the map below.  
      if your address is not correct, use a nearby landmark
    </div>
    <small v-if="!form.addressVerified" class="warning">
      select address from autocomplete suggestions
    </small>
  </label>

  <input
    id="address-input"
    v-model="form.address"
    placeholder="Start typing address…"
    required
  />
</div>

<!-- MAP PREVIEW -->
<div id="map" class="map-preview"></div>

          <!-- Actions -->
          <div class="actions">
            <button type="submit" class="primary-btn">
              Save Changes
            </button>
            <button type="button" class="secondary-btn" @click="cancel">
              Cancel
            </button>
          </div>

        </form>
      </section>

    </div>
  </div>
</template>


<script setup>
import { reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { getAuth } from "firebase/auth"
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore"

const router = useRouter()
const auth = getAuth()
const db = getFirestore()

let map
let marker
let autocomplete

const form = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
  lat: null,
  lng: null,
  addressVerified: false,
  passportUrl: ""
})

/* ================= LOAD DATA ================= */
onMounted(async () => {
  const user = auth.currentUser
  if (!user) return

  const providerRef = doc(db, "providers", user.uid)
  const snap = await getDoc(providerRef)

  if (snap.exists()) {
    const data = snap.data()

    form.name = data.name || ""
    form.email = data.email || ""
    form.phone = data.phone || ""
    form.address = data.address || ""
    form.lat = data.lat || null
    form.lng = data.lng || null
    form.passportUrl = data.passportUrl || ""
    form.addressVerified = true
  }

  initGoogleMaps()
})

/* ================= GOOGLE MAP ================= */
function initGoogleMaps() {
  const input = document.getElementById("address-input")

  input.addEventListener("input", () => {
    form.addressVerified = false
  })

  autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ["formatted_address", "geometry"]
  })

  map = new google.maps.Map(document.getElementById("map"), {
    center: form.lat
      ? { lat: form.lat, lng: form.lng }
      : { lat: 6.5244, lng: 3.3792 },
    zoom: 13
  })

  marker = new google.maps.Marker({ map })

  if (form.lat && form.lng) {
    marker.setPosition({ lat: form.lat, lng: form.lng })
  }

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace()

    if (!place.geometry) {
      form.addressVerified = false
      return
    }

    const location = place.geometry.location

    map.setCenter(location)
    marker.setPosition(location)

    form.address = place.formatted_address
    form.lat = location.lat()
    form.lng = location.lng()
    form.addressVerified = true
  })
}

/* ================= SAVE ================= */
async function saveProfile() {
  if (!form.addressVerified) {
    alert("Please select a valid address from suggestions")
    return
  }

  const user = auth.currentUser
  if (!user) return

  const payload = {
    name: form.name,
    email: form.email,
    phone: form.phone,
    address: form.address,
    lat: form.lat,
    lng: form.lng
  }

  await Promise.all([
    updateDoc(doc(db, "users", user.uid), payload),
    updateDoc(doc(db, "providers", user.uid), payload)
  ])

  alert("Profile updated successfully ✔️")
  router.push("/providerdashboard")
}

function cancel() {
  router.back()
}
</script>



<style scoped>
/* ===== PAGE ===== */
.edit-profile {
  min-height: 100vh;
  background: #f9fafb;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;

  display: flex;
  justify-content: center; /* horizontal center */
}

/* ===== WRAPPER (VERTICAL STACK) ===== */
.container {
  width: 100%;
  max-width: 600px;
  padding: 40px 20px;

  display: flex;
  flex-direction: column; /* 🔑 THIS is what you were missing */
  align-items: center;    /* centers header + card horizontally */
}


/* ===== CARD ===== */
.card {
  width: 90%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 16px;
  padding: 26px;
  box-shadow: 0 10px 26px rgba(0,0,0,0.08);
}


/* ===== HEADER ===== */
.header {
  text-align: center;
  margin-bottom: 26px;
}

.header h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #166534;
}

.header p {
  margin-top: 6px;
  color: #6b7280;
}

/* ===== PHOTO ===== */
.photo-section {
  display: grid;
  place-items: center;
  margin-bottom: 24px;
}

.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #16a34a;
}

.upload-btn {
  margin-top: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #16a34a;
  cursor: pointer;
}

.map-preview {
  width: 100%;
  height: 300px;
  margin-top: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.warning {
  color: #b91c1c;
  font-size: 0.85rem;
}


/* ===== FORM ===== */
.form {
  width: 80%;
  max-width: 460px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.form-group {
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #16a34a;
}

/* ===== ACTIONS ===== */
.actions {
  display: flex;
  gap: 14px;
  margin-top: 18px;
}

.primary-btn,
.secondary-btn {
  flex: 1;
  padding: 13px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.primary-btn {
  background: #16a34a;
  color: white;
}

.secondary-btn {
  background: #e5e7eb;
  color: #111827;
}

/* ===== MOBILE ===== */
@media (max-width: 480px) {
  .card {
    padding: 22px 20px;
  }

  .actions {
    flex-direction: column;
  }
}
.address-note {
  margin-top: 6px;
  font-size: 0.85rem;
  color: #b91c1c;          /* red */
  font-weight: 500;
  line-height: 1.3;
}


</style>
