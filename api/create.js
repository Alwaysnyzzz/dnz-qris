import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPA_URL, process.env.SUPA_KEY);

function convertQR(qris, nominal) {
  let qrisData = qris.slice(0, -4);
  let replaceData = qrisData.replace("010211", "010212");
  let splitData = replaceData.split("5802ID");
  let amount = "54" + nominal.toString().length.toString().padStart(2, '0') + nominal;
  let newQRIS = splitData[0] + amount + "5802ID" + splitData[1];
  
  // Rumus CRC16
  let crc = 0xFFFF;
  for (let i = 0; i < newQRIS.length; i++) {
    crc ^= newQRIS.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
    }
  }
  crc = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  return newQRIS + crc;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  try {
    const { nominal } = req.body;
    const unik = Math.floor(Math.random() * 5) + 1; 
    const total = parseInt(nominal) + unik;

    const { data, error } = await supabase
      .from('transaksi')
      .insert([{ nominal: total, status: 'PENDING' }])
      .select();
    if (error) throw error;

    const qrisStatis = "00020101021126570011ID.DANA.WWW011893600915397838615002099783861500303UMI51440014ID.CO.QRIS.WWW0215ID10254266189280303UMI5204594553033605802ID5910Denz_Store600412926105613166304E74A";

    // Panggil fungsi buatan sendiri
    const qrisDinamis = convertQR(qrisStatis, total);

    res.status(200).json({ orderId: data[0].id, total: total, qrString: qrisDinamis });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
