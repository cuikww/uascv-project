<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { isLoggedIn } from "@/stores/auth.js";

const menuOpen = ref(false);
const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  isLoggedIn.value = false;
  router.push("/auth/login");
};
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">

      <!-- Logo -->
      <div class="nav-logo">
        <router-link to="/">UASCV</router-link>
      </div>

      <!-- Hamburger (Mobile) -->
      <div class="nav-hamburger" @click="menuOpen = !menuOpen">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <!-- Menu -->
      <ul :class="['nav-menu', { 'active': menuOpen }]">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <template v-if="!isLoggedIn">
          <li><router-link to="/auth/login">Login</router-link></li>
          <li><router-link to="/auth/register">Register</router-link></li>
        </template>
        <template v-else>
          <li><router-link to="/onboarding">Onboarding</router-link></li>
          <li><a href="#" @click.prevent="logout">Logout</a></li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: static;
  top: 0;
  left: 0;
  width: 100%;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: space-between; 
  padding: 12px 40px;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.nav-container {
  width: 95%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo a {
  font-size: 1.4rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}

/* Menu Desktop */
.nav-menu {
  display: flex;
  gap: 25px;
  list-style: none;
  transition: 0.3s ease;
}

.nav-menu li a {
  font-size: 1rem;
  text-decoration: none;
  color: #fff;
  font-weight: 500;
  padding: 5px 0;
  position: relative;
}

.nav-menu li a::after {
  content: "";
  width: 0%;
  height: 2px;
  background: #fff;
  position: absolute;
  bottom: -3px;
  left: 0;
  transition: 0.3s;
}

.nav-menu li a:hover::after {
  width: 100%;
}

/* Mobile */
.nav-hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 4px;
}

.nav-hamburger span {
  width: 25px;
  height: 3px;
  background: #fff;
  transition: 0.3s;
}

@media (max-width: 768px) {
  .nav-hamburger {
    display: flex;
  }

  .nav-menu {
    position: absolute;
    top: 65px;
    right: 0;
    width: 200px;
    background: #fff;
    flex-direction: column;
    padding: 15px;
    gap: 15px;
    opacity: 0;
    pointer-events: none;
    transform: translateY(-10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .nav-menu li a {
    color: #333;
  }

  .nav-menu li a::after {
    background: #333;
  }

  .nav-menu.active {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }
}
</style>
