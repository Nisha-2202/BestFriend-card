function loadPhoto(event) {
  var file = event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function (e) {
    var img = document.getElementById('photo-img');
    img.src = e.target.result;
    img.style.display = 'block';
    document.getElementById('photo-placeholder').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

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

function updateCard() {
  var name      = document.getElementById('input-name').value.trim();
  var since     = document.getElementById('input-since').value.trim();
  var badge     = document.getElementById('input-badge').value.trim();
  var traitsRaw = document.getElementById('input-traits').value.trim();
  var memory    = document.getElementById('input-memory').value.trim();
  var footer    = document.getElementById('input-footer').value.trim();
  var years     = document.getElementById('input-years').value.trim();

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

function downloadCard() {
  var btns = document.getElementById('share-btns');
  btns.style.display = 'none';
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
    footer + '\n\n' +
    'With love always! \ud83c\udf89';
  window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}