const USERS_KEY="gch_users";const SESSION_KEY="gch_session";
const defaultUsers=[{id:"u1",username:"admin",password:"admin123",role:"admin",name:"Administrator",active:true},{id:"u2",username:"user",password:"user123",role:"user",name:"Demo User",active:true}];
if(!Storage.get(USERS_KEY))Storage.set(USERS_KEY,defaultUsers);
function currentUser(){return Storage.get(SESSION_KEY)}
function requireAuth(role=null){const u=currentUser();if(!u){location.href="../login.html";return null}if(role&&u.role!==role){location.href="../user/dashboard.html";return null}return u}
function logout(){Storage.remove(SESSION_KEY);location.href="../login.html"}
document.getElementById("loginForm")?.addEventListener("submit",e=>{e.preventDefault();const un=username.value.trim(),pw=password.value;const u=Storage.get(USERS_KEY,[]).find(x=>x.username===un&&x.password===pw&&x.active);if(!u){msg.textContent="Username/password salah atau akun nonaktif.";return}Storage.set(SESSION_KEY,u);location.href=u.role==="admin"?"admin/dashboard.html":"user/dashboard.html"});