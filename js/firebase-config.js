// ===================================================================
// CẤU HÌNH FIREBASE - QUAN TRỌNG!
// ===================================================================
// 
// BƯỚC 1: Tạo project Firebase (MIỄN PHÍ)
// 1. Truy cập: https://console.firebase.google.com/
// 2. Click "Add project" (Thêm dự án)
// 3. Đặt tên project: "de-cuong-tieu-hoc" 
// 4. Tắt Google Analytics (không cần thiết)
// 5. Click "Create project"
//
// BƯỚC 2: Tạo Realtime Database
// 1. Trong Firebase Console, vào "Realtime Database"
// 2. Click "Create Database"
// 3. Chọn location: "United States (us-central1)"
// 4. Chọn "Start in test mode" (cho phép đọc/ghi)
// 5. Click "Enable"
//
// BƯỚC 3: Lấy Firebase Config
// 1. Vào Project Settings (icon bánh răng) > "Project settings"
// 2. Cuộn xuống phần "Your apps"
// 3. Click icon "</>" (Web)
// 4. Đặt tên: "De Cuong Web"
// 5. KHÔNG tick "Also set up Firebase Hosting"
// 6. Click "Register app"
// 7. Copy đoạn config (firebaseConfig object)
// 8. PASTE VÀO DƯỚI ĐÂY (thay thế config mẫu)
//
// BƯỚC 4: Cấu hình Rules (Bảo mật)
// Vào "Realtime Database" > tab "Rules", paste đoạn này:
// {
//   "rules": {
//     "outlines": {
//       ".read": true,
//       ".write": "auth != null"  // Chỉ admin đăng nhập mới sửa được
//     }
//   }
// }
// Hoặc để test, cho phép tất cả (KHÔNG AN TOÀN cho production):
// {
//   "rules": {
//     ".read": true,
//     ".write": true
//   }
// }
// ===================================================================

// FIREBASE CONFIG - ĐÃ CẤU HÌNH
const firebaseConfig = {
  apiKey: "AIzaSyDaCtmdbYw6EH0e2B2a-_XFWLMnO4Rj5xg",
  authDomain: "de-cuong-tieu-hoc.firebaseapp.com",
  databaseURL: "https://de-cuong-tieu-hoc-default-rtdb.firebaseio.com",
  projectId: "de-cuong-tieu-hoc",
  storageBucket: "de-cuong-tieu-hoc.firebasestorage.app",
  messagingSenderId: "989010552130",
  appId: "1:989010552130:web:342b44901dc2ff66b914db",
  measurementId: "G-G121DZ1EZ1"
};

// Khởi tạo Firebase
let app, database;
let useFirebase = false;

try {
  // Kiểm tra xem đã cấu hình Firebase chưa
  if (firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
    app = firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    useFirebase = true;
    console.log('✅ Firebase đã kết nối thành công!');
    
    // Tự động tạo tài khoản admin nếu chưa có
    createDefaultAdminAccount();
  } else {
    console.warn('⚠️ Firebase chưa được cấu hình. Đang dùng dữ liệu local.');
    console.warn('📖 Xem hướng dẫn trong file firebase-config.js');
  }
} catch (error) {
  console.error('❌ Lỗi khởi tạo Firebase:', error);
  console.warn('Chuyển sang dùng dữ liệu local.');
  useFirebase = false;
}

// Tự động tạo tài khoản admin mặc định
function createDefaultAdminAccount() {
  // Thông tin tài khoản mặc định
  const DEFAULT_ADMIN = {
    email: 'admin',
    password: 'admin123'
  };
  
  if (!database) {
    console.warn('Database chưa khởi tạo');
    return;
  }
  
  // Lưu thông tin admin vào Realtime Database (ghi đè nếu đã có)
  const adminRef = database.ref('admin_credentials');
  
  // Luôn cập nhật thông tin admin mới nhất
  adminRef.set({
    email: DEFAULT_ADMIN.email,
    password: DEFAULT_ADMIN.password,
    updated_at: new Date().toISOString()
  }).then(() => {
    console.log('✅ Đã cập nhật thông tin admin vào Database');
    console.log('📧 Email:', DEFAULT_ADMIN.email);
    console.log('🔑 Password:', DEFAULT_ADMIN.password);
  }).catch((error) => {
    console.error('❌ Lỗi lưu Database:', error);
  });
}

// Export để sử dụng ở file khác
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { app, database, auth, useFirebase };
}
