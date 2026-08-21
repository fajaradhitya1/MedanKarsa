import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import QRCode from "qrcode";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key");

export async function POST(req: Request) {
  try {
    const notification = await req.json();
    
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = notification;

    // Validasi Keamanan Signature Midtrans
    const hash = crypto.createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (hash !== signature_key) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Jika pembayaran sukses atau lunas
    if (transaction_status === "capture" || transaction_status === "settlement") {
      const email = notification.customer_details?.email;
      const buyerName = `${notification.customer_details?.first_name || ""} ${notification.customer_details?.last_name || ""}`.trim();
      const phone = notification.customer_details?.phone || "-";
      const eventId = notification.item_details?.[0]?.id;

      if (eventId && email) {
        const ticketCode = `MDK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        // Simpan tiket ke database
        const newTicket = await (prisma as any).ticket.create({
          data: {
            ticketCode,
            buyerName,
            buyerEmail: email,
            buyerPhone: phone,
            eventId,
          },
        });

        const event = await prisma.event.findUnique({ where: { id: eventId } });
        const qrCodeDataUrl = await QRCode.toDataURL(ticketCode);

        const eventDate = event ? new Date(event.startAt).toLocaleDateString("id-ID", {
          day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
        }) : "-";

        // Kirim email tiket resmi
        await resend.emails.send({
          from: "MedanKarsa <onboarding@resend.dev>",
          to: [email],
          subject: `E-Tiket Resmi: ${event?.title || "Event MedanKarsa"}`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #f8f3e8; padding: 30px; color: #173d2b;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2d8c5;">
                <div style="background-color: #173d2b; color: #ffffff; padding: 25px; text-align: center;">
                  <h1 style="margin: 0; font-size: 22px; font-family: serif; color: #dcae59;">MedanKarsa E-Ticket</h1>
                  <p style="margin: 5px 0 0; font-size: 12px; color: rgba(255,255,255,0.8);">Pembayaran Lunas & Terverifikasi!</p>
                </div>
                <div style="padding: 30px;">
                  <h2 style="margin-top: 0; font-size: 20px; color: #173d2b;">${event?.title}</h2>
                  <div style="background: #fdfbf7; padding: 15px 20px; border-radius: 12px; border: 1px solid #e2d8c5; margin-bottom: 20px; font-size: 13px; line-height: 1.6;">
                    <p style="margin: 5px 0;"><strong>Nama Pemesan:</strong> ${buyerName}</p>
                    <p style="margin: 5px 0;"><strong>Waktu Acara:</strong> ${eventDate} WIB</p>
                    <p style="margin: 5px 0;"><strong>Lokasi:</strong> ${event?.location}</p>
                    <p style="margin: 5px 0;"><strong>Kode Tiket:</strong> <span style="font-family: monospace; color: #a27731; font-weight: bold;">${ticketCode}</span></p>
                  </div>
                  <div style="text-align: center; margin: 30px 0;">
                    <p style="font-size: 11px; color: #777d75; margin-bottom: 10px;">Tunjukkan QR Code ini kepada panitia:</p>
                    <img src="${qrCodeDataUrl}" alt="QR Code" style="width: 150px; height: 150px; border: 1px solid #e2d8c5; padding: 10px; border-radius: 12px; background: #fff;" />
                  </div>
                </div>
              </div>
            </div>
          `,
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook gagal" }, { status: 500 });
  }
}