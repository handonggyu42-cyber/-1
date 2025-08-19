let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.style.display = 'block';
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.style.display = 'none';
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js', { scope: './' })
    .catch(console.error);
  });
}

// Simple "tab" navigation (client-side)
const screens = document.querySelectorAll('[data-screen]');
function showScreen(name) {
  screens.forEach(s => s.style.display = s.dataset.screen === name ? 'block' : 'none');
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === name);
  });
  history.replaceState({}, '', `#${name}`);
}
document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => showScreen(t.dataset.tab));
});
const initial = location.hash?.replace('#','') || 'home';
showScreen(initial);