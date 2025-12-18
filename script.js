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

// DOM Elements
const suggestionForm = document.getElementById('suggestionForm');
const suggestionText = document.getElementById('suggestionText');
const suggestionsList = document.getElementById('suggestionsList');

const assignmentForm = document.getElementById('assignmentForm');
const assignmentName = document.getElementById('assignmentName');
const assignmentDeadline = document.getElementById('assignmentDeadline');
const assignmentItems = document.getElementById('assignmentItems');

const financeForm = document.getElementById('financeForm');
const financeFile = document.getElementById('financeFile');
const financeItems = document.getElementById('financeItems');

// Initialize the app
function initApp() {
    loadSuggestions();
    loadAssignments();
    loadFinanceRecords();
}

// Suggestions functionality
function loadSuggestions() {
    const suggestions = StorageManager.getSuggestions();
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
    
    const text = suggestionText.value.trim();
    if (!text) return;
    
    StorageManager.addSuggestion(text);
    suggestionText.value = '';
    loadSuggestions();
}

// Assignments functionality
function loadAssignments() {
    const assignments = StorageManager.getAssignments();
    assignmentItems.innerHTML = '';
    
    if (assignments.length === 0) {
        assignmentItems.innerHTML = '<li><em>Belum ada tugas yang ditambahkan.</em></li>';
        return;
    }
    
    assignments.forEach(assignment => {
        const li = document.createElement('li');
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
    financeItems.innerHTML = '';
    
    if (records.length === 0) {
        financeItems.innerHTML = '<li><em>Belum ada file keuangan yang diupload.</em></li>';
        return;
    }
    
    records.forEach(record => {
        const li = document.createElement('li');
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

// Event listeners
suggestionForm.addEventListener('submit', submitSuggestion);
assignmentForm.addEventListener('submit', submitAssignment);
financeForm.addEventListener('submit', submitFinance);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupNavigation();
});