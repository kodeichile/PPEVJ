# Entre Vinos y Jardines - Catalogo auto-administrable

Sitio Next.js con catalogo publico, login con Google mediante Firebase Auth, panel protegido y backend en Google Apps Script usando Google Sheets.

## Ejecutar local

1. Instala dependencias:

```bash
npm install
```

2. Copia variables:

```bash
cp .env.example .env.local
```

3. Completa `.env.local` con Firebase, Apps Script y correos administradores.

4. Ejecuta:

```bash
npm run dev
```

## Google Sheet

1. Crea una hoja de calculo en Google Sheets.
2. Crea una pestaña llamada `Productos`.
3. Agrega encabezados:

```text
id | nombre | precio | imagen_url | descripcion | activo | fecha_creacion
```

El sitio trae un catalogo local de respaldo con los productos actuales, pero al configurar Apps Script leerá desde la hoja.

## Apps Script

1. En el Google Sheet abre `Extensiones > Apps Script`.
2. Copia el contenido de `apps-script/Code.gs`.
3. Crea una carpeta en Drive para imagenes de productos y pega su ID en `DRIVE_FOLDER_ID`.
4. En `Project Settings > Script Properties`, agrega:

```text
API_TOKEN=un_token_largo_y_privado
```

5. Despliega como Web App:
   - Ejecutar como: `Yo`
   - Acceso: `Cualquiera`
6. Copia la URL de la Web App en Vercel como `APPSCRIPT_URL`.
7. Copia el mismo token como `APPSCRIPT_TOKEN`.

## Firebase Auth

1. Crea un proyecto en Firebase Console.
2. Activa `Authentication > Sign-in method > Google`.
3. En Project settings copia la config web.
4. En Vercel agrega:

```text
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

5. En `Project settings > Service accounts`, genera una private key.
6. En Vercel agrega:

```text
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
ADMIN_EMAILS=correo1@gmail.com,correo2@gmail.com
```

`ADMIN_EMAILS` controla quienes pueden entrar al panel.

## Vercel y GitHub

1. Sube este proyecto a GitHub.
2. En Vercel importa el repositorio.
3. Configura todas las variables de entorno.
4. Cada push a `main` hará deploy automático.

## Cloudflare

Cloudflare solo se usa como DNS:

1. En Vercel agrega el dominio.
2. Vercel indicará los registros DNS.
3. En Cloudflare crea esos registros.
4. Mantén el proxy según la recomendación de Vercel para el dominio configurado.

## Rutas

- `/`: catalogo publico.
- `/ingresar`: login con Google.
- `/panel`: administracion de productos.
- `/api/productos`: API server-side para listar y crear.
- `/api/productos/[id]`: API server-side para editar u ocultar.
- `/api/upload`: sube imagenes a Apps Script/Drive.
