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

        <!-- Profile Image -->
        <div class="photo-section">
          <img :src="previewImage || form.photo" class="profile-photo" />
          <label class="upload-btn">
            Change Photo
            <input type="file" accept="image/*" @change="onImageChange" hidden />
          </label>
        </div>

        <!-- Form -->
        <form class="form" @submit.prevent="saveProfile">

          <div class="form-group">
            <label>Full Name</label>
            <input type="text" v-model="form.name" placeholder="Enter full name" />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="form.email" placeholder="Enter email address" />
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" v-model="form.phone" placeholder="+234..." />
          </div>

          <div class="form-group">
            <label>Address</label>
            <textarea
              v-model="form.address"
              rows="3"
              placeholder="Street, City, State"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="actions">
            <button type="submit" class="primary-btn">Save Changes</button>
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
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

// Mock provider data (replace with Firebase later)
const form = reactive({
  name: "Nurse Amina",
  email: "amina@example.com",
  phone: "+234 812 345 6789",
  address: "12 Health Street, Lagos",
  photo: "https://i.pravatar.cc/150"
})

const previewImage = ref(null)

// Handle image preview
function onImageChange(e) {
  const file = e.target.files[0]
  if (!file) return

  previewImage.value = URL.createObjectURL(file)
  // later: upload to Firebase Storage
}

// Save profile (frontend only)
function saveProfile() {
  console.log("Updated profile:", form)
  alert("Profile updated successfully ✔️")

  // later: save to Firestore
  router.push("/provider-dashboard")
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

</style>
