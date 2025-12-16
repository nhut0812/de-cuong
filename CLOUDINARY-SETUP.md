# Hướng dẫn Setup Cloudinary (MIỄN PHÍ)

## Bước 1: Tạo tài khoản Cloudinary

1. Truy cập: https://cloudinary.com/users/register_free
2. Điền thông tin:
   - Email
   - Password
   - Cloud name (tự động tạo)
3. Click "Create Account"
4. Xác nhận email

## Bước 2: Lấy thông tin Cloud Name

1. Sau khi đăng nhập vào Cloudinary Dashboard
2. Ở góc trên bên trái sẽ thấy **Cloud name**
3. Copy cloud name này (ví dụ: `de-cuong-abc123`)

## Bước 3: Tạo Upload Preset

1. Vào **Settings** (⚙️) → **Upload**
2. Scroll xuống phần **Upload presets**
3. Click **Add upload preset**
4. Điền:
   - **Upload preset name**: `decuong_upload`
   - **Signing mode**: **Unsigned** (quan trọng!)
   - **Folder**: `outlines` (tùy chọn)
5. Click **Save**

## Bước 4: Cập nhật code

Mở file `js/admin.js`, tìm dòng đầu tiên và thay đổi:

```javascript
const CLOUDINARY_CLOUD_NAME = 'de-cuong-abc123'; // Thay bằng cloud name của bạn
const CLOUDINARY_UPLOAD_PRESET = 'decuong_upload'; // Thay bằng upload preset vừa tạo
```

## Bước 5: Test

1. Vào trang Admin
2. Tab "Thêm đề cương"
3. Upload file PDF/DOCX
4. File sẽ tự động upload lên Cloudinary
5. Link download sẽ là: `https://res.cloudinary.com/[cloud-name]/...`

## Giới hạn miễn phí

- ✅ 25 GB Storage
- ✅ 25 GB Bandwidth/tháng
- ✅ Không cần thẻ tín dụng
- ✅ Không giới hạn số file

## Lưu ý

- Upload preset phải là **Unsigned** để upload từ browser
- Cloudinary tự động optimize file (nén, format)
- File có thể access từ mọi nơi qua link
- Có thể xóa file trong Cloudinary Dashboard

## Troubleshooting

**Lỗi "Upload failed":**
- Kiểm tra cloud name đúng chưa
- Kiểm tra upload preset đã tạo chưa
- Upload preset phải là "Unsigned"

**File không tải được:**
- Kiểm tra link có https://res.cloudinary.com/...
- File có thể mất vài giây để xử lý
