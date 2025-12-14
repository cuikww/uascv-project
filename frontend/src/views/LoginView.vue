<script setup>
import { ref } from "vue";
import { login } from "@/api/auth.js";
import { useRouter } from "vue-router";
import { isLoggedIn } from "@/stores/auth.js";

const email = ref("");
const password = ref("");
const msg = ref("");

const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await login({
      email: email.value,
      password: password.value,
    });

    // simpan token
    localStorage.setItem("token", response.data.token);
    isLoggedIn.value = true;

    msg.value = "Login success!";
    router.push("/onboarding")
  } catch (err) {
    msg.value = err.response?.data?.message || "Wrong Email or password";
  }
};
</script>

<template>
  <div class="page-background">
    <div class="card">
      <h2 class="card-title">Login</h2>

      <form class="form" @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />

        <button class="btn btn-primary">Login</button>
      </form>

      <p v-if="msg" class="error">{{ msg }}</p>
    </div>
  </div>
</template>

<style scoped>
  /* isi kalo hanya ada di view ini */
</style>