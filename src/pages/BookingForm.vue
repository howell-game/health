<template>
  <div class="booking-wrapper">
    <h1 class="title">Client Booking Form</h1>
    <p class="subtitle">(Home Healthcare Service Request)</p>

    <form @submit.prevent="submitForm">
      <!-- SECTION 1 -->
      <section>
        <h2>Client Information</h2>

        <label>
          Full Name
          <input v-model="form.clientName" required />
        </label>

        <label>
          Phone Number
          <input v-model="form.clientPhone" required />
        </label>

        <label>
          Email Address (optional)
          <input type="email" v-model="form.clientEmail" />
        </label>

        <label>
          Relationship to Patient
          <select v-model="form.relationship" required>
            <option value="">Select</option>
            <option>Self</option>
            <option>Parent</option>
            <option>Child</option>
            <option>Spouse</option>
            <option>Other</option>
          </select>
        </label>
      </section>

      <!-- SECTION 2 -->
      <section>
        <h2>Patient Details</h2>

        <label>
          Patient’s Full Name
          <input v-model="form.patientName" required />
        </label>

        <label>
          Patient’s Age
          <input type="number" v-model="form.patientAge" required />
        </label>

        <label>
          Patient’s Gender
          <select v-model="form.patientGender">
            <option>Male</option>
            <option>Female</option>
            <option>Prefer not to say</option>
          </select>
        </label>

        <label>
          Primary Health Concern
          <textarea v-model="form.healthConcern" required></textarea>
        </label>

        <label>
          Is the patient currently under a doctor’s care?
          <select v-model="form.doctorCare">
            <option>No</option>
            <option>Yes</option>
          </select>
        </label>

        <label v-if="form.doctorCare === 'Yes'">
          Relevant Instructions (optional)
          <textarea v-model="form.doctorInstructions"></textarea>
        </label>
      </section>

      <!-- SECTION 3 -->
<section>
  <h2>Service Request</h2>

  <!-- Care Category -->
  <label>
    Type of Care Required
    <select v-model="form.careCategory" required>
      <option value="">Select</option>
      <option value="nursing">Nursing Care</option>
      <option value="physio">Physiotherapist</option>
    </select>
  </label>

  <!-- Nursing Care Options -->
  <label v-if="form.careCategory === 'nursing'">
    Nursing Care Service
    <select v-model="form.serviceType" required>
      <option value="">Select</option>
      <option>Wound Care</option>
      <option>Injection & Drip</option>
      <option>Elderly Care</option>
      <option>Post Natal Care</option>
      <option> Home Monitoring</option>
    </select>
  </label>

  <!-- Physiotherapy Options -->
  <label v-if="form.careCategory === 'physio'">
    Physiotherapy Service
    <select v-model="form.serviceType" required>
      <option value="">Select</option>
      <option>Massage</option>
    </select>
  </label>

  <label>
    Describe the Care Needed
    <textarea v-model="form.careDescription" required></textarea>
  </label>

  <label>
    Expected Duration of Visit
    <select v-model="form.duration" required>
  <option value="">Select</option>
  <option>1 Hour</option>
  <option>2–3 Hours</option>
  <option>Half Day</option>
  <option>Full Day</option>
  <option>Ongoing Care</option>
</select>

  </label>
</section>


      <!-- SECTION 4 -->
      <section>
        <h2>Location Details</h2>

        <label>
  Service Address <small v-if="!form.addressVerified" class="warning">
  please confirm your address using the map below.  
      if your address is not correct, use a nearby landmark
</small>
  <input
    id="address-input"
    v-model="form.address"
    placeholder="Start typing address…"
    required
  />
</label>
<button
  type="button"
  class="location-btn"
  @click="useCurrentLocation"
>
  📍 Use my current location
</button>



<!-- MAP PREVIEW -->
<div id="map" class="map-preview"></div>


        <label>
          State
          <input v-model="form.state" required />
        </label>

        <label>
          Is the location easily accessible?
          <select v-model="form.accessible">
            <option>Yes</option>
            <option>No</option>
          </select>
        </label>

        <label>
          Special Directions or Notes (optional)
          <textarea v-model="form.locationNotes"></textarea>
        </label>
      </section>

      <!-- SECTION 5 -->
      <section>
        <h2>Scheduling</h2>

        <label>
          Preferred Date
          <input type="date" v-model="form.date" required />
        </label>

        <label>
          Preferred Time
          <select v-model="form.time">
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
        </label>

        <label>
          Is this an urgent request?
          <select v-model="form.urgent">
            <option>No</option>
            <option>Yes</option>
          </select>
        </label>
      </section>

      <!-- SECTION 6 -->
      <section>
        <h2>Provider Preference (Optional)</h2>

        <label>
          Preferred Provider Gender
          <select v-model="form.providerGender">
            <option>No Preference</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </label>

        <label>
          Have you used our service before?
          <select v-model="form.usedBefore">
            <option>No</option>
            <option>Yes</option>
          </select>
        </label>

        <label v-if="form.usedBefore === 'Yes'">
          Would you like the same provider again?
          <select v-model="form.sameProvider">
            <option>Yes</option>
            <option>No</option>
          </select>
        </label>
      </section>

      <!-- SECTION 7 -->
      <section>
        <h2>Safety & Consent</h2>

        <label>
          Emergency Contact Name
          <input v-model="form.emergencyName" required />
        </label>

        <label>
          Emergency Contact Phone Number
          <input v-model="form.emergencyPhone" required />
        </label>

        <label class="checkbox">
          <input type="checkbox" v-model="form.consent" required />
          I confirm that the information provided is accurate and understand this service does not replace emergency care.
        </label>
      </section>

      <!-- SECTION 8 -->
      <section>
        <h2>Payment Acknowledgement</h2>
        <p class="notice">
          Payment is required to confirm this booking. Funds are held securely and released after service completion.
        </p>

        <label class="checkbox">
          <input type="checkbox" v-model="form.paymentAgreement" required />
          I agree to the payment and cancellation terms.
        </label>
      </section>

      <button class="submit-btn">Request Care</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue"
import { auth, db } from "@/firebase"
import { useRouter } from "vue-router"
import { onMounted } from "vue"
import { watch } from "vue"


const router = useRouter()


let map
let marker
let autocomplete

onMounted(() => {
  const input = document.getElementById("address-input")


  autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ["formatted_address", "geometry"]
  })

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 6.5244, lng: 3.3792 }, // Lagos
    zoom: 13
  })

  marker = new google.maps.Marker({ map })

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

    // ✅ Verified ONLY via Google
    form.addressVerified = true
  })
})



const form = reactive({
  clientName: "",
  clientPhone: "",
  clientEmail: "",
  relationship: "",

  patientName: "",
  patientAge: "",
  patientGender: "Prefer not to say",

  healthConcern: "",
  doctorCare: "No",
  doctorInstructions: "",

  // ✅ ADD THESE
  careCategory: "",
  serviceType: "",

  careDescription: "",
  duration: "",

  address: "",
  lat: null,
  lng: null,
  addressVerified: false,
  state: "",
  accessible: "Yes",
  locationNotes: "",

  date: "",
  time: "Morning",
  urgent: "No",

  providerGender: "No Preference",
  usedBefore: "No",
  sameProvider: "",

  emergencyName: "",
  emergencyPhone: "",

  consent: false,
  paymentAgreement: false
})


watch(
  () => form.address,
  (newVal, oldVal) => {
    // If user manually edits after verification, invalidate it
    if (form.addressVerified && newVal !== oldVal) {
      form.addressVerified = false
    }
  }
)

async function submitForm() {
  if (!form.addressVerified) {
    alert("Please select a valid address from the suggestions.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in");
    return;
  }

  const token = await user.getIdToken();

  try {
    const API = import.meta.env.VITE_API_BASE_URL
    const response = await fetch(`${API}/api/bookings`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify(form)
})

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Booking failed");
    }

    router.push({
      name: "Payment",
      query: { bookingId: result.bookingId }
    });

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

function useCurrentLocation() {
  if (!map || !marker) {
    alert("Map is still loading. Please wait a moment.");
    return;
  }

  if (!navigator.geolocation) {
    alert("Geolocation is not supported on this device.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const location = { lat, lng };

      map.setCenter(location);
      map.setZoom(16);
      marker.setPosition(location);

      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ location }, (results, status) => {
        if (status === "OK" && results.length) {
          form.address = results[0].formatted_address;
          form.lat = lat;
          form.lng = lng;

          // ✅ VERIFIED via Google
          form.addressVerified = true;
        } else {
          alert("Unable to determine address. Please use a nearby landmark.");
          form.addressVerified = false;
        }
      });
    },
    () => {
      alert("Location permission denied. Please enable location access.");
    }
  );
}



</script>

<style>
.booking-wrapper {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  font-family: Arial, sans-serif;
  color: #000;
}

.title {
  text-align: center;
  color: #1e7f43;
}

.subtitle {
  text-align: center;
  margin-bottom: 30px;
}

section {
  margin-bottom: 40px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 30px;
}

h2 {
  color: #1e7f43;
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 15px;
  font-weight: 600;
}

input, select, textarea {
  width: 100%;
  padding: 10px;
  margin-top: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

textarea {
  min-height: 80px;
}

.checkbox-group label,
.checkbox {
  font-weight: normal;
}

.notice {
  background: #f0fff6;
  padding: 15px;
  border-left: 4px solid #1e7f43;
  margin-bottom: 15px;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: #1e7f43;
  color: white;
  border: none;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
}

.submit-btn:hover {
  background: #166534;
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

.location-btn {
  margin-top: 8px;
  padding: 8px 12px;
  font-size: 0.9rem;
  border-radius: 6px;
  border: 1px dashed #1e7f43;
  background: #f0fff6;
  color: #1e7f43;
  cursor: pointer;
}

.location-btn:hover {
  background: #dcfce7;
}


</style>
