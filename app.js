// ===== KONFIGURACJA I STAŁE =====

// Dostępne kolory dla nawyków
const COLORS = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe',
    '#43e97b', '#fa709a', '#fee140', '#30cfd0',
    '#a8edea', '#ff6b6b', '#4ecdc4', '#45b7d1'
];

// Dostępne ikony dla nawyków
const ICONS = [
    '💧', '📚', '🏃', '🧘', '🥗', '💪',
    '🎯', '✍️', '🎨', '🎵', '🌱', '☕',
    '🌙', '⏰', '📱', '🧠', '❤️', '🌟'
];

// Częstotliwości
const FREQUENCIES = {
    daily: 'Codziennie',
    weekdays: 'Dni robocze',
    weekends: 'Weekendy',
    weekly: 'Raz w tygodniu'
};

// ===== ZARZĄDZANIE DANYMI =====

// Pobierz dane z localStorage
function loadHabits() {
    const saved = localStorage.getItem('habitCoachData');
    return saved ? JSON.parse(saved) : [];
}

// Zapisz dane do localStorage
function saveHabits(habits) {
    localStorage.setItem('habitCoachData', JSON.stringify(habits));
}

// Pobierz aktywności z localStorage
function loadActivities() {
    const saved = localStorage.getItem('habitCoachActivities');
    return saved ? JSON.parse(saved) : [];
}

// Zapisz aktywności do localStorage
function saveActivities(activities) {
    localStorage.setItem('habitCoachActivities', JSON.stringify(activities));
}

// ===== STAN APLIKACJI =====

let habits = loadHabits();
let activities = loadActivities();
let editingHabitId = null;

// ===== INICJALIZACJA APLIKACJI =====

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderHabits();
    renderActivities();
    renderStatistics();
    generateInsights();
    setupEventListeners();
}

// ===== EVENT LISTENERS =====

function setupEventListeners() {
    // Przycisk dodawania nawyku
    document.getElementById('addHabitBtn').addEventListener('click', openAddHabitModal);
    
    // Przycisk "Dobre nawyki"
    document.getElementById('goodHabitsBtn').addEventListener('click', function() {
        window.open('https://www.youtube.com/watch?v=WF5nHZvvg3E', '_blank');
    });
    
    // Zamykanie modala
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('habitModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    // Formularz
    document.getElementById('habitForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    
    // Wybór koloru
    setupColorPicker();
    
    // Wybór ikony
    setupIconPicker();
    
    // Aktywności
    document.getElementById('addActivityBtn').addEventListener('click', addActivity);
    document.getElementById('activityInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addActivity();
    });
    
    // Przełącznik trybu ciemnego
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    loadTheme();
}

// ===== MODAL =====

function openAddHabitModal() {
    editingHabitId = null;
    document.getElementById('modalTitle').textContent = 'Dodaj nowy nawyk';
    document.getElementById('habitForm').reset();
    
    // Ustaw domyślne wartości
    selectColor(COLORS[0]);
    selectIcon(ICONS[0]);
    
    document.getElementById('habitModal').classList.add('active');
}

function openEditHabitModal(habitId) {
    editingHabitId = habitId;
    const habit = habits.find(h => h.id === habitId);
    
    if (!habit) return;
    
    document.getElementById('modalTitle').textContent = 'Edytuj nawyk';
    document.getElementById('habitName').value = habit.name;
    document.getElementById('habitDescription').value = habit.description || '';
    document.getElementById('habitFrequency').value = habit.frequency;
    
    selectColor(habit.color);
    selectIcon(habit.icon);
    
    document.getElementById('habitModal').classList.add('active');
}

function closeModal() {
    document.getElementById('habitModal').classList.remove('active');
    editingHabitId = null;
}

// ===== WYBÓR KOLORU I IKONY =====

function setupColorPicker() {
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.innerHTML = COLORS.map(color => 
        `<div class="color-option" data-color="${color}" style="background-color: ${color}"></div>`
    ).join('');
    
    colorPicker.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            selectColor(this.dataset.color);
        });
    });
}

function setupIconPicker() {
    const iconPicker = document.getElementById('iconPicker');
    iconPicker.innerHTML = ICONS.map(icon => 
        `<div class="icon-option" data-icon="${icon}">${icon}</div>`
    ).join('');
    
    iconPicker.querySelectorAll('.icon-option').forEach(option => {
        option.addEventListener('click', function() {
            selectIcon(this.dataset.icon);
        });
    });
}

function selectColor(color) {
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.toggle('selected', option.dataset.color === color);
    });
    document.getElementById('selectedColor').value = color;
}

function selectIcon(icon) {
    document.querySelectorAll('.icon-option').forEach(option => {
        option.classList.toggle('selected', option.dataset.icon === icon);
    });
    document.getElementById('selectedIcon').value = icon;
}

// ===== OBSŁUGA FORMULARZA =====

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('habitName').value.trim(),
        description: document.getElementById('habitDescription').value.trim(),
        frequency: document.getElementById('habitFrequency').value,
        color: document.getElementById('selectedColor').value,
        icon: document.getElementById('selectedIcon').value
    };
    
    if (!formData.name) {
        alert('Podaj nazwę nawyku!');
        return;
    }
    
    if (editingHabitId) {
        updateHabit(editingHabitId, formData);
    } else {
        addHabit(formData);
    }
    
    closeModal();
}

// ===== OPERACJE NA NAWYKACH =====

function addHabit(formData) {
    const newHabit = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        completions: [], // tablica dat wykonania
        skips: [] // tablica dat pominięcia
    };
    
    habits.push(newHabit);
    saveHabits(habits);
    renderHabits();
    generateInsights();
}

function updateHabit(habitId, formData) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    Object.assign(habit, formData);
    saveHabits(habits);
    renderHabits();
    generateInsights();
}

function deleteHabit(habitId) {
    if (!confirm('Czy na pewno chcesz usunąć ten nawyk? Wszystkie dane zostaną utracone.')) {
        return;
    }
    
    habits = habits.filter(h => h.id !== habitId);
    saveHabits(habits);
    renderHabits();
    generateInsights();
}

function toggleHabit(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const today = new Date().toDateString();
    const completionIndex = habit.completions.findIndex(date => 
        new Date(date).toDateString() === today
    );
    
    const button = document.querySelector(`#check-${habitId}`);
    
    if (completionIndex === -1) {
        // Oznacz jako wykonane
        habit.completions.push(new Date().toISOString());
        
        // Usuń z pominięć jeśli było
        habit.skips = habit.skips.filter(date => 
            new Date(date).toDateString() !== today
        );
        
        // Animacja
        button.classList.add('checking');
        setTimeout(() => button.classList.remove('checking'), 600);
    } else {
        // Cofnij wykonanie
        habit.completions.splice(completionIndex, 1);
    }
    
    saveHabits(habits);
    renderHabits();
    renderStatistics();
    generateInsights();
}

// ===== RENDEROWANIE =====

function renderHabits() {
    const habitsList = document.getElementById('habitsList');
    const noHabitsMessage = document.getElementById('noHabitsMessage');
    
    if (habits.length === 0) {
        habitsList.innerHTML = '';
        noHabitsMessage.style.display = 'block';
        return;
    }
    
    noHabitsMessage.style.display = 'none';
    habitsList.innerHTML = habits.map(habit => createHabitCard(habit)).join('');
    
    // Dodaj event listenery
    habits.forEach(habit => {
        document.getElementById(`check-${habit.id}`).addEventListener('click', () => toggleHabit(habit.id));
        document.getElementById(`edit-${habit.id}`).addEventListener('click', () => openEditHabitModal(habit.id));
        document.getElementById(`delete-${habit.id}`).addEventListener('click', () => deleteHabit(habit.id));
    });
}

function createHabitCard(habit) {
    const today = new Date().toDateString();
    const isCompletedToday = habit.completions.some(date => 
        new Date(date).toDateString() === today
    );
    
    const streak = calculateStreak(habit);
    const completionRate = calculateCompletionRate(habit);
    const weekChart = generateWeekChart(habit);
    
    return `
        <div class="habit-card ${isCompletedToday ? 'completed' : ''}" style="border-left-color: ${habit.color}">
            <div class="habit-header">
                <div class="habit-info">
                    <div class="habit-title">
                        <span class="habit-icon">${habit.icon}</span>
                        <span class="habit-name">${habit.name}</span>
                    </div>
                    ${habit.description ? `<div class="habit-description">${habit.description}</div>` : ''}
                    <span class="habit-frequency">${FREQUENCIES[habit.frequency]}</span>
                </div>
                <div class="habit-stats-row">
                    <span class="habit-streak">🔥 ${streak} ${streak === 1 ? 'dzień' : 'dni'}</span>
                    <span class="habit-completion-rate">📊 ${completionRate}%</span>
                </div>
            </div>
            
            ${weekChart}
            
            <div class="habit-actions">
                <button id="check-${habit.id}" class="btn-check ${isCompletedToday ? 'checked' : ''}">
                    ${isCompletedToday ? '✓ Wykonane dzisiaj' : 'Oznacz jako wykonane'}
                </button>
                <button id="edit-${habit.id}" class="btn-edit" title="Edytuj">✏️</button>
                <button id="delete-${habit.id}" class="btn-delete" title="Usuń">🗑️</button>
            </div>
        </div>
    `;
}

// ===== WYKRES =====

function generateWeekChart(habit) {
    // Pobierz ostatnie 7 dni
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date);
    }
    
    // Sprawdź status dla każdego dnia
    const chartData = last7Days.map(date => {
        const dateStr = date.toDateString();
        const isCompleted = habit.completions.some(c => 
            new Date(c).toDateString() === dateStr
        );
        
        const dayName = date.toLocaleDateString('pl-PL', { weekday: 'short' });
        const dayDate = date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' });
        
        return {
            label: `${dayName} ${dayDate}`,
            completed: isCompleted,
            height: isCompleted ? 100 : 20
        };
    });
    
    // Utwórz wykres
    return `
        <div class="chart-container">
            <div class="chart-title">📊 Ostatnie 7 dni</div>
            <div class="chart-bars">
                ${chartData.map(data => `
                    <div class="chart-bar-wrapper">
                        <div class="chart-bar ${data.completed ? 'completed' : 'missed'}" 
                             style="height: ${data.height}%"></div>
                        <div class="chart-label">${data.label}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function showHabitChart(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    // Sprawdź czy wykres już istnieje
    const existingChart = document.getElementById(`chart-container-${habitId}`);
    if (existingChart) {
        existingChart.remove();
        return;
    }
    
    // Pobierz ostatnie 7 dni
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date);
    }
    
    // Sprawdź status dla każdego dnia
    const chartData = last7Days.map(date => {
        const dateStr = date.toDateString();
        const isCompleted = habit.completions.some(c => 
            new Date(c).toDateString() === dateStr
        );
        
        const dayName = date.toLocaleDateString('pl-PL', { weekday: 'short' });
        const dayDate = date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' });
        
        return {
            label: `${dayName} ${dayDate}`,
            completed: isCompleted,
            height: isCompleted ? 100 : 20
        };
    });
    
    // Utwórz wykres
    const chartHTML = `
        <div id="chart-container-${habitId}" class="chart-container">
            <div class="chart-title">📊 Ostatnie 7 dni - ${habit.name}</div>
            <div class="chart-bars">
                ${chartData.map(data => `
                    <div class="chart-bar-wrapper">
                        <div class="chart-bar ${data.completed ? 'completed' : 'missed'}" 
                             style="height: ${data.height}%"></div>
                        <div class="chart-label">${data.label}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Dodaj wykres po karcie nawyku
    const habitCard = document.querySelector(`#check-${habitId}`).closest('.habit-card');
    habitCard.insertAdjacentHTML('afterend', chartHTML);
}

// ===== OBLICZENIA I STATYSTYKI =====

function calculateStreak(habit) {
    if (habit.completions.length === 0) return 0;
    
    const sortedDates = habit.completions
        .map(d => new Date(d))
        .sort((a, b) => b - a);
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let completion of sortedDates) {
        const completionDate = new Date(completion);
        completionDate.setHours(0, 0, 0, 0);
        
        const diffDays = Math.floor((currentDate - completionDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === streak) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}

function calculateCompletionRate(habit) {
    const createdDate = new Date(habit.createdAt);
    const today = new Date();
    const daysSinceCreation = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24)) + 1;
    
    if (daysSinceCreation === 0) return 0;
    
    // Uwzględnij częstotliwość
    let expectedDays = daysSinceCreation;
    
    if (habit.frequency === 'weekdays') {
        expectedDays = countWeekdays(createdDate, today);
    } else if (habit.frequency === 'weekends') {
        expectedDays = countWeekends(createdDate, today);
    } else if (habit.frequency === 'weekly') {
        expectedDays = Math.ceil(daysSinceCreation / 7);
    }
    
    const rate = (habit.completions.length / expectedDays) * 100;
    return Math.min(100, Math.round(rate));
}

function countWeekdays(startDate, endDate) {
    let count = 0;
    const current = new Date(startDate);
    
    while (current <= endDate) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) count++;
        current.setDate(current.getDate() + 1);
    }
    
    return count;
}

function countWeekends(startDate, endDate) {
    let count = 0;
    const current = new Date(startDate);
    
    while (current <= endDate) {
        const day = current.getDay();
        if (day === 0 || day === 6) count++;
        current.setDate(current.getDate() + 1);
    }
    
    return count;
}

// ===== INTELIGENTNE WSKAZÓWKI =====

function generateInsights() {
    const insightsList = document.getElementById('insightsList');
    const insights = [];
    
    habits.forEach(habit => {
        const daysSinceCreation = Math.floor((new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24));
        
        if (daysSinceCreation < 3) return;
        
        // Różne typy analiz
        const dayAnalysis = analyzeDaysOfWeek(habit);
        if (dayAnalysis) insights.push(dayAnalysis);
        
        const streakAnalysis = analyzeStreak(habit);
        if (streakAnalysis) insights.push(streakAnalysis);
        
        const rateAnalysis = analyzeCompletionRate(habit);
        if (rateAnalysis) insights.push(rateAnalysis);
        
        const timeAnalysis = analyzeTimePatterns(habit);
        if (timeAnalysis) insights.push(timeAnalysis);
    });
    
    if (insights.length === 0) {
        insightsList.innerHTML = '<p class="no-insights">Zbieramy dane... Wskazówki pojawią się po kilku dniach śledzenia nawyków. 📊</p>';
        return;
    }
    
    insightsList.innerHTML = insights.map(insight => `
        <div class="insight-card ${insight.type}">
            <div class="insight-title">${insight.icon} ${insight.title}</div>
            <div class="insight-text">${insight.text}</div>
        </div>
    `).join('');
}

function analyzeDaysOfWeek(habit) {
    const dayNames = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    const dayTotals = [0, 0, 0, 0, 0, 0, 0];
    
    const createdDate = new Date(habit.createdAt);
    const today = new Date();
    
    // Policz dni
    for (let d = new Date(createdDate); d <= today; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay();
        dayTotals[dayOfWeek]++;
    }
    
    habit.completions.forEach(completion => {
        const date = new Date(completion);
        dayCounts[date.getDay()]++;
    });
    
    // Znajdź najgorszy dzień
    let worstDay = -1;
    let worstRate = 1;
    
    for (let i = 0; i < 7; i++) {
        if (dayTotals[i] >= 2) {
            const rate = dayCounts[i] / dayTotals[i];
            if (rate < worstRate) {
                worstRate = rate;
                worstDay = i;
            }
        }
    }
    
    // Znajdź najlepszy dzień
    let bestDay = -1;
    let bestRate = 0;
    
    for (let i = 0; i < 7; i++) {
        if (dayTotals[i] >= 2) {
            const rate = dayCounts[i] / dayTotals[i];
            if (rate > bestRate) {
                bestRate = rate;
                bestDay = i;
            }
        }
    }
    
    if (worstDay !== -1 && worstRate < 0.4) {
        return {
            type: 'warning',
            icon: '📅',
            title: `"${habit.name}"`,
            text: `Najczęściej pomijasz ten nawyk w ${dayNames[worstDay]} (${Math.round(worstRate * 100)}% skuteczności). Może to zbyt trudny dzień? Spróbuj zaplanować go na inną porę lub uprość zadanie.`
        };
    }
    
    if (bestDay !== -1 && bestRate > 0.8) {
        return {
            type: 'positive',
            icon: '🌟',
            title: `"${habit.name}"`,
            text: `Świetnie idzie Ci w ${dayNames[bestDay]}! Skuteczność: ${Math.round(bestRate * 100)}%. Może warto przenieść inne nawyki na ten dzień?`
        };
    }
    
    return null;
}

function analyzeStreak(habit) {
    const streak = calculateStreak(habit);
    
    if (streak >= 7) {
        return {
            type: 'positive',
            icon: '🔥',
            title: `"${habit.name}"`,
            text: `Niesamowite! Masz ${streak} dni z rzędu! Jesteś na dobrej drodze do utrwalenia tego nawyku. Badania pokazują, że nawyki utrwalają się po 21-66 dniach.`
        };
    }
    
    if (streak === 0 && habit.completions.length > 0) {
        const lastCompletion = new Date(Math.max(...habit.completions.map(d => new Date(d))));
        const daysSince = Math.floor((new Date() - lastCompletion) / (1000 * 60 * 60 * 24));
        
        if (daysSince >= 3) {
            return {
                type: 'warning',
                icon: '⚠️',
                title: `"${habit.name}"`,
                text: `Minęło ${daysSince} dni od ostatniego wykonania. Nie poddawaj się! Każdy dzień to nowa szansa. Może warto uprościć ten nawyk?`
            };
        }
    }
    
    return null;
}

function analyzeCompletionRate(habit) {
    const rate = calculateCompletionRate(habit);
    const daysSinceCreation = Math.floor((new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24));
    
    if (daysSinceCreation < 7) return null;
    
    if (rate >= 80) {
        return {
            type: 'positive',
            icon: '💪',
            title: `"${habit.name}"`,
            text: `Fantastyczna skuteczność ${rate}%! Ten nawyk staje się częścią Twojej rutyny. Może czas dodać nowe wyzwanie?`
        };
    }
    
    if (rate < 30) {
        return {
            type: 'warning',
            icon: '💡',
            title: `"${habit.name}"`,
            text: `Skuteczność ${rate}% sugeruje, że ten nawyk może być zbyt trudny lub źle dopasowany do Twojego stylu życia. Rozważ uproszczenie go lub zmianę pory dnia.`
        };
    }
    
    return null;
}

function analyzeTimePatterns(habit) {
    if (habit.completions.length < 5) return null;
    
    // Analiza godzin wykonania
    const hours = habit.completions.map(c => new Date(c).getHours());
    const morningCount = hours.filter(h => h >= 6 && h < 12).length;
    const afternoonCount = hours.filter(h => h >= 12 && h < 18).length;
    const eveningCount = hours.filter(h => h >= 18 || h < 6).length;
    
    const total = hours.length;
    
    if (morningCount / total > 0.7) {
        return {
            type: 'info',
            icon: '🌅',
            title: `"${habit.name}"`,
            text: `Widzę, że najlepiej idzie Ci rano (${Math.round(morningCount / total * 100)}% wykonań). Poranna rutyna działa! Może warto dodać przypomnienie na tę porę?`
        };
    }
    
    if (eveningCount / total > 0.7) {
        return {
            type: 'info',
            icon: '🌙',
            title: `"${habit.name}"`,
            text: `Jesteś wieczornym typem! ${Math.round(eveningCount / total * 100)}% wykonań przypada na wieczór. Może warto zaplanować więcej nawyków na tę porę?`
        };
    }
    
    return null;
}


// ===== PLANOWANE AKTYWNOŚCI =====

function addActivity() {
    const input = document.getElementById('activityInput');
    const activityText = input.value.trim();
    
    if (activityText === '') {
        alert('Wpisz treść aktywności!');
        return;
    }
    
    const newActivity = {
        id: Date.now(),
        text: activityText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    activities.push(newActivity);
    saveActivities(activities);
    input.value = '';
    renderActivities();
}

function renderActivities() {
    const activitiesList = document.getElementById('activitiesList');
    const noActivitiesMessage = document.getElementById('noActivitiesMessage');
    
    if (activities.length === 0) {
        activitiesList.innerHTML = '';
        noActivitiesMessage.style.display = 'block';
        return;
    }
    
    noActivitiesMessage.style.display = 'none';
    activitiesList.innerHTML = activities.map(activity => createActivityItem(activity)).join('');
    
    // Dodaj event listenery
    activities.forEach(activity => {
        document.getElementById(`activity-check-${activity.id}`).addEventListener('change', () => toggleActivity(activity.id));
        document.getElementById(`activity-delete-${activity.id}`).addEventListener('click', () => deleteActivity(activity.id));
    });
}

function createActivityItem(activity) {
    const createdDate = new Date(activity.createdAt);
    const timeStr = createdDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    
    return `
        <div class="activity-item ${activity.completed ? 'completed' : ''}">
            <input 
                type="checkbox" 
                id="activity-check-${activity.id}" 
                class="activity-checkbox" 
                ${activity.completed ? 'checked' : ''}
            >
            <span class="activity-text">${activity.text}</span>
            <span class="activity-time">${timeStr}</span>
            <button id="activity-delete-${activity.id}" class="btn-delete-activity">🗑️</button>
        </div>
    `;
}

function toggleActivity(activityId) {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;
    
    activity.completed = !activity.completed;
    saveActivities(activities);
    renderActivities();
}

function deleteActivity(activityId) {
    if (!confirm('Czy na pewno chcesz usunąć tę aktywność?')) {
        return;
    }
    
    activities = activities.filter(a => a.id !== activityId);
    saveActivities(activities);
    renderActivities();
}


// ===== TRYB CIEMNY =====

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeIcon.textContent = '☀️';
        localStorage.setItem('habitCoachTheme', 'dark');
    } else {
        themeIcon.textContent = '🌙';
        localStorage.setItem('habitCoachTheme', 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('habitCoachTheme');
    const themeIcon = document.querySelector('.theme-icon');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
}


// ===== STATYSTYKI I WYKRESY =====

function renderStatistics() {
    if (habits.length === 0) {
        document.getElementById('barChart').innerHTML = '<p class="no-data-message">Dodaj nawyki, aby zobaczyć statystyki 📊</p>';
        document.getElementById('pieChart').innerHTML = '<p class="no-data-message">Dodaj nawyki, aby zobaczyć statystyki 🎯</p>';
        return;
    }
    
    renderBarChart();
    renderPieChart();
}

// Wykres słupkowy - wykonane dni dla każdego nawyku (ostatnie 30 dni)
function renderBarChart() {
    const container = document.getElementById('barChart');
    
    const last30Days = 30;
    const habitStats = habits.map(habit => {
        const completionsLast30 = habit.completions.filter(date => {
            const completionDate = new Date(date);
            const daysAgo = Math.floor((new Date() - completionDate) / (1000 * 60 * 60 * 24));
            return daysAgo <= last30Days;
        }).length;
        
        return {
            name: habit.name,
            icon: habit.icon,
            count: completionsLast30,
            color: habit.color
        };
    }).sort((a, b) => b.count - a.count);
    
    const maxCount = Math.max(...habitStats.map(h => h.count), 1);
    
    container.innerHTML = habitStats.map(stat => `
        <div class="bar-chart-row">
            <div class="bar-chart-label">${stat.icon} ${stat.name}</div>
            <div class="bar-chart-bar-wrapper">
                <div class="bar-chart-bar" style="width: ${(stat.count / maxCount) * 100}%; background: ${stat.color};">
                    <span class="bar-chart-value">${stat.count}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Wykres kołowy - wykonane vs pominięte
function renderPieChart() {
    const container = document.getElementById('pieChart');
    
    // Policz wszystkie możliwe dni dla wszystkich nawyków
    let totalPossible = 0;
    let totalCompleted = 0;
    
    habits.forEach(habit => {
        const createdDate = new Date(habit.createdAt);
        const today = new Date();
        const daysSinceCreation = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24)) + 1;
        
        totalPossible += daysSinceCreation;
        totalCompleted += habit.completions.length;
    });
    
    const totalMissed = totalPossible - totalCompleted;
    const completedPercent = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;
    const missedPercent = 100 - completedPercent;
    
    // Oblicz kąty dla wykresu kołowego
    const completedAngle = (completedPercent / 100) * 360;
    const missedAngle = (missedPercent / 100) * 360;
    
    // Generuj SVG wykres kołowy
    const svg = `
        <svg class="pie-chart-svg" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="#4caf50" />
            <circle cx="100" cy="100" r="90" fill="#f44336" 
                    stroke-dasharray="${completedPercent * 5.65} 565" 
                    stroke-dashoffset="0"
                    transform="rotate(-90 100 100)"
                    stroke="#4caf50"
                    stroke-width="180"
                    fill="none" />
            <circle cx="100" cy="100" r="60" fill="white" />
            <text x="100" y="95" text-anchor="middle" font-size="24" font-weight="bold" fill="#333">
                ${Math.round(completedPercent)}%
            </text>
            <text x="100" y="115" text-anchor="middle" font-size="12" fill="#666">
                wykonane
            </text>
        </svg>
        <div class="pie-chart-legend">
            <div class="pie-legend-item">
                <div class="pie-legend-color" style="background: #4caf50;"></div>
                <span class="pie-legend-text">Wykonane:</span>
                <span class="pie-legend-value">${totalCompleted}</span>
            </div>
            <div class="pie-legend-item">
                <div class="pie-legend-color" style="background: #f44336;"></div>
                <span class="pie-legend-text">Pominięte:</span>
                <span class="pie-legend-value">${totalMissed}</span>
            </div>
        </div>
    `;
    
    container.innerHTML = svg;
}
