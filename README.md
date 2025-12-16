# 📚 Website Đề Cương Ôn Tập

Website tĩnh để phát hành và chia sẻ đề cương ôn tập cho học sinh tiểu học. Website hoạt động hoàn toàn trên GitHub Pages, hỗ trợ Firebase để đồng bộ dữ liệu tự động.

## ✨ Tính năng

### Website công khai (index.html)
- 📱 **Responsive Design** - Tương thích với mọi thiết bị (desktop, tablet, mobile)
- 🔍 **Tìm kiếm nhanh** - Tìm kiếm đề cương theo tên môn học
- 📥 **Tải xuống dễ dàng** - Click vào card hoặc nút tải để download file
- 🎨 **Giao diện đẹp mắt** - Thiết kế hiện đại, dễ nhìn

### Trang quản trị (admin.html)
- 🔐 **Đăng nhập an toàn** - Tài khoản tự động tạo, chỉ admin mới vào được
- ➕ **Thêm đề cương** - Form thêm mới dễ dàng, upload file tự động nhận tên
- ✏️ **Sửa đề cương** - Chỉnh sửa thông tin trực tiếp trên giao diện
- 🗑️ **Xóa đề cương** - Xóa đề cương không cần thiết
- 💾 **Xuất JSON** - Tải file outlines.json để cập nhật lên GitHub
- 📊 **Thống kê** - Xem tổng quan số lượng đề cương
- 🔍 **Tìm kiếm** - Tìm kiếm nhanh trong bảng quản lý
- 🔥 **Firebase** - Đồng bộ tự động giữa tất cả máy (tùy chọn)

### Đăng nhập Admin
- 📧 **Email mặc định**: `admin@decuong.com`
- 🔑 **Password mặc định**: `admin123456`
- ✨ **Tự động tạo** - Tài khoản được tạo tự động khi lần đầu truy cập
- 🔒 **Bảo mật** - Chỉ người đăng nhập mới sửa được dữ liệu

### Đồng bộ dữ liệu
- 🔥 **Firebase Realtime Database** - Cập nhật tự động, không cần chỉnh code
- 💾 **LocalStorage** - Backup local khi không dùng Firebase
- 📤 **Export/Import** - Xuất JSON để backup hoặc di chuyển

## 📁 Cấu trúc thư mục

```
decuong/
├── index.html          # Trang chủ (website công khai)
├── admin.html          # Trang quản trị (thêm/sửa/xóa đề cương)
├── outlines.json       # Danh sách đề cương (FILE QUAN TRỌNG)
├── css/
│   ├── styles.css      # CSS cho trang chủ
│   └── admin.css       # CSS cho trang admin
├── js/
│   ├── app.js          # JavaScript cho trang chủ
│   └── admin.js        # JavaScript cho trang admin
## 🚀 Cách sử dụng

### 🔥 Phương pháp 1: Dùng Firebase (Khuyến nghị - Tự động đồng bộ)

**Ưu điểm:**
- ✅ Thêm/sửa/xóa trên máy này → Tất cả máy khác tự động cập nhật
- ✅ Không cần chỉnh code `app.js`
- ✅ Không cần export/import JSON
- ✅ Realtime, cập nhật ngay lập tức

**Setup Firebase:** Xem file [FIREBASE-SETUP.md](FIREBASE-SETUP.md) (5-10 phút)

**Sau khi setup Firebase:**
1. Mở `admin.html`
2. Thêm/sửa/xóa đề cương → Tự động lưu vào Firebase
3. Mở `index.html` trên bất kỳ máy nào → Thấy dữ liệu mới ngay!
4. Chỉ cần push file PDF vào `docs/` khi có file mới

---

### 💾 Phương pháp 2: Không dùng Firebase (Thủ công)
    └── ...
```

## 🚀 Cách sử dụng

### Phương pháp 1: Sử dụng trang Admin (Khuyến nghị)

**Bước 1:** Mở file `admin.html` trong trình duyệt

**Bước 2:** Thêm đề cương mới
1. Click vào tab "➕ Thêm đề cương"
2. Kéo thả hoặc chọn file đề cương (tự động điền tên file)
3. Điền thông tin: Tên môn học, Lớp, Mô tả
4. Chọn icon
5. Click "➕ Thêm đề cương"

**Bước 3:** Đồng bộ lên GitHub để mọi người xem được
1. Vào tab "💾 Xuất dữ liệu"
2. Click "📤 Hướng dẫn đồng bộ lên GitHub"
3. Click "📋 Copy Code"
4. Mở file `js/app.js`, tìm dòng `const outlinesData = {`
5. Chọn toàn bộ từ `const outlinesData` đến hết `};`
6. Paste code đã copy vào
7. Lưu file

**Bước 4:** Push lên GitHub
```bash
# Copy file đề cương vào docs/
cp ~/Downloads/De-cuong-moi.pdf docs/

# Push code (bao gồm js/app.js đã sửa)
git add .
git commit -m "Thêm đề cương mới"
git push
```

💡 **Lưu ý:** Phải sửa file `js/app.js` thì máy khác mới thấy được!

---

### Phương pháp 2: Chỉnh sửa JSON thủ công (Cách cũ)

### 1. Thêm đề cương mới

**Bước 1:** Thêm file đề cương vào thư mục `docs/`

```bash
# Copy file đề cương vào thư mục docs
cp /path/to/your/De-cuong-Hoa-12-HK2.pdf docs/
```

**Bước 2:** Cập nhật file `outlines.json`

Mở file `outlines.json` và thêm một đối tượng mới vào mảng `outlines`:

```json
{
  "id": 7,
  "subject": "Hóa Học",
  "description": "Đề cương ôn tập Hóa học lớp 12 - Học kỳ 2",
  "fileName": "De-cuong-Hoa-12-HK2.pdf",
  "filePath": "docs/De-cuong-Hoa-12-HK2.pdf",
  "fileType": "pdf",
  "icon": "🧪"
}
```

**Các trường thông tin:**
- `id`: Số thứ tự (tăng dần)
- `subject`: Tên môn học
- `description`: Mô tả chi tiết
- `fileName`: Tên file (để hiển thị và download)
- `filePath`: Đường dẫn tới file (luôn bắt đầu bằng `docs/`)
- `fileType`: Loại file (`pdf`, `docx`, `doc`, `pptx`, etc.)
- `icon`: Icon emoji cho môn học

**Các icon gợi ý:**
- 📐 Toán
- ⚡ Vật Lý
- 🧪 Hóa Học
- 📖 Ngữ Văn
- 🌍 Tiếng Anh
- 🧬 Sinh Học
- 🏛️ Lịch Sử
- 🌏 Địa Lý
- 💻 Tin Học

**Bước 3:** Cập nhật ngày trong `outlines.json`

```json
{
  "lastUpdate": "2025-12-16",
  ...
}
```

### 2. Đẩy lên GitHub

```bash
# Thêm tất cả các thay đổi
git add .

# Commit với message mô tả
git commit -m "Thêm đề cương Hóa học HK2"

# Push lên GitHub
git push origin main
```

## 🌐 Deploy lên GitHub Pages

### Lần đầu tiên thiết lập:

1. Tạo repository mới trên GitHub (ví dụ: `de-cuong-on-tap`)

2. Khởi tạo Git và push code:

```bash
cd /Users/mbpro/Downloads/decuong
git init
git add .
git commit -m "Initial commit - Website đề cương"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/de-cuong-on-tap.git
git push -u origin main
```

3. Bật GitHub Pages:
   - Vào **Settings** của repository
   - Chọn **Pages** ở menu bên trái
   - Trong **Source**, chọn `main` branch
   - Nhấn **Save**

4. Website sẽ có địa chỉ: `https://YOUR-USERNAME.github.io/de-cuong-on-tap/`

### Các lần sau:

Chỉ cần push code lên GitHub, website tự động cập nhật sau 1-2 phút:

```bash
git add .
git commit -m "Thêm đề cương mới"
git push
```

## 📝 Quy trình làm việc khuyến nghị

### Khi thêm đề cương mới:

```bash
# 1. Copy file đề cương vào thư mục docs/
cp ~/Desktop/De-cuong-Toan-12-HK2.pdf docs/

# 2. Mở admin.html trong trình duyệt, thêm thông tin đề cương mới

# 3. Xuất file outlines.json từ trang admin

# 4. Thay file outlines.json cũ, commit và push
git add .
git commit -m "Thêm đề cương Toán HK2"
git push
```

### Khi cập nhật/xóa đề cương:

```bash
# 1. Mở admin.html, chỉnh sửa hoặc xóa đề cương

# 2. Xuất file outlines.json mới

# 3. Nếu xóa file, nhớ xóa file trong thư mục docs/ (nếu cần)
rm docs/De-cuong-cu.pdf

# 4. Commit và push
git add .
git commit -m "Cập nhật đề cương"
git push
```

## 🎯 Lưu ý quan trọng

### Khi dùng trang Admin:
1. **Dữ liệu được lưu trong trình duyệt** (localStorage) - không tự động lưu vào file
2. **Phải xuất file JSON** sau khi chỉnh sửa để cập nhật website
3. **File đề cương** vẫn phải upload thủ công vào thư mục `docs/`
4. **Tên file** trong admin phải khớp với tên file thực tế trong `docs/`
5. **Trang admin chỉ chạy local** - không cần deploy lên GitHub Pages

### Về file đề cương:
1. File đề cương phải được đặt trong thư mục `docs/`
2. Đường dẫn trong JSON phải chính xác (case-sensitive)
3. Loại file được hỗ trợ: PDF, DOCX, DOC, PPTX, TXT...
4. Tên file **không nên có dấu** và **không có khoảng trắng** (dùng gạch ngang `-` hoặc underscore `_`)
5. Sau mỗi lần push, đợi 1-2 phút để GitHub Pages cập nhật

### Truy cập:
- **Website công khai**: `https://YOUR-USERNAME.github.io/de-cuong-on-tap/` (hoặc `index.html`)
- **Trang admin**: Chỉ mở local file `admin.html` trên máy tính của bạn

## 🛠️ Tùy chỉnh

### Thay đổi màu sắc

Mở file `css/styles.css` và sửa các biến CSS trong `:root`:

```css
:root {
    --primary-color: #4a90e2;    /* Màu chính */
    --secondary-color: #2c3e50;  /* Màu phụ */
    --accent-color: #e74c3c;     /* Màu nhấn */
}
```

### Thay đổi tiêu đề

Mở file `index.html` và sửa trong phần `<header>`:

```html
<h1>📚 Đề Cương Ôn Tập Lớp 12</h1>
<p class="subtitle">Tải đề cương ôn tập các môn học</p>
```

## 📧 Hỗ trợ

Nếu có vấn đề, hãy kiểm tra:
1. File `outlines.json` có đúng cú pháp JSON không (dùng [JSONLint](https://jsonlint.com/))
2. Đường dẫn file trong `filePath` có chính xác không
3. File đề cương có tồn tại trong thư mục `docs/` không

## 📄 License

MIT License - Tự do sử dụng và chỉnh sửa theo ý muốn.

---

**Chúc bạn sử dụng thành công! 🎉**
