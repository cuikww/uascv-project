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
  <div class="background">
    <div class="login">
      <h2>Login</h2>

      <form @submit.prevent="handleLogin" novalidate>
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>

      <div class="error-wrapper">
        <p v-if="msg" class="error">{{ msg }}</p>
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

.login {
  background: white;
  padding: 80px;
  width: 1000px;
  max-width: 1000px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.login form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.login input {
  padding: 12px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
}

.login input:focus {
  border-color: #5edbee;
}

.login button {
  padding: 12px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  background: #5edbee;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.login button:hover {
  background: #45c9db;
}

.login p {
  margin-top: 15px;
  text-align: center;
}

.login h2 {
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