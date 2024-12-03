import { db } from "./config";
import { collection, addDoc, getDocs } from "firebase/firestore";

export async function addTestDoc() {
  const docRef = await addDoc(collection(db, "test"), { name: "Test User" });
  console.log("Document added with ID:", docRef.id);
}

export async function fetchTestDocs() {
  const querySnapshot = await getDocs(collection(db, "test"));
  querySnapshot.forEach((doc) => console.log(doc.id, "=>", doc.data()));
}