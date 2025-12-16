# Hướng Dẫn Cấu Hình Firebase Authentication

## Bước 1: Kích hoạt Email/Password Authentication

1. Vào Firebase Console: https://console.firebase.google.com/
2. Chọn project `de-cuong-tieu-hoc`
3. Vào menu **Authentication** (bên trái)
4. Click tab **Sign-in method**
5. Click **Email/Password**
6. Bật (Enable) **Email/Password**
7. Click **Save**

## Bước 2: Tạo Tài Khoản Admin

1. Vẫn trong **Authentication**
2. Click tab **Users**
3. Click **Add user**
4. Nhập:
   - **Email**: admin@decuong.com (hoặc email bạn muốn)
   - **Password**: tạo mật khẩu mạnh (ít nhất 6 ký tự)
5. Click **Add user**

## Bước 3: Cập Nhật Database Rules (Bảo mật)

1. Vào **Realtime Database** > tab **Rules**
2. Thay đổi rules thành:

```json
{
  "rules": {
    "admin_credentials": {
      ".read": true,
      ".write": false
    },
    "outlines": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

**Giải thích:**
- `admin_credentials/.read: true` - Ai cũng đọc được để hiển thị thông tin đăng nhập
- `admin_credentials/.write: false` - KHÔNG ai sửa được (chỉ tạo 1 lần tự động)
- `outlines/.read: true` - Ai cũng XEM được đề cương (trang index)
- `outlines/.write: "auth != null"` - Chỉ người ĐĂNG NHẬP mới SỬA được (trang admin)

3. Click **Publish**

## Bước 4: Test Đăng Nhập

1. Mở `login.html` trong trình duyệt
2. Nhập email và password đã tạo ở Bước 2
3. Click **Đăng nhập**
4. Nếu thành công, sẽ chuyển đến `admin.html`

## Luồng Hoạt Động

```
index.html (Công khai)
    ↓
[Click "Admin"]
    ↓
login.html
    ↓
[Nhập email + password]
    ↓
Firebase Auth xác thực
    ↓
✅ admin.html (Có thể thêm/sửa/xóa đề cương)
```

## Quản Lý Tài Khoản

### Thêm admin mới:
- Vào Firebase Console > Authentication > Users > Add user

### Xóa admin:
- Vào Firebase Console > Authentication > Users > Click icon 3 chấm > Delete user

### Đổi mật khẩu:
- Vào Firebase Console > Authentication > Users > Click vào user > Reset password

## Lưu Ý Bảo Mật

1. **MẬT KHẨU MẠNH**: Dùng mật khẩu ít nhất 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt
2. **KHÔNG CHIA SẺ**: Không chia sẻ email/password admin cho người khác
3. **HTTPS**: Khi deploy lên GitHub Pages, luôn dùng HTTPS (tự động)
4. **RULES**: Kiểm tra Database Rules đã đúng (read: true, write: auth != null)

## Troubleshooting

### Lỗi: "Firebase Authentication chưa được cấu hình"
→ Kiểm tra đã kích hoạt Email/Password ở Bước 1 chưa

### Lỗi: "Email không tồn tại"
→ Kiểm tra email đã tạo ở Bước 2 chưa, hoặc gõ đúng email

### Lỗi: "Mật khẩu không đúng"
→ Kiểm tra lại mật khẩu, có thể reset trong Firebase Console

### Lỗi: "Permission denied"
→ Kiểm tra Database Rules ở Bước 3

## Demo Tài Khoản

Sau khi cấu hình xong, bạn có thể tạo thêm tài khoản:
- Email: `admin@example.com`
- Password: `admin123` (đổi sau khi test)

---

**✅ Hoàn tất!** Bây giờ chỉ người có tài khoản admin mới vào được trang quản trị.
