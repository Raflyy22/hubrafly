export const $=(s,r=document)=>r.querySelector(s);
export const $$=(s,r=document)=>[...r.querySelectorAll(s)];
export const uid=(prefix="ID")=>`${prefix}-${crypto.randomUUID?crypto.randomUUID().slice(0,8).toUpperCase():Date.now()}`;
export const now=()=>new Date().toISOString();
export const escapeHTML=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
export const formatDate=iso=>new Intl.DateTimeFormat("id-ID",{dateStyle:"medium"}).format(new Date(iso));
export const formatNumber=n=>new Intl.NumberFormat("id-ID",{notation:"compact",maximumFractionDigits:1}).format(n||0);
export function toast(message,type="success"){const c=$("#toastContainer")||document.body;const e=document.createElement("div");e.className=`toast ${type}`;e.textContent=message;c.appendChild(e);setTimeout(()=>e.remove(),3200)}
export async function hash(value){const data=new TextEncoder().encode(value);const digest=await crypto.subtle.digest("SHA-256",data);return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,"0")).join("")}
export function emailValid(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
export function normalizePhone(v){return v.replace(/[^\d+]/g,"").replace(/^0/,"62")}
export function qsParam(k){return new URLSearchParams(location.search).get(k)}
export function redirect(path){location.href=path}
