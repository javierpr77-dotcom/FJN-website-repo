// Serverless analytics handler for Netlify deployment
let memorySessions = [];

exports.handler = async function(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: JSON.stringify({ message: "OK" }) };
  }

  const path = event.path || "";

  try {
    if (event.httpMethod === "GET" || path.endsWith("/sessions")) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, sessions: memorySessions }),
      };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");

      if (path.endsWith("/clear")) {
        memorySessions = [];
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: "Cleared" }),
        };
      }

      if (path.endsWith("/click")) {
        const { sessionId, click } = body;
        const session = memorySessions.find(s => s.id === sessionId);
        if (session && click) {
          session.clicks = session.clicks || [];
          session.clicks.push(click);
          session.lastActiveTime = Date.now();
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true }),
        };
      }

      if (path.endsWith("/ping")) {
        const { id, durationSeconds, emphasizedAreas } = body;
        const session = memorySessions.find(s => s.id === id);
        if (session) {
          session.durationSeconds = Number(durationSeconds) || session.durationSeconds + 1;
          session.lastActiveTime = Date.now();
          if (emphasizedAreas) {
            session.emphasizedAreas = { ...session.emphasizedAreas, ...emphasizedAreas };
          }
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true }),
        };
      }

      // Default: Track session
      const sessionId = body.id || `session-live-${Date.now()}`;
      const existingIdx = memorySessions.findIndex(s => s.id === sessionId);
      const sessionObj = {
        id: sessionId,
        ip: event.headers["client-ip"] || event.headers["x-forwarded-for"] || "196.28.40.12",
        city: body.city || "San Juan",
        region: body.region || "San Juan",
        country: body.country || "Puerto Rico",
        isPR: body.isPR !== undefined ? body.isPR : true,
        deviceType: body.deviceType || "Mobile",
        os: body.os || "iOS",
        startTime: Number(body.startTime) || Date.now(),
        lastActiveTime: Date.now(),
        durationSeconds: Number(body.durationSeconds) || 1,
        clicks: Array.isArray(body.clicks) ? body.clicks : [],
        emphasizedAreas: body.emphasizedAreas || { hero: 1 },
        isActive: true,
      };

      if (existingIdx >= 0) {
        memorySessions[existingIdx] = { ...memorySessions[existingIdx], ...sessionObj };
      } else {
        memorySessions.unshift(sessionObj);
      }

      if (memorySessions.length > 500) memorySessions = memorySessions.slice(0, 500);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, session: sessionObj }),
      };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: "Not Found" }) };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
