<script>
export default {
  name: "Home"
};
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Selamat Datang di UASCV</h1>
        <p>Platform Membuat CV.</p>

        <div class="hero-buttons">
          <router-link to="/auth/login" class="btn btn-primary">Login</router-link>
          <router-link to="/auth/register" class="btn btn-primary">Register</router-link>
        </div>
      </div>
    </section>


    <!-- Features Section -->
    <section class="features">
      <h2>Fitur Utama</h2>

      <div class="features-grid">
        <div class="feature-card">
          <h3>CV</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>

        <div class="feature-card">
          <h3>AI</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
}

/* Hero Section */
.hero {
  width: 100%;
  min-height: 60vh;
  display: flex;
  justify-content: center;  /* tengah horizontal */
  align-items: center;       /* tengah vertical */
  background: linear-gradient(135deg, #5edbee, #77f582);
}

.hero-content {
  text-align: center;
  max-width: 600px;
  padding: 2rem;
  color: white;
}

.hero h1 {
  font-size: 48px;
  font-weight: 700;
}

.hero p {
  font-size: 18px;
  margin-top: 10px;
  opacity: 0.9;
}

.hero-buttons {
  margin-top: 30px;
}

.btn {
  padding: 12px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 16px;
  margin: 0 10px;
  transition: 0.25s ease;
}

.btn-primary {
  background: white;
  color: #47d152;
  font-weight: bold;
}

.btn-primary:hover {
  background: #e9ffeb;
}

.btn-outline {
  border: 2px solid white;
  color: white;
}

.btn-outline:hover {
  background: white;
  color: #5edbee;
}

/* Features Section */
.features {
  padding: 60px 20px 80px;
}

.features h2 {
  font-size: 32px;
  margin-bottom: 40px;
  text-align: center;
}

.features-grid {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.feature-card {
  background: #ffffff;
  width: 280px;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: 0.25s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #47d152;
}
</style>