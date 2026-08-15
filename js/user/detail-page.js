import {Storage,KEYS} from "../core/storage.js";
import {requireUser,seed} from "../core/auth.js";
import {$,escapeHTML,formatNumber,formatDate,toast} from "../core/utils.js";
await seed(); const session=requireUser();if(!session)throw 0;
const id=new URLSearchParams(location.search).get("id"),scripts=Storage.get(KEYS.SCRIPTS,[]),s=scripts.find(x=>x.id===id);
if(!s){$("#detailContent").innerHTML="<div class='empty-state'>Script tidak ditemukan.</div>";throw 0}
const users=Storage.get(KEYS.USERS,[]),user=users.find(x=>x.id===session.userId);
const expireVip=()=>{if(user?.vip?.active&&Date.now()>=user.vip.expiresAt){user.vip={active:false,activatedAt:null,expiresAt:null};const us=Storage.get(KEYS.USERS,[]);const i=us.findIndex(x=>x.id===user.id);if(i>=0){us[i]=user;Storage.set(KEYS.USERS,us)}}};
expireVip();const vipActive=!!user?.vip?.active&&Date.now()<user.vip.expiresAt;
s.views=(s.views||0)+1;s.lastViewedAt=new Date().toISOString();Storage.set(KEYS.SCRIPTS,scripts);
let history=Storage.get(KEYS.HISTORY,[]).filter(x=>!(x.userId===user.id&&x.scriptId===s.id));history.unshift({userId:user.id,scriptId:s.id,at:new Date().toISOString()});Storage.set(KEYS.HISTORY,history.slice(0,50));
document.title=`${s.name} — Rapzpedia`;
const favs=Storage.get(KEYS.FAVORITES,[]),liked=favs.some(x=>x.userId===user.id&&x.scriptId===s.id);
const reviews=Storage.get(KEYS.REVIEWS,[]).filter(r=>r.scriptId===s.id),myReview=reviews.find(r=>r.userId===user.id);
const related=scripts.filter(x=>x.id!==s.id&&(x.game===s.game||x.category===s.category)).sort((a,b)=>(b.downloads||0)-(a.downloads||0)).slice(0,4);
const statusMap={working:["WORKING","status-working"],updating:["UPDATING","status-updating"],broken:["BROKEN","status-broken"],coming_soon:["COMING SOON","status-coming"]},st=statusMap[s.status]||statusMap.working;
const avg=reviews.length?reviews.reduce((a,r)=>a+r.rating,0)/reviews.length:Number(s.rating||0);
const links=[...(s.downloadLinks||[])];
if(!links.length){
 if(s.freeDownload?.url)links.push({id:"free",type:"free",name:s.freeDownload.name||"Download Free",url:s.freeDownload.url});
 if(s.vipDownload?.url)links.push({id:"vip",type:"vip",name:s.vipDownload.name||"Download VIP",url:s.vipDownload.url});
}
const linkHtml=links.map(l=>{const isVip=l.type==="vip";return `<a class="btn ${isVip?'btn-vip':'btn-primary'} download-link" data-link="${escapeHTML(l.id||l.name)}" data-vip="${isVip}" href="${escapeHTML(l.url)}" target="_blank" rel="noopener">${escapeHTML(l.name)} ${isVip?"✦":"↧"}</a>`}).join("");
$("#detailContent").innerHTML=`<div class="detail-breadcrumb"><a href="user.html">Beranda</a><span>/</span><span>${escapeHTML(s.game)}</span><span>/</span><b>${escapeHTML(s.name)}</b></div>
<div class="detail-layout"><div><div class="detail-cover ${s.gameId}"><div class="detail-game-mark">${s.game==="Free Fire"?"FF":"ML"}</div><span class="detail-cover-label">${escapeHTML(s.game)} · ${st[0]}</span></div><div class="detail-side-meta glass"><div><span>Ukuran</span><b>${escapeHTML(s.size||"-")}</b></div><div><span>Versi</span><b>${escapeHTML(s.version||"-")}</b></div><div><span>Update</span><b>${formatDate(s.updatedAt||s.createdAt)}</b></div></div></div>
<article class="detail-content"><div class="eyebrow">${escapeHTML(s.game)} · ${escapeHTML(s.category)} · ${escapeHTML(s.subCategory)} <span class="status-inline ${st[1]}">${st[0]}</span></div><h1>${escapeHTML(s.name)}</h1>
<div class="detail-tags">${(s.tags||[s.category,s.subCategory]).map(t=>`<span>#${escapeHTML(t)}</span>`).join("")}</div>
<div class="detail-stats"><span>♥ ${formatNumber(s.likes)}</span><span>◉ ${formatNumber(s.views)}</span><span>↧ ${formatNumber(s.downloads||0)}</span><span>★ ${avg.toFixed(1)} (${reviews.length})</span><span>v${escapeHTML(s.version||"-")}</span></div>
<p class="detail-description">${escapeHTML(s.description||"Tidak ada deskripsi.")}</p>
${s.changelog?`<div class="changelog glass"><h3>What's New</h3><pre>${escapeHTML(s.changelog)}</pre></div>`:""}
<div class="detail-actions"><button id="likeBtn" class="btn btn-ghost">${liked?'♥':'♡'} Suka (${formatNumber(s.likes)})</button><button id="favoriteBtn" class="btn btn-ghost">${favs.some(x=>x.userId===user.id&&x.scriptId===s.id)?'♥':'♡'} Favorit</button><button id="shareInner" class="btn btn-ghost">↗ Bagikan</button><button id="reportBtn" class="btn btn-ghost danger-outline">⚑ Laporkan</button></div>
<div class="download-box glass"><div><b>Download Center</b><small>${links.length} link tersedia · ${vipActive?"Akun VIP aktif":"Akun Free"}</small></div><div class="download-buttons">${linkHtml||"<span class='muted'>Link download belum tersedia.</span>"}</div></div>
${!vipActive&&links.some(l=>l.type==="vip")?'<div class="vip-note">✦ Link VIP membutuhkan VIP aktif dan bebas iklan.</div>':''}
</article></div>
<section class="review-section"><div class="section-title"><div><span class="mini-label">COMMUNITY</span><h2>Rating & Review</h2></div><strong>★ ${avg.toFixed(1)}</strong></div>
<form id="reviewForm" class="review-form glass"><div class="star-picker">${[1,2,3,4,5].map(n=>`<button type="button" data-rating="${n}" class="${myReview?.rating>=n?'active':''}">★</button>`).join("")}</div><textarea id="reviewText" maxlength="500" placeholder="Bagikan pengalamanmu...">${escapeHTML(myReview?.text||"")}</textarea><button class="btn btn-primary">Kirim Review</button></form>
<div id="reviewsList" class="reviews-list">${reviews.length?reviews.slice().reverse().map(r=>`<article class="review-card glass"><div><b>${escapeHTML(r.username)}</b><span>★ ${r.rating}</span></div><p>${escapeHTML(r.text)}</p><small>${formatDate(r.createdAt)}</small></article>`).join(""):"<div class='empty-state'>Belum ada review.</div>"}</div></section>
${related.length?`<section class="related-section"><div class="section-title"><div><span class="mini-label">MORE LIKE THIS</span><h2>Script terkait</h2></div></div><div class="related-grid">${related.map(r=>`<a class="related-card glass" href="detail.html?id=${encodeURIComponent(r.id)}"><span class="related-mark">${r.game==="Free Fire"?'FF':'ML'}</span><span><b>${escapeHTML(r.name)}</b><small>${escapeHTML(r.game)} · ${formatNumber(r.downloads||0)} downloads</small></span><strong>→</strong></a>`).join('')}</div></section>`:""}`;
let selectedRating=myReview?.rating||0;
document.querySelectorAll("[data-rating]").forEach(b=>b.onclick=()=>{selectedRating=Number(b.dataset.rating);document.querySelectorAll("[data-rating]").forEach(x=>x.classList.toggle("active",Number(x.dataset.rating)<=selectedRating))});
$("#reviewForm").onsubmit=e=>{e.preventDefault();if(!selectedRating)return toast("Pilih rating terlebih dahulu.","error");const text=$("#reviewText").value.trim();if(!text)return toast("Tulis review terlebih dahulu.","error");let all=Storage.get(KEYS.REVIEWS,[]);const obj={id:myReview?.id||crypto.randomUUID(),scriptId:s.id,userId:user.id,username:user.username,rating:selectedRating,text,createdAt:myReview?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};all=all.filter(r=>!(r.scriptId===s.id&&r.userId===user.id));all.push(obj);Storage.set(KEYS.REVIEWS,all);toast("Review disimpan.");location.reload()};
function share(){const url=location.href;if(navigator.share)navigator.share({title:s.name,text:`${s.name} — ${s.game}`,url}).catch(()=>{});else navigator.clipboard?.writeText(url).then(()=>toast("URL postingan disalin."))}
$("#shareBtn").onclick=share;$("#shareInner").onclick=share;
$("#likeBtn").onclick=()=>{s.likes=(s.likes||0)+1;Storage.set(KEYS.SCRIPTS,scripts);$("#likeBtn").textContent=`♥ Suka (${formatNumber(s.likes)})`;toast("Like ditambahkan.")};
$("#favoriteBtn").onclick=()=>{let f=Storage.get(KEYS.FAVORITES,[]);const i=f.findIndex(x=>x.userId===user.id&&x.scriptId===s.id);if(i>=0){f.splice(i,1);$("#favoriteBtn").textContent="♡ Favorit";toast("Dihapus dari favorit.")}else{f.push({userId:user.id,scriptId:s.id,createdAt:new Date().toISOString()});$("#favoriteBtn").textContent="♥ Favorit";toast("Ditambahkan ke favorit.")}Storage.set(KEYS.FAVORITES,f)};
document.querySelectorAll(".download-link").forEach(a=>a.addEventListener("click",e=>{if(a.dataset.vip==="true"&&!vipActive){e.preventDefault();toast("Akses VIP belum aktif.","error");return}s.downloads=(s.downloads||0)+1;Storage.set(KEYS.SCRIPTS,scripts)}));
$("#reportBtn").onclick=()=>{const reason=prompt("Alasan laporan (link rusak, tidak bekerja, salah kategori, dll):");if(!reason?.trim())return;const reports=Storage.get(KEYS.REPORTS,[]);reports.push({id:crypto.randomUUID(),scriptId:s.id,userId:user.id,username:user.username,reason:reason.trim(),status:"pending",createdAt:new Date().toISOString()});Storage.set(KEYS.REPORTS,reports);toast("Laporan dikirim ke admin.")};
