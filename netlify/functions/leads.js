// Netlify serverless function for Leads
let memoryLeads = [];

exports.handler = async function(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: JSON.stringify({ message: "OK" }) };
  }

  try {
    if (event.httpMethod === "GET") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, leads: memoryLeads })
      };
    }

    if (event.httpMethod === "POST") {
      const data = JSON.parse(event.body || "{}");
      const newLead = {
        id: data.id || `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: data.type || (data.plan ? "plan_order" : "consultation"),
        createdAt: Number(data.createdAt) || Date.now(),
        name: String(data.name || "Cliente").trim(),
        phone: String(data.phone || "").trim(),
        email: String(data.email || "").trim(),
        goal: data.goal ? String(data.goal).trim() : undefined,
        town: data.town ? String(data.town).trim() : "Puerto Rico",
        date: data.date,
        time: data.time,
        plan: data.plan,
        addons: data.addons,
        total: data.total,
        status: data.status || "new",
        notes: data.notes,
        source: data.source || (data.plan ? "Cotizador de Planes" : "Formulario de Asesoría Web")
      };

      memoryLeads.unshift(newLead);
      if (memoryLeads.length > 500) memoryLeads = memoryLeads.slice(0, 500);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, lead: newLead })
      };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
