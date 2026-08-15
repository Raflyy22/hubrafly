import {escapeHTML,formatNumber,formatDate} from "../core/utils.js";
import {Storage,KEYS} from "../core/storage.js";
export function isFavorite(id,userId){return Storage.get(KEYS.FAVORITES,[]).some(x=>x.userId===userId&&x.scriptId===id)}
export function scriptCard(s,isVip=false,userId=""){
 const fav=isFavorite(s.id,userId);
 return `<article class="script-card glass reveal-card">
   <div class="script-cover ${s.gameId||''}">
     <div class="cover-orb"></div><div class="script-game-mark">${escapeHTML(s.game==="Free Fire"?"FF":"ML")}</div>
     <span class="game-label">${escapeHTML(s.game)}</span>${s.vipDownload?.enabled?'<span class="vip-tag">✦ VIP</span>':''}
     <button class="card-fav ${fav?'active':''}" data-favorite="${escapeHTML(s.id)}" aria-label="Favorite">${fav?'♥':'♡'}</button>
   </div>
   <div class="script-body">
     <div class="script-meta"><span>${escapeHTML(s.category)}</span><i>•</i><span>${escapeHTML(s.subCategory)}</span></div>
     <h3>${escapeHTML(s.name)}</h3><p>${escapeHTML(s.description||"Tidak ada deskripsi.")}</p>
     <div class="script-tags"><span>#${escapeHTML((s.subCategory||s.category||'script').replace(/\s+/g,''))}</span><span>v${escapeHTML(s.version)}</span></div>
     <div class="script-stats"><span>♥ ${formatNumber(s.likes)}</span><span>◉ ${formatNumber(s.views)}</span><span>↧ ${formatNumber(s.downloads||0)}</span></div>
     <div class="card-footer"><small>Diperbarui ${formatDate(s.updatedAt||s.createdAt)}</small><a class="btn btn-ghost" href="detail.html?id=${encodeURIComponent(s.id)}">Detail <span>→</span></a></div>
   </div>
 </article>`
}
