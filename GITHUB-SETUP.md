# 🔑 Hướng dẫn Setup GitHub Upload

Hệ thống sử dụng GitHub API để upload file trực tiếp lên repository. Cần tạo Personal Access Token.

## Bước 1: Tạo GitHub Personal Access Token

1. **Đăng nhập GitHub**
   - Vào: https://github.com

2. **Vào Settings**
   - Click avatar (góc trên phải) → **Settings**

3. **Tạo Token**
   - Scroll xuống → Click **Developer settings** (menu trái)
   - Click **Personal access tokens** → **Tokens (classic)**
   - Click **Generate new token** → **Generate new token (classic)**

4. **Cấu hình Token**
   - **Note**: `decuong-upload` (tên gợi nhớ)
   - **Expiration**: `No expiration` hoặc `1 year`
   - **Scopes**: Chọn ✅ **`repo`** (Full control of private repositories)
     - Mở rộng `repo` và check tất cả sub-items
   - Scroll xuống → Click **Generate token**

5. **Copy Token**
   - Token có dạng: `ghp_xxxxxxxxxxxxxxxxxxxx`
   - ⚠️ **QUAN TRỌNG**: Copy ngay, token chỉ hiện 1 lần!
   - Lưu vào file text hoặc password manager

## Bước 2: Tạo File Config

1. **Tạo file mới**
   ```bash
   touch js/github-config.js
   ```

2. **Paste nội dung sau:**
   ```javascript
   // GitHub Configuration - KHÔNG ĐƯỢC COMMIT FILE NÀY LÊN GIT!
   const GITHUB_CONFIG = {
       token: 'ghp_YOUR_TOKEN_HERE',  // Thay bằng token vừa tạo
       owner: 'nhut0812',              // Username GitHub của bạn
       repo: 'de-cuong',               // Tên repository
       branch: 'main',                 // Branch mặc định
       docsFolder: 'docs/'             // Folder chứa file
   };
   ```

3. **Thay thế thông tin:**
   - `token`: Token vừa copy
   - `owner`: Username GitHub của bạn
   - `repo`: Tên repository của bạn

## Bước 3: Kiểm tra .gitignore

File `.gitignore` đã có dòng:
```
js/github-config.js
```

Đảm bảo dòng này tồn tại để **không bao giờ commit token lên Git**.

## Bước 4: Test Upload

1. **Mở trang admin**
   ```bash
   # Dùng Live Server hoặc
   python -m http.server 8000
   ```

2. **Đăng nhập admin**
   - Email: `admin@decuong.com`
   - Password: `admin123456`

3. **Upload file test**
   - Tab "Thêm đề cương"
   - Chọn file PDF
   - Click "Thêm"
   - Mở Console (F12) → Xem log

4. **Kiểm tra kết quả**
   - Vào GitHub → Repository → Folder `docs/`
   - File đã được commit tự động
   - Copy URL file: `https://raw.githubusercontent.com/...`
   - Paste vào browser → File tải về được

## ⚠️ Bảo mật Token

### ✅ Làm đúng:
- Lưu token trong `js/github-config.js`
- File này đã được `.gitignore`
- Không share token cho ai
- Không commit file config lên Git

### ❌ Tuyệt đối KHÔNG:
- Commit token lên GitHub public
- Share token trong chat/email
- Hard-code token vào file khác
- Screenshot token

### Nếu lộ token:
1. Vào GitHub Settings → Developer settings → Tokens
2. Tìm token bị lộ
3. Click **Delete**
4. Tạo token mới
5. Cập nhật lại `js/github-config.js`

## 🔧 Troubleshooting

### Lỗi "Unauthorized" (401)
- Token sai hoặc hết hạn
- Token không có quyền `repo`
- Kiểm tra lại file `github-config.js`

### Lỗi "Not Found" (404)
- Sai `owner` hoặc `repo` name
- Repository không tồn tại
- Repository là private nhưng token không có quyền

### Lỗi "Validation Failed"
- File name có ký tự đặc biệt
- Hệ thống đã tự động chuyển không dấu
- Check Console log để debug

### Token hết hạn
1. Tạo token mới (như Bước 1)
2. Cập nhật `js/github-config.js`
3. Refresh trang admin
4. Upload test lại

## 📝 Lưu ý

- Token không giới hạn lượt dùng
- API rate limit: 5000 requests/hour
- File size tối đa: 100MB
- Nên dùng file < 10MB cho tốc độ tốt

## 🎯 Kết luận

Sau khi setup xong:
- ✅ Upload file tự động lên GitHub
- ✅ File public, ai cũng tải được
- ✅ Tự động commit, có lịch sử
- ✅ Xóa file đồng bộ khi xóa đề cương

---

🔒 **Bảo mật token = Bảo vệ repository!**
