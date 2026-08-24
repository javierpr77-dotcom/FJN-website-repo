exports.handler = async function(event, context) {
  // CORS Headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Successful preflight" }),
    };
  }

  if (event.httpMethod !== "POST" && event.httpMethod !== "GET") {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }) 
    };
  }

  // Diagnostic GET route to check serverless health
  if (event.httpMethod === "GET") {
    const hasKey = !!process.env.RESEND_API_KEY;
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: "ok",
        function: "send-email",
        resendConfigured: hasKey,
        targetEmailConfigured: process.env.ADMIN_EMAIL || process.env.NOTIFICATION_EMAIL || "negociospr82@gmail.com, javierpr77@gmail.com",
        timestamp: new Date().toISOString()
      })
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const { name, phone, email, goal, town, date, time, plan, addons, total, action } = data;

    const resendApiKey = process.env.RESEND_API_KEY;

    // Check if this is an explicit diagnostic test from Admin Panel
    const isDiagnosticTest = action === "test";

    // Target recipient emails: check env vars or default to business emails
    const customTarget = process.env.ADMIN_EMAIL || process.env.NOTIFICATION_EMAIL;
    const recipientEmails = customTarget 
      ? customTarget.split(",").map(e => e.trim()) 
      : ["negociospr82@gmail.com", "javierpr77@gmail.com"];

    // Clean phone number for WhatsApp URL
    const cleanPhone = (phone || "").replace(/[^0-9]/g, "");
    const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY environment variable is not defined in Netlify");
      return {
        statusCode: 200, // Return 200 with clear warning so client doesn't crash
        headers,
        body: JSON.stringify({ 
          success: false, 
          warning: "RESEND_API_KEY_MISSING",
          message: "La solicitud fue guardada en el panel administrativo local, pero el servicio de email en Netlify no tiene configurada la variable RESEND_API_KEY.",
          recipients: recipientEmails,
          payloadReceived: { name, phone, email, town, plan }
        }),
      };
    }

    const isPlanOrder = !!plan;
    let subject = isDiagnosticTest
      ? `🧪 [TEST DIAGNÓSTICO] Verificación de Sistema FJN Digital - ${new Date().toLocaleTimeString()}`
      : isPlanOrder 
        ? `🛍️ Solicitud de Plan: ${plan} - ${name || 'Cliente'}`
        : `⚡ Nuevo Lead / Asesoría: ${name || 'Cliente'} (${town || 'Puerto Rico'})`;

    let emailHtml = "";

    if (isDiagnosticTest) {
      emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #145bff; border-radius: 16px; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #0d1220 0%, #050507 100%); padding: 24px; text-align: center; border-radius: 12px 12px 0 0; color: white;">
            <h2 style="color: #3b7bff; margin: 0; font-size: 22px;">🧪 Verificación de Envío Exitosa</h2>
            <p style="margin: 6px 0 0 0; color: #cfcfd4; font-size: 13px;">FJN Digital Media Logistics Control</p>
          </div>
          <div style="padding: 24px;">
            <p style="font-size: 15px; color: #1e293b; line-height: 1.5;">Este es un mensaje de prueba generado desde tu panel administrativo de <strong>FJN Digital Media</strong>.</p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin: 16px 0;">
              <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
              <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;"><strong>Destinatarios activos:</strong> ${recipientEmails.join(", ")}</p>
              <p style="margin: 0; font-size: 13px; color: #16a34a;"><strong>Estado:</strong> Conectividad con Resend 100% Operativa ✅</p>
            </div>
          </div>
        </div>
      `;
    } else if (isPlanOrder) {
      emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #145bff; border-radius: 16px; box-shadow: 0 8px 30px rgba(20,91,255,0.12); background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #0d1220 0%, #050507 100%); padding: 24px; text-align: center; border-radius: 12px 12px 0 0; color: white;">
            <h2 style="color: #3b7bff; margin: 0; font-size: 24px; padding-bottom: 8px;">🛍️ Solicitud de Plan Recibida</h2>
            <p style="margin: 0; color: #cfcfd4; font-size: 14px;">Has recibido una solicitud para el plan <strong>${plan}</strong></p>
          </div>
          <div style="padding: 24px 0;">
            <h3 style="color: #145bff; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px; margin-top: 0; font-size: 16px;">Detalles del Prospecto</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background-color: #f9fafb;">
                <td style="padding: 10px; font-weight: bold; width: 140px; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 14px;">Nombre:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; font-weight: bold;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 14px;">Teléfono:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">
                  <a href="tel:${phone}" style="color: #145bff; text-decoration: none; font-weight: bold;">${phone}</a>
                </td>
              </tr>
              ${email ? `
              <tr style="background-color: #f9fafb;">
                <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 14px;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;"><a href="mailto:${email}" style="color: #145bff; text-decoration: none;">${email}</a></td>
              </tr>
              ` : ''}
              ${town ? `
              <tr>
                <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 14px;">Pueblo / Zona:</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">${town}</td>
              </tr>
              ` : ''}
            </table>

            <h3 style="color: #145bff; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px; margin-top: 0; font-size: 16px;">Resumen de la Inversión</h3>
            <div style="background-color: #0d1220; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; color: white; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8; font-size: 14px;">Plan Seleccionado:</td>
                  <td style="padding: 6px 0; text-align: right; color: #ffffff; font-weight: bold; font-size: 15px;">${plan}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8; font-size: 14px; vertical-align: top;">Add-ons Opcionales:</td>
                  <td style="padding: 6px 0; text-align: right; color: #e2e8f0; font-size: 13px; max-width: 250px;">${addons || 'Ninguno'}</td>
                </tr>
                <tr style="border-top: 1px solid #334155;">
                  <td style="padding: 12px 0 0 0; color: #3b7bff; font-weight: bold; font-size: 16px;">Inversión Estimada:</td>
                  <td style="padding: 12px 0 0 0; text-align: right; color: #3b7bff; font-weight: bold; font-size: 20px;">${total}</td>
                </tr>
              </table>
            </div>

            ${waUrl ? `
            <div style="text-align: center; margin-top: 16px;">
              <a href="${waUrl}" style="background-color: #25D366; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 14px;">
                💬 Chatear con el cliente por WhatsApp
              </a>
            </div>
            ` : ''}
          </div>
          <div style="margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">Enviado de forma segura mediante FJN Digital Logistics Control.</p>
          </div>
        </div>
      `;
    } else {
      emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #145bff; border-radius: 16px; box-shadow: 0 8px 30px rgba(20,91,255,0.12); background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #0d1220 0%, #050507 100%); padding: 24px; text-align: center; border-radius: 12px 12px 0 0; color: white;">
            <h2 style="color: #3b7bff; margin: 0; font-size: 24px; padding-bottom: 8px;">⚡ Nuevo Lead / Asesoría</h2>
            <p style="margin: 0; color: #cfcfd4; font-size: 14px;">Has recibido una nueva solicitud de consulta estratégica</p>
          </div>
          <div style="padding: 24px 0;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background-color: #f9fafb;">
                <td style="padding: 12px; font-weight: bold; width: 140px; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Nombre:</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px; font-weight: bold;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Teléfono:</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px;">
                  <a href="tel:${phone}" style="color: #145bff; text-decoration: none; font-weight: bold;">${phone}</a>
                </td>
              </tr>
              ${email ? `
              <tr style="background-color: #f9fafb;">
                <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Email:</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px;"><a href="mailto:${email}" style="color: #145bff; text-decoration: none;">${email}</a></td>
              </tr>
              ` : ''}
              ${town ? `
              <tr>
                <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Pueblo / Municipio:</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px; font-weight: 500;">${town}</td>
              </tr>
              ` : ''}
              <tr style="background-color: #f9fafb;">
                <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Objetivo / Proyecto:</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px; line-height: 1.5;">${goal || 'No especificado'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Fecha Deseada:</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px;">${date || 'No seleccionada'}</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Hora Deseada:</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px;">${time || 'No seleccionada'}</td>
              </tr>
            </table>

            ${waUrl ? `
            <div style="text-align: center; margin-top: 16px;">
              <a href="${waUrl}" style="background-color: #25D366; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 14px;">
                💬 Contactar al cliente por WhatsApp
              </a>
            </div>
            ` : ''}
          </div>
          <div style="margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">Enviado de forma segura mediante FJN Digital Logistics Control.</p>
          </div>
        </div>
      `;
    }

    // Attempt sending email via Resend
    // We send to the primary recipient(s)
    let sendErrors = [];
    let messageIds = [];

    // First attempt sending to primary recipient
    for (const recipient of recipientEmails) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: "FJN Digital Media <onboarding@resend.dev>",
            to: recipient,
            subject: subject,
            html: emailHtml
          })
        });

        if (emailResponse.ok) {
          const resJson = await emailResponse.json();
          messageIds.push({ recipient, id: resJson.id });
        } else {
          const errorText = await emailResponse.text();
          console.warn(`Resend failed for ${recipient}:`, errorText);
          sendErrors.push({ recipient, error: errorText });
        }
      } catch (err) {
        sendErrors.push({ recipient, error: err.message });
      }
    }

    if (messageIds.length > 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          deliveredTo: messageIds,
          errors: sendErrors.length > 0 ? sendErrors : undefined 
        }),
      };
    } else {
      return {
        statusCode: 200, // Return 200 so UI continues gracefully with local backup
        headers,
        body: JSON.stringify({
          success: false,
          warning: "EMAIL_DISPATCH_FAILED",
          details: sendErrors,
          info: "La solicitud fue guardada en el panel de control local de FJN Digital."
        })
      };
    }
  } catch (error) {
    console.error("Netlify serverless function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
