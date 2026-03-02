const axios = require('axios');

async function jalankanRobot() {
    console.log("Robot sedang memantau mutasi...");
    
    // LOGIKA: Di sini nantinya ditaruh kode cek mutasi DANA/OVO kamu.
    // Sebagai contoh, kita asumsikan ada uang masuk 2 perak.
    const nominalMasuk = 2; 

    try {
        const res = await axios.post('https://dnz-qris.vercel.app/api/update-status', {
            nominal: nominalMasuk,
            secret_key: "denz_rahasia_123"
        });
        console.log("Berhasil update database:", res.data.message);
    } catch (err) {
        console.log("Gagal update atau tidak ada transaksi pending.");
    }
}

// Jalankan setiap 1 menit
setInterval(jalankanRobot, 60000);
jalankanRobot();

