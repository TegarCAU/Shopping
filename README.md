# Aplikasi Toko Online

Aplikasi toko online modern untuk menjual berbagai produk fashion dan aksesori.

## Fitur Utama

- **Kategori Produk**:
  - Wanita
  - Pria
  - Aksesori
  - Produk Diskon

- **Fitur Pengguna**:
  - Pencarian produk
  - Wishlist
  - Navigasi responsif
  - Tampilan produk dengan gambar
  - Informasi harga dalam Rupiah

## Cara Penggunaan

1. Pastikan Node.js dan Java JDK 17 sudah terinstal di komputer Anda
2. Buka terminal dan navigasi ke folder proyek
3. Untuk frontend:
   ```bash
   npm install
   npm start
   ```
4. Untuk backend keamanan:
   ```bash
   mvn clean install
   java -jar target/security-service-1.0.0.jar
   ```
5. Buka browser dan akses:
   - Frontend: `http://localhost:8080`
   - Backend (API): `http://localhost:8081`

## Struktur Direktori

```
Shopping/
├── css/
│   ├── styles.css
│   └── components.css
├── js/
│   ├── main.js
│   ├── cart.js
│   └── data/
│       └── products.js
├── images/
├── index.html
├── women.html
├── men.html
├── accessories.html
├── sale.html
├── src/
│   └── main/
│       └── java/
│           ├── security/
│           │   ├── SecurityConfig.java
│           │   └── AuthenticationService.java
│           └── SecurityApplication.java
├── pom.xml
└── README.md
```

## Teknologi yang Digunakan

- HTML5
- CSS3
- JavaScript
- Node.js (untuk development server)
- Java Spring Boot
- Spring Security
- PostgreSQL
- Maven
- JWT (JSON Web Token)

## Lisensi

ISC License
