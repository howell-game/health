<template>
  <div class="processing">
    <h2>Confirming payment...</h2>
    <p>Please don’t close this page.</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase"

const route = useRoute()
const router = useRouter()
const bookingId = route.query.bookingId

onMounted(async () => {
  if (!bookingId) {
    router.replace("/payment-failure")
    return
  }

  // 🔁 Poll Firestore until webhook updates
  let attempts = 0
  const interval = setInterval(async () => {
    attempts++

    const snap = await getDoc(doc(db, "bookings", bookingId))

    if (!snap.exists()) {
      clearInterval(interval)
      router.replace("/payment-failure")
      return
    }

    const status = snap.data().paymentStatus

    if (status === "paid") {
      clearInterval(interval)
      router.replace("/payment-success")
    }

    if (status === "failed") {
      clearInterval(interval)
      router.replace("/payment-failure")
    }

    if (attempts > 10) {
      clearInterval(interval)
      router.replace("/payment-failure")
    }
  }, 2000)
})
</script>