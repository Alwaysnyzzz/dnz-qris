import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPA_URL, process.env.SUPA_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const { nominal, secret_key } = req.body;

  // Keamanan sederhana agar tidak sembarang orang bisa update
  if (secret_key !== "denz_rahasia_123") {
    return res.status(403).json({ error: 'Akses ditolak' });
  }

  try {
    const { data, error } = await supabase
      .from('transaksi')
      .update({ status: 'SUCCESS' })
      .eq('nominal', nominal)
      .eq('status', 'PENDING');

    if (error) throw error;
    res.status(200).json({ message: 'Status berhasil diupdate ke SUCCESS' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
