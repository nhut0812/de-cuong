// Biến toàn cục
let allOutlines = [];
let currentFilter = 'all';

// Dữ liệu đề cương (nhúng trực tiếp)
const outlinesData = {
  "lastUpdate": "2025-12-16",
  "outlines": []
};

// Hàm tải dữ liệu đề cương
function loadOutlines() {
    if (typeof useFirebase !== 'undefined' && useFirebase && database) {
        loadFromFirebase();
    } else {
        loadFromLocal();
    }
}

// Load từ Firebase
function loadFromFirebase() {
    const outlinesRef = database.ref('outlines');
    
    outlinesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data && data.items && data.items.length > 0) {
            allOutlines = data.items;
            const lastUpdateElement = document.getElementById('lastUpdate');
            if (lastUpdateElement) {
                lastUpdateElement.textContent = formatDate(data.lastUpdate || new Date().toISOString().split('T')[0]);
            }
            displayOutlines(allOutlines);
            console.log('✅ Đã tải dữ liệu từ Firebase');
        } else {
            console.log('📝 Firebase trống, đang khởi tạo dữ liệu mẫu...');
            const initialData = {
                lastUpdate: outlinesData.lastUpdate,
                items: outlinesData.outlines
            };
            outlinesRef.set(initialData).then(() => {
                console.log('✅ Đã khởi tạo dữ liệu mẫu vào Firebase');
                allOutlines = outlinesData.outlines;
                displayOutlines(allOutlines);
            }).catch((error) => {
                console.error('❌ Lỗi khởi tạo Firebase:', error);
                loadFromLocal();
            });
        }
    }, (error) => {
        console.error('❌ Lỗi Firebase:', error);
        loadFromLocal();
    });
}

// Load từ dữ liệu local
function loadFromLocal() {
    try {
        allOutlines = outlinesData.outlines;
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = formatDate(outlinesData.lastUpdate);
        }
        displayOutlines(allOutlines);
        console.log('📝 Đã tải dữ liệu local');
    } catch (error) {
        console.error('Lỗi:', error);
        displayError();
    }
}

// Hàm hiển thị danh sách đề cương
function displayOutlines(outlines) {
    const container = document.getElementById('outlinesList');
    if (!container) {
        console.error('Không tìm thấy container #outlinesList');
        return;
    }
    if (!outlines || outlines.length === 0) {
        container.innerHTML = '<div class="no-results"><p>📭 Chưa có đề cương nào!</p></div>';
        updateTotalCount(0);
        return;
    }
    const cardsHTML = outlines.map(outline => createOutlineCard(outline)).join('');
    container.innerHTML = cardsHTML;
    addCardClickEvents();
    updateTotalCount(outlines.length);
}

// Cập nhật tổng số đề cương
function updateTotalCount(count) {
    const totalCountElement = document.getElementById('totalCount');
    if (totalCountElement) {
        totalCountElement.textContent = count;
    }
}

// Hàm tạo HTML cho một card đề cương
function createOutlineCard(outline) {
    const gradeTag = outline.grade ? `<span class="grade-tag">Lớp ${outline.grade}</span>` : '';
    return `
        <div class="outline-card" data-id="${outline.id}" data-file="${outline.filePath}" data-grade="${outline.grade || ''}">
            <h3><span class="subject-icon">${outline.icon}</span>${outline.subject}${gradeTag}</h3>
            <p class="description">${outline.description}</p>
            <div class="file-info">
                <span class="file-type ${outline.fileType}">${outline.fileType.toUpperCase()}</span>
                <span>${outline.fileName}</span>
            </div>
            <a href="${outline.filePath}" class="download-btn" download="${outline.fileName}" onclick="event.stopPropagation()">📥 Tải xuống</a>
        </div>
    `;
}

// Hàm thêm sự kiện click cho các card
function addCardClickEvents() {
    const cards = document.querySelectorAll('.outline-card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('download-btn')) return;
            const filePath = this.getAttribute('data-file');
            const fileName = this.querySelector('.file-info span:last-child').textContent;
            downloadFile(filePath, fileName);
        });
    });
}

// Hàm tải file
function downloadFile(filePath, fileName) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Hàm tìm kiếm
function searchOutlines(searchTerm) {
    let filtered = allOutlines;
    if (currentFilter !== 'all') {
        filtered = filtered.filter(outline => outline.grade === currentFilter);
    }
    if (searchTerm) {
        const searchString = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(outline => {
            return (
                outline.subject.toLowerCase().includes(searchString) ||
                outline.description.toLowerCase().includes(searchString) ||
                outline.fileName.toLowerCase().includes(searchString)
            );
        });
    }
    displayOutlines(filtered);
}

// Hàm lọc theo lớp
function filterByGrade(grade) {
    currentFilter = grade;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-grade') === grade) {
            btn.classList.add('active');
        }
    });
    const searchTerm = document.getElementById('searchInput').value;
    searchOutlines(searchTerm);
}

// Hàm format ngày
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Hàm hiển thị lỗi
function displayError() {
    const container = document.getElementById('outlinesList');
    if (container) {
        container.innerHTML = '<div class="no-results"><p style="color: #e74c3c;">❌ Đã xảy ra lỗi khi tải đề cương!</p></div>';
    }
}

// Khởi tạo khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    loadOutlines();
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchOutlines(e.target.value);
            }, 300);
        });
    }
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const grade = this.getAttribute('data-grade');
            filterByGrade(grade);
        });
    });
});
