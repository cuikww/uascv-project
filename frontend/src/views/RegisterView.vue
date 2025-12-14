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
  <div class="background">
    <div class="register">
      <h2>Register</h2>

      <form @submit.prevent="handleRegister">
        <input v-model="fullname" type="text" placeholder="Full name" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit" :disabled="!!passwordError">Register</button>
      </form>

      <div class="error-wrapper">
        <p class="error">{{ passwordError || msg || '\u00A0' }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background:
  linear-gradient(to top, white 50%, transparent 50%),
  linear-gradient(135deg, #5edbee, #77f582);
}

.register {
  background: white;
  padding: 80px;
  width: 1000px;
  max-width: 1000px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.register form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.register input {
  padding: 12px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
}

.register input:focus {
  border-color: #5edbee;
}

.register button {
  padding: 12px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  background: #5edbee;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.register button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.register button:hover {
  background: #45c9db;
}

.register p {
  margin-top: 15px;
  text-align: center;
}

.register h2 {
  text-align: center;
  font-size: 30px;
}

.error-wrapper {
  min-height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.error {
  color: red;
}

</style>