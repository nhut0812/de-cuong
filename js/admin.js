// Biến toàn cục
let outlines = [];
let originalData = {};
let currentEditId = null;
let selectedFile = null;
let firebaseEnabled = false;
let currentUser = null;

// LocalStorage key
const STORAGE_KEY = 'decuong_data';

// Kiểm tra đăng nhập
function checkAuth() {
    // Kiểm tra localStorage
    const sessionData = localStorage.getItem('admin_session');
    
    if (sessionData) {
        try {
            const session = JSON.parse(sessionData);
            
            // Kiểm tra thời gian hết hạn
            if (session.expires && Date.now() < session.expires && session.logged_in) {
                // Phiên còn hiệu lực
                console.log('✅ Đã đăng nhập:', session.email);
                document.getElementById('userEmail').textContent = session.email;
                return;
            }
        } catch (e) {
            console.error('Lỗi đọc session:', e);
        }
    }
    
    // Phiên hết hạn hoặc không hợp lệ, xóa và chuyển đến login
    localStorage.removeItem('admin_session');
    window.location.href = 'login.html';
}

// Đăng xuất
function logout() {
    // Xóa thông tin đăng nhập
    localStorage.removeItem('admin_session');
    console.log('👋 Đã đăng xuất');
    window.location.href = 'login.html';
}

// Load dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập trước
    checkAuth();
    
    // Kiểm tra Firebase
    if (typeof useFirebase !== 'undefined' && useFirebase && database) {
        firebaseEnabled = true;
        console.log('✅ Admin đang dùng Firebase');
    }
    
    initApp();
    setupEventListeners();
    setupFileUpload();
});

// Khởi tạo ứng dụng
async function initApp() {
    loadData();
    // updateDashboard, renderTable, updateJSONPreview sẽ được gọi trong loadDataFromFirebase/loadFromLocalStorage
}

// Setup các event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });

    // Add form
    document.getElementById('addOutlineForm').addEventListener('submit', handleAddOutline);
    
    // Edit form
    document.getElementById('editOutlineForm').addEventListener('submit', handleEditOutline);

    // Search
    document.getElementById('adminSearch').addEventListener('input', handleSearch);
}

// Setup file upload với drag & drop
function setupFileUpload() {
    const fileInput = document.getElementById('fileUpload');
    const uploadArea = document.getElementById('fileUploadArea');

    // Click to upload
    fileInput.addEventListener('change', handleFileSelect);

    // Drag & drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
}

// Xử lý khi chọn file
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// Xử lý file
function handleFile(file) {
    // Kiểm tra loại file
    const allowedTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'application/vnd.ms-powerpoint',
                         'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                         'text/plain'];
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|pptx|txt)$/i)) {
        showToast('❌ Chỉ hỗ trợ file PDF, DOC, DOCX, PPTX, TXT', 'error');
        return;
    }

    selectedFile = file;
    
    // Lấy tên file và loại file
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const fileSize = (file.size / 1024).toFixed(2); // KB

    // Cập nhật hidden fields
    document.getElementById('fileName').value = fileName;
    document.getElementById('fileType').value = fileExtension;

    // Hiển thị preview
    document.querySelector('.upload-placeholder').style.display = 'none';
    const preview = document.getElementById('filePreview');
    preview.style.display = 'flex';
    
    // Icon theo loại file
    const fileIcons = {
        'pdf': '📕',
        'doc': '📘',
        'docx': '📘',
        'pptx': '📙',
        'txt': '📄'
    };
    
    preview.querySelector('.file-icon').textContent = fileIcons[fileExtension] || '📄';
    document.getElementById('previewFileName').textContent = fileName;
    document.getElementById('previewFileInfo').textContent = `${fileSize} KB • ${fileExtension.toUpperCase()}`;

    // Tự động gợi ý mô tả nếu chưa có
    if (!document.getElementById('description').value) {
        const baseName = fileName.replace(/\.[^/.]+$/, ""); // Bỏ extension
        document.getElementById('description').value = `Đề cương - ${baseName}`;
    }
}

// Xóa file đã chọn
function removeFile() {
    selectedFile = null;
    document.getElementById('fileUpload').value = '';
    document.getElementById('fileName').value = '';
    document.getElementById('fileType').value = '';
    
    document.querySelector('.upload-placeholder').style.display = 'block';
    document.getElementById('filePreview').style.display = 'none';
}

// Chuyển tab
function switchTab(tabName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        }
    });

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
}

// Load dữ liệu từ localStorage hoặc file
async function loadData() {
    if (firebaseEnabled) {
        loadDataFromFirebase();
    } else {
        loadFromLocalStorage();
    }
}

// Load từ Firebase
function loadDataFromFirebase() {
    const outlinesRef = database.ref('outlines');
    
    outlinesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.items) {
            originalData = {
                lastUpdate: data.lastUpdate,
                outlines: data.items
            };
            outlines = data.items;
            showToast('✅ Đã tải dữ liệu từ Firebase', 'success');
        } else {
            // Firebase trống, khởi tạo với dữ liệu mặc định
            if (typeof outlinesData !== 'undefined') {
                outlines = outlinesData.outlines;
                originalData = outlinesData;
                saveToFirebase();
            } else {
                outlines = [];
                originalData = { lastUpdate: new Date().toISOString().split('T')[0], outlines: [] };
            }
        }
        
        updateDashboard();
        renderTable();
        updateJSONPreview();
    }, (error) => {
        console.error('❌ Lỗi Firebase:', error);
        showToast('⚠️ Không kết nối được Firebase, dùng localStorage', 'error');
        loadFromLocalStorage();
    });
}

// Lưu vào localStorage
function saveToLocalStorage() {
    const data = {
        lastUpdate: new Date().toISOString().split('T')[0],
        outlines: outlines
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    originalData = data;
}

// Lưu vào Firebase
function saveToFirebase() {
    if (!firebaseEnabled) {
        saveToLocalStorage();
        return;
    }
    
    const data = {
        lastUpdate: new Date().toISOString().split('T')[0],
        items: outlines
    };
    
    database.ref('outlines').set(data)
        .then(() => {
            console.log('✅ Đã lưu vào Firebase');
            originalData = { lastUpdate: data.lastUpdate, outlines: data.items };
        })
        .catch((error) => {
            console.error('❌ Lỗi lưu Firebase:', error);
            showToast('⚠️ Không lưu được Firebase, dùng localStorage', 'error');
            saveToLocalStorage();
        });
}



// Load từ localStorage
function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            const data = JSON.parse(savedData);
            originalData = data;
            outlines = data.outlines || [];
            showToast('Đã tải dữ liệu từ bộ nhớ tạm', 'success');
        } else if (typeof outlinesData !== 'undefined') {
            // Nếu không có trong localStorage, load từ app.js
            originalData = outlinesData;
            outlines = outlinesData.outlines || [];
            saveToLocalStorage();
            showToast('Đã tải dữ liệu từ hệ thống', 'success');
        } else {
            // Nếu không có gì, khởi tạo dữ liệu mặc định
            originalData = {
                lastUpdate: new Date().toISOString().split('T')[0],
                outlines: []
            };
            outlines = [];
            showToast('Đã khởi tạo dữ liệu mới', 'success');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        originalData = {
            lastUpdate: new Date().toISOString().split('T')[0],
            outlines: []
        };
        outlines = [];
        showToast('Đã khởi tạo dữ liệu mới', 'success');
    }
    
    // Cập nhật giao diện
    updateDashboard();
    renderTable();
    updateJSONPreview();
}

// Lưu vào localStorage
function saveToLocalStorage() {
    const data = {
        lastUpdate: new Date().toISOString().split('T')[0],
        outlines: outlines
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    originalData = data;
}

// Cập nhật dashboard
function updateDashboard() {
    const total = outlines.length;
    const pdfCount = outlines.filter(o => o.fileType === 'pdf').length;
    const docxCount = outlines.filter(o => o.fileType === 'docx').length;
    
    document.getElementById('totalOutlines').textContent = total;
    document.getElementById('totalPDF').textContent = pdfCount;
    document.getElementById('totalDOCX').textContent = docxCount;
    document.getElementById('lastUpdateDate').textContent = 
        new Date(originalData.lastUpdate || new Date()).toLocaleDateString('vi-VN');
}

// Render bảng
function renderTable(filteredOutlines = null) {
    const tbody = document.getElementById('outlinesTableBody');
    const data = filteredOutlines || outlines;

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="loading-row">
                    Chưa có đề cương nào. Hãy thêm đề cương mới!
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = data.map(outline => `
        <tr>
            <td>${outline.id}</td>
            <td style="font-size: 1.5rem;">${outline.icon}</td>
            <td><strong>${outline.subject}</strong></td>
            <td><span class="grade-badge">Lớp ${outline.grade || '-'}</span></td>
            <td>${outline.description}</td>
            <td><code>${outline.fileName}</code></td>
            <td>
                <span class="file-type-badge ${outline.fileType}">
                    ${outline.fileType.toUpperCase()}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-primary btn-small" onclick="editOutline(${outline.id})">
                        ✏️ Sửa
                    </button>
                    <button class="btn btn-accent btn-small" onclick="deleteOutline(${outline.id})">
                        🗑️ Xóa
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Chuyển tiếng Việt có dấu sang không dấu
function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Loại bỏ ký tự đặc biệt, chỉ giữ chữ, số, dấu chấm, gạch ngang
    str = str.replace(/[^a-zA-Z0-9.-]/g, "_");
    // Loại bỏ dấu gạch dưới liên tiếp
    str = str.replace(/_+/g, "_");
    // Loại bỏ dấu gạch dưới đầu/cuối
    str = str.replace(/^_|_$/g, "");
    return str;
}

// Upload file lên GitHub qua API
async function uploadToGitHub(file) {
    console.log('📤 Uploading to GitHub...', {
        fileName: file.name,
        size: file.size,
        type: file.type
    });
    
    // Đọc file thành base64
    const reader = new FileReader();
    const fileContent = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
    
    // Chuyển tên file tiếng Việt sang không dấu
    let fileName = removeVietnameseTones(file.name);
    let filePath = `${GITHUB_CONFIG.docsFolder}${fileName}`;
    
    // Check nếu file đã tồn tại, thêm số vào tên
    let counter = 1;
    let checkUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}`;
    
    while (true) {
        const checkResponse = await fetch(checkUrl, {
            headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` }
        });
        
        if (checkResponse.status === 404) {
            // File chưa tồn tại, OK để upload
            break;
        } else if (checkResponse.ok) {
            // File đã tồn tại, thêm số vào tên
            const nameParts = file.name.split('.');
            const ext = nameParts.pop();
            const baseName = nameParts.join('.');
            const cleanBaseName = removeVietnameseTones(baseName);
            fileName = `${cleanBaseName}_(${counter}).${ext}`;
            filePath = `${GITHUB_CONFIG.docsFolder}${fileName}`;
            checkUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}`;
            counter++;
        } else {
            throw new Error('Failed to check file existence');
        }
    }
    
    console.log('✅ Final file name:', fileName);
    
    // Upload lên GitHub
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}`;
    
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_CONFIG.token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: `Upload file: ${file.name}`,
            content: fileContent,
            branch: GITHUB_CONFIG.branch
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ GitHub upload error:', errorData);
        throw new Error(errorData.message || 'GitHub upload failed');
    }
    
    const data = await response.json();
    console.log('✅ GitHub upload success:', data);
    
    // Trả về URL public từ raw.githubusercontent.com với tên file đã encode
    const encodedFileName = encodeURIComponent(fileName);
    const publicURL = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.docsFolder}${encodedFileName}`;
    return publicURL;
}

// Xóa file từ GitHub
async function deleteFromGitHub(fileURL) {
    try {
        // Trích xuất tên file từ URL
        const urlParts = fileURL.split('/');
        const fileName = decodeURIComponent(urlParts[urlParts.length - 1]);
        const filePath = `${GITHUB_CONFIG.docsFolder}${fileName}`;
        
        console.log('🗑️ Deleting from GitHub:', fileName);
        
        // Lấy SHA của file (cần thiết để xóa)
        const getUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}`;
        const getResponse = await fetch(getUrl, {
            headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` }
        });
        
        if (!getResponse.ok) {
            console.warn('⚠️ File không tồn tại trên GitHub, bỏ qua');
            return;
        }
        
        const fileData = await getResponse.json();
        
        // Xóa file
        const deleteUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}`;
        const deleteResponse = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Delete file: ${fileName}`,
                sha: fileData.sha,
                branch: GITHUB_CONFIG.branch
            })
        });
        
        if (!deleteResponse.ok) {
            const errorData = await deleteResponse.json();
            console.error('❌ GitHub delete error:', errorData);
            throw new Error(errorData.message || 'Delete failed');
        }
        
        console.log('✅ Deleted from GitHub successfully');
    } catch (error) {
        console.error('❌ Error deleting from GitHub:', error);
        // Không throw error để không block việc xóa đề cương
    }
}

// Xử lý thêm đề cương
async function handleAddOutline(e) {
    e.preventDefault();
    
    if (!selectedFile) {
        showToast('❌ Vui lòng chọn file đề cương!', 'error');
        return;
    }
    
    const formData = new FormData(e.target);
    const fileName = formData.get('fileName');
    
    showToast('📤 Đang upload file lên GitHub...', 'info');
    
    try {
        // Upload file lên GitHub
        const fileUrl = await uploadToGitHub(selectedFile);
        
        console.log('✅ Đã upload file lên GitHub:', fileUrl);
        
        const newOutline = {
            id: outlines.length > 0 ? Math.max(...outlines.map(o => o.id)) + 1 : 1,
            subject: formData.get('subject'),
            grade: formData.get('grade'),
            description: formData.get('description'),
            fileName: fileName,
            filePath: fileUrl,
            fileType: formData.get('fileType'),
            icon: formData.get('icon') || '📚'
        };

        outlines.push(newOutline);
        
        if (firebaseEnabled) {
            saveToFirebase();
        } else {
            saveToLocalStorage();
        }
        
        updateDashboard();
        renderTable();
        updateJSONPreview();
        
        // Reset form và file
        e.target.reset();
        removeFile();
        
        showToast('✅ Đã thêm đề cương và upload file thành công!', 'success');
    } catch (error) {
        console.error('❌ Lỗi upload file:', error);
        showToast('❌ Lỗi upload file: ' + error.message, 'error');
    }
    showToast('📌 Nhớ copy file vào thư mục docs/ trước khi push!', 'success');
    
    // Chuyển sang tab quản lý
    setTimeout(() => switchTab('manage'), 1000);
}

// Mở modal chỉnh sửa
function editOutline(id) {
    const outline = outlines.find(o => o.id === id);
    if (!outline) return;

    currentEditId = id;
    
    document.getElementById('editId').value = outline.id;
    document.getElementById('editSubject').value = outline.subject;
    document.getElementById('editGrade').value = outline.grade || '';
    document.getElementById('editDescription').value = outline.description;
    document.getElementById('editFileName').value = outline.fileName;
    document.getElementById('editFileType').value = outline.fileType;
    document.getElementById('editIcon').value = outline.icon;

    openEditModal();
}

// Xử lý cập nhật đề cương
function handleEditOutline(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editId').value);
    const index = outlines.findIndex(o => o.id === id);
    
    if (index === -1) return;

    const fileName = document.getElementById('editFileName').value;
    
    outlines[index] = {
        id: id,
        subject: document.getElementById('editSubject').value,
        grade: document.getElementById('editGrade').value,
        description: document.getElementById('editDescription').value,
        fileName: fileName,
        filePath: `docs/${fileName}`,
        fileType: document.getElementById('editFileType').value,
        icon: document.getElementById('editIcon').value
    };

    if (firebaseEnabled) {
        saveToFirebase();
    } else {
        saveToLocalStorage();
    }
    
    updateDashboard();
    renderTable();
    updateJSONPreview();
    
    closeEditModal();
    showToast('✅ Đã cập nhật đề cương thành công!', 'success');
}

// Xóa đề cương
// Xóa đề cương
async function deleteOutline(id) {
    const outline = outlines.find(o => o.id === id);
    if (!outline) return;
    
    if (!confirm(`Bạn có chắc muốn xóa đề cương "${outline.subject}"?\n\nFile trên GitHub cũng sẽ bị xóa!`)) {
        return;
    }
    
    // Xóa file trên GitHub nếu có
    if (outline.filePath && outline.filePath.includes('githubusercontent.com')) {
        showToast('🗑️ Đang xóa file trên GitHub...', 'info');
        await deleteFromGitHub(outline.filePath);
    }
    
    // Xóa đề cương khỏi danh sách
    outlines = outlines.filter(o => o.id !== id);
    
    if (firebaseEnabled) {
        saveToFirebase();
    } else {
        saveToLocalStorage();
    }
    
    updateDashboard();
    renderTable();
    updateJSONPreview();
    
    showToast('🗑️ Đã xóa đề cương và file!', 'success');
}

// Tìm kiếm
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderTable();
        return;
    }

    const filtered = outlines.filter(outline => {
        return (
            outline.subject.toLowerCase().includes(searchTerm) ||
            outline.description.toLowerCase().includes(searchTerm) ||
            outline.fileName.toLowerCase().includes(searchTerm)
        );
    });

    renderTable(filtered);
}

// Set icon
function setIcon(emoji) {
    document.getElementById('icon').value = emoji;
}

// Modal functions
function openEditModal() {
    document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    currentEditId = null;
}

// Close modal khi click outside
document.getElementById('editModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeEditModal();
    }
});

// Cập nhật JSON preview
function updateJSONPreview() {
    const data = {
        lastUpdate: new Date().toISOString().split('T')[0],
        outlines: outlines
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    document.getElementById('jsonPreview').textContent = jsonString;
}

// Xuất JSON
function exportJSON() {
    const data = {
        lastUpdate: new Date().toISOString().split('T')[0],
        outlines: outlines
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'outlines.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('💾 Đã tải file outlines.json!', 'success');
}

// Copy JSON
function copyJSON() {
    const data = {
        lastUpdate: new Date().toISOString().split('T')[0],
        outlines: outlines
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    
    navigator.clipboard.writeText(jsonString).then(() => {
        showToast('📋 Đã copy JSON vào clipboard!', 'success');
    }).catch(err => {
        console.error('Lỗi copy:', err);
        showToast('❌ Không thể copy JSON', 'error');
    });
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Reset localStorage (để test)
function resetData() {
    if (confirm('Bạn có chắc muốn reset tất cả dữ liệu?')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
}

// Import JSON từ file
function importJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                if (data.outlines && Array.isArray(data.outlines)) {
                    outlines = data.outlines;
                    originalData = data;
                    saveToLocalStorage();
                    updateDashboard();
                    renderTable();
                    updateJSONPreview();
                    showToast('✅ Import thành công!', 'success');
                } else {
                    throw new Error('File JSON không đúng định dạng');
                }
            } catch (error) {
                console.error('Lỗi import:', error);
                showToast('❌ File JSON không hợp lệ!', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}
