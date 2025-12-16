# Hướng dẫn Setup Auto Delete File từ Cloudinary

## Phương án 1: Cloudflare Workers (MIỄN PHÍ - Khuyên dùng)

### Bước 1: Lấy API Key từ Cloudinary

1. Vào Cloudinary Dashboard: https://console.cloudinary.com
2. Click **Settings** (⚙️) → **API Keys**
3. Copy:
   - **API Key**
   - **API Secret** (click "Reveal" để xem)

### Bước 2: Tạo Cloudflare Worker

1. Đăng ký Cloudflare: https://workers.cloudflare.com/
2. Click **Create a Service**
3. Đặt tên: `cloudinary-delete`
4. Click **Create Service**
5. Click **Quick Edit**
6. Copy code từ file `cloudflare-worker.js`
7. Thay thế:
   - `YOUR_API_KEY` → API Key của bạn
   - `YOUR_API_SECRET` → API Secret của bạn
8. Click **Save and Deploy**
9. Copy URL worker (ví dụ: `https://cloudinary-delete.your-name.workers.dev`)

### Bước 3: Cập nhật Code Website

Thêm URL worker vào file `js/admin.js`:

```javascript
const CLOUDFLARE_WORKER_URL = 'https://cloudinary-delete.your-name.workers.dev';
```

## Phương án 2: Xóa thủ công (MIỄN PHÍ)

1. Vào Cloudinary: https://console.cloudinary.com
2. Click **Assets** (menu bên trái)
3. Tìm file cần xóa
4. Click file → Click **Delete** (🗑️)
5. Xác nhận

## Phương án 3: Firebase Functions (Tốn phí - Cần Blaze plan)

Nếu muốn dùng Firebase Functions, cần nâng cấp lên Blaze plan.

---

## So sánh các phương án

| Phương án | Miễn phí | Tự động | Khó setup |
|-----------|----------|---------|-----------|
| Cloudflare Workers | ✅ | ✅ | Trung bình |
| Xóa thủ công | ✅ | ❌ | Dễ |
| Firebase Functions | ❌ | ✅ | Khó |

## Khuyến nghị

- **Dùng Cloudflare Workers**: Nếu muốn tự động xóa file
- **Xóa thủ công**: Nếu ít khi xóa file (đơn giản nhất)
