import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendEventApprovedEmail(toEmail: string, userName: string, eventTitle: string) {
  try {
    await transporter.sendMail({
      from: '"MedanKarsa Official" <no-reply@medankarsa.com>',
      to: toEmail,
      subject: "Selamat! Event Anda di MedanKarsa Telah Disetujui 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #173d2b; background-color: #f8f3e8; border-radius: 10px;">
          <h2 style="color: #173d2b;">Halo, ${userName}!</h2>
          <p>Kabar gembira! Event Anda yang berjudul <b>"${eventTitle}"</b> telah resmi disetujui oleh admin.</p>
          <p>Event Anda sekarang sudah dapat dilihat dan diakses oleh seluruh pengguna di platform <b>MedanKarsa</b>.</p>
          <br/>
          <p style="font-size: 12px; color: #697067;">Terima kasih telah ikut menghidupkan dan meramaikan Kota Medan bersama kami!</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Gagal mengirim email:", error);
    return { success: false };
  }
}