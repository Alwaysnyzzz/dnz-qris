import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPA_URL, process.env.SUPA_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const { nominal, secret_key } = req.body;

  // Cek secret key teko Env Vercel
  if (secret_key !== process.env.MY_SECRET_KEY) {
    return res.status(403).json({ error: 'Akses ditolak' });
  }

  try {
    const { data, error } = await supabase
      .from('transaksi')
      .update({ status: 'SUCCESS' })
      .eq('nominal', parseInt(nominal))
      .eq('status', 'PENDING')
      .select();

    if (error) throw error;
    res.status(200).json({ message: "Update Sukses su!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
