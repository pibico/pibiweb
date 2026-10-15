## pibiweb

Web corporativa de pibiCo sobre Frappe v15. Solo necesita Frappe.

### Contenido

- **Web Pages** (fixtures, módulo Pibiweb): `home` (portada y formulario de contacto),
  `future`, `research`, `domotics`, `greetings` y las páginas legales `legal_es/en` y
  `privacy_es/en`.
- **`/xmas`**: felicitación de Navidad (`www/xmas.html`); el idioma se elige con
  `?_lang=` entre los idiomas activos del sitio.
- **Recursos**: `public/css/styles.css`, `public/js/scripts.js`, imágenes y PDF en
  `public/`.

### Formulario de contacto

`pibiweb.pibiweb.api.send_contact_email` es público por diseño (solo POST) y:

- limita a 5 envíos por hora y por IP;
- descarta en silencio los envíos que rellenan el campo oculto `website` (bots);
- solo acepta los asuntos del desplegable, valida el correo y limita la longitud;
- escapa todo lo que escribe el visitante y responde a su dirección (`reply_to`);
- envía por la cola de correo a **Contact Us Settings → Forward To Email**.

Si ese campo está vacío, el envío falla y queda en el Error Log («Contact Form»).

### Instalación

```bash
bench get-app https://github.com/pibico/pibiweb --branch v15
bench --site <sitio> install-app pibiweb
```

#### Licencia

unlicense
