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
        suggestionsList.innerHTML = '<p class="no-data">Belum ada saran atau kritik.</p>';
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
        assignmentItems.innerHTML = '<li><em>Belum ada tugas yang ditambahkan.</em></li>';
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
                <span class="${deadlineClass}">Deadline: ${deadlineText}</span>
            </div>
            <button class="delete-btn" onclick="removeAssignment(${assignment.id})">Hapus</button>
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
        financeItems.innerHTML = '<li><em>Belum ada file keuangan yang diupload.</em></li>';
        return;
    }
    
    records.forEach(record => {
        const li = document.createElement('li');
        li.className = 'finance-item';
        li.innerHTML = `
            <div>
                <strong>${record.filename}</strong>
                <span class="assignment-deadline">Diupload: ${record.timestamp}</span>
            </div>
            <button class="delete-btn" onclick="removeFinanceRecord(${record.id})">Hapus</button>
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
    
    alert(`File "${fileName}" berhasil diupload!`);
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