// --- Supabase Initialisierung ---
const _supabaseUrl = 'https://ktlllwkvzszwsgtjjbkk.supabase.co';
const _supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bGxsd2t2enN6d3NndGpqYmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODk3MDAsImV4cCI6MjA5ODA2NTcwMH0.W43ch0kHP7r3Hz0HRvxW2F1KCvdUdFZwcFhN8sgR158';

// LÖSUNG: Variable anders nennen ('dbClient') um Konflikte zu vermeiden!
const dbClient = window.supabase.createClient(_supabaseUrl, _supabaseKey);

const designs = {
    skeptic: {
        id: "skeptic",
        name: "Manuelle Kontrolle",
        html: `
            <div class="status-indicator" style="border:0.1875rem solid #000; padding:0.625rem; margin-bottom:0.625rem;">
                <span id="dot" style="display:inline-block; width:0.625rem; height:0.625rem; background:red; border-radius:50%;"></span>
                <strong id="stat-text">AUS: Keine Datenerfassung</strong>
                <p>Wir möchten gerne ihren genauen Standort spreicher. Sie können die Standortabfrage selbst starten und stoppen</p>
            </div>
            <button class="neo-btn" id="toggle-skeptic">Aufzeichnung starten</button>
            <p style="font-size:0.75rem; margin-top:0.5rem;">Vollständige Datensouveränität: Sie entscheiden über jeden Meter.</p>`
    },
    balancer: {
        id: "balancer",
        name: "Granulare Auswahl",
        html: `
            <p>Wir möchten gerne möglichst genau ihren Standort abfragen um damit ihre Radrouten nachvollziehen zu können. Sie haben die Kontrolle wie genau sie ihre Standortdaten mit uns teilen wollen :</p>
            <label class="choice-card"><input type="radio" name="gr" checked>Genaue Standortdaten und Routen</label>
            <label class="choice-card"><input type="radio" name="gr"> Ungefähr</label>
            <button class="neo-btn" id="btn-balancer">Einstellung bestätigen</button>`
    },
    optimist: {
        id: "optimist",
        name: "Optimiertes Design",
        html: `
            <div style="text-align:center;">
                <p><strong>Helfen Sie Berlin sofort!</strong><br>Unterstützen Sie die Community mit einem Klick.</p>
                <button class="neo-btn asymmetric-btn" id="btn-optimist">ALLES AKZEPTIEREN & HELFEN</button>
                <a href="#" class="hidden-link">Informationen zu Drittanbietern verwalten</a>
            </div>`
    }
};

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. INDEX: Onboarding speichern ---
    const mainForm = document.getElementById('study-form');
    if (mainForm) {
        mainForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Verhindert das Neuladen der Seite
            const formData = new FormData(mainForm);
            
            localStorage.setItem('medienkompetenz', formData.get('comp'));
            localStorage.setItem('datenschutz_meinung', formData.get('opinion')); 
            localStorage.setItem('assigned_type', formData.get('type'));
            
            window.location.href = "app-mockup.html";
        });
    }

    // --- 2. MOCKUP: Interaktion & Slider-Speicherung ---
    const mockupView = document.getElementById('mockup-view');
    if (mockupView) {
        const type = localStorage.getItem('assigned_type') || 'skeptic';
        const d = designs[type];
        mockupView.innerHTML = `<h3>${d.name}</h3>${d.html}`;
        
        // Skeptiker Logik
        const sBtn = document.getElementById('toggle-skeptic');
        if (sBtn) {
            sBtn.addEventListener('click', function() {
                const dot = document.getElementById('dot');
                const txt = document.getElementById('stat-text');
                if(dot.style.background === 'red' || dot.style.background === '') {
                    dot.style.background = 'var(--green-bright)';
                    txt.innerText = 'AKTIV: Datenfluss gestartet';
                    this.innerText = 'Aufzeichnung stoppen';
                } else {
                    dot.style.background = 'red';
                    txt.innerText = 'AUS: Keine Datenerfassung';
                    this.innerText = 'Aufzeichnung starten';
                }
            });
        }

        // Balancer & Optimist Feedback
        const bBtn = document.getElementById('btn-balancer');
        if (bBtn) bBtn.addEventListener('click', () => bBtn.innerText = "✓ Gespeichert");
        
        const oBtn = document.getElementById('btn-optimist');
        if (oBtn) oBtn.addEventListener('click', () => oBtn.innerText = "Danke! Sie tracken jetzt");

        // Speichern des Sliders beim Klick auf Weiter
        const nextBtn = document.querySelector('a[href="comparison.html"]');
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                const ratingValue = document.querySelector('input[type="range"]').value;
                localStorage.setItem('prototyp_rating', ratingValue);
            });
        }
    }

      const compContainer = document.getElementById('comparison-render');
    const finalForm = document.querySelector('form.neo-box.bg-green');

    if (compContainer) {
        Object.values(designs).forEach(d => {
            const card = document.createElement('div');
            card.className = "mini-ui";
            card.innerHTML = `<strong>${d.name}</strong><hr style="margin:0.5rem 0;">${d.html}`;
            compContainer.appendChild(card);
        });
    }

    if (finalForm) {
        const submitBtn = finalForm.querySelector('#submit-study'); // Wir nutzen die ID
        
        if (submitBtn) {
            submitBtn.addEventListener('click', async function(e) {
                e.preventDefault();
                
                // Sicherheitshalber Elemente suchen
                const selectEl = finalForm.querySelector('select');
                const textEl = finalForm.querySelector('textarea');
                const fitEl = finalForm.querySelector('input[name="fit"]:checked');

                submitBtn.innerText = "WIRD GESPEICHERT...";
                submitBtn.disabled = true;

                // Datenobjekt sicher zusammenbauen
                const finalResults = {
                    medienkompetenz: localStorage.getItem('medienkompetenz') || 'n/a',
                    datenschutz_meinung: localStorage.getItem('datenschutz_meinung') || 'n/a',
                    zugewiesener_typus: localStorage.getItem('assigned_type') || 'n/a',
                    bewertung_prototyp: parseInt(localStorage.getItem('prototyp_rating')) || 0,
                    // Hier prüfen wir, ob die Elemente existieren, sonst Fallback-Wert
                    bevorzugter_typus: selectEl ? selectEl.value : 'nicht ausgewählt',
                    passt_zuordnung: fitEl ? fitEl.value : 'keine Angabe',
                    freitext_feedback: textEl ? textEl.value : ''
                };

                console.log("Sende Daten:", finalResults); // Zum Debuggen in der Konsole (F12)

                try {
                    const { data, error } = await dbClient
                        .from('fahrradstudie_daten')
                        .insert([finalResults]);

                    if (error) throw error;

                    alert("Studie abgeschlossen. Vielen Dank!");
                    localStorage.clear();
                    window.location.href = 'index.html';
                } catch (error) {
                    alert("Fehler beim Speichern: " + error.message);
                    submitBtn.disabled = false;
                    submitBtn.innerText = "ERNEUT VERSUCHEN";
                }
            });
        }
    }
});

function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
}