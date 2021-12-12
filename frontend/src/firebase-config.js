import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCESHxbty0WU1JLcxpVsvQbJsPNBPeoTxk",
  authDomain: "iotex-36fc9.firebaseapp.com",
  projectId: "iotex-36fc9",
  storageBucket: "iotex-36fc9.appspot.com",
  messagingSenderId: "234892928023",
  appId: "1:234892928023:web:eb418f40f087b9229aa852",
  measurementId: "G-MBLS875KBN"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);