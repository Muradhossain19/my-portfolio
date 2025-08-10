import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const getEmailHtml = (data: any) => `
  <!-- Responsive Email Template for Contact/Order -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f6; padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05); font-family:Arial,sans-serif;">
          <tr>
            <td style="padding:32px 32px 16px 32px; text-align:center;">
              <h2 style="margin:0; color:#222;">
                ${
                  data.type === "order"
                    ? "Order Received!"
                    : "Thank You for Contacting Us!"
                }
              </h2>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px 32px;">
              <p style="font-size:16px; color:#444; margin:0 0 16px 0;">
                Hi <strong>${data.name}</strong>,
              </p>
              <p style="font-size:16px; color:#444; margin:0 0 16px 0;">
                ${
                  data.type === "order"
                    ? "We have received your order request and will get back to you soon."
                    : "We have received your message and will get back to you soon."
                }
                <br><br>
                <strong>Details:</strong>
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9; border-radius:6px;">
                <tr>
                  <td style="padding:12px 16px; font-size:15px; color:#333;">
                    <strong>Email:</strong> ${data.email}<br>
                    <strong>Phone:</strong> ${data.phone}<br>
                    <strong>Subject:</strong> ${data.subject}<br>
                    ${
                      data.type === "contact"
                        ? `<strong>Service:</strong> ${data.service}<br>`
                        : ""
                    }
                    <strong>Message:</strong><br>
                    ${data.message}
                    ${
                      data.type === "order"
                        ? `<br><strong>Price:</strong> ${data.price}`
                        : ""
                    }
                  </td>
                </tr>
              </table>
              <p style="font-size:15px; color:#888; margin:24px 0 0 0;">
                If you have any urgent queries, feel free to reply to this email.<br>
                <br>
                Best regards,<br>
                <strong>Murad Hossain Portfolio Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px; text-align:center; font-size:13px; color:#aaa;">
              &copy; 2025 Murad Hossain Portfolio. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Murad Hossain Portfolio" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

export async function POST(req: Request) {
  const data = await req.json();
  const connection = await mysql.createConnection(dbConfig);

  if (data.type === "contact") {
    await connection.query(
      "INSERT INTO contacts_form (name, email, phone, subject, service, message) VALUES (?, ?, ?, ?, ?, ?)",
      [
        data.name,
        data.email,
        data.phone,
        data.subject,
        data.service,
        data.message,
      ]
    );
  } else if (data.type === "order") {
    await connection.query(
      "INSERT INTO orders (name, email, phone, subject, message, price) VALUES (?, ?, ?, ?, ?, ?)",
      [
        data.name,
        data.email,
        data.phone,
        data.subject,
        data.message,
        data.price,
      ]
    );
  } else if (data.type === "subscribe") {
    await connection.query("INSERT INTO subscriptions (email) VALUES (?)", [
      data.email,
    ]);
  }

  // Email send logic
  const html = getEmailHtml(data);

  // User ke email
  await sendEmail({
    to: data.email,
    subject:
      data.type === "order" ? "Order Confirmation" : "Contact Confirmation",
    html,
  });

  // Owner ke email
  await sendEmail({
    to: process.env.EMAIL_TO,
    subject:
      data.type === "order" ? "New Order Received" : "New Contact Message",
    html,
  });

  await connection.end();
  return NextResponse.json({ success: true });
}
