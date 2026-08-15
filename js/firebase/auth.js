import { auth } from "./app.js";
import { db } from "./db.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

export const currentUser=()=>auth.currentUser;
export const watchAuth=(cb)=>onAuthStateChanged(auth,cb);
export const hashText=async(value)=>{const data=new TextEncoder().encode(value);const hash=await crypto.subtle.digest("SHA-256",data);return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("")};
export async function registerFirebase({username,whatsapp,email,password}){
  const cred=await createUserWithEmailAndPassword(auth,email.trim().toLowerCase(),password);
  await setDoc(doc(db,"users",cred.user.uid),{username:username.trim(),whatsapp:whatsapp.trim(),email:cred.user.email,role:"user",status:"active",bannedUntil:null,vip:{active:false,activatedAt:null,expiresAt:null},createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
  return cred.user;
}
export async function loginFirebase(email,password){return (await signInWithEmailAndPassword(auth,email.trim().toLowerCase(),password)).user;}
export async function logoutFirebase(){await signOut(auth);localStorage.removeItem("rapzpedia_session");location.href="../login.html";}
export async function userProfile(uid){const s=await getDoc(doc(db,"users",uid));return s.exists()?{id:s.id,...s.data()}:null;}
export async function adminProfile(uid){const s=await getDoc(doc(db,"admins",uid));return s.exists()?{id:s.id,...s.data()}:null;}
export async function saveAdminPin(uid,pin){await setDoc(doc(db,"admins",uid),{pinHash:await hashText(pin),role:"admin",updatedAt:serverTimestamp()},{merge:true});}
export async function verifyAdminPin(uid,pin){const a=await adminProfile(uid);return !!a&&a.role==="admin"&&a.pinHash===await hashText(pin);}
export async function changeFirebasePassword(newPassword){if(!auth.currentUser)throw new Error("Belum login.");await updatePassword(auth.currentUser,newPassword);}
export {auth};
