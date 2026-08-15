import {Storage,KEYS} from "../core/storage.js";
import {requireUser,logout,seed} from "../core/auth.js";
import {$,escapeHTML,formatDate,formatNumber,toast} from "../core/utils.js";
import {scriptCard} from "../components/card.js";
await seed();
const session=requireUser(); if(!session) throw 0;
let users=Storage.get(KEYS.USERS,[]);let user=users.find(u=>u.id===session.userId);if(!user){logout();throw 0}
const refreshUser=()=>{users=Storage.get(KEYS.USERS,[]);user=users.find(u=>u.id===session.userId)};
const expireVip=()=>{refreshUser();if(user?.vip?.active&&Date.now()>=user.vip.expiresAt){user.vip.active=false;user.vip.activatedAt=null;user.vip.expiresAt=null;Storage.set(KEYS.USERS,users)}};
expireVip();refreshUser();
$("#welcomeName").textContent=user.username;
const vipActive=()=>{refreshUser();return !!user?.vip?.active&&Date.now()<user.vip.expiresAt};
if(vipActive()) $("#vipBadge").classList.remove("hidden");
const games=Storage.get(KEYS.GAMES,[]);
games.forEach(g=>$("#gameFilter").insertAdjacentHTML("beforeend",`<option value="${escapeHTML(g.name)}">${escapeHTML(g.name)}</option>`));
function updateCategories(){const val=$("#gameFilter").value;$("#categoryFilter").innerHTML='<option value="">Semua kategori</option>';games.filter(g=>!val||g.name===val).forEach(g=>g.categories.forEach(c=>$("#categoryFilter").insertAdjacentHTML("beforeend",`<option value="${escapeHTML(c.name)}">${escapeHTML(c.name)}</option>`)))}
updateCategories();
let quick="all";
function getFavorites(){return Storage.get(KEYS.FAVORITES,[]).filter(x=>x.userId===user.id).map(x=>x.scriptId)}
function render(){
 let list=Storage.get(KEYS.SCRIPTS,[]);const q=$("#searchInput").value.toLowerCase().trim(),game=$("#gameFilter").value,cat=$("#categoryFilter").value;
 if(q)list=list.filter(s=>[s.name,s.game,s.category,s.subCategory,s.version,s.description,...(s.tags||[])].join(" ").toLowerCase().includes(q));
 if(game)list=list.filter(s=>s.game===game);if(cat)list=list.filter(s=>s.category===cat);
 if(quick!=="all"){if(quick==="vip")list=list.filter(s=>s.vipDownload?.enabled);else if(quick==="favorite")list=list.filter(s=>getFavorites().includes(s.id));else list=list.filter(s=>s.game===quick)}
 const sort=$("#sortFilter").value;const cmp={newest:(a,b)=>new Date(b.updatedAt||b.createdAt)-new Date(a.updatedAt||a.createdAt),oldest:(a,b)=>new Date(a.createdAt)-new Date(b.createdAt),mostLiked:(a,b)=>(b.likes||0)-(a.likes||0),leastLiked:(a,b)=>(a.likes||0)-(b.likes||0),mostViewed:(a,b)=>(b.views||0)-(a.views||0),leastViewed:(a,b)=>(a.views||0)-(b.views||0),mostDownloaded:(a,b)=>(b.downloads||0)-(a.downloads||0)}[sort];list.sort(cmp);
 $("#resultCount").textContent=`${list.length} script`;$("#scriptGrid").innerHTML=list.map((s,i)=>scriptCard(s,vipActive(),user.id).replace('reveal-card',`reveal-card`)).join("");$("#emptyState").classList.toggle("hidden",list.length>0);
 bindFavorites();renderHistory();renderSuggestions();
}
function bindFavorites(){document.querySelectorAll("[data-favorite]").forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();const id=btn.dataset.favorite;let favs=Storage.get(KEYS.FAVORITES,[]);const idx=favs.findIndex(x=>x.userId===user.id&&x.scriptId===id);if(idx>=0){favs.splice(idx,1);btn.classList.remove("active");btn.textContent="♡";toast("Dihapus dari favorit.")}else{favs.push({userId:user.id,scriptId:id,createdAt:new Date().toISOString()});btn.classList.add("active");btn.textContent="♥";toast("Ditambahkan ke favorit.")}Storage.set(KEYS.FAVORITES,favs);if(quick==="favorite")render()})}
function renderHistory(){const scripts=Storage.get(KEYS.SCRIPTS,[]),ids=Storage.get(KEYS.HISTORY,[]).filter(x=>x.userId===user.id).sort((a,b)=>new Date(b.at)-new Date(a.at)).slice(0,4);$("#historyRow").innerHTML=ids.length?ids.map(h=>{const s=scripts.find(x=>x.id===h.scriptId);if(!s)return"";return `<a class="history-card" href="detail.html?id=${encodeURIComponent(s.id)}"><span class="history-mark">${s.game==="Free Fire"?"FF":"ML"}</span><span><b>${escapeHTML(s.name)}</b><small>${escapeHTML(s.game)} · ${formatNumber(s.views)} views</small></span></a>`}).join(""):"<div class='muted'>Belum ada script yang dilihat.</div>"}
function renderSuggestions(){const q=$("#searchInput").value.trim().toLowerCase(),box=$("#searchSuggestions");if(!q){box.classList.add("hidden");return}const scripts=Storage.get(KEYS.SCRIPTS,[]),matches=[];scripts.forEach(s=>{if([s.name,s.game,s.category,s.subCategory,...(s.tags||[])].join(" ").toLowerCase().includes(q)&&matches.length<6)matches.push(s)});box.innerHTML=matches.map(s=>`<div class="suggestion" data-suggestion="${escapeHTML(s.name)}"><span>${escapeHTML(s.name)}<small>${escapeHTML(s.game)} · ${escapeHTML(s.category)}</small></span><b>→</b></div>`).join("")||`<div class="suggestion"><span>Tidak ada saran</span></div>`;box.classList.remove("hidden");box.querySelectorAll("[data-suggestion]").forEach(x=>x.onclick=()=>{$("#searchInput").value=x.dataset.suggestion;box.classList.add("hidden");render()})}
["searchInput","gameFilter","categoryFilter","sortFilter"].forEach(id=>$("#"+id).addEventListener("input",()=>{if(id==="gameFilter")updateCategories();render()}));
$("#searchInput").addEventListener("focus",renderSuggestions);$("#clearSearch").onclick=()=>{$("#searchInput").value="";render()};
$("#searchInput").addEventListener("input",()=>$("#clearSearch").classList.toggle("hidden",!$("#searchInput").value));
$("#resetFilters").onclick=()=>{$("#searchInput").value="";$("#gameFilter").value="";updateCategories();$("#categoryFilter").value="";$("#sortFilter").value="newest";quick="all";document.querySelectorAll(".quick-chip").forEach(x=>x.classList.toggle("active",x.dataset.quick==="all"));render()};
$("#emptyReset").onclick=()=>$("#resetFilters").click();
document.querySelectorAll(".quick-chip").forEach(ch=>ch.onclick=()=>{quick=ch.dataset.quick;document.querySelectorAll(".quick-chip").forEach(x=>x.classList.toggle("active",x===ch));render()});
$("#clearHistory").onclick=e=>{e.preventDefault();let h=Storage.get(KEYS.HISTORY,[]).filter(x=>x.userId!==user.id);Storage.set(KEYS.HISTORY,h);renderHistory();toast("Riwayat dihapus.")};
$("#logoutBtn").onclick=logout;$("#supportNav").onclick=()=>location.href="support.html";
const notifs=Storage.get(KEYS.NOTIFICATIONS,[]).filter(n=>n.userId===user.id);if(notifs.some(n=>!n.read)){$("#notifBadge").textContent=notifs.filter(n=>!n.read).length;$("#notifBadge").classList.remove("hidden")}
$("#notificationBtn").onclick=()=>{const p=$("#notificationPanel");p.classList.toggle("hidden");p.innerHTML=notifs.length?notifs.slice().reverse().map(n=>`<div class="notif-item"><b>${escapeHTML(n.title)}</b><small>${escapeHTML(n.message)}</small><em>${formatDate(n.createdAt)}</em></div>`).join(""):"<div class='notif-item'>Belum ada notifikasi.</div>";const all=Storage.get(KEYS.NOTIFICATIONS,[]);all.forEach(n=>{if(n.userId===user.id)n.read=true});Storage.set(KEYS.NOTIFICATIONS,all);$("#notifBadge").classList.add("hidden")};
document.addEventListener("click",e=>{if(!e.target.closest(".search-wrap"))$("#searchSuggestions").classList.add("hidden")});
render();
