<template>
  <pre v-if="isAuthenticated">
    Welcome, {{user.name}}
    <button @click="logout">Log out</button>

    Would you like to visit your private page? 
    <button @click="redirectToUserPage">Yes please</button>
  </pre>
  <pre v-if="!isAuthenticated">
    <button @click="login">Log in</button>
  </pre>
  Would you like user pages to be private?
    <input
      id="accessCheckbox"
      type="checkbox"
      v-model="correctAccessControl"
    />
</template>
<script>
  import { useAuth0 } from '@auth0/auth0-vue';
  import { db } from '../firebase'
  import { addDoc, collection, where, getDocs, query,  } from "firebase/firestore"; 


  export default {
    data() {
      const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

      return {
        login: () => {
          loginWithRedirect();
        },
        logout: () => {
          logout({ logoutParams: { returnTo: window.location.origin } });
        },
        user,
        isAuthenticated,
        pathId: "",
        correctAccessControl: this.getAccessControl()
      };
    },
    created() {
      if (this.isAuthenticated) {
        this.submit();
      }
    },
    watch: {
      correctAccessControl(newValue) {
        localStorage.setItem("correctAccessContol", newValue);
      },
    },
    methods: {
      async submit() {
        try {
          if (await this.checkIfShouldAddUser()) {
            const numberOfUsers = await getDocs(collection(db, "users"));
            this.pathId = (numberOfUsers.size+1).toString()
            await addDoc(collection(db, "users"), {
              email: this.user.email,
              nickname: this.user.nickname,
              name: this.user.name,
              pathId: this.pathId
            });
          }
        } catch (e) {
          console.error(e);
        }
      },
      async redirectToUserPage() {
        if (await this.checkIfShouldAddUser()) {
          await this.submit()
        } 
        if (this.getAccessControl()) {
          this.$router.push('/user/' + await this.getUserDocId());
        } else {
          this.$router.push('/user/' + await this.getUserPathId());
        }
      },
      async checkIfShouldAddUser() {
        const userWithCurrentEmail = await getDocs(
            query(collection(db, "users"), where("email", "==", this.user.email))
        );
        return userWithCurrentEmail.size === 0
      },
      async getUserPathId() {
        const currentUserPathId = await getDocs(
            query(collection(db, "users"), where("email", "==", this.user.email))
        );
        return currentUserPathId.docs[0].data().pathId
      },
      async getUserDocId() {
        const currentUserPathId = await getDocs(
            query(collection(db, "users"), where("email", "==", this.user.email))
        );
        return currentUserPathId.docs[0].id
      },
      getAccessControl() {
          const accessControl = localStorage.getItem("correctAccessContol")
          return accessControl ? JSON.parse(accessControl) : false;
      }
    }
  };
</script>