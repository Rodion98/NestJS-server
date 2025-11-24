// public/swagger-custom.js
window.addEventListener('load', function () {
  const buttonId = 'download-openapi-btn';

  const interval = setInterval(function () {
    const topbarWrapper = document.querySelector(
      '.swagger-ui .topbar .wrapper',
    );

    if (!topbarWrapper) return;

    if (document.getElementById(buttonId)) {
      clearInterval(interval);
      return;
    }

    var btn = document.createElement('button');
    btn.id = buttonId;
    btn.innerText = 'Скачать OpenAPI JSON';
    btn.className = 'download-openapi-btn';

    btn.onclick = function () {
      // берём текущий путь (/docs, /api и т.п.)
      var path = window.location.pathname.replace(/\/$/, '');
      // и строим URL к JSON (/docs-json, /api-json)
      var jsonUrl = path + '-json';

      var link = document.createElement('a');
      link.href = jsonUrl;
      link.download = 'openapi.json';
      link.click();
    };

    topbarWrapper.appendChild(btn);
    clearInterval(interval);
  }, 500);
});
