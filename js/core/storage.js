export const KEYS = {
  USERS:"rapzpedia_users", SCRIPTS:"rapzpedia_scripts", GAMES:"rapzpedia_games",
  SESSION:"rapzpedia_session", NOTIFICATIONS:"rapzpedia_notifications",
  SUPPORT:"rapzpedia_support", SETTINGS:"rapzpedia_settings",
  FAVORITES:"rapzpedia_favorites", HISTORY:"rapzpedia_history", REVIEWS:"rapzpedia_reviews", REPORTS:"rapzpedia_reports"
};
export const Storage = {
  get(key, fallback=null){try{const raw=localStorage.getItem(key);return raw===null?fallback:JSON.parse(raw)}catch{return fallback}},
  set(key,value){localStorage.setItem(key,JSON.stringify(value));return value},
  remove(key){localStorage.removeItem(key)},
  update(key, updater, fallback=[]){const next=updater(Storage.get(key,fallback));Storage.set(key,next);return next}
};
