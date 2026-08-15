# Rapzpedia V4 — Admin System + Firebase

Upgrade V3 → V4 dengan Firebase Authentication + Cloud Firestore.

## Fitur V4
- Firebase Email/Password Authentication
- Admin role berbasis `admins/{uid}`
- Admin PIN hash
- Dashboard analytics
- User management
- Ban 7/14/30/99 hari
- Permanent ban
- Reset account
- VIP 30 hari
- Script CRUD Firestore
- Script enable/disable
- Featured
- Multi download links
- Games/category manager
- Report moderation
- Realtime support via Firestore `onSnapshot`
- Admin PIN change
- Firestore security rules
- Storage rules untuk attachment/script

## Konfigurasi
Lihat `firebase/setup.md` lalu isi `js/firebase/config.js`.

> Firebase config web boleh berada di frontend. Yang tidak boleh dipublikasikan adalah service-account private key/secret backend.

## Catatan arsitektur
V4 sudah memindahkan autentikasi utama dan admin data ke Firebase. Beberapa halaman V3 lama masih memiliki state UI LocalStorage seperti favorite/history. Pada V5 kita dapat memindahkan seluruh user data, VIP, favorite, history, notification, support, dan download tracking ke Firestore sehingga lintas perangkat.
