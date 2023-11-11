<template>
    <p v-if="error">
        Uh oh, seems like there's nothing here for you. 
    </p>
    <p v-else>
        Welcome {{ name }} ( {{ email }} )!
        This is your perfectly private page, don't worry about it. 
    </p>
</template>
  <script>
    import { useRoute } from 'vue-router'
    import { useAuth0 } from '@auth0/auth0-vue';
    import { db } from '../firebase'
    import { doc, getDoc, collection, where, getDocs, query,  } from "firebase/firestore";
  
    export default {
        data() {
            const { user, isAuthenticated } = useAuth0();
    
            return {
                user,
                isAuthenticated,
                name: "",
                email: "",
                error: false
            };
        },
        mounted() {
            const route = useRoute()
            this.id = route.params.id.trim()
            this.getData()
        },
        methods: {
            async getData() {
                if (this.getAccessControl()) {
                    this.getCorrectAccess()
                } else {
                    this.getBrokenAccess()
                }
            },
            async getBrokenAccess() {
                const userWithCurrentPathId = await getDocs(
                    query(collection(db, "users"), where("pathId", "==", this.id))
                )
                if (userWithCurrentPathId.size !== 0) {
                    let userData = userWithCurrentPathId.docs[0].data()
                    this.name = userData.name
                    this.email = userData.email
                    this.error = false
                } else {
                    this.error = true
                }
            },
            async getCorrectAccess() {
                try {
                    const userRef = doc(db, "users", this.id);
                    const userWithCurrentEmail = await getDoc(userRef);

                    if (userWithCurrentEmail.exists()) {
                        let userData = userWithCurrentEmail.data()
                        if (userData.email === this.user.email){
                            this.name = userData.name
                            this.email = userData.email
                            this.error = false
                        } else {
                            this.error = true
                        }
                    } else {
                        this.error = true
                    }
                } catch (error) {
                    this.error = true
                }
            },
            getAccessControl() {
                const accessControl = localStorage.getItem("correctAccessContol")
                return accessControl ? JSON.parse(accessControl) : false;
            }
        }
    };
  </script>