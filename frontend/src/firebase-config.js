import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBM9uKKMpcDkxRxZTyXBSsrvOeCWKypmqQ",
  authDomain: "cns-domain.firebaseapp.com",
  databaseURL: "https://cns-domain-default-rtdb.firebaseio.com",
  projectId: "cns-domain",
  storageBucket: "cns-domain.appspot.com",
  messagingSenderId: "10089615313",
  appId: "1:10089615313:web:21a076cde26155d94a1af0",
  measurementId: "${config.measurementId}"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);