import { createClient } from '@supabase/supabase-js';
import qris from 'qris-pay';

const supabase = createClient(process.env.SUPA_URL, process.env.SUPA_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  try {
    const { nominal } = req.body;
    // Fee ringan 1-5 perak agar robot bisa deteksi otomatis
    const unik = Math.floor(Math.random() * 5) + 1; 
    const total = parseInt(nominal) + unik;

    // Simpan data ke database Supabase
    const { data, error } = await supabase
      .from('transaksi')
      .insert([{ nominal: total, status: 'PENDING' }])
      .select();

    if (error) throw error;

    // Kode QRIS Statis Denz_Store kamu
    const qrisStatis = "00020101021126570011ID.DANA.WWW011893600915397838615002099783861500303UMI51440014ID.CO.QRIS.WWW0215ID10254266189280303UMI5204594553033605802ID5910Denz_Store600412926105613166304E74A";

    // MENGUBAH STATIS JADI DINAMIS (AUTO NOMINAL)
    const qrisDinamis = qris(qrisStatis, { amount: total });

    res.status(200).json({ 
      orderId: data[0].id, 
      total: total, 
      qrString: qrisDinamis 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
