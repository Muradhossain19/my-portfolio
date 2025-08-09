import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const body = await req.json();
  const { type, name, email, phone, subject, message, price, service } = body;

  let mailSubject = "";
  let mailHtml = "";

  if (type === "order") {
    mailSubject = `New Order: ${subject}`;
    mailHtml = `
      <div style="background:#ECF0F3;padding:32px;border-radius:16px;font-family:sans-serif;">
        <h2 style="color:#FF004F;margin-bottom:16px;">New Order Received</h2>
        <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;">
          <tr style="background:#FF004F;color:#fff;">
            <th style="padding:8px;text-align:left;">Field</th>
            <th style="padding:8px;text-align:left;">Details</th>
          </tr>
          <tr><td style="padding:8px;">Name</td><td style="padding:8px;">${name}</td></tr>
          <tr><td style="padding:8px;">Email</td><td style="padding:8px;">${email}</td></tr>
          <tr><td style="padding:8px;">Phone</td><td style="padding:8px;">${phone}</td></tr>
          <tr><td style="padding:8px;">Subject</td><td style="padding:8px;">${subject}</td></tr>
          <tr><td style="padding:8px;">Package Price</td><td style="padding:8px;">${price}</td></tr>
        </table>
        <h3 style="color:#FF004F;margin-top:24px;">Message</h3>
        <div style="background:#fff;padding:16px;border-radius:8px;color:#1f2125;">${message}</div>
        <p style="margin-top:32px;color:#3c3e41;font-size:13px;">This message was sent from your service order form.</p>
      </div>
    `;
  } else if (type === "contact") {
    mailSubject = `Contact Inquiry: ${subject}`;
    mailHtml = `
      <div style="background:#ECF0F3;padding:32px;border-radius:16px;font-family:sans-serif;">
        <h2 style="color:#FF004F;margin-bottom:16px;">New Contact Inquiry</h2>
        <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;">
          <tr style="background:#FF004F;color:#fff;">
            <th style="padding:8px;text-align:left;">Field</th>
            <th style="padding:8px;text-align:left;">Details</th>
          </tr>
          <tr><td style="padding:8px;">Name</td><td style="padding:8px;">${name}</td></tr>
          <tr><td style="padding:8px;">Email</td><td style="padding:8px;">${email}</td></tr>
          <tr><td style="padding:8px;">Phone</td><td style="padding:8px;">${phone}</td></tr>
          <tr><td style="padding:8px;">Subject</td><td style="padding:8px;">${subject}</td></tr>
          <tr><td style="padding:8px;">Service</td><td style="padding:8px;">${service}</td></tr>
        </table>
        <h3 style="color:#FF004F;margin-top:24px;">Message</h3>
        <div style="background:#fff;padding:16px;border-radius:8px;color:#1f2125;">${message}</div>
        <p style="margin-top:32px;color:#3c3e41;font-size:13px;">This message was sent from your portfolio contact form.</p>
      </div>
    `;
  } else if (type === "subscribe") {
    mailSubject = `New Subscriber`;
    mailHtml = `
      <div style="background:#ECF0F3;padding:32px;border-radius:16px;font-family:sans-serif;">
        <h2 style="color:#FF004F;margin-bottom:16px;">New Newsletter Subscriber</h2>
        <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;">
          <tr style="background:#FF004F;color:#fff;">
            <th style="padding:8px;text-align:left;">Email</th>
          </tr>
          <tr><td style="padding:8px;">${email}</td></tr>
        </table>
        <p style="margin-top:32px;color:#3c3e41;font-size:13px;">This message was sent from your portfolio subscribe form.</p>
      </div>
    `;
  } else {
    return NextResponse.json({ error: "Invalid form type" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: mailSubject,
      html: mailHtml, // এখানে html property ব্যবহার করুন
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
