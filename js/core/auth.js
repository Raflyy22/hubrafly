import {Storage,KEYS} from "./storage.js";
import {registerFirebase,loginFirebase,logoutFirebase,userProfile,adminProfile,verifyAdminPin,changeFirebasePassword} from "../firebase/auth.js";
export async function seed(){return {firebase:true};}
export async function registerUser(data){return registerFirebase(data);}
export async function authenticate(email,password){
  const u=await loginFirebase(email,password);
  const [profile,admin]=await Promise.all([userProfile(u.uid),adminProfile(u.uid)]);
  if(admin?.role==="admin") return {type:"admin",uid:u.uid,email:u.email,admin};
  if(!profile) throw new Error("Profil akun tidak ditemukan.");
  if(profile.status==="banned"&&(profile.bannedUntil===null||Date.now()<profile.bannedUntil)) throw new Error("Akun sedang dibanned.");
  if(profile.status==="banned"&&profile.bannedUntil&&Date.now()>=profile.bannedUntil){await import("../firebase/db.js").then(m=>m.updateDoc(m.doc(m.db,"users",u.uid),{status:"active",bannedUntil:null}));profile.status="active";}
  return {type:"user",user:{...profile,uid:u.uid}};
}
export function setSession(s){Storage.set(KEYS.SESSION,s)}
export function getSession(){return Storage.get(KEYS.SESSION)}
export async function logout(){await logoutFirebase()}
export function requireUser(){const s=getSession();if(!s||s.type!=="user"){location.href="../login.html";return null}return s}
export function requireAdmin(){const s=getSession();if(!s||s.type!=="admin"){location.href="../login.html";return null}return s}
export async function changePassword(userId,oldPass,newPass){
  const {auth}=await import("../firebase/auth.js");
  const {EmailAuthProvider,reauthenticateWithCredential}=await import("https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js");
  if(!auth.currentUser||auth.currentUser.uid!==userId)throw new Error("Sesi login tidak valid.");
  await reauthenticateWithCredential(auth.currentUser,EmailAuthProvider.credential(auth.currentUser.email,oldPass));
  await changeFirebasePassword(newPass);
}
