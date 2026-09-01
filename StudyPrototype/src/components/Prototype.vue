<template>
  <div class="app-shell h-full flex flex-col relative overflow-hidden select-none">

    <!-- NAVBAR -->
    <nav class="relative flex items-center justify-between px-5 h-16 bg-[var(--surface)]/95 backdrop-blur border-b border-[var(--border)] shrink-0 z-20">
      <div class="relative">
        <button
          class="flex flex-col justify-between h-3.5 w-6 cursor-pointer press"
          :aria-label="menuOpen ? 'Menü schließen' : 'Menü öffnen'"
          @click="toggleMenu"
        >
          <div class="h-0.5 w-full bg-[var(--ink)] rounded-full transition-transform" :class="menuOpen ? 'translate-y-[6px] rotate-45' : ''"></div>
          <div class="h-0.5 w-full bg-[var(--ink)] rounded-full transition-opacity" :class="menuOpen ? 'opacity-0' : ''"></div>
          <div class="h-0.5 w-full bg-[var(--ink)] rounded-full transition-transform" :class="menuOpen ? '-translate-y-[6px] -rotate-45' : ''"></div>
        </button>

        <Transition name="menu">
          <div v-if="menuOpen" class="nav-menu">
            <button class="nav-menu-item press" @click="restartPrototype">
              <RestartIcon/> Neu starten
            </button>
          </div>
        </Transition>
      </div>

      <div class="absolute left-1/2 -translate-x-1/2 font-display text-[19px] text-[var(--ink)] whitespace-nowrap">
        Gesundheits&#8209;App
      </div>

      <div class="w-9 h-9 rounded-full bg-[var(--primary-soft)] flex items-center justify-center text-[13px] font-semibold text-[var(--primary)] ring-1 ring-[var(--primary)]/15">
        A
      </div>
    </nav>
    <div v-if="menuOpen" class="menu-scrim" @click="menuOpen = false"></div>

    <!-- CONTENT -->
    <Transition :name="transitionName" mode="out-in">
      <main :key="currentScreen" class="content flex-1 overflow-y-auto px-5 pt-6 pb-8 bg-[var(--bg)]">

        <!-- SETUP -->
        <div v-if="currentScreen === 'setup'" class="space-y-7">
          <div class="space-y-2">
            <p class="eyebrow">Städtisches Gesundheitsamt</p>
            <h1 class="font-display title leading-tight text-[var(--ink)]">
              Freiwilliger<br />Infektionsschutz
            </h1>

            <p class="text-[14px] leading-relaxed text-[var(--ink-soft)] max-w-[34ch]">
              Helfen Sie mit, Infektionsketten schnell zu unterbrechen. Die Nutzung ist freiwillig und dient dem Schutz der Gemeinschaft.
            </p>
          </div>

          <div class="card">
            <h3 class="text-[13px] font-semibold text-[var(--ink)] mb-3">Datenschutzgarantie</h3>
            <ul class="space-y-2.5">
              <li class="guarantee"><CheckIcon/> Keine kommerziellen Partner</li>
              <li class="guarantee"><CheckIcon/> Betrieb durch das städtische Gesundheitsamt</li>
              <li class="guarantee"><CheckIcon/> Vollständige Kontrolle über Ihre Freigaben</li>
            </ul>
          </div>

          <div class="space-y-2.5 pt-1">
            <p class="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-soft)] px-1 mb-1">Profil zum Testen wählen</p>
            <button v-for="p in personas" :key="p.id" class="persona-card press" @click="startPath(p.id)">
              <span class="persona-icon"><component :is="p.icon"/></span>
              <span class="flex-1 text-left">
                <span class="block text-[14px] font-semibold text-[var(--ink)]">{{ p.label }}</span>
                <span class="block text-[12px] text-[var(--ink-soft)]">{{ p.hint }}</span>
              </span>
              <ChevronIcon class="text-[var(--ink-soft)]"/>
            </button>
          </div>
        </div>

        <!-- P6: DER GUTGLÄUBIGE -->
        <div v-if="currentScreen === 'p6'" class="flex flex-col min-h-full">
          <BackLink @click="currentScreen = 'setup'"/>
          <StepDots :step="1"/>

          <div class="illustration mb-6">
            <ShieldHeartIcon/>
          </div>

          <div class="card mb-4">
            <h3 class="font-display text-[17px] text-[var(--ink)] mb-2">Toll dass du mitmachst</h3>
            <p class="text-[14px] leading-relaxed text-[var(--ink-soft)]">Wir sammeln einige Daten um deinen bestmöglichen Schutz zu garantieren. Keine Sorge, deine Daten sind bei uns sicher !</p>
            <button class="link-btn mt-2" @click="openPopup(5)">Mehr erfahren</button>
          </div>

          <div class="card flex justify-between items-center">
            <div>
              <span class="block text-[14px] font-semibold text-[var(--ink)]">Einwilligen</span>
              <button class="link-btn text-[11px]">Mehr Informationen per Email anfragen</button>
            </div>
            <ToggleSwitch v-model="settings.consent" size="lg"/>
          </div>

          <div class="grow"></div>
          <PrimaryButton class="mt-6" @click="save('home')">Speichern</PrimaryButton>
        </div>

        <!-- P9: SKEPTIKER -->
        <div v-if="currentScreen === 'p9'" class="flex flex-col min-h-full">
          <BackLink @click="currentScreen = 'setup'"/>
          <StepDots :step="1"/>

          <div class="card mb-4">
            <h3 class="font-display text-[16px] text-[var(--ink)] mb-2">Persönliche Daten teilen</h3>
            <p class="text-[13px] leading-relaxed text-[var(--ink-soft)]">
              Damit das System funktioniert, müssen wir deine persönlichen Gesundheitsdaten abfragen. Mehr Daten bedeutet zuverlässigere Angaben für andere Nutzer.
            </p>
          </div>

          <div class="space-y-2.5">
            <div v-for="(val, key) in sensorMap" :key="key" class="card flex justify-between items-center !py-3.5">
              <div class="flex items-center gap-3.5">
                <span class="sensor-icon">
                  <component :is="val.icon"/>
                </span>
                <div>
                  <p class="text-[14px] font-semibold text-[var(--ink)]">{{ key }}</p>
                  <button class="link-btn text-[11px]" @click="openPopup(val.popupId)">Warum?</button>
                </div>
              </div>
              <ToggleSwitch v-model="settings[val.id]"/>
            </div>
          </div>

          <div class="grow mt-6"></div>
          <PrimaryButton class="mt-6" @click="save('home')">Speichern</PrimaryButton>
        </div>

        <!-- P8: MISSTRAUEND — Freigabe & Live-Schutzstatus auf derselben Seite -->
        <div v-if="currentScreen === 'p8'" class="flex flex-col min-h-full">
          <BackLink @click="currentScreen = 'setup'"/>
          <StepDots :step="1"/>

          <div class="card mb-4">
            <h3 class="font-display text-[16px] text-[var(--ink)] mb-2">Aktuell freigegebene Daten</h3>
            <p class="text-[13px] leading-relaxed text-[var(--ink-soft)]">
              Steuere jede Freigabe einzeln. Dein Schutzstatus unten passt sich live an, sobald du etwas änderst.
            </p>
          </div>

          <div class="space-y-2.5">
            <div v-for="(val, key) in sensorMap" :key="key" class="card flex justify-between items-center !py-3.5">
              <div class="flex items-center gap-3.5">
                <span class="sensor-icon">
                  <component :is="val.icon"/>
                </span>
                <div>
                  <p class="text-[14px] font-semibold text-[var(--ink)]">{{ key }}</p>
                  <button class="link-btn text-[11px]" @click="openPopup(val.popupId)">Warum?</button>
                </div>
              </div>
              <ToggleSwitch v-model="settings[val.id]"/>
            </div>
          </div>

          <button class="sharing-btn press mt-5" :class="{ 'is-active': sharingActive }" @click="sharingActive = !sharingActive">
            <span class="live-dot" v-if="sharingActive"></span>
            {{ sharingActive ? 'Teilen läuft · Beenden' : 'Teilen starten' }}
          </button>

          <Transition name="expand">
            <div v-if="sharingActive" class="mt-4">
              <div class="risk-card">
                <div class="flex items-center gap-2 mb-3.5">
                  <span class="live-dot"></span>
                  <h3 class="text-[11px] font-semibold uppercase tracking-wide text-[var(--danger)]">Live-Schutzstatus</h3>
                </div>
                <div class="text-[13px]">

                  <TransitionGroup name="fade-row" tag="div" class="contents space-y-2.5">
                    <div key="loc" class="flex justify-between border-b border-[var(--danger)]/12 pb-2">
                      <span class="text-[var(--ink-soft)]">Location</span>
                      <span v-if="settings.gps" class="font-semibold text-[var(--ink)]">U-Bahnhof Hermannstraße</span>
                      <span v-else class="locked"><LockIcon/> GPS einschalten</span>
                    </div>

                    <div key="risk" class="flex justify-between border-b border-[var(--danger)]/12 pb-2">
                      <span class="text-[var(--ink-soft)]">Infektionsgefahr</span>
                      <span v-if="settings.temp" class="risk-pill">Mittel</span>
                      <span v-else class="locked"><LockIcon/> Temperatur einschalten</span>
                    </div>

                    <div key="virus" class="flex justify-between border-b border-[var(--danger)]/12 pb-2">
                      <span class="text-[var(--ink-soft)]">Virus-Art</span>
                      <span v-if="settings.mic" class="font-semibold text-[var(--ink)]">Grippe</span>
                      <span v-else class="locked"><LockIcon/> Mikrofon einschalten</span>
                    </div>

                    <div key="symptoms" class="pt-1">
                      <p class="text-[var(--ink-soft)] mb-1.5">Symptome</p>
                      <div v-if="settings.camera" class="flex flex-wrap gap-1.5">
                        <span v-for="s in symptoms" :key="s" class="chip">{{ s }}</span>
                      </div>
                      <span v-else class="locked"><LockIcon/> Kamera einschalten</span>
                    </div>
                  </TransitionGroup>

                </div>
              </div>

              <button class="report-btn press mt-4" @click="reportInfection">
                <span>Infektion melden</span>
              </button>
            </div>
          </Transition>

          <div class="grow mt-4"></div>
        </div>

        <!-- HOME -->
        <div v-if="currentScreen === 'home'" class="space-y-4">
          <div>
            <p class="eyebrow">Ihr Status heute</p>
            <h1 class="font-display text-[24px] text-[var(--ink)] leading-tight">Aktuelle Übersicht</h1>
          </div>

          <div class="card">
            <h3 class="text-[13px] font-semibold text-[var(--ink)] mb-3">Funktionen</h3>
            <div class="space-y-2.5">
              <p class="text-[13px] leading-relaxed text-[var(--ink-soft)] flex gap-2">
                <span class="num-dot">1</span>
                Wir informieren Sie über Ihre persönliche, aktuelle Infektionsgefahr.
              </p>
              <p class="text-[13px] leading-relaxed text-[var(--ink-soft)] flex gap-2">
                <span class="num-dot">2</span>
                Im Falle einer Infektion teilen Sie uns bitte Symptome mit und meiden Sie Kontakte im öffentlichen Raum.
              </p>
            </div>
          </div>

          <div class="risk-card">
            <div class="flex items-center gap-2 mb-3.5">
              <WarnIcon/>
              <h3 class="text-[11px] font-semibold uppercase tracking-wide text-[var(--danger)]">Besondere Gefahrenbereiche auf Ihrer Route</h3>
            </div>
            <div class="space-y-2.5 text-[13px]">
              <div class="flex justify-between border-b border-[var(--danger)]/12 pb-2">
                <span class="text-[var(--ink-soft)]">Location</span>
                <span class="font-semibold text-[var(--ink)]">U-Bahnhof Hermannstraße</span>
              </div>
              <div class="flex justify-between border-b border-[var(--danger)]/12 pb-2">
                <span class="text-[var(--ink-soft)]">Infektionsgefahr</span>
                <span class="risk-pill">Mittel</span>
              </div>
              <div class="flex justify-between border-b border-[var(--danger)]/12 pb-2">
                <span class="text-[var(--ink-soft)]">Virus-Art</span>
                <span class="font-semibold text-[var(--ink)]">Grippe</span>
              </div>
              <div class="pt-1">
                <p class="text-[var(--ink-soft)] mb-1.5">Symptome</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="s in symptoms" :key="s" class="chip">{{ s }}</span>
                </div>
              </div>
            </div>
          </div>

          <button class="report-btn press" @click="reportInfection">
            <span>Infektion melden</span>
          </button>
        </div>
      </main>
    </Transition>

    <!-- BOTTOM SHEET POPUP -->
    <Transition name="backdrop">
      <div v-if="activePopup !== null" class="sheet-backdrop" @click.self="activePopup = null">
        <Transition name="sheet" appear>
          <div class="sheet" key="sheet">
            <div class="sheet-handle"></div>
            <h2 class="font-display text-[19px] text-[var(--ink)] mb-4">Daten, die wir sammeln</h2>
            <div class="text-[14px] leading-relaxed text-[var(--ink-soft)] space-y-3">
              <p v-if="activePopup === 1">Über den Temperatursensor können wir die Verbreitungswahrscheinlichkeit von Viren besser abschätzen, was unsere Prognosen verbessert.</p>
              <p v-if="activePopup === 2">Über die Audioanalyse Ihrer Umgebung können wir die Infektionsgefahr genauer ermitteln.</p>
              <p v-if="activePopup === 3">Über Ihre Standortdaten können wir Sie darüber informieren, ob Sie einem Infektions-Hotspot ausgesetzt waren oder mit infizierten Personen Kontakt hatten.</p>
              <p v-if="activePopup === 4">Wir sammeln Ihre Kameradaten, um potentiell infizierte Personen in Ihrer Umgebung erkennen zu können und Sie frühzeitig zu warnen.</p>
              <div v-if="activePopup === 5" class="space-y-3">
                <p class="font-semibold text-[var(--ink)]">Standort, visuelle Umgebungsdaten, Lautstärke, Temperaturdaten</p>
                <p>Diese Daten sind für die Funktionalität der App dringend nötig und werden nicht anderweitig missbraucht ;) Wenn Sie ein Problem damit haben, wenden Sie sich bitte an den Support.</p>
              </div>
            </div>
            <button class="sheet-close press" @click="activePopup = null">Schließen</button>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- TOAST -->
    <Transition name="toast">
      <div v-if="toast" class="toast">
        <CheckIcon class="!w-4 !h-4 shrink-0"/> {{ toast }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, h } from 'vue';

const emit = defineEmits(['finish']);

const currentScreen = ref('setup');
const activePopup = ref(null);
const menuOpen = ref(false);
const toast = ref('');
const transitionName = ref('slide-forward');
const sharingActive = ref(false);

const settings = reactive({
  persona: '',
  consent: true,
  camera: true,
  mic: true,
  gps: true,
  temp: true,
});

/* ---------- tiny inline icon set (stroke, currentColor) ---------- */
const icon = (paths, extra = {}) => (props) =>
  h('svg', { viewBox: '0 0 24 24', fill: 'none', width: 18, height: 18, ...extra, ...props },
    paths.map(d => h('path', { d, stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })));

const CheckIcon = icon(['M5 12.5 9.5 17 19 7']);
const ChevronIcon = icon(['M9 6l6 6-6 6']);
const WarnIcon = icon(['M12 9v4', 'M12 16.5h.01', 'M10.3 3.9 2.6 17.4a1.7 1.7 0 0 0 1.5 2.6h15.8a1.7 1.7 0 0 0 1.5-2.6L13.7 3.9a1.7 1.7 0 0 0-3.4 0Z']);
const CameraIcon = icon(['M4 8.5A1.5 1.5 0 0 1 5.5 7H8l1-2h6l1 2h2.5A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z', 'M12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z']);
const MicIcon = icon(['M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z', 'M6 11a6 6 0 0 0 12 0', 'M12 19v2']);
const GpsIcon = icon(['M12 21s7-6.1 7-11.4A7 7 0 0 0 5 9.6C5 14.9 12 21 12 21Z', 'M12 12a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z']);
const TempIcon = icon(['M10.5 14.2V5.5a1.5 1.5 0 0 1 3 0v8.7a3.5 3.5 0 1 1-3 0Z']);
const NaiveIcon = icon(['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M8.5 10.5h.01', 'M15.5 10.5h.01', 'M8.5 14.5c1 1 5 1 6 0']);
const SkepticIcon = icon(['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M8.5 10.5h3', 'M14 10.5h1.5', 'M8.5 15h7']);
const DistrustIcon = icon(['M12 3 4 6.5v5c0 5 3.4 8.4 8 9.5 4.6-1.1 8-4.5 8-9.5v-5L12 3Z', 'M9.5 12.5 11 14l3.5-3.5']);
const ShieldHeartIcon = icon(['M12 3 4.5 6v5.4C4.5 16 7.8 19.7 12 21c4.2-1.3 7.5-5 7.5-9.6V6L12 3Z',
  'M12 15.2c-2.6-1.5-4-3-4-4.6a2.1 2.1 0 0 1 4-1 2.1 2.1 0 0 1 4 1c0 1.6-1.4 3.1-4 4.6Z'],
  { width: 46, height: 46 });
const RestartIcon = icon(['M4 4v5h5', 'M4.6 15a8 8 0 1 0 1.7-8.4L4 9']);
const LockIcon = icon(['M6.5 10.5V8a5.5 5.5 0 0 1 11 0v2.5', 'M5.5 10.5h13a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z'], { width: 13, height: 13 });

const sensorMap = {
  Kamera:      { id: 'camera', popupId: 4, icon: CameraIcon },
  Mikrofon:    { id: 'mic',    popupId: 2, icon: MicIcon },
  GPS:         { id: 'gps',    popupId: 3, icon: GpsIcon },
  Temperatur:  { id: 'temp',   popupId: 1, icon: TempIcon },
};

const personas = [
  { id: 'gutgläubig',  label: 'Gutgläubig',   hint: 'Vertraut der App ohne viel zu hinterfragen', icon: NaiveIcon },
  { id: 'skeptiker',   label: 'Skeptiker',    hint: 'Liest genauer, zögert bei Freigaben',          icon: SkepticIcon },
  { id: 'misstrauend', label: 'Misstrauend',  hint: 'Prüft jede Berechtigung einzeln',              icon: DistrustIcon },
];

const symptoms = ['Fieber', 'Halsschmerzen', 'Glieder- & Muskelschmerzen', 'Extreme Müdigkeit', 'Trockener Husten'];

/* ---------- local UI components ---------- */
const ToggleSwitch = (props, { emit }) => {
  const sizes = props.size === 'lg' ? { w: 56, h: 32, knob: 24 } : { w: 46, h: 26, knob: 20 };
  return h('button', {
    class: 'toggle',
    style: { width: sizes.w + 'px', height: sizes.h + 'px', background: props.modelValue ? 'var(--primary)' : 'var(--track-off)' },
    onClick: () => emit('update:modelValue', !props.modelValue),
  }, [
    h('span', {
      class: 'toggle-knob',
      style: {
        width: sizes.knob + 'px', height: sizes.knob + 'px',
        transform: `translateX(${props.modelValue ? sizes.w - sizes.knob - 4 : 4}px)`,
      },
    }, props.modelValue ? h(CheckIcon, { style: { width: '11px', height: '11px', color: 'var(--primary)' } }) : null),
  ]);
};
ToggleSwitch.props = ['modelValue', 'size'];
ToggleSwitch.emits = ['update:modelValue'];

const PrimaryButton = (props, { slots, attrs }) => h('button', { class: ['primary-btn', 'press', attrs.class], onClick: attrs.onClick }, slots.default?.());

const BackLink = (props, { attrs }) => h('button', { class: 'back-link press', onClick: attrs.onClick }, [h(ChevronBackIcon), 'Zurück']);
const ChevronBackIcon = icon(['M15 6l-6 6 6 6']);

const StepDots = (props) => h('div', { class: 'step-dots' }, [1, 2].map(n =>
  h('span', { class: ['step-dot', n === props.step ? 'active' : ''] })));

/* ---------- logic ---------- */
const startPath = (persona) => {
  settings.persona = persona;
  transitionName.value = 'slide-forward';
  sharingActive.value = false;
  if (persona === 'gutgläubig') currentScreen.value = 'p6';
  if (persona === 'skeptiker') currentScreen.value = 'p9';
  if (persona === 'misstrauend') currentScreen.value = 'p8';
};

const openPopup = (id) => { activePopup.value = id; };

const showToast = (msg) => {
  toast.value = msg;
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => { toast.value = ''; }, 2200);
};

const save = (nextScreen) => {
  showToast('Gespeichert');
  transitionName.value = 'slide-forward';
  window.setTimeout(() => { currentScreen.value = nextScreen; }, 260);
};

const reportInfection = () => {
  showToast('Meldung gesendet');
  emit('finish', settings);
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const restartPrototype = () => {
  menuOpen.value = false;
  activePopup.value = null;
  transitionName.value = 'slide-forward';
  sharingActive.value = false;
  settings.persona = '';
  settings.consent = true;
  settings.camera = true;
  settings.mic = true;
  settings.gps = true;
  settings.temp = true;
  currentScreen.value = 'setup';
  showToast('Neu gestartet');
};
</script>

<style scoped>
.app-shell {
  --bg: #F5F2EC;
  --surface: #FFFFFF;
  --surface-alt: #EFEAE0;
  --ink: #1C2420;
  --ink-soft: #5B6B63;
  --border: #E4DECF;
  --primary: #1F5749;
  --primary-soft: #E3EEE8;
  --track-off: #DCD6C8;
  --danger: #B23A2C;
  --danger-soft: #FBEEEC;
  --amber: #B9701C;
  --amber-soft: #FBF1E3;
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  color: var(--ink);
}
.font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; font-weight: 600; }

@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');

.eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .06em; color: var(--primary); text-transform: uppercase; margin-bottom: 4px; }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 1px 2px rgba(28,36,32,.04);
}

.guarantee { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink-soft); }
.guarantee svg { color: var(--primary); width: 15px; height: 15px; flex-shrink: 0; }

.persona-card {
  width: 100%;
  display: flex; align-items: center; gap: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 13px 14px;
  text-align: left;
}
.persona-icon {
  width: 40px; height: 40px; border-radius: 12px;
  background: var(--primary-soft); color: var(--primary);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.link-btn { color: var(--primary); font-size: 12px; font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }

.illustration {
  height: 128px; border-radius: 18px;
  background: linear-gradient(155deg, var(--primary-soft), var(--surface-alt));
  display: flex; align-items: center; justify-content: center;
  color: var(--primary);
}

.primary-btn {
  width: 100%; padding: 15px; border-radius: 14px;
  background: var(--primary); color: #fff;
  font-weight: 600; font-size: 13px; letter-spacing: .02em;
  text-align: center;
}

.back-link {
  display: inline-flex; align-items: center; gap: 2px;
  font-size: 13px; font-weight: 500; color: var(--ink-soft);
  margin-bottom: 14px; align-self: flex-start;
}
.back-link svg { width: 18px; height: 18px; }

.menu-scrim { position: absolute; inset: 0; z-index: 15; background: transparent; }

.nav-menu {
  position: absolute; top: calc(100% + 10px); left: 0; z-index: 30;
  min-width: 170px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 6px;
  box-shadow: 0 10px 26px rgba(28,36,32,.14);
}
.nav-menu-item {
  width: 100%; display: flex; align-items: center; gap: 9px;
  padding: 10px 10px; border-radius: 9px;
  font-size: 13px; font-weight: 600; color: var(--ink);
  text-align: left;
}
.nav-menu-item:hover { background: var(--surface-alt); }
.nav-menu-item svg { color: var(--primary); width: 16px; height: 16px; flex-shrink: 0; }

.menu-enter-active { transition: opacity .16s ease, transform .18s cubic-bezier(.2,.9,.3,1); }
.menu-leave-active { transition: opacity .12s ease, transform .12s ease; }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateY(-6px) scale(.97); }

.step-dots { display: flex; gap: 5px; margin-bottom: 18px; }
.step-dot { width: 16px; height: 4px; border-radius: 2px; background: var(--track-off); transition: background .2s; }
.step-dot.active { background: var(--primary); }

.sensor-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: var(--surface-alt); color: var(--primary);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.num-dot {
  width: 16px; height: 16px; border-radius: 50%;
  background: var(--primary-soft); color: var(--primary);
  font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;
}

.risk-card {
  background: var(--danger-soft);
  border: 1px solid rgba(178,58,44,.14);
  border-left: 4px solid var(--danger);
  border-radius: 16px;
  padding: 18px;
}
.risk-pill {
  font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 999px;
  background: var(--amber-soft); color: var(--amber);
}
.chip {
  font-size: 11.5px; font-weight: 500; color: var(--danger);
  background: #fff; border: 1px solid rgba(178,58,44,.18);
  padding: 4px 9px; border-radius: 999px;
}

.report-btn {
  width: 100%; padding: 16px; margin-top: 6px;
  border-radius: 14px; background: var(--danger); color: #fff;
  font-weight: 700; font-size: 13px; letter-spacing: .02em; text-align: center;
  box-shadow: 0 6px 16px rgba(178,58,44,.28);
}

.sharing-btn {
  width: 100%; padding: 15px; border-radius: 14px;
  background: var(--surface-alt); color: var(--ink);
  border: 1px solid var(--border);
  font-weight: 600; font-size: 13px; letter-spacing: .02em;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.sharing-btn.is-active { background: var(--primary); color: #fff; border-color: var(--primary); }

.live-dot {
  width: 8px; height: 8px; border-radius: 50%; background: #fff;
  box-shadow: 0 0 0 rgba(255,255,255,.5); flex-shrink: 0;
  animation: pulse-dot 1.6s ease-out infinite;
}
.risk-card .live-dot { background: var(--danger); animation: pulse-dot-danger 1.6s ease-out infinite; }
@keyframes pulse-dot {
  0% { box-shadow: 0 0 0 0 rgba(255,255,255,.55); }
  70% { box-shadow: 0 0 0 6px rgba(255,255,255,0); }
  100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
}
@keyframes pulse-dot-danger {
  0% { box-shadow: 0 0 0 0 rgba(178,58,44,.4); }
  70% { box-shadow: 0 0 0 6px rgba(178,58,44,0); }
  100% { box-shadow: 0 0 0 0 rgba(178,58,44,0); }
}

.locked {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11.5px; font-weight: 600; color: var(--ink-soft);
  background: var(--surface-alt); padding: 3px 9px 3px 7px; border-radius: 999px;
}
.locked svg { color: var(--ink-soft); flex-shrink: 0; }

.fade-row-enter-active, .fade-row-leave-active { transition: opacity .22s ease, transform .22s ease; }
.fade-row-enter-from { opacity: 0; transform: translateY(-4px); }
.fade-row-leave-to { opacity: 0; transform: translateY(4px); }
.fade-row-move { transition: transform .22s ease; }

.expand-enter-active { transition: opacity .25s ease, transform .25s cubic-bezier(.2,.9,.3,1); }
.expand-leave-active { transition: opacity .18s ease, transform .18s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; transform: translateY(-8px); }

.press { transition: transform .15s cubic-bezier(.34,1.56,.64,1), opacity .15s; }
.press:active { transform: scale(.96); opacity: .9; }

/* toggle */
:deep(.toggle) { position: relative; border-radius: 999px; transition: background .25s ease; flex-shrink: 0; }
:deep(.toggle-knob) {
  position: absolute; top: 3px; left: 0; border-radius: 999px; background: #fff;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,.18);
  transition: transform .28s cubic-bezier(.34,1.56,.64,1);
}

/* bottom sheet */
.sheet-backdrop {
  position: absolute; inset: 0; z-index: 40;
  background: rgba(20,26,23,.42);
  display: flex; align-items: flex-end;
}
.sheet {
  width: 100%; background: var(--surface);
  border-radius: 22px 22px 0 0;
  padding: 10px 22px 26px;
  box-shadow: 0 -8px 30px rgba(0,0,0,.15);
}
.sheet-handle { width: 36px; height: 4px; border-radius: 2px; background: var(--border); margin: 6px auto 16px; }
.sheet-close {
  width: 100%; margin-top: 22px; padding: 14px; border-radius: 12px;
  background: var(--surface-alt); color: var(--ink); font-weight: 600; font-size: 13px; text-align: center;
}

/* toast */
.toast {
  position: absolute; left: 50%; bottom: 22px; transform: translateX(-50%);
  z-index: 50; display: flex; align-items: center; gap: 6px;
  background: var(--ink); color: #fff; font-size: 12.5px; font-weight: 500;
  padding: 10px 16px; border-radius: 999px; box-shadow: 0 8px 20px rgba(0,0,0,.25);
}

/* transitions */
.slide-forward-enter-active, .slide-forward-leave-active { transition: opacity .22s ease, transform .22s ease; }
.slide-forward-enter-from { opacity: 0; transform: translateX(14px); }
.slide-forward-leave-to { opacity: 0; transform: translateX(-14px); }

.backdrop-enter-active, .backdrop-leave-active { transition: opacity .2s ease; }
.backdrop-enter-from, .backdrop-leave-to { opacity: 0; }

.sheet-enter-active { transition: transform .3s cubic-bezier(.2,.9,.3,1); }
.sheet-leave-active { transition: transform .22s ease-in; }
.sheet-enter-from, .sheet-leave-to { transform: translateY(100%); }

.toast-enter-active { transition: opacity .2s ease, transform .25s cubic-bezier(.34,1.56,.64,1); }
.toast-leave-active { transition: opacity .18s ease, transform .18s ease; }
.toast-enter-from { opacity: 0; transform: translate(-50%, 10px) scale(.9); }
.toast-leave-to { opacity: 0; transform: translate(-50%, 4px); }

.title{
  width: 100%;
  max-width: 100%;
  font-size: clamp(18px, 14cqw, 26px);
  overflow-wrap: normal;
  word-break: normal;
}
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: .001ms !important; animation-duration: .001ms !important; }
}
</style>