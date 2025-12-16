# 🔥 Hướng dẫn cài đặt Firebase cho Website Đề Cương

## 🎯 Lợi ích khi dùng Firebase:
- ✅ **Tự động đồng bộ**: Thêm/sửa/xóa đề cương trên máy này → Tất cả máy khác tự động cập nhật
- ✅ **Không cần chỉnh code**: Không phải copy/paste vào `app.js` nữa
- ✅ **Realtime**: Cập nhật ngay lập tức, không cần reload trang
- ✅ **Miễn phí**: Firebase Spark Plan (miễn phí) đủ dùng cho trường học
- ✅ **Dễ dùng**: Setup 1 lần, sau đó chỉ việc dùng admin

---

## 📝 BƯỚC 1: Tạo Firebase Project (5 phút)

### 1.1. Tạo tài khoản Google (nếu chưa có)
- Truy cập: https://accounts.google.com/signup

### 1.2. Tạo Firebase Project
1. Truy cập: **https://console.firebase.google.com/**
2. Click nút **"Add project"** (Thêm dự án)
3. Đặt tên project: `de-cuong-tieu-hoc` (hoặc tên bạn thích)
4. Click **"Continue"**
5. Tắt **"Google Analytics"** (không cần thiết)
6. Click **"Create project"**
7. Đợi 10-20 giây → Click **"Continue"**

---

## 📝 BƯỚC 2: Tạo Realtime Database (3 phút)

### 2.1. Tạo Database
1. Trong Firebase Console, menu bên trái, click **"Realtime Database"**
2. Click nút **"Create Database"**
3. Chọn location: **"United States (us-central1)"** (gần nhất)
4. Chọn Security rules: **"Start in test mode"**
5. Click **"Enable"**

### 2.2. Cấu hình Rules (Bảo mật)
1. Trong trang Realtime Database, click tab **"Rules"**
2. Thay thế code hiện tại bằng:

```json
{
  "rules": {
    "outlines": {
      ".read": true,
      ".write": true
    }
  }
}
```

3. Click **"Publish"**

> **Lưu ý:** Rules này cho phép mọi người đọc và ghi. Nếu cần bảo mật hơn, có thể thêm authentication sau.

---

## 📝 BƯỚC 3: Lấy Firebase Configuration (3 phút)

### 3.1. Tạo Web App
1. Trong Firebase Console, click icon **"Project Settings"** (⚙️ góc trên trái)
2. Click **"Project settings"**
3. Cuộn xuống phần **"Your apps"**
4. Click icon **"</>"** (Web)
5. Đặt nickname: **"De Cuong Web App"**
6. **KHÔNG** tick ô "Also set up Firebase Hosting"
7. Click **"Register app"**

### 3.2. Copy Configuration
Bạn sẽ thấy đoạn code như sau:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q",
  authDomain: "de-cuong-tieu-hoc.firebaseapp.com",
  databaseURL: "https://de-cuong-tieu-hoc-default-rtdb.firebaseio.com",
  projectId: "de-cuong-tieu-hoc",
  storageBucket: "de-cuong-tieu-hoc.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6g7h8i9j0k1"
};
```

**Copy toàn bộ object `firebaseConfig` này!**

---

## 📝 BƯỚC 4: Cập nhật Code (2 phút)

### 4.1. Mở file `js/firebase-config.js`
Tìm đoạn:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  ...
};
```

### 4.2. Thay thế bằng config của bạn
Paste config đã copy ở bước 3.2 vào.

**Ví dụ:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q",
  authDomain: "de-cuong-tieu-hoc.firebaseapp.com",
  databaseURL: "https://de-cuong-tieu-hoc-default-rtdb.firebaseio.com",
  projectId: "de-cuong-tieu-hoc",
  storageBucket: "de-cuong-tieu-hoc.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6g7h8i9j0k1"
};
```

### 4.3. Lưu file
Nhấn **Ctrl+S** (Windows) hoặc **Cmd+S** (Mac)

---

## 📝 BƯỚC 5: Push lên GitHub (1 phút)

```bash
git add js/firebase-config.js
git commit -m "Cấu hình Firebase"
git push
```

---

## ✅ KIỂM TRA

### Cách 1: Mở Console trình duyệt
1. Mở `index.html` hoặc `admin.html`
2. Nhấn **F12** để mở Developer Tools
3. Vào tab **Console**
4. Nếu thấy: **"✅ Firebase đã kết nối thành công!"** → Thành công!
5. Nếu thấy: **"⚠️ Firebase chưa được cấu hình"** → Kiểm tra lại config

### Cách 2: Thử thêm đề cương
1. Mở `admin.html`
2. Thêm 1 đề cương mới
3. Mở tab khác với `index.html`
4. Nếu thấy đề cương mới xuất hiện ngay → Firebase hoạt động!

---

## 🎉 XONG!

Từ giờ:
- ✅ Thêm/sửa/xóa đề cương trong admin → Tự động cập nhật tất cả máy
- ✅ Không cần chỉnh file `app.js` nữa
- ✅ Không cần export JSON
- ✅ Chỉ cần push file đề cương vào `docs/` và push lên GitHub

---

## 🔧 Khắc phục sự cố

### Lỗi: "Permission denied"
→ Kiểm tra lại Rules trong Realtime Database, đảm bảo `.write: true`

### Lỗi: "Invalid API key"
→ Copy lại config từ Firebase Console, đảm bảo không thừa/thiếu ký tự

### Không thấy "✅ Firebase đã kết nối"
→ Mở file `firebase-config.js`, kiểm tra `apiKey` không còn là `"YOUR_API_KEY_HERE"`

### Website không tải được
→ Đảm bảo có kết nối internet (Firebase cần internet)

---

## 📊 Giới hạn Firebase Free Plan

- **Lượt đọc/tháng**: 100,000 (rất đủ cho trường học)
- **Lượt ghi/tháng**: 20,000 (rất đủ)
- **Dung lượng**: 1 GB (chỉ lưu danh sách, không lưu file PDF)
- **Băng thông**: 10 GB/tháng

→ **KẾT LUẬN**: Hoàn toàn miễn phí cho website đề cương trường học!

---

## ❓ FAQ

**Q: Firebase có an toàn không?**
A: Có! Bạn có thể thêm authentication để chỉ admin mới sửa được.

**Q: Nếu hết quota miễn phí thì sao?**
A: Website tự động chuyển về dùng dữ liệu local (như cũ), không bị lỗi.

**Q: File PDF có lưu trên Firebase không?**
A: Không. File PDF vẫn lưu trong `docs/` và push lên GitHub. Firebase chỉ lưu thông tin (tên, mô tả, đường dẫn).

**Q: Có cần tạo account Firebase cho học sinh không?**
A: Không. Học sinh chỉ xem, không cần account.
