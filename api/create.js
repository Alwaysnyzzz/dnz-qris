import { createClient } from '@supabase/supabase-js';
import qris from 'qris-generator';

const supabase = createClient(process.env.SUPA_URL, process.env.SUPA_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const { nominal } = req.body;
  const unik = Math.floor(Math.random() * 5) + 1; 
  const total = parseInt(nominal) + unik;

  const { data, error } = await supabase
    .from('transaksi')
    .insert([{ nominal: total, status: 'PENDING' }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  // Kode QRIS Statis kamu yang tadi
  const qrisStatis = "00020101021126570011ID.DANA.WWW011893600915397838615002099783861500303UMI51440014ID.CO.QRIS.WWW0215ID10254266189280303UMI5204594553033605802ID5910Denz_Store600412926105613166304E74A";

  // PROSES MERUBAH KE DINAMIS (AUTO NOMINAL)
  const qrisDinamis = qris(qrisStatis, { amount: total });

  res.json({ orderId: data[0].id, total: total, qrString: qrisDinamis });
}
