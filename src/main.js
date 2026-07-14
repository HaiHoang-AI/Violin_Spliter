import { initShaderCanvas } from './shader.js';

// Global state
let currentView = 'dashboard';
let isDarkTheme = true;
let hfSpaceUrl = localStorage.getItem('hf_space_url') || 'ancalagon-stradivarius-pastoral-ai.hf.space';
let customStems = null; // Holds the separated stem URLs when a real separation completes

// Web Audio API & Audio elements
let audioContext = null;
let audioViolin = new Audio();
let audioBg = new Audio();
let audioSourceViolin = null;
let audioSourceBg = null;
let gainViolin = null;
let gainBg = null;

// Filter nodes for simulation mode
let filterViolin = null;
let filterBg = null;

let isPlaying = false;
let isDualMode = false; // Playing separated stems vs single full mix
let playProgressInterval = null;

// Track Database (Free classic tracks from Wikimedia Commons)
const trackDatabase = [
  {
    id: 1,
    title: "Sonata No. 1 in G Minor: Adagio",
    author: "J.S. Bach (violin: John Harrison)",
    opus: "Opus BWV 1001",
    durationText: "04:15",
    durationSeconds: 255,
    url: "https://upload.wikimedia.org/wikipedia/commons/d/dd/John_Harrison_-_01_-_Bach_Adagio_BWV1001.ogg",
    art: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUA_85HSXZNORKgszJPLPxISE9xc13QP5sNeMCxaG0T1Irow-K3ApeWsihWuJooKXcWg6dyYENgiOjr1vdt2BAM6UO8uJkV0LKoBPbOGdW1HDoblrItCYOdC3hYv4mtsJtHgd8-7-MAgz2a2kK_Hv5W2Mf-a5_1UM83LqgidJHSWZ1cCoMPlzx2ZXm9mt7N6FMqLtujM7BcrqI2xEYk1dEmzy2HdszWKwTKyQpMvAq3WtVCzgkKZqTbrtn2gLJTPqN1b9Qm5oNbB0",
    quote: "\"The bow should dance across the strings like a feather caught in an autumn draft...\"",
    movement: "I. Adagio Sostenuto",
    type: "solo"
  },
  {
    id: 2,
    title: "Partita No. 2 in D Minor: Chaconne",
    author: "J.S. Bach (violin: Ben Goldstein)",
    opus: "Opus BWV 1004",
    durationText: "14:50",
    durationSeconds: 890,
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b5/J._S._Bach_-_Partita_No._2_in_D_minor_for_solo_violin%2C_BWV_1004_-_5._Chaconne.ogg",
    art: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNG9oDQNR6AQP-x8bjPtfy0DEWumf59p996h7MPHgWpplyV5zypmjlpk4OfC7GHzl4Ct-vBtXebogv_SiefKx8oj-1xq2Na_MWOEKcJ-_4fVyf0wEugGBs3zgK0h81w36nS0XJpiw6m0lUOickpM8A2BDtwHgJUG163hQXFeol42HxjWy3dnev5x3sFgPiKAeypjqkhYFU3vaNTdueED6tV1dN3D2ABJ0I0i8FsNJAcl7u1TG3TdHZUxXk0mhckVmjVYUDySJz__M",
    quote: "\"Architecture in motion. A cathedral built of single notes and sweeping double stops.\"",
    movement: "V. Chaconne",
    type: "solo"
  },
  {
    id: 3,
    title: "The Four Seasons: Winter - Largo",
    author: "Antonio Vivaldi (violin: John Harrison)",
    opus: "Opus 8 No. 4",
    durationText: "02:12",
    durationSeconds: 132,
    url: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Vivaldi_-_Winter_-_Largo.ogg",
    art: "https://lh3.googleusercontent.com/aida-public/AB6AXuADdDtqSpZM9s54t7AKu_x66NugVh3MRygJCM2FAe3Mb2vk9WS_Ze7eAOJmJllDmADB6JwGpTHoIZrcFCf-AhW7PSj4nMCFG2IE1ByCxJjEKuMztU9odY0cTMRo-AJm48uQYJr0M9CWv8Oti-decyI_7Qp79OfMTwO3z99yzoBgG3xRPCe2fZ29Lba83xKVp4HFAm-7fA3sEGS0wW5EHKj44IwwetA5zaitlp5SF3Ejq-imUDx92mFPbbRKD9eQE8HcjDgWy2tWUgw",
    quote: "\"Raindrops tapping on the windowpane, while we sit warmly inside by the hearth.\"",
    movement: "II. Largo",
    type: "orchestra"
  },
  {
    id: 4,
    title: "Caprice No. 24 in A Minor",
    author: "Niccolò Paganini",
    opus: "Opus 1",
    durationText: "04:47",
    durationSeconds: 287,
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Paganini_-_Caprice_No._24.ogg",
    art: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7ioyXCYifiALLjDOJ-VhCQT24Onh3svoZFqv7q9rjZyHlucpf4jJ3Wle6aQKgbT7ZUIEF3QmSWFuKTqFg5CDCfkaTaQGrDvy9C3vKZRZ_6pZzMjMS3VTdMTsU5ZuuSuIgwNIVUsqkD0fa-OQjr_YO_H6FveBOUcOICGUZ-Nkkm-27k8ZJhrqOnUj6Nec13suCaUJEv7TEJyXbEgBSAEoAHDYFcJM16598QHi0wpNu90URjzcYANAhpIkIEuQTbpzhBLwDiRvF4dA",
    quote: "\"The ultimate test of virtuosity, containing eleven variations and a dramatic finale.\"",
    movement: "Tema con Variazioni",
    type: "solo"
  }
];

let currentTrack = trackDatabase[0];
let activeLibraryTab = 'all';

// Audio separation history
let separationHistory = JSON.parse(localStorage.getItem('separation_history')) || [
  { id: 'h1', name: 'Vivaldi_Winter_Solo.flac', time: '2 hours ago', confidence: '98% Confidence', status: 'done', trackId: 3 },
  { id: 'h2', name: 'Paganini_Caprice_24.wav', time: 'Yesterday', confidence: '84% Confidence', status: 'done', trackId: 4 },
  { id: 'h3', name: 'Mendelssohn_Final_3.flac', time: '3 days ago', confidence: 'Separation in Progress', status: 'processing', trackId: 1 }
];

// Initialize Audio Context and Routing
function initAudioEngine() {
  if (audioContext) return;
  
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Set up Media Sources
  audioSourceViolin = audioContext.createMediaElementSource(audioViolin);
  audioSourceBg = audioContext.createMediaElementSource(audioBg);
  
  // Create gain nodes for volume adjustment
  gainViolin = audioContext.createGain();
  gainBg = audioContext.createGain();
  
  // Create filter nodes (peaking / shelving filters) to simulate separation when single audio is played
  filterViolin = audioContext.createBiquadFilter();
  filterViolin.type = 'peaking';
  filterViolin.frequency.value = 2500; // Violin key frequency area
  filterViolin.Q.value = 1.0;
  filterViolin.gain.value = 0; // default no change
  
  filterBg = audioContext.createBiquadFilter();
  filterBg.type = 'lowshelf';
  filterBg.frequency.value = 800; // Accompaniment/orchestra area
  filterBg.gain.value = 0;
  
  // Connect routes
  audioSourceViolin.connect(filterViolin).connect(gainViolin).connect(audioContext.destination);
  audioSourceBg.connect(filterBg).connect(gainBg).connect(audioContext.destination);
}

// Play a selected track
function playTrack(track, isStems = false, violinStemUrl = null, bgStemUrl = null) {
  initAudioEngine();
  
  // Resume AudioContext if suspended (browser security)
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  currentTrack = track;
  isDualMode = isStems;
  
  stopAudioInterval();
  
  if (isDualMode && violinStemUrl && bgStemUrl) {
    // Cross-origin support (only for remote URLs) - MUST BE SET BEFORE SRC
    if (violinStemUrl.startsWith('blob:') || violinStemUrl.startsWith('data:')) {
      audioViolin.removeAttribute('crossOrigin');
    } else {
      audioViolin.crossOrigin = "anonymous";
    }
    
    if (bgStemUrl.startsWith('blob:') || bgStemUrl.startsWith('data:')) {
      audioBg.removeAttribute('crossOrigin');
    } else {
      audioBg.crossOrigin = "anonymous";
    }

    // Play real separated stems
    audioViolin.src = violinStemUrl;
    audioBg.src = bgStemUrl;
    
    audioViolin.load();
    audioBg.load();
    
    // Reset filters
    filterViolin.gain.value = 0;
    filterBg.gain.value = 0;
  } else {
    // Cross-origin support (only for remote URLs) - MUST BE SET BEFORE SRC
    if (track.url && (track.url.startsWith('blob:') || track.url.startsWith('data:'))) {
      audioViolin.removeAttribute('crossOrigin');
    } else {
      audioViolin.crossOrigin = "anonymous";
    }

    // Play normal full track
    audioViolin.src = track.url;
    audioViolin.load();
    
    // Clear background audio
    audioBg.src = "";
  }
  
  audioViolin.play().then(() => {
    isPlaying = true;
    updatePlayerUI();
    startAudioInterval();
    
    if (isDualMode && bgStemUrl) {
      audioBg.play().catch(e => console.error("Error playing background stem:", e));
    }
  }).catch(e => {
    console.error("Error playing main audio:", e);
    alert("Không thể phát bài hát này. Vui lòng kiểm tra kết nối mạng.");
  });
}

function togglePlay() {
  initAudioEngine();
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }

  if (isPlaying) {
    audioViolin.pause();
    if (isDualMode) audioBg.pause();
    isPlaying = false;
    stopAudioInterval();
  } else {
    if (audioViolin.src) {
      audioViolin.play();
      if (isDualMode && audioBg.src) audioBg.play();
      isPlaying = true;
      startAudioInterval();
    } else {
      // Play default track
      playTrack(currentTrack);
    }
  }
  updatePlayerUI();
}

function startAudioInterval() {
  playProgressInterval = setInterval(() => {
    if (!audioViolin.duration) return;
    
    const progress = (audioViolin.currentTime / audioViolin.duration) * 100;
    
    // Update progress bars
    document.getElementById('mini-progress-bar').style.width = `${progress}%`;
    document.getElementById('player-progress-bar').style.width = `${progress}%`;
    document.getElementById('player-scrubber-handle').style.left = `${progress}%`;
    
    // Update time indicators
    const currentText = formatTime(audioViolin.currentTime);
    const totalText = formatTime(audioViolin.duration);
    document.getElementById('mini-player-subtitle').textContent = `Violin Solo • ${currentText} / ${totalText}`;
    document.getElementById('player-time-current').textContent = currentText;
    document.getElementById('player-time-total').textContent = totalText;
    
    // Manuscript view scrubber alignment
    document.getElementById('manuscript-score-scrubber').style.left = `${progress}%`;

    // Sync dual audios occasionally if drift occurs
    if (isDualMode && !audioBg.paused) {
      if (Math.abs(audioViolin.currentTime - audioBg.currentTime) > 0.15) {
        audioBg.currentTime = audioViolin.currentTime;
      }
    }
    
    if (audioViolin.ended) {
      isPlaying = false;
      updatePlayerUI();
      stopAudioInterval();
    }
  }, 250);
}

function stopAudioInterval() {
  if (playProgressInterval) {
    clearInterval(playProgressInterval);
  }
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Adjust stems volume or filter (Simulation mode)
function adjustSeparationStems() {
  const violinVol = parseInt(document.getElementById('violin-vol-slider').value);
  const bgVol = parseInt(document.getElementById('bg-vol-slider').value);
  
  // Update labels and fill bars
  document.getElementById('violin-vol-label').textContent = `${violinVol}%`;
  document.getElementById('violin-vol-fill').style.width = `${violinVol}%`;
  document.getElementById('bg-vol-label').textContent = `${bgVol}%`;
  document.getElementById('bg-vol-fill').style.width = `${bgVol}%`;
  
  if (!audioContext) return;
  
  if (isDualMode) {
    // Real stem mode - adjust raw volumes
    gainViolin.gain.value = violinVol / 100;
    gainBg.gain.value = bgVol / 100;
  } else {
    // Single track simulation mode - use peaking/shelving filters to simulate violin/accompaniment separation
    // Lowering violin volume reduces high-mid frequencies
    if (violinVol < 100) {
      filterViolin.gain.value = -30 * (1 - (violinVol / 100)); // Cut peaking filter at 2.5kHz
    } else {
      filterViolin.gain.value = 0;
    }
    
    // Lowering background volume cuts low frequencies
    if (bgVol < 100) {
      filterBg.gain.value = -30 * (1 - (bgVol / 100)); // Cut lowshelf filter
    } else {
      filterBg.gain.value = 0;
    }
    
    // Adjust overall volume a bit
    gainViolin.gain.value = (violinVol + bgVol) / 200;
  }
}

// UI Navigation / Router
function navigateTo(viewId) {
  currentView = viewId;
  
  // Hide all sections
  document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
  
  // Show target section
  const targetEl = document.getElementById(`view-${viewId}`);
  if (targetEl) {
    targetEl.classList.remove('hidden');
  }
  
  // Update sidebar active styling
  document.querySelectorAll('#sidebar-links button, #mobile-nav-links button').forEach(btn => {
    if (btn.getAttribute('data-target') === viewId) {
      btn.className = "flex items-center gap-4 text-secondary dark:text-[#e9c176] border-l-2 border-secondary dark:border-[#e9c176] pl-8 bg-secondary-container/10 dark:bg-[#604403]/10 py-3 transition-all text-left w-full";
    } else {
      btn.className = "flex items-center gap-4 text-on-surface-variant dark:text-[#c1c8c3] hover:text-on-surface dark:hover:text-[#e5e2d8] hover:bg-surface-container-high/50 dark:hover:bg-[#2a2a23]/50 pl-8 py-3 transition-all text-left w-full";
    }
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Build Library UI
function renderLibrary() {
  const container = document.getElementById('library-manuscripts-grid');
  if (!container) return;
  
  container.innerHTML = '';
  
  const filtered = trackDatabase.filter(track => {
    if (activeLibraryTab === 'all') return true;
    if (activeLibraryTab === 'solo') return track.type === 'solo';
    if (activeLibraryTab === 'orchestra') return track.type === 'orchestra';
    return true; // placeholder for archived
  });
  
  filtered.forEach(track => {
    const isCurrent = currentTrack.id === track.id;
    const card = document.createElement('div');
    card.className = `vellum-card p-6 flex flex-col aspect-[3/4] group cursor-pointer relative overflow-hidden ${isCurrent ? 'border-secondary dark:border-[#e9c176]' : ''}`;
    card.innerHTML = `
      <div class="absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
        <span class="material-symbols-outlined text-[120px] dark:text-[#e9c176]">eco</span>
      </div>
      <div class="border border-secondary/20 flex-1 flex flex-col p-4 items-center justify-center text-center">
        <span class="font-label-sm text-[10px] text-secondary/60 dark:text-[#e9c176]/60 tracking-widest uppercase mb-4">${track.opus}</span>
        <h2 class="font-display-lg text-xl md:text-2xl text-secondary dark:text-[#e9c176] leading-tight mb-4">${track.title}</h2>
        <div class="w-12 h-[1px] bg-secondary/30 mb-4"></div>
        <p class="font-body-md italic text-on-surface-variant dark:text-[#c1c8c3] text-sm">${track.author}</p>
      </div>
      <div class="mt-4 flex justify-between items-center z-10">
        <span class="text-label-sm font-label-sm text-secondary/70 dark:text-[#e9c176]/70">${track.durationText}</span>
        <span class="material-symbols-outlined text-secondary dark:text-[#e9c176] ${isCurrent && isPlaying ? 'fill-icon' : 'opacity-0 group-hover:opacity-100'} transition-all">${isCurrent && isPlaying ? 'pause_circle' : 'play_circle'}</span>
      </div>
    `;
    
    card.addEventListener('click', () => {
      if (isCurrent) {
        togglePlay();
      } else {
        playTrack(track);
      }
      renderLibrary();
    });
    
    container.appendChild(card);
  });
}

// Build Dashboard / Landing View
function renderDashboard() {
  // Render Daily Masterpieces (2 items)
  const masterpiecesContainer = document.getElementById('daily-masterpieces-container');
  if (masterpiecesContainer) {
    masterpiecesContainer.innerHTML = '';
    trackDatabase.slice(0, 2).forEach(track => {
      const isCurrent = currentTrack.id === track.id;
      const el = document.createElement('div');
      el.className = "vellum-layer p-6 rounded-xl hover:translate-y-[-4px] cursor-pointer group";
      el.innerHTML = `
        <div class="w-full h-40 rounded-lg overflow-hidden mb-4 relative">
          <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Sheet music" src="${track.art}"/>
          <div class="absolute inset-0 bg-primary-container/20 group-hover:bg-transparent transition-colors"></div>
        </div>
        <span class="font-label-sm text-primary dark:text-[#a9cfbe] tracking-widest text-[10px] uppercase">${track.type === 'solo' ? 'SOLO VIOLIN' : 'ORCHESTRAL CONCERTO'}</span>
        <h4 class="font-display-lg text-xl text-on-surface dark:text-[#e5e2d8] mt-1">${track.title}</h4>
        <p class="text-sm text-on-surface-variant/80 dark:text-[#c1c8c3]/80 mt-2 line-clamp-2">${track.quote}</p>
        <div class="flex items-center justify-between mt-4">
          <div class="flex -space-x-2">
            <div class="w-6 h-6 rounded-full border border-secondary dark:border-[#e9c176] bg-surface-container dark:bg-[#202019]"></div>
          </div>
          <span class="material-symbols-outlined text-secondary dark:text-[#e9c176] group-hover:scale-125 transition-transform ${isCurrent && isPlaying ? 'fill-icon' : ''}" data-icon="play_circle">${isCurrent && isPlaying ? 'pause_circle' : 'play_circle'}</span>
        </div>
      `;
      el.addEventListener('click', () => {
        if (isCurrent) {
          togglePlay();
        } else {
          playTrack(track);
        }
        renderDashboard();
      });
      masterpiecesContainer.appendChild(el);
    });
  }

  // Render Recent Separations List
  const recentsContainer = document.getElementById('recent-separations-container');
  if (recentsContainer) {
    recentsContainer.innerHTML = '';
    separationHistory.forEach(item => {
      const matchingTrack = trackDatabase.find(t => t.id === item.trackId) || trackDatabase[0];
      const isCurrent = currentTrack.id === matchingTrack.id;
      const el = document.createElement('div');
      el.className = "flex items-center gap-4 p-3 hover:bg-secondary-container/10 dark:hover:bg-[#604403]/10 rounded transition-colors cursor-pointer border-b border-secondary/10 dark:border-[#e9c176]/10";
      el.innerHTML = `
        <div class="w-12 h-12 flex-shrink-0 bg-surface-container-high dark:bg-[#2a2a23] rounded flex items-center justify-center border border-secondary/20 dark:border-[#e9c176]/20">
          <span class="material-symbols-outlined text-secondary dark:text-[#e9c176]">${item.status === 'processing' ? 'sync' : 'audio_file'}</span>
        </div>
        <div class="flex-1 overflow-hidden">
          <h5 class="font-body-md font-medium text-on-surface dark:text-[#e5e2d8] truncate">${item.name}</h5>
          <p class="font-label-sm text-on-surface-variant dark:text-[#c1c8c3] text-[10px]">${item.time} • ${item.confidence}</p>
        </div>
      `;
      el.addEventListener('click', () => {
        if (item.status === 'done') {
          playTrack(matchingTrack);
          renderDashboard();
        } else {
          alert("Bản dịch nhạc này vẫn đang được tách nền trên máy chủ. Xin vui lòng chờ.");
        }
      });
      recentsContainer.appendChild(el);
    });
    
    // Add Archive view link at bottom of Recents
    const viewFullBtn = document.createElement('button');
    viewFullBtn.className = "text-center py-2 font-label-sm text-secondary dark:text-[#e9c176] hover:text-on-surface dark:hover:text-[#e5e2d8] transition-colors w-full";
    viewFullBtn.textContent = "VIEW FULL ARCHIVE";
    viewFullBtn.addEventListener('click', () => navigateTo('archive'));
    recentsContainer.appendChild(viewFullBtn);
  }
}

// Build Archive Acquisitions List
function renderAcquisitions() {
  const container = document.getElementById('archive-acquisitions-container');
  if (!container) return;
  
  container.innerHTML = '';
  const acquisitions = [
    { name: "Caprice No. 24", author: "N. PAGANINI", url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Paganini_-_Caprice_No._24.ogg" },
    { name: "Violin Concerto in D", author: "J. BRAHMS", url: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Brahms_Violin_Concerto_Adagio.ogg" }
  ];
  
  acquisitions.forEach(acq => {
    const el = document.createElement('div');
    el.className = "flex items-center justify-between group cursor-pointer";
    el.innerHTML = `
      <div class="flex gap-4 items-center">
        <div class="w-12 h-16 bg-primary-container/20 border border-secondary/20 flex items-center justify-center">
          <span class="material-symbols-outlined text-secondary/40">auto_stories</span>
        </div>
        <div>
          <p class="font-body-lg text-on-surface dark:text-[#e5e2d8]">${acq.name}</p>
          <p class="text-label-sm font-label-sm text-on-surface-variant">${acq.author}</p>
        </div>
      </div>
      <a href="${acq.url}" target="_blank" class="material-symbols-outlined text-on-surface-variant group-hover:text-secondary transition-colors" data-icon="download">download</a>
    `;
    container.appendChild(el);
  });
}

// Update Player UI elements (Mini and Grand Player)
function updatePlayerUI() {
  // Update Mini Player
  document.getElementById('mini-player-art').src = currentTrack.art;
  document.getElementById('mini-player-title').textContent = currentTrack.title;
  
  const playBtn = document.getElementById('mini-btn-play');
  if (isPlaying) {
    playBtn.textContent = 'pause_circle';
    playBtn.style.fontVariationSettings = "'FILL' 1";
  } else {
    playBtn.textContent = 'play_circle';
    playBtn.style.fontVariationSettings = "'FILL' 0";
  }

  // Update Grand Player
  document.getElementById('player-art').src = currentTrack.art;
  document.getElementById('player-title').textContent = currentTrack.title;
  document.getElementById('player-opus').textContent = currentTrack.opus;
  document.getElementById('player-author').textContent = `${currentTrack.author} • Transcription by Maestro`;
  document.getElementById('player-quote').textContent = currentTrack.quote;
  document.getElementById('player-movement').textContent = currentTrack.movement;

  const grandPlayIcon = document.getElementById('player-play-icon');
  const grandPlayBtn = document.getElementById('player-btn-play');
  if (isPlaying) {
    grandPlayIcon.textContent = 'pause';
    grandPlayBtn.classList.add('active-ring');
  } else {
    grandPlayIcon.textContent = 'play_arrow';
    grandPlayBtn.classList.remove('active-ring');
  }

  // Set up Up Next
  const currentIdx = trackDatabase.findIndex(t => t.id === currentTrack.id);
  const nextIdx = (currentIdx + 1) % trackDatabase.length;
  const nextTrack = trackDatabase[nextIdx];
  
  document.getElementById('up-next-art').src = nextTrack.art;
  document.getElementById('up-next-title').textContent = nextTrack.title;
  document.getElementById('up-next-desc').textContent = `${nextTrack.author} — Conservatory Recording`;
}

// Hugging Face AI Audio Separation API Call (Option C)
async function performAISeparation(file) {
  const dropzoneContainer = document.getElementById('dropzone-text-container');
  const loadingContainer = document.getElementById('separation-loading-container');
  const refineBtn = document.getElementById('refine-sound-btn');
  const progressBar = document.getElementById('separation-progress-bar');
  const progressTitle = document.getElementById('separation-progress-title');
  const progressDesc = document.getElementById('separation-progress-desc');

  // Toggle view
  dropzoneContainer.classList.add('hidden');
  loadingContainer.classList.remove('hidden');
  refineBtn.disabled = true;

  progressBar.style.width = '10%';
  progressTitle.textContent = 'Uploading audio manuscript...';

  try {
    // 1. Upload the file to Hugging Face Space
    const formData = new FormData();
    formData.append("files", file);

    const uploadRes = await fetch(`https://${hfSpaceUrl}/upload`, {
      method: "POST",
      body: formData
    });

    if (!uploadRes.ok) throw new Error("Upload failed");
    
    const uploadData = await uploadRes.json();
    const tempFilePath = uploadData[0]; // e.g. "/tmp/gradio/xxx/audio.mp3"

    // 2. Trigger the Demucs prediction
    progressBar.style.width = '30%';
    progressTitle.textContent = 'Invoking AI Demucs models...';
    progressDesc.textContent = 'Xử lý sóng âm và nhận diện nhạc cụ trên máy chủ Hugging Face (Có thể mất 1-2 phút)...';

    // Call API predict
    const predictRes = await fetch(`https://${hfSpaceUrl}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          { path: tempFilePath, meta: { _type: "gradio.FileData" } }
        ]
      })
    });

    if (!predictRes.ok) throw new Error("Separation prediction failed");

    progressBar.style.width = '80%';
    progressTitle.textContent = 'Structuring acoustic stems...';

    const predictData = await predictRes.json();
    const outputs = predictData.data; // Array of stem objects: [violin_stem, accompaniment_stem]

    if (!outputs || outputs.length < 2) {
      throw new Error("Invalid output received from model");
    }

    // Extract URLs
    const violinStemUrl = outputs[0].url || `https://${hfSpaceUrl}/file=${outputs[0].path}`;
    const bgStemUrl = outputs[1].url || `https://${hfSpaceUrl}/file=${outputs[1].path}`;

    progressBar.style.width = '100%';
    progressTitle.textContent = 'Separation Complete!';
    
    // Add to local history list
    const newHistory = {
      id: 'h_' + Date.now(),
      name: file.name,
      time: 'Just now',
      confidence: '95% Confidence (AI)',
      status: 'done',
      trackId: 1 // fallback mapping
    };
    separationHistory.unshift(newHistory);
    localStorage.setItem('separation_history', JSON.stringify(separationHistory));

    customStems = { violin: violinStemUrl, bg: bgStemUrl };

    setTimeout(() => {
      // Toggle back view
      loadingContainer.classList.add('hidden');
      dropzoneContainer.classList.remove('hidden');
      document.getElementById('upload-status-text').innerHTML = `<span class="text-secondary">✓ ${file.name} (Separated)</span>`;
      refineBtn.disabled = false;
      
      // Play the newly separated stems
      const tempTrack = {
        id: 999,
        title: file.name,
        author: "Uploaded Manuscript (Separated)",
        opus: "AI Separation",
        durationText: "00:00",
        durationSeconds: 0,
        url: violinStemUrl,
        art: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUA_85HSXZNORKgszJPLPxISE9xc13QP5sNeMCxaG0T1Irow-K3ApeWsihWuJooKXcWg6dyYENgiOjr1vdt2BAM6UO8uJkV0LKoBPbOGdW1HDoblrItCYOdC3hYv4mtsJtHgd8-7-MAgz2a2kK_Hv5W2Mf-a5_1UM83LqgidJHSWZ1cCoMPlzx2ZXm9mt7N6FMqLtujM7BcrqI2xEYk1dEmzy2HdszWKwTKyQpMvAq3WtVCzgkKZqTbrtn2gLJTPqN1b9Qm5oNbB0",
        quote: "Audio separated successfully using Demucs on Hugging Face.",
        movement: "Isolated Violin Stem",
        type: "solo"
      };

      playTrack(tempTrack, true, violinStemUrl, bgStemUrl);
      renderDashboard();
    }, 1000);

  } catch (error) {
    console.error("Separation Error:", error);
    progressBar.style.width = '100%';
    progressTitle.textContent = 'Running in Demo Mode (Backend Offline)';
    progressDesc.textContent = 'Không thể kết nối máy chủ AI. Đang chuyển sang Chế độ Giả lập Tách tiếng...';

    setTimeout(() => {
      // Fallback: Run Option A Simulation
      loadingContainer.classList.add('hidden');
      dropzoneContainer.classList.remove('hidden');
      document.getElementById('upload-status-text').innerHTML = `<span class="text-secondary">✓ ${file.name} (Demo Simulation)</span>`;
      refineBtn.disabled = false;
      
      // Start simulated track with the user's actual uploaded file
      const localUrl = URL.createObjectURL(file);
      const tempTrack = {
        id: 999,
        title: file.name,
        author: "Uploaded Manuscript (Demo Simulation)",
        opus: "Demo Simulation",
        durationText: "00:00",
        durationSeconds: 0,
        url: localUrl,
        art: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUA_85HSXZNORKgszJPLPxISE9xc13QP5sNeMCxaG0T1Irow-K3ApeWsihWuJooKXcWg6dyYENgiOjr1vdt2BAM6UO8uJkV0LKoBPbOGdW1HDoblrItCYOdC3hYv4mtsJtHgd8-7-MAgz2a2kK_Hv5W2Mf-a5_1UM83LqgidJHSWZ1cCoMPlzx2ZXm9mt7N6FMqLtujM7BcrqI2xEYk1dEmzy2HdszWKwTKyQpMvAq3WtVCzgkKZqTbrtn2gLJTPqN1b9Qm5oNbB0",
        quote: "Chế độ Giả lập Tách tiếng đang chạy trên tệp âm thanh của bạn.",
        movement: "Original Track",
        type: "solo"
      };
      
      playTrack(tempTrack, false);
      renderDashboard();
    }, 2500);
  }
}

// Setup Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial renders
  renderLibrary();
  renderDashboard();
  renderAcquisitions();

  // 2. Navigation events
  navigateTo('dashboard'); // Start at dashboard

  document.querySelectorAll('#sidebar-links button, #mobile-nav-links button').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) {
        navigateTo(target);
        document.getElementById('mobile-drawer').classList.add('hidden');
      }
    });
  });

  document.getElementById('app-logo').addEventListener('click', () => navigateTo('dashboard'));
  document.querySelectorAll('[data-action="view-library"]').forEach(el => {
    el.addEventListener('click', () => navigateTo('library'));
  });

  // Mobile menu drawer
  const drawer = document.getElementById('mobile-drawer');
  const drawerContent = document.getElementById('mobile-drawer-content');
  
  document.getElementById('mobile-menu-toggle').addEventListener('click', () => {
    drawer.classList.remove('hidden');
    setTimeout(() => drawerContent.style.transform = 'translateX(0)', 50);
  });
  
  document.getElementById('mobile-drawer-close').addEventListener('click', () => {
    drawerContent.style.transform = 'translateX(-100%)';
    setTimeout(() => drawer.classList.add('hidden'), 300);
  });

  // 3. Theme Toggle events
  const themeToggleBtn = document.getElementById('theme-toggle');
  const grandThemeToggleBtn = document.getElementById('grand-theme-toggle');

  const toggleTheme = () => {
    isDarkTheme = !isDarkTheme;
    document.documentElement.classList.toggle('dark');
    document.documentElement.classList.toggle('light');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  };

  themeToggleBtn.addEventListener('click', toggleTheme);
  grandThemeToggleBtn.addEventListener('click', toggleTheme);

  // Initialize saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    isDarkTheme = false;
  }

  // 4. Music Player UI events
  // Bottom mini player actions
  document.getElementById('mini-btn-play').addEventListener('click', togglePlay);
  document.getElementById('mini-btn-prev').addEventListener('click', () => {
    const currentIdx = trackDatabase.findIndex(t => t.id === currentTrack.id);
    const prevIdx = (currentIdx - 1 + trackDatabase.length) % trackDatabase.length;
    playTrack(trackDatabase[prevIdx]);
  });
  document.getElementById('mini-btn-next').addEventListener('click', () => {
    const currentIdx = trackDatabase.findIndex(t => t.id === currentTrack.id);
    const nextIdx = (currentIdx + 1) % trackDatabase.length;
    playTrack(trackDatabase[nextIdx]);
  });

  // Slide up full Grand Player
  document.getElementById('mini-track-info-click').addEventListener('click', () => {
    document.getElementById('grand-player-panel').style.transform = 'translateY(0)';
  });

  document.getElementById('grand-player-close').addEventListener('click', () => {
    document.getElementById('grand-player-panel').style.transform = 'translateY(100%)';
  });

  document.getElementById('goto-library-from-player').addEventListener('click', () => {
    document.getElementById('grand-player-panel').style.transform = 'translateY(100%)';
    navigateTo('library');
  });

  // Grand Player Controls
  document.getElementById('player-btn-play').addEventListener('click', togglePlay);
  document.getElementById('player-btn-prev').addEventListener('click', () => {
    const currentIdx = trackDatabase.findIndex(t => t.id === currentTrack.id);
    const prevIdx = (currentIdx - 1 + trackDatabase.length) % trackDatabase.length;
    playTrack(trackDatabase[prevIdx]);
  });
  document.getElementById('player-btn-next').addEventListener('click', () => {
    const currentIdx = trackDatabase.findIndex(t => t.id === currentTrack.id);
    const nextIdx = (currentIdx + 1) % trackDatabase.length;
    playTrack(trackDatabase[nextIdx]);
  });

  // Up Next card click
  document.getElementById('up-next-container').addEventListener('click', () => {
    const currentIdx = trackDatabase.findIndex(t => t.id === currentTrack.id);
    const nextIdx = (currentIdx + 1) % trackDatabase.length;
    playTrack(trackDatabase[nextIdx]);
  });

  // 5. Scrubber interactions
  const handleSeek = (e, containerId) => {
    const rect = document.getElementById(containerId).getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (audioViolin.duration) {
      audioViolin.currentTime = pos * audioViolin.duration;
      if (isDualMode && audioBg.src) {
        audioBg.currentTime = audioViolin.currentTime;
      }
    }
  };

  document.getElementById('mini-progress-container').addEventListener('click', (e) => handleSeek(e, 'mini-progress-container'));
  document.getElementById('player-progress-container').addEventListener('click', (e) => handleSeek(e, 'player-progress-container'));

  // Volume slider interaction
  const volumeSlider = document.getElementById('mini-volume-container');
  if (volumeSlider) {
    volumeSlider.addEventListener('click', (e) => {
      const rect = volumeSlider.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      document.getElementById('mini-volume-bar').style.width = `${pct * 100}%`;
      audioViolin.volume = pct;
      audioBg.volume = pct;
    });
  }

  // 6. Library Tab filters
  document.querySelectorAll('.library-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.library-tab-btn').forEach(b => {
        b.className = "text-on-surface-variant hover:text-secondary transition-colors pb-1 library-tab-btn";
      });
      btn.className = "text-secondary border-b border-secondary pb-1 library-tab-btn";
      
      activeLibraryTab = btn.getAttribute('data-tab');
      renderLibrary();
    });
  });

  // 7. Separation Studio interactions & Drag-and-drop
  const dropzone = document.getElementById('audio-dropzone');
  const fileInput = document.getElementById('audio-file-input');

  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      document.getElementById('upload-status-text').textContent = `Loaded: ${file.name}`;
      dropzone.style.borderColor = "#e9c176";
    }
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "#e9c176";
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = "rgba(197, 160, 89, 0.3)";
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      const file = e.dataTransfer.files[0];
      document.getElementById('upload-status-text').textContent = `Loaded: ${file.name}`;
      dropzone.style.borderColor = "#e9c176";
    }
  });

  // Sliders for separation intensity
  document.getElementById('violin-vol-slider').addEventListener('input', adjustSeparationStems);
  document.getElementById('bg-vol-slider').addEventListener('input', adjustSeparationStems);

  // Refine Sound Action click
  document.getElementById('refine-sound-btn').addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
      alert("Vui lòng kéo thả hoặc chọn một tệp tin nhạc âm bản trước khi phân tách.");
      return;
    }
    performAISeparation(file);
  });

  // Hugging Face Endpoints input
  const hfInput = document.getElementById('hf-api-url');
  if (hfInput) {
    hfInput.value = hfSpaceUrl;
    document.getElementById('save-hf-url').addEventListener('click', () => {
      const val = hfInput.value.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
      if (val) {
        hfSpaceUrl = val;
        localStorage.setItem('hf_space_url', val);
        alert("Đã lưu máy chủ AI Hugging Face mới: " + val);
      }
    });
  }

  // 8. Load shader canvas
  const canvas = document.getElementById('shader-canvas');
  if (canvas) {
    initShaderCanvas(canvas);
  }

  // Desktop sidebar "New Transcription" button
  document.getElementById('sidebar-new-transcription').addEventListener('click', () => {
    navigateTo('separation');
  });

  // Initialize sidebar copy to mobile drawer
  const mobileNavContainer = document.getElementById('mobile-nav-links');
  if (mobileNavContainer) {
    const sidebarHtml = document.getElementById('sidebar-links').innerHTML;
    mobileNavContainer.innerHTML = sidebarHtml;
    // Bind click events to mobile buttons as well
    mobileNavContainer.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        if (target) {
          navigateTo(target);
          drawerContent.style.transform = 'translateX(-100%)';
          setTimeout(() => drawer.classList.add('hidden'), 300);
        }
      });
    });
  }

  // Setup parallax image hover on Grand Player
  window.addEventListener('mousemove', (e) => {
    if (currentView === 'separation' || document.getElementById('grand-player-panel').style.transform === 'translateY(0)') {
      const img = document.getElementById('player-art');
      if (img) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        img.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
      }
    }
  });
});
