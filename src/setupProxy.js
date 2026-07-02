const path = require('path');

/**
 * 開發環境：讓 MSW service worker 可從根路徑 /mockServiceWorker.js 存取，
 * 並加上 Service-Worker-Allowed: / 標頭以允許涵蓋整個 localhost 的 scope。
 *
 * 背景：package.json homepage 設為 /myAnswerSkinCare，
 * 導致 CRA dev server 把 public 靜態檔案掛在 /myAnswerSkinCare/ 路徑，
 * 但 MSW SW scope 必須覆蓋 localhost:3000/，因此需要這個代理。
 */
module.exports = function (app) {
  app.get('/mockServiceWorker.js', (req, res) => {
    const swPath = path.join(__dirname, '..', 'public', 'mockServiceWorker.js');
    res.set('Content-Type', 'application/javascript');
    res.set('Service-Worker-Allowed', '/');
    res.sendFile(swPath);
  });
};
