import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPA_URL, process.env.SUPA_KEY);

export default async function handler(req, res) {
  const { id } = req.query;
  const { data, error } = await supabase
    .from('transaksi')
    .select('status')
    .eq('id', id)
    .single();

  if (error) return res.status(500).json({ error: "Data tidak ditemukan" });
  res.json({ status: data.status });
}
