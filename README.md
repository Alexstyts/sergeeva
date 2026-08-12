# WB Client Dashboard — MVP

1. В текущем Google Apps Script добавьте содержимое `Code.gs` В КОНЕЦ существующего кода. Старую синхронизацию не удаляйте.
2. Apps Script → Deploy → New deployment → Web app.
3. Execute as: Me. Who has access: Anyone (для MVP; позже сделаем авторизацию).
4. Скопируйте URL Web App.
5. В `app.js` замените `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` на этот URL.
6. Создайте GitHub-репозиторий, загрузите `index.html`, `style.css`, `app.js`.
7. Settings → Pages → Deploy from branch → main / root.

Важно: это MVP. Публичный Apps Script URL означает, что JSON доступен по ссылке. Для клиентского продакшена следующим этапом нужна авторизация/токен доступа.
