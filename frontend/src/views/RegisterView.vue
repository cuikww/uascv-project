<script setup>
import { ref, computed } from "vue";
import { register } from "@/api/auth.js";
import { useRouter } from "vue-router";

const fullname = ref("");
const email = ref("");
const password = ref("");
const msg = ref("");

const router = useRouter();

const passwordError = computed(() => {
  if (!password.value || password.value.trim() === "")
    return "Password is Empty";
  if (password.value.length < 8)
    return "Minimum 8 Character";
  return "";
});

const handleRegister = async () => {
  if (password.value.length < 8) {
    msg.value = "8 Character Minimum";
    return;
  }

  try {
    await register({
      fullname: fullname.value,
      email: email.value,
      password: password.value,
    });

    msg.value = "Register success";
    router.push("/auth/login")
  } catch (err) {
    msg.value = err.response?.data?.message || "Error register";
  }
};
</script>

<template>
  <div class="page-background">
    <div class="card">
      <h2 class="card-title">Register</h2>

      <form class="form" @submit.prevent="handleRegister">
        <input v-model="fullname" placeholder="Full name" />
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />

        <button class="btn btn-primary":disabled="!!passwordError">
          Register
        </button>
      </form>

      <p class="error">{{ passwordError || msg }}</p>
    </div>
  </div>
</template>

<style scoped>
  /* isi kalo hanya ada di view ini */
</style>