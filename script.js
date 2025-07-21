class SkillTreeApp {
    constructor() {
        this.skills = [];
        this.nextId = 1;
        this.currentSkillPositions = new Map();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadFromStorage();
        this.render();
    }

    bindEvents() {
        document.getElementById('addSkillBtn').addEventListener('click', () => this.openAddSkillModal());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveToFile());
        document.getElementById('loadBtn').addEventListener('click', () => this.loadFromFile());
        document.getElementById('addSkillForm').addEventListener('submit', (e) => this.handleAddSkill(e));
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') this.closeModal();
        });
        document.getElementById('skillDetailModal').addEventListener('click', (e) => {
            if (e.target.id === 'skillDetailModal') this.closeSkillDetail();
        });
        this.addMilestone();
    }

    openAddSkillModal() {
        document.getElementById('modalOverlay').classList.add('active');
        document.getElementById('skillName').focus();
    }

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
        this.resetForm();
    }

    closeSkillDetail() {
        document.getElementById('skillDetailModal').classList.remove('active');
    }

    resetForm() {
        document.getElementById('addSkillForm').reset();
        const container = document.getElementById('milestonesContainer');
        container.innerHTML = '';
        this.addMilestone();
    }

    addMilestone() {
        const container = document.getElementById('milestonesContainer');
        const milestoneDiv = document.createElement('div');
        milestoneDiv.className = 'milestone-input';
        milestoneDiv.innerHTML = `
            <input type="text" placeholder="e.g., Learn Variables and Data Types" class="milestone-name" required>
            <button type="button" class="remove-milestone" onclick="app.removeMilestone(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        container.appendChild(milestoneDiv);
    }

    removeMilestone(button) {
        const container = document.getElementById('milestonesContainer');
        if (container.children.length > 1) {
            button.parentElement.remove();
        }
    }

    handleAddSkill(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const milestoneInputs = document.querySelectorAll('.milestone-name');
        const milestones = Array.from(milestoneInputs)
            .map(input => input.value.trim())
            .filter(value => value.length > 0)
            .map(name => ({
                id: this.generateId(),
                name,
                completed: false
            }));
        if (milestones.length === 0) {
            alert('Please add at least one milestone.');
            return;
        }
        const skill = {
            id: this.generateId(),
            name: document.getElementById('skillName').value.trim(),
            description: document.getElementById('skillDescription').value.trim(),
            category: document.getElementById('skillCategory').value,
            milestones,
            completed: false,
            createdAt: new Date().toISOString()
        };
        this.skills.push(skill);
        this.closeModal();
        this.render();
        this.saveToStorage();
    }

    generateId() {
        return this.nextId++;
    }

    toggleMilestone(skillId, milestoneId) {
        const skill = this.skills.find(s => s.id === skillId);
        if (!skill) return;
        const milestone = skill.milestones.find(m => m.id === milestoneId);
        if (!milestone) return;
        milestone.completed = !milestone.completed;
        skill.completed = skill.milestones.every(m => m.completed);
        this.saveToStorage();
        const modal = document.getElementById('skillDetailModal');
        if (modal.classList.contains('active')) {
            this.openSkillDetail(skillId);
            this.renderStats();
            this.renderSkillsList();
            this.renderTree();
        } else {
            this.render();
        }
    }

    deleteSkill(skillId) {
        if (confirm('Are you sure you want to delete this skill?')) {
            const originalLength = this.skills.length;
            this.skills = this.skills.filter(s => s.id !== skillId);
            if (this.skills.length < originalLength) {
                this.saveToStorage();
                this.closeSkillDetail();
                this.render();
                window.location.reload();
            }
        }
    }

    openSkillDetail(skillId) {
        const skill = this.skills.find(s => s.id === skillId);
        if (!skill) return;
        const modal = document.getElementById('skillDetailModal');
        const title = document.getElementById('skillDetailTitle');
        const content = document.getElementById('skillDetailContent');
        title.textContent = skill.name;
        const completedMilestones = skill.milestones.filter(m => m.completed).length;
        const progressPercentage = skill.milestones.length > 0 
            ? Math.round((completedMilestones / skill.milestones.length) * 100) 
            : 0;
        content.innerHTML = `
            <div class="skill-detail-header">
                <div class="skill-detail-category">
                    <span class="skill-category">${this.getCategoryName(skill.category)}</span>
                </div>
                <div class="skill-detail-progress">
                    <div class="progress-info">
                        <span>${completedMilestones}/${skill.milestones.length} Milestones Complete</span>
                        <span class="progress-percent">${progressPercentage}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                    </div>
                </div>
            </div>
            ${skill.description ? `
                <div class="skill-description">
                    <h4>Description</h4>
                    <p>${skill.description}</p>
                </div>
            ` : ''}
            <div class="skill-milestones">
                <h4>Milestones</h4>
                <div class="milestones-list">
                    ${skill.milestones.map(milestone => `
                        <div class="milestone-item ${milestone.completed ? 'completed' : ''}">
                            <label class="milestone-checkbox ${milestone.completed ? 'completed' : ''}">
                                <input type="checkbox" data-skill-id="${skill.id}" data-milestone-id="${milestone.id}" ${milestone.completed ? 'checked' : ''} />
                            </label>
                            <span class="milestone-text">${milestone.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="skill-actions">
                <button class="btn btn-secondary" onclick="app.deleteSkill(${skill.id})">
                    <i class="fas fa-trash"></i> Delete Skill
                </button>
            </div>
        `;
        setTimeout(() => {
            document.querySelectorAll('#skillDetailContent .milestone-checkbox input[type="checkbox"]').forEach(box => {
                box.onchange = (e) => {
                    e.stopPropagation();
                    const skillId = Number(box.getAttribute('data-skill-id'));
                    const milestoneId = Number(box.getAttribute('data-milestone-id'));
                    app.toggleMilestone(skillId, milestoneId);
                };
            });
        }, 0);
        modal.classList.add('active');
    }

    getCategoryName(category) {
        const categories = {
            programming: 'Programming',
            design: 'Design',
            data: 'Data Science',
            business: 'Business',
            other: 'Other'
        };
        return categories[category] || 'Other';
    }

    getCategoryColor(category) {
        const colors = {
            programming: '#3b82f6',
            design: '#8b5cf6',
            data: '#10b981',
            business: '#f59e0b',
            other: '#6b7280'
        };
        return colors[category] || '#6b7280';
    }

    calculateTreePositions() {
        const positions = new Map();
        const nodeWidth = 250;
        const nodeHeight = 200;
        const horizontalSpacing = 100;
        const verticalSpacing = 80;
        this.skills.forEach((skill, index) => {
            const col = index % 3;
            const row = Math.floor(index / 3);
            positions.set(skill.id, {
                x: col * (nodeWidth + horizontalSpacing) + 50,
                y: row * (nodeHeight + verticalSpacing) + 50
            });
        });
        return positions;
    }

    render() {
        this.renderStats();
        this.renderSkillsList();
        this.renderTree();
    }

    renderStats() {
        const totalSkills = this.skills.length;
        const totalMilestones = this.skills.reduce((sum, skill) => sum + skill.milestones.length, 0);
        const completedMilestones = this.skills.reduce((sum, skill) => 
            sum + skill.milestones.filter(m => m.completed).length, 0);
        const progressPercentage = totalMilestones > 0 
            ? Math.round((completedMilestones / totalMilestones) * 100) 
            : 0;
        document.getElementById('totalSkills').textContent = totalSkills;
        document.getElementById('completedMilestones').textContent = `${completedMilestones}/${totalMilestones}`;
        document.getElementById('progressPercentage').textContent = `${progressPercentage}%`;
        document.getElementById('progressBar').style.width = `${progressPercentage}%`;
    }

    renderSkillsList() {
        const container = document.getElementById('skillsList');
        if (this.skills.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No skills added yet</p>';
            return;
        }
        container.innerHTML = this.skills.map(skill => {
            const completedMilestones = skill.milestones.filter(m => m.completed).length;
            const progressPercentage = skill.milestones.length > 0 
                ? Math.round((completedMilestones / skill.milestones.length) * 100) 
                : 0;
            return `
                <div class="skill-item" onclick="app.openSkillDetail(${skill.id})">
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-progress">${completedMilestones}/${skill.milestones.length} milestones (${progressPercentage}%)</div>
                    <span class="skill-category">${this.getCategoryName(skill.category)}</span>
                </div>
            `;
        }).join('');
    }

    renderTree() {
        const canvas = document.getElementById('treeCanvas');
        const emptyState = document.getElementById('emptyState');
        if (this.skills.length === 0) {
            emptyState.style.display = 'flex';
            canvas.style.display = 'block';
            canvas.innerHTML = '';
            canvas.appendChild(emptyState);
            return;
        }
        emptyState.style.display = 'none';
        canvas.innerHTML = '';
        const positions = this.calculateTreePositions();
        this.skills.forEach(skill => {
            const position = positions.get(skill.id);
            const completedMilestones = skill.milestones.filter(m => m.completed).length;
            const progressPercentage = skill.milestones.length > 0 
                ? Math.round((completedMilestones / skill.milestones.length) * 100) 
                : 0;
            const node = document.createElement('div');
            node.className = `skill-node ${skill.completed ? 'completed' : ''}`;
            node.style.left = `${position.x}px`;
            node.style.top = `${position.y}px`;
            node.innerHTML = `
                <div class="skill-node-header">
                    <div class="skill-node-title">${skill.name}</div>
                    <span class="skill-node-category">${this.getCategoryName(skill.category)}</span>
                </div>
                <div class="skill-node-progress">
                    <div class="progress-info" style="font-size: 0.875rem; margin-bottom: 0.75rem; color: ${skill.completed ? 'rgba(255,255,255,0.8)' : '#6b7280'};">
                        ${completedMilestones}/${skill.milestones.length} milestones (${progressPercentage}% )
                    </div>
                </div>
                <ul class="milestones-list">
                    ${skill.milestones.slice(0, 3).map(milestone => `
                        <li class="milestone-item ${milestone.completed ? 'completed' : ''}">
                            <label class="milestone-checkbox ${milestone.completed ? 'completed' : ''}">
                                <input type="checkbox" data-skill-id="${skill.id}" data-milestone-id="${milestone.id}" ${milestone.completed ? 'checked' : ''} />
                            </label>
                            <span class="milestone-text">${milestone.name}</span>
                        </li>
                    `).join('')}
                    ${skill.milestones.length > 3 ? `
                        <li style="text-align: center; padding: 0.5rem 0; color: ${skill.completed ? 'rgba(255,255,255,0.6)' : '#9ca3af'}; font-size: 0.75rem;">
                            +${skill.milestones.length - 3} more milestones
                        </li>
                    ` : ''}
                </ul>
            `;
            setTimeout(() => {
                node.querySelectorAll('.milestone-checkbox input[type="checkbox"]').forEach(box => {
                    box.onchange = (e) => {
                        e.stopPropagation();
                        const skillId = Number(box.getAttribute('data-skill-id'));
                        const milestoneId = Number(box.getAttribute('data-milestone-id'));
                        app.toggleMilestone(skillId, milestoneId);
                        app.render();
                    };
                });
            }, 0);
            node.addEventListener('click', () => this.openSkillDetail(skill.id));
            canvas.appendChild(node);
        });
        this.drawConnections(canvas, positions);
        const overallProgress = this.skills.reduce((sum, skill) => sum + skill.milestones.filter(m => m.completed).length, 0) / this.skills.reduce((sum, skill) => sum + skill.milestones.length, 0) * 100;
        canvas.style.transform = `scale(${1 + overallProgress / 100})`;
        canvas.style.transition = 'transform 0.5s ease';
    }

    drawConnections(canvas, positions) {
        for (let i = 0; i < this.skills.length - 1; i++) {
            const currentSkill = this.skills[i];
            const nextSkill = this.skills[i + 1];
            const currentPos = positions.get(currentSkill.id);
            const nextPos = positions.get(nextSkill.id);
            const line = document.createElement('div');
            line.className = `connection-line ${currentSkill.completed ? 'completed' : ''}`;
            const deltaX = nextPos.x - currentPos.x;
            const deltaY = nextPos.y - currentPos.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
            line.style.width = `${distance}px`;
            line.style.height = '3px';
            line.style.left = `${currentPos.x + 125}px`;
            line.style.top = `${currentPos.y + 100}px`;
            line.style.transformOrigin = '0 50%';
            line.style.transform = `rotate(${angle}deg)`;
            canvas.appendChild(line);
        }
    }

    saveToStorage() {
        const data = {
            skills: this.skills,
            nextId: this.nextId,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem('skilltree-data', JSON.stringify(data));
    }

    loadFromStorage() {
        const data = localStorage.getItem('skilltree-data');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                this.skills = parsed.skills || [];
                this.nextId = parsed.nextId || 1;
            } catch (e) {
                console.error('Error loading from storage:', e);
            }
        }
    }

    saveToFile() {
        const data = {
            skills: this.skills,
            nextId: this.nextId,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `skilltree-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('SkillTree data saved successfully!');
    }

    loadFromFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.skills && Array.isArray(data.skills)) {
                        if (confirm('This will replace your current progress. Continue?')) {
                            this.skills = data.skills;
                            this.nextId = data.nextId || this.skills.length + 1;
                            this.render();
                            this.saveToStorage();
                            alert('SkillTree data loaded successfully!');
                        }
                    } else {
                        alert('Invalid file format. Please select a valid SkillTree backup file.');
                    }
                } catch (error) {
                    alert('Error reading file. Please make sure it\'s a valid JSON file.');
                    console.error('Error parsing file:', error);
                }
            };
            reader.readAsText(file);
        });
        input.click();
    }
}

let pomodoroInterval = null;
let workTime = 25;
let breakTime = 5;
let pomodoroSeconds = workTime * 60;
let isWorkSession = true;
let isPaused = false;

function updatePomodoroDisplay() {
    const min = String(Math.floor(pomodoroSeconds / 60)).padStart(2, '0');
    const sec = String(pomodoroSeconds % 60).padStart(2, '0');
    const timerEl = document.getElementById('pomodoroTimeBox');
    if (timerEl) timerEl.textContent = `${min}:${sec}`;
}

function togglePomodoro() {
    const startBtn = document.getElementById('pomodoroStart');
    if (!pomodoroInterval) {
        pomodoroInterval = setInterval(() => {
            if (pomodoroSeconds > 0) {
                pomodoroSeconds--;
                updatePomodoroDisplay();
            } else {
                clearInterval(pomodoroInterval);
                pomodoroInterval = null;
                startBtn.textContent = 'Start';
                startBtn.classList.remove('paused');
                if (isWorkSession) {
                    alert('Work session complete! Time for a break.');
                    pomodoroSeconds = breakTime * 60;
                    isWorkSession = false;
                    updatePomodoroDisplay();
                } else {
                    alert('Break complete! Time to work.');
                    pomodoroSeconds = workTime * 60;
                    isWorkSession = true;
                    updatePomodoroDisplay();
                }
            }
        }, 1000);
        startBtn.textContent = 'Pause';
        startBtn.classList.add('paused');
        isPaused = false;
    } else {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
        startBtn.textContent = 'Start';
        startBtn.classList.remove('paused');
        isPaused = true;
    }
}

function resetPomodoro() {
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
    pomodoroSeconds = isWorkSession ? workTime * 60 : breakTime * 60;
    updatePomodoroDisplay();
    const startBtn = document.getElementById('pomodoroStart');
    if (startBtn) {
        startBtn.textContent = 'Start';
        startBtn.classList.remove('paused');
    }
    isPaused = false;
}

function applyPomodoroSettings() {
    workTime = Math.max(1, Math.min(60, Number(document.getElementById('workTimeInput').value)));
    breakTime = Math.max(1, Math.min(30, Number(document.getElementById('breakTimeInput').value)));
    isWorkSession = true;
    pomodoroSeconds = workTime * 60;
    resetPomodoro();
}

const pomodoroSettingsBtn = document.getElementById('pomodoroSettingsBtn');
const pomodoroSettingsBox = document.getElementById('pomodoroSettingsBox');
if (pomodoroSettingsBtn && pomodoroSettingsBox) {
    pomodoroSettingsBtn.addEventListener('click', () => {
        pomodoroSettingsBox.classList.toggle('active');
    });
}

document.getElementById('pomodoroStart').addEventListener('click', togglePomodoro);
document.getElementById('pomodoroReset').addEventListener('click', resetPomodoro);
document.getElementById('pomodoroApply').addEventListener('click', applyPomodoroSettings);
updatePomodoroDisplay();

window.openAddSkillModal = () => app.openAddSkillModal();
window.closeModal = () => app.closeModal();
window.closeSkillDetail = () => app.closeSkillDetail();
window.removeMilestone = (button) => app.removeMilestone(button);
window.addMilestone = () => app.addMilestone();

const app = new SkillTreeApp();