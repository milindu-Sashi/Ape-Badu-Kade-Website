# Ape බඩු කඩේ (E-Commerce Platform)

ශ්‍රී ලංකාවේ ප්‍රමුඛතම ඔන්ලයින් සාප්පු සවාරි අත්දැකීම - Modern Full-Stack E-Commerce Website with Customer Storefront, Interactive Payment Gateway, SQLite Database, and Secure Password-Protected Admin Portal.

---

## 🌟 පාරිභෝගික මුහුණත (Customer Storefront)
පාරිභෝගිකයින්ට කිසිදු පරිපාලන (Admin) බොත්තමක් නොපෙනෙන අතර, පිරිසිදු shopping අත්දැකීමක් පමණක් ලැබේ:
- **වෙළඳ නාමය**: **Ape බඩු කඩේ** ("ඔබේ විශ්වාසවන්ත ඔන්ලයින් සාප්පුව")
- **භාණ්ඩ නාමාවලිය**: සිලෝන් තේ, කුළුබඩු, ගෘහ උපකරණ, ඉලෙක්ට්‍රොනික්, රසකැවිලි, බතික් සහ අත්යන්ත්‍ර රෙදි.
- **සජීවී සෙවුම සහ කාණ්ඩ**: ඕනෑම භාණ්ඩයක් නමෙන් හෝ කාණ්ඩයෙන් සෙවීම.
- **භාණ්ඩ විස්තර (Quick View Modal)**: ඡායාරූප, ප්‍රමාණය තේරීම, වට්ටම් සහ තොග ප්‍රමාණය.
- **කරත්තය (Shopping Cart Drawer)**: භාණ්ඩ අඩු වැඩි කිරීම සහ `APE10` කූපන් කේතයෙන් 10% වට්ටම්.
- **ගෙවීම් ක්‍රම (Interactive Payment Gateway)**:
  - **Credit/Debit Card (Visa / Mastercard)**: සජීවී 3D Card Preview, CVV flip සහ demo card autofill.
  - **Cash on Delivery (භාණ්ඩ ලැබුණු පසු මුදල් ගෙවීම)**.
  - **Bank Transfer / LANKAQR**.
- **ඇණවුම් තහවුරු කිරීම සහ රිසිට්පත (Invoice)**: Print කළ හැකි digital invoice.
- **සජීවී ඇණවුම් තත්ත්වය පරීක්ෂාව (Live Order Tracking)**: Order ID (උදා: `ORD-7821`) ඇතුළත් කර ඇණවුමේ තත්ත්වය බැලීම.

---

## 🔒 පරිපාලක පුවරුව (Secure Admin Portal)
- පාරිභෝගිකයින්ගෙන් සම්පූර්ණයෙන්ම වෙන් කර ඇත.
- පිවිසීම සඳහා Footer එකෙහි ඇති **"පරිපාලක පිවිසුම (Staff / Admin Login)"** ක්ලික් කර ලොග් විය යුතුය.
- **පෙරනිමි පිවිසුම් තොරතුරු (Default Credentials)**:
  - **Username**: `admin`
  - **Password**: `admin123`
- ලොග් වූ පසු ලැබෙන පහසුකම්:
  - **Revenue Analytics**: මුළු ආදායම, මුළු ඇණවුම්, Pending ඇණවුම්, Stock අවසන් අනතුරු ඇඟවීම්.
  - **භාණ්ඩ කළමනාකරණය (Product CRUD)**: Add New Product, Edit, Delete.
  - **ඇණවුම් කළමනාකරණය (Orders Management)**: පාරිභෝගික තොරතුරු බැලීම, Invoice බැලීම, ඇණවුම් තත්ත්වය (Pending -> Confirmed -> Processing -> Shipped -> Delivered) යාවත්කාලීන කිරීම.
  - **Logout (පිටවීම)**: ආරක්ෂිතව Admin ගිණුමෙන් පිටවී නැවත Storefront වෙත යාම.

---

## 🗄️ දත්ත ගබඩාව (SQLite Database)
- සැබෑ **SQLite Database** එකක් (`server/database/ape_badu_kade.sqlite`) තුළ සියලුම දත්ත ස්ථිරව සුරැකේ (Persistent Storage):
  - `admins` වගුව: පරිපාලක ගිණුම්
  - `products` වගුව: සියලුම භාණ්ඩ, මිල ගණන් සහ තොග
  - `orders` වගුව: පාරිභෝගිකයින්ගෙන් ලැබෙන සියලුම ඇණවුම් සහ ගෙවීම් විස්තර

---

## 🚀 ක්‍රියාත්මක කිරීම
```bash
npm run dev
```
- **Storefront & Admin Link**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
