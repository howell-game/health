<template>
  <div class="withdraw-page">
    <div class="card">
      <h1>Withdraw Funds</h1>
      <p class="subtitle">Transfer your earnings to your bank account</p>

      <!-- Balance -->
      <div class="balance-box">
        Available Balance:
        <strong>₦{{ balance.toLocaleString() }}</strong>
      </div>

      <!-- Amount -->
      <div class="field">
        <label>Amount</label>
        <input
          type="number"
          v-model.number="amount"
          :max="balance"
          placeholder="Enter amount"
        />
      </div>

      <!-- Bank -->
      <div class="field">
        <label>Bank</label>
<input
  v-model="bankSearch"
  placeholder="Start typing bank name..."
/>

<ul v-if="filteredBanks.length" class="dropdown">
  <li
    v-for="bank in filteredBanks"
    :key="bank.code"
    @click="selectBank(bank)"
  >
    {{ bank.name }}
  </li>
</ul>
      </div>

      <!-- Account Number -->
      <div class="field">
        <label>Account Number</label>
        <input
          type="text"
          maxlength="10"
          v-model="accountNumber"
          :disabled="accountResolved"
          placeholder="10-digit account number"
        />
      </div>

      <!-- Resolve -->
      <button
        class="btn secondary"
        @click="resolveAccount"
        :disabled="resolving || accountResolved"
      >
        {{ resolving ? "Resolving..." : "Resolve Account Name" }}
      </button>

      <!-- Resolved Name -->
      <div v-if="accountName" class="resolved">
        Account Name:
        <strong>{{ accountName }}</strong>
      </div>

      <!-- Withdraw -->
      <button
        class="btn primary"
        :disabled="!accountResolved || amount <= 0 || amount > balance"
        @click="withdraw"
      >
        Withdraw
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { getAuth } from "firebase/auth"
import { ref, onMounted, computed, watch } from "vue"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { app } from "../firebase" // your firebase.js export

const db = getFirestore(app)
const auth = getAuth()

/* 🔧 Dynamic balance */
const balance = ref(0)

const API = import.meta.env.VITE_API_BASE_URL
const banks = ref([])
const bankSearch = ref("")
const selectedBank = ref(null)
const loadingBanks = ref(false)

/* Form state */
const amount = ref(0)
const accountNumber = ref("")
const accountName = ref("")
const resolving = ref(false)
const accountResolved = ref(false)
const error = ref("")
const withdrawing = ref(false)

/* -------------------------------
   Load banks and provider balance
--------------------------------*/
onMounted(async () => {
  loadingBanks.value = true
  try {
    // Fetch banks for dropdown
    const res = await fetch(`${API}/api/withdrawals/banks`)
    banks.value = await res.json()
  } catch (err) {
    console.error("Failed to load banks", err)
  } finally {
    loadingBanks.value = false
  }

  // Fetch logged-in user's balance from Firestore
  const user = auth.currentUser
  if (user) {
    const uid = user.uid
    try {
      const docRef = doc(db, "providers", uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        balance.value = docSnap.data().balance || 0
      } else {
        error.value = "Provider not found"
      }
    } catch (err) {
      console.error("Failed to load balance:", err)
      error.value = "Unable to load balance"
    }
  } else {
    error.value = "User not authenticated"
  }
})

/* -------------------------------
   Banks dropdown logic
--------------------------------*/
const filteredBanks = computed(() => {
  if (!bankSearch.value) return []
  return banks.value.filter(bank =>
    bank.name.toLowerCase().includes(bankSearch.value.toLowerCase())
  )
})

function selectBank(bank) {
  selectedBank.value = bank
  bankSearch.value = bank.name
}

/* -------------------------------
   Resolve account
--------------------------------*/
async function resolveAccount() {
  error.value = ""

  if (!selectedBank.value || accountNumber.value.length !== 10) {
    error.value = "Enter valid bank and account number"
    return
  }

  resolving.value = true
  try {
    const res = await fetch(`${API}/api/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account_number: accountNumber.value,
        bank_code: selectedBank.value.code
      })
    })
    const data = await res.json()
    if (!res.ok) {
      error.value = data.message || "Failed to resolve account"
      resolving.value = false
      return
    }

    accountName.value = data.account_name
    accountResolved.value = true
  } catch (err) {
    console.error("Resolve failed:", err)
    error.value = "Server error: unable to resolve account"
  } finally {
    resolving.value = false
  }
}

/* -------------------------------
   Withdraw
--------------------------------*/
async function withdraw() {
  error.value = ""
  if (withdrawing.value) return
  withdrawing.value = true

  if (!accountResolved.value) {
    error.value = "Resolve account first"
    withdrawing.value = false
    return
  }

  if (amount.value <= 0 || amount.value > balance.value) {
    error.value = "Invalid withdrawal amount"
    withdrawing.value = false
    return
  }

  try {
    const user = auth.currentUser
    if (!user) {
      error.value = "Not authenticated"
      withdrawing.value = false
      return
    }

    const token = await user.getIdToken()

    const res = await fetch(`${API}/api/drawals/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: amount.value,
        bank_code: selectedBank.value.code,
        account_number: accountNumber.value
      })
    })

    const data = await res.json()
    if (!res.ok) {
      error.value = data.message || "Withdrawal failed"
      withdrawing.value = false
      return
    }

    alert("Withdrawal initiated successfully")

    // Reset form
    amount.value = 0
    accountNumber.value = ""
    accountName.value = ""
    accountResolved.value = false
    selectedBank.value = null
    bankSearch.value = ""
  } catch (err) {
    console.error("Withdrawal error:", err)
    error.value = "Server error. Try again."
  } finally {
    withdrawing.value = false
  }
}

/* -------------------------------
   Reset resolved account if user changes input
--------------------------------*/
watch([accountNumber, selectedBank], () => {
  accountResolved.value = false
  accountName.value = ""
})
</script>

<style scoped>
.withdraw-page {
  min-height: 100vh;
  background: #f9fafb;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.card {
  width: 100%;
  max-width: 420px;
  background: white;
  padding: 28px;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

h1 {
  text-align: center;
  color: #166534;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 20px;
}

.balance-box {
  background: #ecfdf5;
  padding: 12px;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
}

.field {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.85rem;
  color: #374151;
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
}

.dropdown {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  margin-top: 6px;
  max-height: 150px;
  overflow-y: auto;
}

.dropdown li {
  padding: 10px;
  cursor: pointer;
}

.dropdown li:hover {
  background: #f3f4f6;
}

.resolved {
  margin: 14px 0;
  background: #f0fdf4;
  padding: 12px;
  border-radius: 10px;
  text-align: center;
}

.btn {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  margin-top: 10px;
  cursor: pointer;
}

.btn.primary {
  background: #16a34a;
  color: white;
}

.btn.secondary {
  background: #e5e7eb;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #dc2626;
  margin-top: 10px;
  text-align: center;
}
</style>