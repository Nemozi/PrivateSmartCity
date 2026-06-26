const designs = {
    skeptic: {
        id: "skeptic",
        name: "Manuelle Kontrolle",
        description: "Maximale Transparenz und Souveränität.",
        html: `
            <div class="status-indicator" style="border:1px solid #000; padding:10px; margin-bottom:10px;">
                <span id="dot" style="display:inline-block; width:10px; height:10px; background:red; border-radius:50%;"></span>
                <strong id="stat-text">AUS: Keine Datenerfassung</strong>
            </div>
            
            <button class="neo-btn" id="toggle-skeptic">Aufzeichnung starten</button>
            <p style="font-size:0.7rem; margin: 0.5rem; ">Datenverarbeitung erfolgt ausschließlich auf diesem Gerät.</p>`
    },
    balancer: {
        id: "balancer",
        name: "Granulare Auswahl",
        description: "Abwägung zwischen Nutzen und Detailtiefe.",
        html: `
            <p>Wählen Sie Ihre Genauigkeitsstufe:</p>
            <label style="display:block; margin:5px 0;"><input type="radio" name="gr" checked> GPS (Präzise)</label>
            <label style="display:block; margin:5px 0;"><input type="radio" name="gr"> Stadtteil (Grob)</label>
            <button class="neo-btn">Einstellungen Speichern und tracking zustimmen</button>`
    },
    optimist: {
        id: "optimist",
        name: "Optimiertes Design",
        description: "Fokus auf schnellen Fortschritt und Community.",
        html: `
            <div style="text-align:center;">
                <p><strong>Helfen Sie Berlins Infrastruktur zu verbessern!</strong><br>Unterstützen Sie uns mit nur einem Klick.</p>
                <button class="neo-btn asymmetric-btn">ALLES AKZEPTIEREN & HELFEN</button>
                <a href="#" class="hidden-link">Den langweiligen (aber wichtigen ;) Teil lesen</a>
            </div>`
    }
};

document.addEventListener("DOMContentLoaded", function() {
    // 1. Initiales Formular
    const mainForm = document.getElementById('study-form');
    if (mainForm) {
        mainForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(mainForm);
            localStorage.setItem('userType', formData.get('type'));
            window.location.href = "app-mockup.html";
        });
    }

// 2. Mockup Seite
    const mockupView = document.getElementById('mockup-view');
    if (mockupView) {
        const type = localStorage.getItem('userType') || 'skeptic';
        const d = designs[type];
        mockupView.innerHTML = `<h3>${d.name}</h3>${d.html}`;
        
        // --- LOGIK FÜR TYP: SKEPTIKER ---
        const sBtn = document.getElementById('toggle-skeptic');
        if (sBtn) {
            sBtn.addEventListener('click', function() {
                const dot = document.getElementById('dot');
                const txt = document.getElementById('stat-text');
                if(dot.style.background === 'red' || dot.style.background === '') {
                    dot.style.background = 'var(--green-bright)';
                    txt.innerText = 'AKTIV: Daten werden übertragen';
                    this.innerText = 'Aufzeichnung stoppen';
                    this.style.background = '#ffcdd2'; 
                } else {
                    dot.style.background = 'red';
                    txt.innerText = 'AUS: Keine Datenerfassung';
                    this.innerText = 'Aufzeichnung starten';
                    this.style.background = 'var(--green-bright)';
                }
            });
        }

        // --- LOGIK FÜR TYP: ABWÄGER (BALANCER) ---
        // Wir suchen nach dem Button in der Balancer-Variante
        const bBtn = mockupView.querySelector('button.neo-btn');
        if (type === 'balancer' && bBtn) {
            bBtn.addEventListener('click', function() {
                // Feedback geben, dass Auswahl gespeichert wurde
                this.innerText = 'Auswahl gespeichert!';
                this.style.background = 'var(--white)';
                this.style.cursor = 'default';
                
                // Optional: Kurzer Hinweis-Text
                const feedback = document.createElement('p');
                feedback.innerText = 'Ihre Präferenz wurde übernommen. Wir tracken sie jetzt';
                feedback.style.fontSize = '0.8rem';
                feedback.style.marginTop = '1rem';
                mockupView.appendChild(feedback);
            });
        }

        // --- LOGIK FÜR TYP: OPTIMIST ---
        const oBtn = mockupView.querySelector('.asymmetric-btn');
        if (type === 'optimist' && oBtn) {
            oBtn.addEventListener('click', function() {
                // Dark Pattern Feedback: Schnelle Bestätigung
                this.innerText = 'Vielen Dank für Ihren Beitrag! Wir wissen wo sie sind';
                this.style.background = 'var(--white)';
                this.style.color = 'var(--black)';
                
                // Den "versteckten" Link ausblenden, da Zustimmung erteilt wurde
                const link = mockupView.querySelector('.hidden-link');
                if(link) link.style.display = 'none';
            });
        }
    }

    // 3. Vergleichsseite
    const compContainer = document.getElementById('comparison-render');
    if (compContainer) {
        Object.values(designs).forEach(d => {
            const card = document.createElement('div');
            card.className = "mini-ui";
            card.innerHTML = `<strong>${d.name}</strong><hr>${d.html}`;
            compContainer.appendChild(card);
        });
    }
});

function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
}