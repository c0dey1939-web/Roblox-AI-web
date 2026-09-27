const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: false, // Sandbox mode
  serverKey: process.env.MIDTRANS_SERVER_KEY
});

export default async function handler(req, res) {
  if (req.method === 'POST' && req.query.action === 'create') {
    const { amount, customerName } = req.body;

    const parameter = {
      transaction_details: {
        order_id: `ROBLOX-AI-${Date.now()}`,
        gross_amount: amount || 10000
      },
      credit_card: { secure: true },
      customer_details: { first_name: customerName || "User Roblox" }
    };

    try {
      const transaction = await snap.createTransaction(parameter);
      return res.status(200).json({ token: transaction.token });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST' && req.query.action === 'notification') {
    // Webhook otomatis dari Midtrans saat user berhasil bayar
    return res.status(200).json({ status: 'OK' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
