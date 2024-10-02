<template>
  <div class="login">
      <h1>Login</h1>
      <div class="form-login">
            <form>
                <input type="text" v-model="user.email" placeholder="E-mail"/><br><br>
                <input type="email" v-model="user.password" placeholder="password"/><br><br>
                <button @click.prevent="fazerLogin" :disabled="isLoading">
                <span v-if="isLoading" class="spinner"></span>
                <span v-if="isLoading"> Carregando...</span>
                <span v-else>Login</span></button>
            </form>
        </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data(){
    return{
      user:{
        email:'',
        password:'',
      }
    }
  },
  methods:{
    fazerLogin(){

    }
  }
}
</script>
