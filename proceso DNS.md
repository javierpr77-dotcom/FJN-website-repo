# Guía de Conexión: Dominio de Cloudflare a Netlify 🚀

Esta guía detalla el proceso completo paso a paso para conectar un dominio registrado/gestionado en **Cloudflare** hacia tu sitio web alojado en **Netlify**, garantizando una propagación DNS óptima y la correcta activación de los certificados SSL.

---

## 📌 Fase 1: Configuración en Netlify (Preparar el Terreno)

1. **Inicia sesión** en tu panel de control de [Netlify](https://app.netlify.com/).
2. Selecciona el proyecto de tu sitio web de la lista.
3. Dirígete a **Site configuration** (Configuración del sitio) > **Domain management** (Gestión de dominios).
4. Haz clic en el botón **Add custom domain** (Añadir dominio personalizado).
5. Escribe tu nombre de dominio completo (ej. `tupagina.com`) y presiona **Verify** (Verificar).
6. Confirma que eres el dueño del dominio haciendo clic en **Add domain**.
7. Verás que Netlify añade automáticamente tanto el dominio principal (`tupagina.com`) como el subdominio con www (`www.tupagina.com`).

---

## ⚡ Fase 2: Configuración de DNS en Cloudflare (El Enlace Principal)

Abre otra pestaña del navegador, inicia sesión en tu cuenta de [Cloudflare](https://dash.cloudflare.com/) y selecciona tu dominio. Luego ve a la sección **DNS** > **Records** (Registros DNS) para crear los siguientes registros:

### 1. Configurar el Dominio Principal (Ápex / Raíz: @ o `tupagina.com`)
* **Tipo (Type):** `A`
* **Nombre (Name):** `@` (indica el dominio raíz)
* **Destino/Dirección IP (IPv4 address):** `75.2.60.5` (Es la IP oficial del equilibrador de carga de Netlify)
* **Estado de Proxy (Proxy status):** **DNS Only** (Nube Gris ⚪)
  * *⚠️ NOTA CRÍTICA:* Debe estar en **DNS Only** (Nube Gris). Si lo dejas en *Proxied* (Nube Naranja), Netlify no podrá renovar ni validar el certificado SSL de Let's Encrypt de forma automática.
* **TTL:** `Auto` o `2 min`.

### 2. Configurar el Subdominio (con `www`)
* **Tipo (Type):** `CNAME`
* **Nombre (Name):** `www`
* **Destino (Target):** Tu subdominio asignado por Netlify (ej. `nombre-de-tu-app.netlify.app`)
  * *(Puedes encontrar este subdominio en la cabecera de tu proyecto en el panel de Netlify).*
* **Estado de Proxy (Proxy status):** **DNS Only** (Nube Gris ⚪)
* **TTL:** `Auto`.

---

## 🔒 Fase 3: Activación del Certificado de Seguridad SSL

1. Regresa al panel de **Domain management** de Netlify para tu proyecto.
2. Desplázate hacia abajo hasta la sección llamada **HTTPS**.
3. Verás un mensaje indicando que se está configurando el certificado. Haz clic en el botón **Verify DNS configuration** (Verificar configuración DNS).
4. Una vez verificado, Netlify generará y activará un certificado **Let's Encrypt SSL** de forma 100% gratuita. Tu sitio ahora cargará con un candado seguro `https://`.

---

## 💡 Consejos de Rendimiento y Seguridad (Uso Avanzado de Cloudflare)

Si deseas aprovechar las capas de seguridad y CDN de Cloudflare (activar la Nube Naranja 🟠 posteriormente):

1. **Espera que Netlify complete la emisión de tu certificado SSL local.** Esto toma alrededor de 10 a 30 minutos desde la creación de tus registros en Cloudflare.
2. Una vez que tu sitio esté 100% operativo en HTTPS bajo Netlify, opcionalmente puedes cambiar el interruptor de tus registros DNS en Cloudflare a **Proxied** (Nube Naranja 🟠).
3. **CONFIGURACIÓN DE SSL EN CLOUDFLARE:** Si activas la nube naranja, debes dirigirte en Cloudflare a la pestaña lateral **SSL/TLS** y asegurarte de que el nivel de cifrado esté configurado en **"Full" (Completo)** o **"Full (strict)" (Completo estricto)**. De lo contrario, se producirá un bucle infinito de redirecciones (`ERR_TOO_MANY_REDIRECTS`).

---

## 📩 Fase 4: Configuración de Netlify Forms y Envío de Leads al Email

¡Tienes **toda la razón**! Netlify Forms es la mejor solución para sitios estáticos en React, ya que elimina la necesidad de configurar servidores, bases de datos o servicios de correo externos como **Resend**. Netlify se encarga de interceptar y registrar las solicitudes, enviándolas directamente a tu correo de forma automática.

Aquí tienes los pasos exactos y cómo funciona con nuestra aplicación React:

### 1. ¿Cómo funciona en una SPA (Single Page Application) como esta?
En React, el formulario es interactivo (usa JavaScript para manejar estados). Para que Netlify reconozca el formulario en su proceso de compilación automática, se define un formulario oculto en el archivo HTML principal y se envían los datos codificados por URL (`x-www-form-urlencoded`).

### 2. Configurar las Notificaciones por Email en Netlify (Tu buzón)
Una vez que subas el sitio web a Netlify, realiza estos pasos para enlazar las solicitudes a tu email:
1. Inicia sesión en tu panel de **Netlify**.
2. Ve al panel de tu sitio y haz clic en **Site configuration** (Configuración del sitio).
3. En el menú lateral izquierdo, ve a **Forms** (Formularios).
4. Dentro de la sección de formularios, busca **Form notifications** (Notificaciones de formulario).
5. Haz clic en **Add notification** (Añadir notificación) y selecciona **Email notification** (Notificación por correo electrónico).
6. Configura lo siguiente:
   * **Event to trigger value:** `New form submission` (Nueva entrega de formulario).
   * **Email address to notify:** Tu correo electrónico (donde quieres que lleguen las solicitudes de asesoría).
   * **Form to listen to:** Escribe `contact` (o déjalo en blanco para escuchar todos los formularios).
7. Haz clic en **Save** (Guardar).

¡Listo! A partir de ese momento, cada vez que un cliente presione el botón de enviar, Netlify registrará el lead y te enviará un correo con todos los datos (Nombre, Teléfono, Email, Objetivo, y la Fecha/Hora elegida por el cliente si la seleccionó).

---

## 🔥 Estrategia de Conversión Híbrida (Netlify Forms + WhatsApp Directo)

Como el contacto directo genera una confianza inmediata (especialmente en Puerto Rico y Latinoamérica), nosotros podemos configurar el botón para que haga **ambas cosas de forma transparente**:

1. **Guarda en Netlify invisiblemente (Detrás de escena):** Cuando el usuario hace clic, enviamos silenciosamente los datos a Netlify en segundo plano mediante un `fetch` rápido de React. El lead queda guardado en la nube y te llega instantáneamente por Email.
2. **Redirige al WhatsApp:** Dos segundos después (o inmediatamente al completar la petición posterior), redirige al usuario a WhatsApp con el mensaje personalizado redactado automáticamente.

Esta metodología te asegura el **100% de tasa de captura**: si el cliente por alguna razón no termina de enviar el mensaje en WhatsApp o cierra la pestaña, **ya tienes su información capturada y respaldada en tu correo electrónico a través de Netlify**.

