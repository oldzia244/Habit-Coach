# 🎯 Habit Coach - Inteligentny trener nawyków

**Habit Coach** to nowoczesna aplikacja webowa do śledzenia nawyków z zaawansowaną analizą i personalizowanymi wskazówkami. Aplikacja analizuje Twoje wzorce zachowań i podpowiada, jak skuteczniej budować nawyki.

![Habit Coach](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Funkcje

### 🎨 Podstawowe funkcje
- ✅ **Dodawanie nawyków** - twórz własne nawyki z nazwą, opisem i ikoną
- 🎨 **Personalizacja** - wybieraj spośród 12 kolorów i 18 ikon
- 📅 **Częstotliwość** - ustaw czy nawyk ma być codzienny, w dni robocze, weekendy czy raz w tygodniu
- ✏️ **Edycja nawyków** - modyfikuj istniejące nawyki w każdej chwili
- 🗑️ **Usuwanie nawyków** - usuń nawyki, które już nie są potrzebne

### 📊 Śledzenie i statystyki
- ✓ **Oznaczanie wykonania** - kliknij przycisk, aby oznaczyć nawyk jako wykonany
- 🔥 **Serie dni** - śledź ile dni z rzędu wykonujesz nawyk
- 📈 **Procent skuteczności** - zobacz jak często wykonujesz swoje nawyki
- 📊 **Wykres 7 dni** - wizualizacja ostatniego tygodnia dla każdego nawyku

### 💡 Inteligentna analiza (główny twist!)
Aplikacja automatycznie analizuje Twoje dane i generuje personalizowane wskazówki:

- 📅 **Analiza dni tygodnia** - "Najczęściej pomijasz ten nawyk w poniedziałki"
- 🌅 **Analiza pory dnia** - "Widzę, że najlepiej idzie Ci rano - może warto ustawić przypomnienie?"
- 🔥 **Analiza serii** - Motywujące komunikaty przy długich seriach
- ⚠️ **Ostrzeżenia** - Powiadomienia gdy nawyk jest zaniedbywany
- 💪 **Gratulacje** - Pozytywne wzmocnienie przy wysokiej skuteczności

## 🚀 Jak uruchomić

### Opcja 1: Uruchom lokalnie
1. Pobierz wszystkie pliki projektu
2. Otwórz plik `index.html` w przeglądarce
3. Gotowe! Aplikacja działa bez instalacji i serwera

### Opcja 2: GitHub Pages (darmowy hosting w internecie)

#### Krok 1: Utwórz repozytorium
1. Zaloguj się na [GitHub.com](https://github.com)
2. Kliknij "New repository" (zielony przycisk)
3. Nazwij repozytorium np. `habit-coach`
4. Ustaw jako **Public**
5. Kliknij "Create repository"

#### Krok 2: Wgraj pliki
Możesz to zrobić na dwa sposoby:

**Sposób A: Przez interfejs GitHub (prostszy)**
1. W swoim repozytorium kliknij "Add file" → "Upload files"
2. Przeciągnij wszystkie pliki i foldery projektu
3. Kliknij "Commit changes"

**Sposób B: Przez Git (dla zaawansowanych)**
```bash
git init
git add .
git commit -m "Initial commit - Habit Coach"
git branch -M main
git remote add origin https://github.com/TWOJA-NAZWA/habit-coach.git
git push -u origin main
```

#### Krok 3: Włącz GitHub Pages
1. W repozytorium przejdź do **Settings** (Ustawienia)
2. W menu po lewej kliknij **Pages**
3. W sekcji "Source" wybierz branch **main**
4. Kliknij **Save**
5. Po chwili pojawi się link do Twojej aplikacji: `https://twoja-nazwa.github.io/habit-coach`

🎉 **Gotowe!** Twoja aplikacja jest dostępna w internecie!

## 📁 Struktura projektu

```
habit-coach/
├── index.html          # Główna strona aplikacji
├── css/
│   └── style.css      # Style i wygląd aplikacji
├── js/
│   └── app.js         # Logika aplikacji i inteligentna analiza
├── assets/            # Folder na przyszłe zasoby (obrazy, ikony)
└── README.md          # Ten plik - dokumentacja
```

## 💾 Przechowywanie danych

Aplikacja używa **localStorage** do przechowywania danych:

✅ **Zalety:**
- Dane są całkowicie prywatne (nie wysyłane do żadnego serwera)
- Aplikacja działa offline
- Nie wymaga rejestracji ani logowania
- Szybkie i bezpieczne

⚠️ **Ważne:**
- Dane są powiązane z przeglądarką i domeną
- Wyczyszczenie danych przeglądarki usunie nawyki
- Dane nie synchronizują się między urządzeniami

### Struktura danych (dla programistów)
```javascript
{
  id: 1234567890,
  name: "Pić 2 litry wody",
  description: "Nawodnienie jest kluczowe dla zdrowia",
  frequency: "daily",
  color: "#667eea",
  icon: "💧",
  createdAt: "2024-01-01T10:00:00.000Z",
  completions: ["2024-01-01T10:00:00.000Z", "2024-01-02T09:30:00.000Z"],
  skips: []
}
```

## 🛠️ Technologie

- **HTML5** - struktura aplikacji
- **CSS3** - style, animacje, responsywność
- **Vanilla JavaScript** - logika bez frameworków
- **LocalStorage API** - przechowywanie danych

### Dlaczego bez frameworków?
- ✅ Prostota - łatwe do zrozumienia dla początkujących
- ✅ Szybkość - natychmiastowe ładowanie
- ✅ Brak zależności - nie wymaga npm, webpack, etc.
- ✅ Łatwa rozbudowa - można później dodać React/Vue

## 📱 Responsywność

Aplikacja działa świetnie na:
- 💻 Komputerach (desktop)
- 📱 Telefonach (mobile)
- 📱 Tabletach

## 🎨 Personalizacja

### Zmiana kolorów
Edytuj plik `css/style.css`:
```css
/* Gradient tła */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Kolor główny */
color: #667eea;
```

### Dodanie nowych ikon
Edytuj plik `js/app.js`:
```javascript
const ICONS = [
    '💧', '📚', '🏃', '🧘', '🥗', '💪',
    // Dodaj swoje emoji tutaj
];
```

### Dodanie nowych kolorów
```javascript
const COLORS = [
    '#667eea', '#764ba2', '#f093fb',
    // Dodaj swoje kolory tutaj
];
```

## 📝 Jak używać

### 1. Dodaj nawyk
- Kliknij "➕ Dodaj nowy nawyk"
- Wpisz nazwę (np. "Pić 2 litry wody")
- Opcjonalnie dodaj opis
- Wybierz częstotliwość
- Wybierz kolor i ikonę
- Kliknij "Zapisz nawyk"

### 2. Oznaczaj wykonanie
- Każdego dnia klikaj "Oznacz jako wykonane"
- Przycisk zmieni kolor na szary gdy nawyk jest wykonany
- Możesz cofnąć klikając ponownie

### 3. Śledź postępy
- Obserwuj swoje serie dni 🔥
- Sprawdzaj procent skuteczności 📊
- Kliknij 📈 aby zobaczyć wykres ostatnich 7 dni

### 4. Czytaj wskazówki
- Po kilku dniach aplikacja zacznie analizować Twoje dane
- Wskazówki pojawią się w sekcji "💡 Inteligentne wskazówki"
- Aplikacja podpowie kiedy najlepiej Ci idzie i co można poprawić

### 5. Edytuj lub usuń
- Kliknij ✏️ aby edytować nawyk
- Kliknij 🗑️ aby usunąć (z potwierdzeniem)

## 🎯 Algorytmy analizy

### Analiza dni tygodnia
```
Dla każdego dnia tygodnia:
  skuteczność = wykonania / możliwe_dni
  
Jeśli skuteczność < 40%:
  → Ostrzeżenie o trudnym dniu
  
Jeśli skuteczność > 80%:
  → Gratulacje za dobry dzień
```

### Analiza serii
```
Jeśli seria >= 7 dni:
  → Motywacja do kontynuacji
  
Jeśli seria = 0 i minęło > 3 dni:
  → Zachęta do powrotu
```

### Analiza pory dnia
```
Jeśli > 70% wykonań rano (6-12):
  → Sugestia porannych przypomnień
  
Jeśli > 70% wykonań wieczorem (18-6):
  → Informacja o wieczornym typie
```

## 🚀 Przyszłe funkcje (roadmap)

Pomysły na rozbudowę:
- [ ] 🔔 Przypomnienia push (PWA)
- [ ] 📱 Instalacja jako aplikacja mobilna
- [ ] 🌙 Tryb ciemny
- [ ] 📤 Export/import danych (JSON)
- [ ] 🏆 System osiągnięć i nagród
- [ ] 📊 Zaawansowane wykresy (Chart.js)
- [ ] 🔄 Synchronizacja między urządzeniami (Firebase)
- [ ] 👥 Współdzielenie nawyków ze znajomymi
- [ ] 🎯 Cele długoterminowe (30, 60, 90 dni)
- [ ] 📝 Notatki do każdego dnia

## 🤝 Rozwój projektu

### Jak dodać nową funkcję?

1. **Edytuj HTML** (`index.html`) - dodaj nowe elementy interfejsu
2. **Edytuj CSS** (`css/style.css`) - ostyluj nowe elementy
3. **Edytuj JS** (`js/app.js`) - dodaj logikę

### Przykład: Dodanie nowej częstotliwości

**Krok 1:** Dodaj opcję w HTML
```html
<option value="monthly">Raz w miesiącu</option>
```

**Krok 2:** Dodaj tłumaczenie w JS
```javascript
const FREQUENCIES = {
    // ...
    monthly: 'Raz w miesiącu'
};
```

**Krok 3:** Zaktualizuj obliczenia w `calculateCompletionRate()`

## 🐛 Znane problemy

- Brak synchronizacji między urządzeniami (planowane w przyszłości)
- Dane mogą zostać utracone przy czyszczeniu przeglądarki
- Brak eksportu danych (planowane)

## 📄 Licencja

Ten projekt jest **darmowy i otwarty** do użytku:
- ✅ Użytek osobisty
- ✅ Użytek edukacyjny
- ✅ Modyfikacje i rozbudowa
- ✅ Udostępnianie innym

## 👨‍💻 Autor

Stworzone z ❤️ dla osób chcących budować lepsze nawyki.

## 🙏 Podziękowania

Dziękuję za korzystanie z Habit Coach! Jeśli aplikacja Ci pomogła, podziel się nią ze znajomymi. 🚀

---

**Powodzenia w budowaniu nawyków!** 💪

Pamiętaj: Nawyki to nie sprint, to maraton. Każdy mały krok się liczy! 🎯
