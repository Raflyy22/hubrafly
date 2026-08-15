import { db } from "./app.js";
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, orderBy, limit, where, onSnapshot, serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
export { db, collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, orderBy, limit, where, onSnapshot, serverTimestamp, increment };
export const ref = (name,id)=>id?doc(db,name,id):collection(db,name);
export const readDoc = async (name,id)=>{const s=await getDoc(doc(db,name,id));return s.exists()?{id:s.id,...s.data()}:null};
export const writeDoc = (name,id,data)=>setDoc(doc(db,name,id),data,{merge:true});
export const removeDoc = (name,id)=>deleteDoc(doc(db,name,id));
