import {Storage,KEYS} from "./storage.js";
import {hash,uid,now,normalizePhone} from "./utils.js";
const ADMIN_EMAIL="admin@rapzpedia.local";
const ADMIN_PASSWORD="RapzAdmin@2026";
const ADMIN_PIN="2486";
export async function seed(){
  if(!Storage.get(KEYS.GAMES)){
    Storage.set(KEYS.GAMES,[
      {id:"free-fire",name:"Free Fire",icon:"FF",categories:[
        {id:"aimbot",name:"Aimbot",subCategories:[{id:"aim-assist",name:"Aim Assist"},{id:"headshot",name:"Headshot"}]},
        {id:"visual",name:"Visual",subCategories:[{id:"esp",name:"ESP"},{id:"box",name:"Box"}]}
      ]},
      {id:"mobile-legends",name:"Mobile Legends",icon:"ML",categories:[
        {id:"visual",name:"Visual",subCategories:[{id:"map",name:"Map"},{id:"skin",name:"Skin"}]},
        {id:"utility",name:"Utility",subCategories:[{id:"tools",name:"Tools"}]}
      ]}
    ]);
  }
  if(!Storage.get(KEYS.SCRIPTS)){
    Storage.set(KEYS.SCRIPTS,[
      {id:"SCR-DEMO-001",name:"Ultra Aim V1",game:"Free Fire",gameId:"free-fire",category:"Aimbot",categoryId:"aimbot",subCategory:"Aim Assist",subCategoryId:"aim-assist",size:"12 MB",version:"1.5.0",description:"Contoh postingan script untuk demonstrasi dashboard.",thumbnail:"",tags:["Aimbot","Aim Assist","Latest"],downloads:430,freeDownload:{enabled:true,name:"Download Free",url:"https://example.com/free"},vipDownload:{enabled:true,name:"Download VIP",url:"https://example.com/vip"},likes:128,views:1240,createdAt:now(),updatedAt:now()},
      {id:"SCR-DEMO-002",name:"Vision Pack",game:"Mobile Legends",gameId:"mobile-legends",category:"Visual",categoryId:"visual",subCategory:"Map",subCategoryId:"map",size:"8 MB",version:"2.0.1",description:"Contoh postingan Mobile Legends.",thumbnail:"",tags:["Visual","Map","Updated"],downloads:210,freeDownload:{enabled:true,name:"Download Free",url:"https://example.com/free"},vipDownload:{enabled:false,name:"Download VIP",url:""},likes:76,views:830,createdAt:new Date(Date.now()-86400000*3).toISOString(),updatedAt:now()}
    ]);
  }
  if(!Storage.get(KEYS.USERS)) Storage.set(KEYS.USERS,[]);
  if(!Storage.get(KEYS.NOTIFICATIONS)) Storage.set(KEYS.NOTIFICATIONS,[]);
  if(!Storage.get(KEYS.SUPPORT)) Storage.set(KEYS.SUPPORT,[]);
  return {ADMIN_EMAIL,ADMIN_PASSWORD,ADMIN_PIN};
}
export async function registerUser(data){
  const users=Storage.get(KEYS.USERS,[]);
  if(users.some(u=>u.email.toLowerCase()===data.email.toLowerCase())) throw new Error("Email sudah terdaftar.");
  if(users.some(u=>u.username.toLowerCase()===data.username.toLowerCase())) throw new Error("Username sudah digunakan.");
  const user={id:uid("USR"),username:data.username.trim(),whatsapp:normalizePhone(data.whatsapp),email:data.email.trim().toLowerCase(),passwordHash:await hash(data.password),role:"user",status:"active",bannedUntil:null,vip:{active:false,activatedAt:null,expiresAt:null},createdAt:now(),updatedAt:now()};
  users.push(user);Storage.set(KEYS.USERS,users);return user;
}
export async function authenticate(email,password){
  await seed(); const normalized=email.trim().toLowerCase();
  if(normalized===ADMIN_EMAIL && password===ADMIN_PASSWORD) return {type:"admin",email:ADMIN_EMAIL};
  const users=Storage.get(KEYS.USERS,[]);const hp=await hash(password);const user=users.find(u=>u.email===normalized&&u.passwordHash===hp);
  if(!user) throw new Error("Email atau password salah.");
  if(user.status==="banned" && (user.bannedUntil===null || Date.now()<user.bannedUntil)) throw new Error("Akun sedang dibanned.");
  if(user.status==="banned" && user.bannedUntil && Date.now()>=user.bannedUntil){user.status="active";user.bannedUntil=null;Storage.set(KEYS.USERS,users)}
  return {type:"user",user};
}
export function setSession(session){Storage.set(KEYS.SESSION,session)}
export function getSession(){return Storage.get(KEYS.SESSION)}
export function logout(){Storage.remove(KEYS.SESSION);location.href="../login.html"}
export function requireUser(){const s=getSession();if(!s||s.type!=="user"){location.href="../login.html";return null}return s}
export function requireAdmin(){const s=getSession();if(!s||s.type!=="admin"){location.href="../login.html";return null}return s}
export async function changePassword(userId,oldPass,newPass){
  const users=Storage.get(KEYS.USERS,[]),u=users.find(x=>x.id===userId);if(!u)throw new Error("User tidak ditemukan.");
  if(u.passwordHash!==await hash(oldPass))throw new Error("Password lama salah.");
  u.passwordHash=await hash(newPass);u.updatedAt=now();Storage.set(KEYS.USERS,users);
}