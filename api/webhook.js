import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPA_URL, process.env.SUPA_KEY);

export default async function handler(req, res) {
  const { nominal, secret } = req.query;
  
  // Keamanan tambahan agar tidak sembarang orang bisa nembak API
  if (secret !== "denz123") return res.status(403).send('Akses Ditolak');

  const { data, error } = await supabase
    .from('transaksi')
    .update({ status: 'SUCCESS' })
    .eq('nominal', parseInt(nominal))
    .eq('status', 'PENDING');

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Pembayaran Dikonfirmasi!', updated: data });
}
