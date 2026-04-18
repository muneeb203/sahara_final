import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const { to, lat, lng, contactName, senderName } = await req.json();

    if (!to || !lat || !lng) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, lat, lng" }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
    const ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN");

    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
      return new Response(
        JSON.stringify({ error: "WhatsApp credentials not configured." }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    // Format phone — strip spaces/dashes, ensure no leading +
    const phone = to.replace(/[\s\-\(\)]/g, "").replace(/^\+/, "");

    const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
    const messageBody =
      `🚨 *Emergency Alert*\n\n` +
      `*${senderName || "Someone"}* has shared their live location with you.\n\n` +
      `📍 *Location:* ${mapsLink}\n\n` +
      `_This message was sent via Saharah emergency system._`;

    const response = await fetch(
      `https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phone,
          type: "text",
          text: { body: messageBody },
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API error:", result);
      return new Response(
        JSON.stringify({ error: result?.error?.message || "WhatsApp API error" }),
        { status: response.status, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, messageId: result?.messages?.[0]?.id }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
