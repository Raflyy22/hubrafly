# Rapzpedia V4 — Firebase Setup

V4 mengalihkan autentikasi dan data admin ke Firebase Authentication + Cloud Firestore. Firebase Web SDK modular browser modules digunakan agar project tetap dapat dideploy sebagai static site di Netlify.

## 1. Buat project Firebase

Firebase Console → Add project → buat project baru.

## 2. Aktifkan Authentication

Authentication → Sign-in method → aktifkan **Email/Password**.

## 3. Buat Firestore

Firestore Database → Create database. Untuk production, gunakan locked/production rules, lalu paste `firebase/firestore.rules` ke tab Rules.

## 4. Register Web App

Project settings → Your apps → Web app → copy konfigurasi Firebase.

Paste ke:

`js/firebase/config.js`

Jangan masukkan service-account private key ke website.

## 5. Buat akun admin

Buat akun admin lewat Authentication → Users.

Misalnya:

`admin@domainanda.com`

Setelah user dibuat, salin UID-nya.

Di Firestore buat:

`admins/{UID}`

dengan field:

```text
role: "admin"
pinHash: ""
```

PIN pertama dapat dibuat melalui console dengan SHA-256, atau sementara gunakan fungsi `saveAdminPin()` dari browser setelah dokumen admin ada. Lebih aman untuk produksi memakai MFA / Cloud Functions untuk verifikasi PIN.

## 6. Jalankan website

Netlify dapat menyajikan file static ini langsung. Tidak ada build command yang wajib.

## 7. Data model

```text
users/{uid}
admins/{uid}
scripts/{scriptId}
games/{gameId}
reports/{reportId}
supportThreads/{threadId}
notifications/{notificationId}
reviews/{reviewId}
```

## 8. Migrasi dari V3 LocalStorage

Jangan mencoba mengimpor `passwordHash` LocalStorage menjadi Firebase Authentication password. Firebase Auth harus membuat credential sendiri.

User lama sebaiknya diarahkan melakukan **Forgot Password / daftar ulang** pada Firebase Auth.

Data script, game, kategori, dan data non-rahasia dapat dipindahkan ke Firestore melalui import tool yang akan kita buat pada tahap berikutnya.

## 9. Security

Jangan menggunakan `allow read, write: if true` di production. Firestore Security Rules harus membatasi operasi berdasarkan `request.auth` dan role admin. Aktifkan App Check sebelum trafik publik besar.
