<template>
  <div id="app">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Professional Home Healthcare, Delivered with care</h1>
        <p>We connect families and individuals with licensed nurses and physiotherapists for safe, reliable home care services.</p>
        <div class="buttons">
          <router-link to="/book">
  <button class="primary-btn">Book a Home Care Provider</button>
</router-link>

        <p> <router-link to="/providersignup">
  <button class="primary-btn">Join as a Healthcare Provider</button>
</router-link>
</p>
        </div>
        <img src="https://via.placeholder.com/600x400" alt="Healthcare at Home" />
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works">
      <div class="container">
        <h2>How It Works</h2>
        <div class="steps">
          <div class="step">
          <div class="icon">🩺</div>
          <h3>Request A Service</h3>
            <p>Choose the care you need from our list of services. Write your location and preferred date and time</p>
          </div>
          <div class="step">
            <div class="icon">📅</div>
            <h3>Get Matched</h3>
            <p>We connect you with nearby, verified healthcare providers who are available</p>
          </div>
          <div class="step">
            <div class="icon">😎💰</div>
            <h3>Confirm And Pay</h3>
            <p>Securely make payment through our platform. Funds are held safely until service is completed</p>
          </div>
          <div class="step">
            <div class="icon">🏠</div>
            <h3>Receive Care at Home</h3>
            <p>A licensed professional visits your home and delivers the agreed service.</p>
          </div>
          <div class="step">
            <div class="icon">💖</div>
            <h3>Complete And Review</h3>
            <p>Confirm service completion and leave a review to help others.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="services">
      <div class="container">
        <h2>Our Services</h2>
        <div class="cards">
          <div class="card">
            <div class="icon">🏥</div>
            <h3>Wound Care</h3>
          </div>
          <div class="card">
            <div class="icon">💉</div>
            <h3>Injections & Drips</h3>
          </div>
          <div class="card">
            <div class="icon">🤱🍼</div>
            <h3>Postnatal & Maternal Support</h3>
          </div>
          <div class="card">
            <div class="icon">🌸</div>
            <h3>Elderly Care</h3>
          </div>
          <div class="card">
            <div class="icon">💆‍♂️</div>
            <h3>Physiotherapy & Post Stroke Rehabilitation Support</h3>
          </div>
          <div class="card">
            <div class="icon">📋</div>
            <h3>Home Monitoring & Follow-up</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="why-choose-us">
      <div class="container">
        <h2>Why Choose Us</h2>
        <div class="cards">
          <div class="card">
            <div class="icon">✅</div>
            <h3>Certified Staff</h3>
            <p>All our nurses and physiotherapists are licensed and experienced.</p>
          </div>
          <div class="card">
            <div class="icon">⏰</div>
            <h3>Flexible Scheduling</h3>
            <p>Book visits at times that suit you best.</p>
          </div>
          <div class="card">
            <div class="icon">❤️</div>
            <h3>Patient-First Care</h3>
            <p>Your health and comfort are our top priority.</p>
          </div>
          <div class="card">
            <div class="icon">🌟</div>
            <h3>Trusted Reviews</h3>
            <p>Thousands of patients trust us for home healthcare.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <h2>Book Your Home Visit Today</h2>
        <p>Get professional healthcare from the comfort of your home.</p>
        <v>Medical Disclaimer: We facilitate connections between clients and licensed healthcare providers. We do not replace hospitals, emergency services or medical diagnosis.</v>
        <p><router-link to="/book">
  <button class="primary-btn">Book Now</button>
</router-link></p>
      </div>
    </section>

    
  </div>
</template>

<style>
/* Global Styles */
body, html, #app {
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
  color: black;
  background-color: white;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero Section */
.hero {
  background-color: white;
  text-align: center;
  padding: 80px 0;
}

.hero h1 {
  font-size: 3rem;
  color: #2f855a; /* green */
  margin-bottom: 20px;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 30px;
}

.hero .buttons button {
  margin: 0 10px;
  padding: 12px 30px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.hero .primary-btn {
  background-color: #2f855a;
  color: white;
}

.hero .primary-btn:hover {
  background-color: #276749;
}

.hero .secondary-btn {
  background-color: white;
  color: #2f855a;
  border: 2px solid #2f855a;
}

.hero .secondary-btn:hover {
  background-color: #f0fff4;
}

.hero img {
  margin-top: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

/* How It Works Section */
.how-it-works {
  background-color: #f0fff4; /* light green */
  padding: 80px 0;
  text-align: center;
}

.how-it-works h2 {
  color: #276749;
  font-size: 2.5rem;
  margin-bottom: 50px;
}

.steps {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

.step {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  width: 250px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.step:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.step .icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.step h3 {
  color: #2f855a;
  font-size: 1.25rem;
  margin-bottom: 10px;
}

/* Cards Section (Services + Why Choose Us) */
.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

.card {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  width: 250px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.card .icon {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #2f855a;
}

.card h3 {
  font-size: 1.25rem;
  margin-bottom: 10px;
}

.card p {
  font-size: 1rem;
}

/* CTA Section */
.cta {
  background-color: #2f855a;
  color: white;
  text-align: center;
  padding: 80px 0;
  margin-bottom: 0;
  overflow: hidden; /* 🔑 THIS removes the white space */
}


.cta h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: black;
}
.cta v {
  font-size: 0.9rem;
  margin-bottom: 40px;
  color: yellow;
}

.cta p {
  font-size: 1.25rem;
  margin-bottom: 30px;
}

.cta .primary-btn {
  background-color: white;
  color: #2f855a;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta .primary-btn:hover {
  background-color: #f0fff4;
}

/* Responsive */
@media (max-width: 768px) {
  .steps, .cards {
    flex-direction: column;
    align-items: center;
  }
}
.cta p:last-child {
  margin-bottom: 0;
}

</style>
