import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPA_URL, process.env.SUPA_KEY);

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'ID dibutuhkan' });

  try {
    const { data, error } = await supabase
      .from('transaksi')
      .select('status')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.status(200).json({ status: data.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
