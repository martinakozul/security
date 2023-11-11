import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBpd3EjwlF_mL-tHfXKWXiFkgwuMVPDT_o",
    authDomain: "security-387f9.firebaseapp.com",
    projectId: "security-387f9",
    storageBucket: "security-387f9.appspot.com",
    messagingSenderId: "795529375568",
    appId: "1:795529375568:web:12141e203f7f9f4423c655"
};
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export { db }