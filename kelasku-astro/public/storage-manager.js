// Simple storage system using localStorage
const StorageManager = {
    // Suggestions
    getSuggestions() {
        return JSON.parse(localStorage.getItem('suggestions') || '[]');
    },

    addSuggestion(text) {
        const suggestions = this.getSuggestions();
        suggestions.push({
            id: Date.now(),
            text: text,
            timestamp: new Date().toLocaleString()
        });
        localStorage.setItem('suggestions', JSON.stringify(suggestions));
        return suggestions;
    },

    // Assignments
    getAssignments() {
        return JSON.parse(localStorage.getItem('assignments') || '[]');
    },

    addAssignment(name, deadline) {
        const assignments = this.getAssignments();
        assignments.push({
            id: Date.now(),
            name: name,
            deadline: deadline,
            timestamp: new Date().toLocaleDateString()
        });
        localStorage.setItem('assignments', JSON.stringify(assignments));
        return assignments;
    },

    removeAssignment(id) {
        let assignments = this.getAssignments();
        assignments = assignments.filter(assignment => assignment.id !== id);
        localStorage.setItem('assignments', JSON.stringify(assignments));
        return assignments;
    },

    // Finance records
    getFinanceRecords() {
        return JSON.parse(localStorage.getItem('financeRecords') || '[]');
    },

    addFinanceRecord(filename, date) {
        const records = this.getFinanceRecords();
        records.push({
            id: Date.now(),
            filename: filename,
            date: date,
            timestamp: new Date().toLocaleDateString()
        });
        localStorage.setItem('financeRecords', JSON.stringify(records));
        return records;
    },

    removeFinanceRecord(id) {
        let records = this.getFinanceRecords();
        records = records.filter(record => record.id !== id);
        localStorage.setItem('financeRecords', JSON.stringify(records));
        return records;
    }
};

// Initialize the app
function initApp() {
    // Load suggestions if on suggestions page
    if (document.querySelector('#suggestionsList')) {
        loadSuggestions();
    }

    // Load assignments if on assignments page
    if (document.querySelector('#assignmentItems')) {
        loadAssignments();
    }

    // Load finance records if on finance page
    if (document.querySelector('#financeItems')) {
        loadFinanceRecords();
    }
}

// Suggestions functionality
function loadSuggestions() {
    const suggestions = StorageManager.getSuggestions();
    const suggestionsList = document.getElementById('suggestionsList');

    if (!suggestionsList) return;

    suggestionsList.innerHTML = '';

    if (suggestions.length === 0) {
        suggestionsList.innerHTML = `
            <div class="no-data">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Belum ada saran atau kritik.
            </div>
        `;
        return;
    }

    suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.innerHTML = `
            <div class="suggestion-content">${suggestion.text}</div>
            <small class="suggestion-date">Dikirim: ${suggestion.timestamp}</small>
        `;
        suggestionsList.appendChild(div);
    });
}

function submitSuggestion(e) {
    e.preventDefault();

    const suggestionText = document.getElementById('suggestionText');
    const text = suggestionText.value.trim();
    if (!text) return;

    StorageManager.addSuggestion(text);
    suggestionText.value = '';
    loadSuggestions();
}

// Assignments functionality
function loadAssignments() {
    const assignments = StorageManager.getAssignments();
    const assignmentItems = document.getElementById('assignmentItems');

    if (!assignmentItems) return;

    assignmentItems.innerHTML = '';

    if (assignments.length === 0) {
        assignmentItems.innerHTML = `
            <li class="no-data">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Belum ada tugas yang ditambahkan.
            </li>
        `;
        return;
    }

    assignments.forEach(assignment => {
        const li = document.createElement('li');
        li.className = 'assignment-item';
        const deadlineDate = new Date(assignment.deadline);
        const formattedDeadline = deadlineDate.toLocaleDateString('id-ID');
        const today = new Date();

        // Check if assignment is overdue
        const isOverdue = deadlineDate < today && !isNaN(deadlineDate.getTime());
        const deadlineClass = isOverdue ? 'assignment-deadline overdue' : 'assignment-deadline';
        const deadlineText = isOverdue ? `${formattedDeadline} (Terlambat!)` : formattedDeadline;

        li.innerHTML = `
            <div>
                <strong>${assignment.name}</strong>
                <span class="${deadlineClass}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Deadline: ${deadlineText}
                </span>
            </div>
            <button class="delete-btn" onclick="removeAssignment(${assignment.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
                Hapus
            </button>
        `;
        assignmentItems.appendChild(li);
    });
}

function submitAssignment(e) {
    e.preventDefault();

    const assignmentName = document.getElementById('assignmentName');
    const assignmentDeadline = document.getElementById('assignmentDeadline');

    const name = assignmentName.value.trim();
    const deadline = assignmentDeadline.value;

    if (!name || !deadline) return;

    StorageManager.addAssignment(name, deadline);
    assignmentName.value = '';
    assignmentDeadline.value = '';
    loadAssignments();
}

function removeAssignment(id) {
    StorageManager.removeAssignment(id);
    loadAssignments();
}

// Finance functionality
function loadFinanceRecords() {
    const records = StorageManager.getFinanceRecords();
    const financeItems = document.getElementById('financeItems');

    if (!financeItems) return;

    financeItems.innerHTML = '';

    if (records.length === 0) {
        financeItems.innerHTML = `
            <li class="no-data">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                Belum ada file keuangan yang diupload.
            </li>
        `;
        return;
    }

    records.forEach(record => {
        const li = document.createElement('li');
        li.className = 'finance-item';
        li.innerHTML = `
            <div>
                <strong>${record.filename}</strong>
                <span class="assignment-deadline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Diupload: ${record.timestamp}
                </span>
            </div>
            <button class="delete-btn" onclick="removeFinanceRecord(${record.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
                Hapus
            </button>
        `;
        financeItems.appendChild(li);
    });
}

function submitFinance(e) {
    e.preventDefault();

    const financeFile = document.getElementById('financeFile');
    const file = financeFile.files[0];
    if (!file) return;

    const fileName = file.name;
    StorageManager.addFinanceRecord(fileName, new Date().toISOString().split('T')[0]);
    financeFile.value = '';
    loadFinanceRecords();

    // Show a visual feedback instead of alert
    const originalText = document.querySelector('#financeForm button').textContent;
    document.querySelector('#financeForm button').innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Berhasil!
        `;

    setTimeout(() => {
        document.querySelector('#financeForm button').innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload File
        `;
    }, 2000);
}

function removeFinanceRecord(id) {
    StorageManager.removeFinanceRecord(id);
    loadFinanceRecords();
}

// Navigation functionality
function setupNavigation() {
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            if (targetId === '') {
                // Special case for home page
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupNavigation();

    // Add event listeners to forms if they exist
    const suggestionForm = document.getElementById('suggestionForm');
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', submitSuggestion);
    }

    const assignmentForm = document.getElementById('assignmentForm');
    if (assignmentForm) {
        assignmentForm.addEventListener('submit', submitAssignment);
    }

    const financeForm = document.getElementById('financeForm');
    if (financeForm) {
        financeForm.addEventListener('submit', submitFinance);
    }
});