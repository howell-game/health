<template>
  <div class="about-page">
    <section class="hero">
      <div class="container">
        <h1>About Home Healthcare</h1>
        <p>
          Home Healthcare connects families and individuals with licensed nurses and physiotherapists
          for safe, reliable home healthcare services. Our goal is to make professional care
          accessible, convenient, and trustworthy.
        </p>
      </div>
    </section>

    <section class="mission-vision">
      <div class="container">
        <h2>Our Mission</h2>
        <p>
          To provide safe, professional, and compassionate home healthcare services by connecting
          clients with qualified providers in their local area.
        </p>

        <h2>Our Vision</h2>
        <p>
          To be the most trusted platform for home healthcare, ensuring comfort, safety, and
          quality care for every patient.
        </p>
      </div>
    </section>

    <section class="values">
      <div class="container">
        <h2>Our Core Values</h2>
        <div class="value-cards">
          <div class="card">
            <h3>Professionalism</h3>
            <p>We partner with licensed healthcare providers who adhere to the highest standards of care.</p>
          </div>
          <div class="card">
            <h3>Trust & Safety</h3>
            <p>All providers are verified, and we encourage secure interactions within our platform.</p>
          </div>
          <div class="card">
            <h3>Compassion</h3>
            <p>We prioritize the comfort and well-being of our patients in every service we facilitate.</p>
          </div>
          <div class="card">
            <h3>Innovation</h3>
            <p>Using technology to simplify access to home healthcare and enhance user experience.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="team">
      <div class="container">
        <h2>Meet Our Team</h2>
        <p>
          Our team consists of experienced developers, healthcare enthusiasts, and customer service
          specialists who are dedicated to improving home healthcare experiences.
        </p>
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <h2>Join Our Community</h2>
        <p>
          Whether you're a client seeking care or a provider offering services, Home Healthcare makes it
          easy to connect and deliver quality care.
        </p>
        <router-link to="/signup">
          <button class="primary-btn">Get Started</button>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-page {
  font-family: Arial, sans-serif;
  color: #333;
  line-height: 1.6;
}

/* Hero */
.hero {
  background-color: #f0fff4;
  text-align: center;
  padding: 60px 20px;
}

.hero h1 {
  color: #1e7f43;
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.hero p {
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto;
}

/* Mission & Vision */
.mission-vision {
  padding: 60px 20px;
  text-align: center;
}

.mission-vision h2 {
  color: #166534;
  font-size: 2rem;
  margin-bottom: 15px;
}

.mission-vision p {
  max-width: 700px;
  margin: 0 auto 30px;
}

/* Values Section */
.values {
  background-color: #f9f9f9;
  padding: 60px 20px;
}

.value-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 30px;
}

.card {
  background: white;
  padding: 30px 20px;
  width: 250px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.card h3 {
  color: #1e7f43;
  margin-bottom: 10px;
}

.card p {
  font-size: 0.95rem;
  color: #555;
}

/* Team */
.team {
  padding: 60px 20px;
  text-align: center;
}

.team h2 {
  color: #166534;
  font-size: 2rem;
  margin-bottom: 15px;
}

.team p {
  max-width: 700px;
  margin: 0 auto;
}

/* CTA */
.cta {
  background-color: #1e7f43;
  color: white;
  text-align: center;
  padding: 60px 20px;
}

.cta h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.cta p {
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.cta .primary-btn {
  background-color: white;
  color: #1e7f43;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta .primary-btn:hover {
  background-color: #c7e1d1;
}

/* Responsive */
@media (max-width: 768px) {
  .value-cards {
    flex-direction: column;
    align-items: center;
  }
}
</style>
