export async function sendOrderReceivedEmail(input: {
  email: string;
  name: string;
  orderNumber: string;
  totalCents: number;
  paymentMethod: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return { skipped: true };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.email],
      subject: `Recibimos tu pedido ${input.orderNumber}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#202020">
          <h1>Gracias, ${escapeHtml(input.name)}</h1>
          <p>Recibimos el pedido <strong>${escapeHtml(input.orderNumber)}</strong>.</p>
          <p>Total provisional: <strong>${new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
          }).format(input.totalCents / 100)}</strong></p>
          <p>Método de pago: ${escapeHtml(input.paymentMethod)}.</p>
          <p>La cobertura, fecha y costo final de entrega se confirmarán antes de preparar el pedido.</p>
        </div>
      `,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`El proveedor de correo respondió ${response.status}`);
  return { skipped: false };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
