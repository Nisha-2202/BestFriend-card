/* ── Photo drag-to-adjust ── */
var photoPosX = 50, photoPosY = 50;
var isDragging = false, startX, startY, startPosX, startPosY;

function loadPhoto(event) {
  var file = event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function (e) {
    var img = document.getElementById('photo-img');
    img.src = e.target.result;
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.objectPosition = '50% 50%';
    img.style.cursor = 'grab';
    photoPosX = 50;
    photoPosY = 50;
    document.getElementById('photo-placeholder').style.display = 'none';
    document.getElementById('adjust-hint').style.display = 'block';
    setTimeout(function () {
      document.getElementById('adjust-hint').style.display = 'none';
    }, 3000);
  };
  reader.readAsDataURL(file);
}

function getClientPos(e) {
  if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function onDragStart(e) {
  var img = document.getElementById('photo-img');
  if (img.style.display === 'none' || !img.src) return;
  isDragging = true;
  var pos = getClientPos(e);
  startX = pos.x;
  startY = pos.y;
  startPosX = photoPosX;
  startPosY = photoPosY;
  img.style.cursor = 'grabbing';
  e.preventDefault();
}

function onDragMove(e) {
  if (!isDragging) return;
  var img = document.getElementById('photo-img');
  var wrap = document.getElementById('photo-wrap');
  var pos = getClientPos(e);
  var dx = pos.x - startX;
  var dy = pos.y - startY;
  var sensitivity = 0.3;
  photoPosX = Math.min(100, Math.max(0, startPosX - dx * sensitivity));
  photoPosY = Math.min(100, Math.max(0, startPosY - dy * sensitivity));
  img.style.objectPosition = photoPosX + '% ' + photoPosY + '%';
  e.preventDefault();
}

function onDragEnd() {
  isDragging = false;
  var img = document.getElementById('photo-img');
  if (img) img.style.cursor = 'grab';
}

/* ── Background load ── */
function loadBackground(event) {
  var file = event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function (e) {
    document.body.style.backgroundImage =
      'linear-gradient(rgba(102,126,234,0.7), rgba(245,87,108,0.7)), url(' + e.target.result + ')';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.getElementById('header-bg').style.backgroundImage = 'url(' + e.target.result + ')';
  };
  reader.readAsDataURL(file);
}

/* ── Update card ── */
function updateCard() {
  var name      = document.getElementById('input-name').value.trim();
  var since     = document.getElementById('input-since').value.trim();
  var years     = document.getElementById('input-years').value.trim();
  var badge     = document.getElementById('input-badge').value.trim();
  var traitsRaw = document.getElementById('input-traits').value.trim();
  var memory    = document.getElementById('input-memory').value.trim();
  var footer    = document.getElementById('input-footer').value.trim();

  if (name)  document.getElementById('friend-name').textContent = name;
  if (badge) document.getElementById('custom-badge').textContent = badge;
  if (since) document.getElementById('friend-since').textContent = 'Since ' + since;

  if (years) {
    document.getElementById('years-val').textContent = years;
  } else if (since) {
    var diff = new Date().getFullYear() - parseInt(since);
    document.getElementById('years-val').textContent = diff > 0 ? diff + '+' : '\u221e';
  }

  if (traitsRaw) {
    var traits = traitsRaw.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    var container = document.getElementById('traits-container');
    container.innerHTML = '';
    traits.forEach(function (t) {
      var span = document.createElement('span');
      span.className = 'trait';
      span.textContent = t;
      container.appendChild(span);
    });
  }

  if (memory) document.getElementById('memory-text').textContent = memory;
  if (footer) document.getElementById('footer-text').textContent = footer + ' \u2728';
}

/* ── Download ── */
function downloadCard() {
  var btns = document.getElementById('share-btns');
  var hint = document.getElementById('adjust-hint');
  btns.style.display = 'none';
  if (hint) hint.style.display = 'none';
  html2canvas(document.getElementById('card'), {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff'
  }).then(function (canvas) {
    var a = document.createElement('a');
    a.download = 'best-friend-card.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
    btns.style.display = 'flex';
    var toast = document.getElementById('toast');
    toast.style.display = 'block';
    setTimeout(function () { toast.style.display = 'none'; }, 3000);
  });
}

/* ── Share ── */
function shareWhatsApp() {
  var name   = document.getElementById('friend-name').textContent;
  var memory = document.getElementById('memory-text').textContent;
  var footer = document.getElementById('footer-text').textContent;
  var msg = '\ud83d\udc96 *' + name + '* \ud83d\udc96\n\n' + memory + '\n\n' + footer + '\n\n\ud83c\udf89 Made with love for you!';
  window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
}

function shareEmail() {
  var name   = document.getElementById('friend-name').textContent;
  var memory = document.getElementById('memory-text').textContent;
  var footer = document.getElementById('footer-text').textContent;
  var traits = Array.from(document.querySelectorAll('.trait')).map(function (t) { return t.textContent; }).join(', ');
  var subject = 'A special card for you, ' + name + '!';
  var body =
    'Hey ' + name + '! \ud83d\udc96\n\n' +
    'I made this special card just for you!\n\n' +
    '\u2728 You are: ' + traits + '\n\n' +
    '\ud83d\udc9b Our favourite memory:\n' + memory + '\n\n' +
    footer + '\n\nWith love always! \ud83c\udf89';
  window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}

/* ── Event listeners ── */
window.addEventListener('DOMContentLoaded', function () {
  var wrap = document.getElementById('photo-wrap');
  wrap.addEventListener('mousedown', onDragStart);
  wrap.addEventListener('touchstart', onDragStart, { passive: false });
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('touchmove', onDragMove, { passive: false });
  window.addEventListener('mouseup', onDragEnd);
  window.addEventListener('touchend', onDragEnd);
});

/* ── Zoom photo ── */
var photoScale = 100;
function zoomPhoto(delta) {
  var img = document.getElementById('photo-img');
  if (!img || img.style.display === 'none') return;
  photoScale = Math.min(200, Math.max(80, photoScale + delta));
  img.style.width = photoScale + '%';
  img.style.height = photoScale + '%';
  img.style.objectFit = 'cover';
}

/* ── Background position adjust ── */
var bgPosX = 50, bgPosY = 50;

function moveBg(direction) {
  var step = 10;
  if (direction === 'left')  bgPosX = Math.max(0,   bgPosX - step);
  if (direction === 'right') bgPosX = Math.min(100, bgPosX + step);
  if (direction === 'up')    bgPosY = Math.max(0,   bgPosY - step);
  if (direction === 'down')  bgPosY = Math.min(100, bgPosY + step);

  var pos = bgPosX + '% ' + bgPosY + '%';

  /* page background */
  document.body.style.backgroundPosition = pos;

  /* card header overlay */
  var hdr = document.getElementById('header-bg');
  if (hdr) hdr.style.backgroundPosition = pos;
}

function zoomBg(delta) {
  var current = window._bgScale || 100;
  current = Math.min(200, Math.max(60, current + delta));
  window._bgScale = current;

  var size = current + '%';
  document.body.style.backgroundSize = size + ' auto';

  var hdr = document.getElementById('header-bg');
  if (hdr) hdr.style.backgroundSize = size + ' auto';
}
