exports.handler = async function(event, context) {
  // CORS Headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Successful preflight" }),
    };
  }

  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }) 
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const { name, phone, email, goal, date, time } = data;

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("RESEND_API_KEY environment variable is not defined");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "RESEND_API_KEY is missing on Netlify environment variables configuration." }),
      };
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        // By default, Resend onboarding API keys can only send from onboarding@resend.dev to the account owner's email.
        // Once a custom domain is verified in Resend, you can change this to e.g. "leads@fjndigitalmedia.com"
        from: "FJN Digital Media <onboarding@resend.dev>",
        to: "negociospr82@gmail.com",
        subject: `⚡ Nuevo Lead: ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #145bff; border-radius: 16px; box-shadow: 0 4px 16px rgba(20,91,255,0.08); background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, #0d1220 0%, #050507 100%); padding: 24px; text-align: center; border-radius: 12px 12px 0 0; color: white;">
              <h2 style="color: #3b7bff; margin: 0; font-size: 24px; padding-bottom: 8px;">⚡ Nuevo Lead Registrado</h2>
              <p style="margin: 0; color: #cfcfd4; font-size: 14px;">Has recibido una nueva solicitud de asesoría</p>
            </div>
            <div style="padding: 24px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; font-weight: bold; width: 140px; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Nombre:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px; font-weight: 500;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Teléfono:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px;"><a href="tel:${phone}" style="color: #145bff; text-decoration: none; font-weight: bold;">${phone}</a></td>
                </tr>
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Email:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px;"><a href="mailto:${email}" style="color: #145bff; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Objetivo:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px; line-height: 1.5;">${goal}</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Fecha Deseada:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px;">${date || 'No seleccionada'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Hora Deseada:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px;">${time || 'No seleccionada'}</td>
                </tr>
              </table>
            </div>
            <div style="text-align: center; margin-top: 8px;">
              <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="display: inline-block; padding: 14px 32px; background-color: #25D366; color: white; text-decoration: none; border-radius: 10px; font-weight: bold; box-shadow: 0 4px 12px rgba(37,211,102,0.25); font-size: 16px;">Contactar por WhatsApp Directo</a>
            </div>
            <div style="margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">Enviado de forma segura mediante Resend y Netlify Functions.</p>
            </div>
          </div>
        `
      })
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API failed:", errorText);
      return {
        statusCode: emailResponse.status,
        headers,
        body: JSON.stringify({ error: "Resend API returned an error response", details: errorText }),
      };
    }

    const resJson = await emailResponse.json();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, messageId: resJson.id }),
    };
  } catch (error) {
    console.error("Netlify serverless function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
