import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createAuth0 } from '@auth0/auth0-vue';

const app = createApp(App);

app.use(
  createAuth0({
    domain: "dev-bn5n22yb0iicyuqr.us.auth0.com",
    clientId: "fnnLkEHVZHk3sqavCLf3T6IelsLJwz9N",
    authorizationParams: {
      redirect_uri: window.location.origin
    },
    cacheLocation: 'localstorage',
  })
);

app.use(router)

app.mount('#app');
