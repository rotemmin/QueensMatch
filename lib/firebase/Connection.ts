import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };


// import { db } from "./config";
// import { collection, addDoc, getDocs } from "firebase/firestore";

// export async function addTestDoc() {
//   const docRef = await addDoc(collection(db, "test"), { name: "Test User" });
//   console.log("Document added with ID:", docRef.id);
// }

// export async function fetchTestDocs() {
//   const querySnapshot = await getDocs(collection(db, "test"));
//   querySnapshot.forEach((doc) => console.log(doc.id, "=>", doc.data()));
// }