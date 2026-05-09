# REPORTE FINAL - MI BACKEND GITHUB CRUD

1. **Fecha de ejecución**
   - 2026-05-09 (America/Bogota).

2. **Confirmación de que `.env` no fue modificado**
   - Confirmado.
   - Hash SHA256 antes y después: `DC1A8AFEA6F12B3D36225358E5869B6839C521FBC83C7E1C53AF5BCB5F98A920`.

3. **Confirmación de que `MONGO_URI` no fue cambiado**
   - Confirmado. No se editó `.env`.

4. **Confirmación de que `GITHUB_API_BASE_URL` se usa desde `.env`**
   - Confirmado en `controllers/github.controllers.js` mediante `process.env.GITHUB_API_BASE_URL`.

5. **Estructura final del proyecto**

```txt
mi-backend/
├── config/
│   └── database.js
├── controllers/
│   └── github.controllers.js
├── models/
│   └── githubRepo.model.js
├── routes/
│   ├── index.routes.js
│   └── github.routes.js
├── server/
│   └── server.js
├── .env
├── .gitignore
├── app.js
├── package-lock.json
└── package.json
```

6. **Archivos eliminados**
   - `public/` (incluyendo `public/app.js`, `public/index.html`, `public/styles.css`).
   - `db/` (incluyendo `db/cnn_mongodb.js`).
   - `index.js`.
   - Archivos temporales de prueba/log al final del proceso.

7. **Archivos creados o modificados**
   - Creados: `app.js`, `config/database.js`.
   - Modificados: `server/server.js`, `routes/index.routes.js`, `routes/github.routes.js`, `controllers/github.controllers.js`, `models/githubRepo.model.js`, `package.json`, `package-lock.json`, `.gitignore`.

8. **Confirmación de que no hay duplicados**
   - Confirmado.
   - Solo una conexión MongoDB: `config/database.js`.
   - Solo un arranque de servidor: `server/server.js`.
   - Solo controlador principal: `controllers/github.controllers.js`.
   - Solo modelo principal: `models/githubRepo.model.js`.

9. **Confirmación de que es solo backend**
   - Confirmado. No existe carpeta `public/` ni frontend.

10. **Resultado de `npm install`**
    - Exitoso.
    - Resumen (última ejecución): `added 1 package, audited 113 packages, found 0 vulnerabilities`.

11. **Resultado de `npm start`**
    - Exitoso.
    - Evidencia: servidor escuchando en `http://localhost:3000` y MongoDB conectado.

12. **Resultado de prueba `GET /`**
    - Status: `200`.

13. **Resultado de prueba `GET /api/health`**
    - Status: `200`.

14. **Resultado de prueba `GET /api/github/search?q=node`**
    - Status: `200`.
    - Repositorios devueltos en la prueba: `10`.

15. **Resultado de los 3 `POST`**
    - POST 1: `201`.
    - POST 2: `201`.
    - POST 3: `201`.

16. **IDs de los 3 registros finales**
    - `69ff7ce9a902e3226e79b10f`
    - `69ff7ce9a902e3226e79b110`
    - `69ff7ce9a902e3226e79b111`

17. **Resultado de `GET /api/github/saved`**
    - Status: `200`.
    - Total registros: `3`.

18. **Resultado de `GET /api/github/saved/:id`**
    - Status: `200`.
    - ID probado: `69ff7ce9a902e3226e79b10f`.

19. **Resultado de `PUT /api/github/saved/:id`**
    - Status: `200`.
    - Cambios confirmados: `description`, `language`, `stars`.

20. **Resultado de `DELETE /api/github/saved/:id`**
    - Se creó un 4to registro temporal y luego se eliminó.
    - Status DELETE: `200`.
    - ID temporal eliminado: `69ff7ceaa902e3226e79b112`.

21. **Resultado de `GET` después del `DELETE` (confirmando `404`)**
    - `GET /api/github/saved/69ff7ceaa902e3226e79b112` -> Status `404`.

22. **Confirmación de MongoDB con exactamente 3 registros finales**
    - Validación directa con Mongoose: `countDocuments() = 3`.

23. **Confirmación de que no quedaron logs temporales**
    - Confirmado. Se eliminaron logs y scripts temporales de prueba.

24. **Confirmación final de cumplimiento de la actividad**
    - Cumplido: estructura backend alineada, sin frontend, sin duplicados, CRUD completo (`GET/POST/PUT/DELETE`) validado, conexión MongoDB operativa, 3 registros finales en BD y `.env` intacto.