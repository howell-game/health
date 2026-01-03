<template>
  <div class="provider-signup">
    <!-- 1️⃣ Header / Intro -->
    <header class="intro">
      <h1>Join as a Healthcare Provider</h1>
      <p>
        Provide safe, professional home healthcare and get matched with patients near you.
      </p>
    </header>

    <form @submit.prevent="submitForm">
      <!-- 2️⃣ Personal Information -->
      <section>
        <h2>Personal Information</h2>

        <input v-model="form.name" placeholder="Full Name" required />
        <input type="email" v-model="form.email" placeholder="Email Address" required />
        <input v-model="form.phone" placeholder="Phone Number" required />

        <select v-model="form.gender">
          <option value="">Gender (optional)</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <input type="date" v-model="form.dob" />
        <textarea v-model="form.address" placeholder="Residential Address" required></textarea>
      </section>

      <!-- 3️⃣ Professional Role -->
      <section>
        <h2>Professional Role</h2>

        <label class="radio">
          <input type="radio" value="Nurse" v-model="form.role" />
          Nurse
        </label>

        <label class="radio">
          <input type="radio" value="Physiotherapist" v-model="form.role" />
          Physiotherapist
        </label>
      </section>

      <!-- 4️⃣ Professional Details -->
      <section v-if="form.role">
        <h2>Professional Details</h2>

        <input
          v-if="form.role === 'Nurse'"
          v-model="form.qualification"
          placeholder="Nursing Qualification"
          required
        />

        <input
          v-if="form.role === 'Physiotherapist'"
          v-model="form.specialization"
          placeholder="Area of Specialization"
          required
        />

        <input
          type="number"
          v-model="form.experience"
          placeholder="Years of Experience"
          required
        />

        <div class="checkbox-group">
          <label v-for="service in availableServices" :key="service">
            <input
              type="checkbox"
              :value="service"
              v-model="form.services"
            />
            {{ service }}
          </label>
        </div>
      </section>

      <!-- 5️⃣ License & Verification -->
      <section>
        <h2>License & Verification</h2>

        <input v-model="form.licenseNumber" placeholder="License Number" required />
        <input v-model="form.issuingAuthority" placeholder="Issuing Authority" required />

        <label>
          Upload License Document (PDF/Image)
          <input type="file" accept="image/*,application/pdf"
                 @change="e => form.licenseDoc = e.target.files[0]" required />
        </label>

        <label>
          Upload Valid ID (Optional)
          <input type="file" accept="image/*,application/pdf"
                 @change="e => form.idDoc = e.target.files[0]" />
        </label>

        <small>Your documents are reviewed before your account goes live.</small>
      </section>

      <!-- 6️⃣ Location & Coverage -->
      <section>
        <h2>Location & Coverage</h2>

        <input v-model="form.city" placeholder="City / State" required />
        <input v-model="form.coverageArea" placeholder="Areas You Cover" required />

        <select v-model="form.travel">
          <option value="">Willing to Travel?</option>
          <option>Yes</option>
          <option>No</option>
        </select>
      </section>

      <!-- 7️⃣ Availability -->
      <section>
        <h2>Availability</h2>

        <div class="checkbox-group">
          <label v-for="day in days" :key="day">
            <input type="checkbox" :value="day" v-model="form.days" />
            {{ day }}
          </label>
        </div>

        <div class="checkbox-group">
          <label v-for="slot in timeSlots" :key="slot">
            <input type="checkbox" :value="slot" v-model="form.timeSlots" />
            {{ slot }}
          </label>
        </div>

        <label class="radio">
          <input type="checkbox" v-model="form.emergency" />
          Available for Emergency Calls
        </label>
      </section>

      <!-- 8️⃣ Payment Preferences -->
      <section>
        <h2>Payment Preferences (Optional)</h2>

        <input v-model="form.bankName" placeholder="Bank Name" />
        <input v-model="form.accountName" placeholder="Account Name" />
      </section>

      <!-- 9️⃣ Consent & Submit -->
      <section>
        <label class="checkbox">
          <input type="checkbox" v-model="form.confirm" required />
          I confirm all information is correct
        </label>

        <label class="checkbox">
          <input type="checkbox" v-model="form.agree" required />
          I agree to platform terms & professional conduct
        </label>
      </section>

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Submitting...' : 'Apply to Join' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const router = useRouter()
const auth = getAuth()
const db = getFirestore()
const storage = getStorage()

const loading = ref(false)
const error = ref('')

const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const timeSlots = ['Morning','Afternoon','Evening']

const nurseServices = [
  'Wound Care','Injections & Drips','Elderly Care','Postnatal Care','Home Monitoring'
]

const physioServices = [
  'Massage Therapy','Stroke Rehabilitation','Post-surgery Rehab'
]

const availableServices = computed(() =>
  form.value.role === 'Nurse' ? nurseServices : physioServices
)

const form = ref({
  name:'', email:'', phone:'', gender:'', dob:'', address:'',
  role:'', qualification:'', specialization:'', experience:'',
  services:[], licenseNumber:'', issuingAuthority:'',
  licenseDoc:null, idDoc:null,
  city:'', coverageArea:'', travel:'',
  days:[], timeSlots:[], emergency:false,
  bankName:'', accountName:'',
  confirm:false, agree:false
})

async function upload(uid, file, name) {
  if (!file) return null
  const fileRef = sRef(storage, `providers/${uid}/${name}`)
  await uploadBytes(fileRef, file)
  return await getDownloadURL(fileRef)
}

async function submitForm() {
  loading.value = true
  try {
    const cred = await createUserWithEmailAndPassword(auth, form.value.email, 'TempPass123!')
    const uid = cred.user.uid

    const licenseUrl = await upload(uid, form.value.licenseDoc, 'license')
    const idUrl = await upload(uid, form.value.idDoc, 'id')

    await setDoc(doc(db, 'users', uid), {
      uid,
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      address: form.value.address,
      category: 'provider',
      createdAt: serverTimestamp()
    })

    await setDoc(doc(db, 'providers', uid), {
      ...form.value,
      licenseUrl,
      idUrl,
      status: 'pending_review',
      createdAt: serverTimestamp()
    })

    router.push('/dashboard')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.provider-signup {
  max-width: 800px;
  margin: 40px auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
}

.intro {
  text-align: center;
  margin-bottom: 30px;
}

section {
  margin-bottom: 30px;
}

input, textarea, select {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

button {
  width: 100%;
  padding: 14px;
  background: #1e7f43;
  color: white;
  border: none;
  border-radius: 8px;
}
</style>
