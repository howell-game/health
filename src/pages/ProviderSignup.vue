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
        <input type="password" v-model="form.password" placeholder="Password" required />
        <input v-model="form.phone" placeholder="Phone Number" required />

        <select v-model="form.gender">
          <option value="">Gender (optional)</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <input type="date" v-model="form.dob" />
        <label>
  Residential Address <small v-if="!form.addressVerified" class="warning">
  as you input your address please select address from the autofill suggestions
</small>
  <input
    id="provider-address-input"
    v-model="form.address"
    placeholder="Start typing your home address…"
    required
  />
</label>


<div id="provider-map" class="map-preview"></div>

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
          Upload Valid ID 
          <input type="file" accept="image/*,application/pdf"
                 @change="e => form.idDoc = e.target.files[0]" />
        </label>

        <label>
          Upload Your Facial Picture
          <input type="file" accept="image/*"
                 @change="e => form.passportDoc = e.target.files[0]" />
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
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { onMounted } from 'vue'

let map
let marker
let autocomplete

function waitForGoogle() {
  return new Promise(resolve => {
    const check = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(check)
        resolve()
      }
    }, 100)
  })
}

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
  name:'', email:'', phone:'', password:'', gender:'', dob:'',
  address:'',
  lat: null,
  lng: null,
  addressVerified: false,
  role:'', qualification:'', specialization:'', experience:'',
  services:[], licenseNumber:'', issuingAuthority:'',
  licenseDoc:null, idDoc:null, passportDoc:null,
  city:'', coverageArea:'', travel:'',
  days:[], timeSlots:[], emergency:false,
  bankName:'', accountName:'',
  confirm:false, agree:false
})

onMounted(async () => {
  await waitForGoogle()

  const input = document.getElementById('provider-address-input')

  input.addEventListener('input', () => {
    form.value.addressVerified = false
  })

  autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ['formatted_address', 'geometry']
  })

  map = new google.maps.Map(document.getElementById('provider-map'), {
    center: { lat: 6.5244, lng: 3.3792 }, // Lagos default
    zoom: 13
  })

  marker = new google.maps.Marker({ map })

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    if (!place.geometry) return

    const loc = place.geometry.location

    map.setCenter(loc)
    marker.setPosition(loc)

    form.value.address = place.formatted_address
    form.value.lat = loc.lat()
    form.value.lng = loc.lng()
    form.value.addressVerified = true
  })
})



async function upload(uid, file, name) {
  if (!file) return null
  const fileRef = sRef(storage, `providers/${uid}/${name}`)
  await uploadBytes(fileRef, file)
  return await getDownloadURL(fileRef)
}


async function submitForm() {
  loading.value = true
  error.value = ''
  
  // 🚫 BLOCK SUBMISSION IF ADDRESS NOT VERIFIED
  if (!form.value.addressVerified) {
    error.value = 'Please select a valid address from the suggestions'
    loading.value = false
    return
  }

  try {
    // 1️⃣ Create Auth user with REAL password
    const cred = await createUserWithEmailAndPassword(
      auth,
      form.value.email,
      form.value.password
    )

    const user = cred.user
    const uid = user.uid

    // 2️⃣ Send verification email
    await sendEmailVerification(user)

    // 3️⃣ Upload documents
    const licenseUrl = await upload(uid, form.value.licenseDoc, 'license')
    const idUrl = await upload(uid, form.value.idDoc, 'id')
    const passportUrl = await upload(uid, form.value.passportDoc, 'passport')

    // 4️⃣ Save user profile
    await setDoc(doc(db, 'users', uid), {
      uid,
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      lat: form.value.lat,
  lng: form.value.lng,
      address: form.value.address,
      role: 'provider',
      emailVerified: false,
      createdAt: serverTimestamp()
    })

    // 5️⃣ Save provider details
    await setDoc(doc(db, 'providers', uid), {
      uid,
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      gender: form.value.gender,
      dob: form.value.dob,
      role: form.value.role,
      qualification: form.value.qualification,
      specialization: form.value.specialization,
      experience: form.value.experience,
      services: form.value.services,
      licenseNumber: form.value.licenseNumber,
      issuingAuthority: form.value.issuingAuthority,
      licenseUrl,
      idUrl,
      passportUrl,
      address: form.value.address,
  lat: form.value.lat,
  lng: form.value.lng,
      city: form.value.city,
      coverageArea: form.value.coverageArea,
      travel: form.value.travel,
      days: form.value.days,
      timeSlots: form.value.timeSlots,
      emergency: form.value.emergency,
      bankName: form.value.bankName,
      accountName: form.value.accountName,
      status: 'pending_review',
      createdAt: serverTimestamp(),
       activeBooking: false,
  declineCount: 3
    })

    // 6️⃣ Redirect to email verification notice
    router.push('/verify-email')

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
.map-preview {
  width: 100%;
  height: 300px;
  margin-top: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.warning {
  color: #b91c1c;
  font-size: 0.9rem;
}

</style>
