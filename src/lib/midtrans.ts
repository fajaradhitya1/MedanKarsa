import midtransClient from "midtrans-client";

export const snap = new midtransClient.Snap({
  isProduction: false, // Ubah ke true jika sudah rilis asli
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
});