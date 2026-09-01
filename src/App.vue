<template>
  <div class="min-h-screen bg-[#DAD4C4] flex items-center justify-center p-4 app-root">
    <!-- Mobile Wrapper -->
    <div class="w-full max-w-[375px] h-[700px] bg-white rounded-[3rem] shadow-2xl overflow-hidden relative border-[8px] border-gray-800">

      <!-- 1. Briefing Stage -->
      <div v-if="step === 'briefing'" class="h-full overflow-y-auto p-6 flex flex-col bg-[var(--bg)]">
        <p class="eyebrow">Vor dem Start</p>
        <h1 class="font-display text-[24px] text-[var(--ink)] mb-3">Briefing</h1>
        <p class="mb-5 text-[13.5px] leading-relaxed text-[var(--ink-soft)]">
          In this study, you will interact with a new Health App prototype. Please answer the following and click start.
        </p>

        <div class="card space-y-3 mb-6">
          <div>
            <label class="field-label">Name / ID</label>
            <input v-model="userData.name" type="text" placeholder="Name/ID" class="field" />
          </div>
          <div>
            <label class="field-label">Age</label>
            <input v-model="userData.age" type="number" placeholder="Age" class="field" />
          </div>
        </div>

        <div class="grow"></div>
        <button
          class="primary-btn press"
          :disabled="!userData.name || !userData.age"
          @click="step = 'prototype'"
        >
          Start Prototype
        </button>
      </div>

      <!-- 2. Prototype Stage -->
      <Prototype v-if="step === 'prototype'" :userData="userData" @finish="onPrototypeComplete" />

      <!-- 3. Exit Survey Stage -->
      <div v-if="step === 'survey'" class="h-full overflow-y-auto p-6 flex flex-col bg-[var(--bg)]">
        <p class="eyebrow">Fast geschafft</p>
        <h1 class="font-display text-[24px] text-[var(--ink)] mb-3">Final Feedback</h1>

        <div class="card mb-6">
          <label class="field-label">How did you feel about the privacy settings?</label>
          <textarea
            v-model="userData.feedback"
            placeholder="How did you feel about the privacy settings?"
            class="field h-32 resize-none"
          ></textarea>
        </div>

        <div class="grow"></div>
        <button class="primary-btn press" :class="{ 'success-btn': !loading }" @click="submitToSupabase" :disabled="loading">
          {{ loading ? 'Saving...' : 'Submit Study' }}
        </button>
      </div>

      <!-- SUCCESS TOAST -->
      <Transition name="toast">
        <div v-if="submitted" class="toast">
          <CheckIcon /> Studie gespeichert
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, h } from 'vue';
import Prototype from './components/Prototype.vue';
import { supabase } from './supabase';

const step = ref('briefing');
const loading = ref(false);
const submitted = ref(false);
const userData = reactive({ name: '', age: null, feedback: '', settings: {} });

const CheckIcon = () =>
  h('svg', { viewBox: '0 0 24 24', fill: 'none', width: 16, height: 16 }, [
    h('path', { d: 'M5 12.5 9.5 17 19 7', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
  ]);

const onPrototypeComplete = (finalSettings) => {
  userData.settings = finalSettings;
  step.value = 'survey';
};

const submitToSupabase = async () => {
  loading.value = true;
  const { error } = await supabase.from('study_data').insert([{
    participant_name: userData.name,
    age: userData.age,
    camera_enabled: userData.settings.camera,
    gps_enabled: userData.settings.gps,
    mic_enabled: userData.settings.mic,
    temp_enabled: userData.settings.temp,
    exit_feedback: userData.feedback,
  }]);
  loading.value = false;
  if (!error) {
    submitted.value = true;
    window.setTimeout(() => { submitted.value = false; }, 2600);
  } else {
    alert('Fehler beim Speichern: ' + error.message);
  }
};
</script>

<style scoped>
.app-root {
  --bg: #F5F2EC;
  --surface: #FFFFFF;
  --surface-alt: #EFEAE0;
  --ink: #1C2420;
  --ink-soft: #5B6B63;
  --border: #E4DECF;
  --primary: #1F5749;
  --primary-soft: #E3EEE8;
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  color: var(--ink);
}
.font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; font-weight: 600; }

@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');

.eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .06em; color: var(--primary); text-transform: uppercase; margin-bottom: 6px; }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 1px 2px rgba(28,36,32,.04);
}

.field-label { display: block; font-size: 11.5px; font-weight: 600; color: var(--ink-soft); margin-bottom: 5px; }
.field {
  width: 100%; background: var(--surface-alt); border: 1px solid var(--border);
  border-radius: 10px; padding: 10px 12px; font-size: 14px; color: var(--ink);
}
.field::placeholder { color: #9AA39A; }
.field:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-soft); }

.primary-btn {
  width: 100%; padding: 15px; border-radius: 14px;
  background: var(--primary); color: #fff;
  font-weight: 600; font-size: 13px; letter-spacing: .02em; text-align: center;
}
.primary-btn:disabled { opacity: .45; }
.success-btn:not(:disabled) { background: #1F5749; }

.press { transition: transform .15s cubic-bezier(.34,1.56,.64,1), opacity .15s; }
.press:active:not(:disabled) { transform: scale(.97); opacity: .92; }

.toast {
  position: absolute; left: 50%; bottom: 22px; transform: translateX(-50%);
  z-index: 50; display: flex; align-items: center; gap: 6px;
  background: var(--ink); color: #fff; font-size: 12.5px; font-weight: 500;
  padding: 10px 16px; border-radius: 999px; box-shadow: 0 8px 20px rgba(0,0,0,.25);
}
.toast-enter-active { transition: opacity .2s ease, transform .25s cubic-bezier(.34,1.56,.64,1); }
.toast-leave-active { transition: opacity .18s ease, transform .18s ease; }
.toast-enter-from { opacity: 0; transform: translate(-50%, 10px) scale(.9); }
.toast-leave-to { opacity: 0; transform: translate(-50%, 4px); }

@media (prefers-reduced-motion: reduce) {
  * { transition-duration: .001ms !important; animation-duration: .001ms !important; }
}
</style>
