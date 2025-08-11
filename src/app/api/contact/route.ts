// File: src/app/api/contact/route.ts

import { NextResponse } from "next/server";
import { Pool } from "pg";
import nodemailer from "nodemailer";

// Neon ডাটাবেস কানেকশন পুল
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

// ডেটার জন্য একটি ইন্টারফেস
type ContactFormData = {
  type: "contact" | "order" | "subscribe";
  name?: string;
  email: string;
  phone?: string;
  subject?: string;
  service?: string;
  message?: string;
  price?: string;
};
// ইমেইলের জন্য HTML টেমপ্লেট
// এখানে `any` এর পরিবর্তে `ContactFormData` ব্যবহার করা হয়েছে
const getEmailHtml = (data: ContactFormData) => `
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
                Hi <strong>${data.name || "there"}</strong>,
              </p>
              <p style="font-size:16px; color:#444; margin:0 0 16px 0;">
                ${
                  data.type === "order"
                    ? "We have received your order request and will get back to you soon."
                    : "We have received your message and will get back to you soon."
                }
                  
  

                <strong>Details:</strong>
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9; border-radius:6px;">
                <tr>
                  <td style="padding:12px 16px; font-size:15px; color:#333;">
                    <strong>Email:</strong> ${data.email}  

                    ${
                      data.phone
                        ? `<strong>Phone:</strong> ${data.phone}  
`
                        : ""
                    }
                    ${
                      data.subject
                        ? `<strong>Subject:</strong> ${data.subject}  
`
                        : ""
                    }
                    ${
                      data.service
                        ? `<strong>Service:</strong> ${data.service}  
`
                        : ""
                    }
                    ${
                      data.message
                        ? `<strong>Message:</strong>  
${data.message}`
                        : ""
                    }
                    ${
                      data.price
                        ? `  
<strong>Price:</strong> ${data.price}`
                        : ""
                    }
                  </td>
                </tr>
              </table>
              <p style="font-size:15px; color:#888; margin:24px 0 0 0;">
                If you have any urgent queries, feel free to reply to this email.  

                  

                Best regards,  

                <strong>Murad Hossain Portfolio Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px; text-align:center; font-size:13px; color:#aaa;">
              &copy; ${new Date().getFullYear()} Murad Hossain Portfolio. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

// Owner email template
const getOwnerEmailHtml = (data: ContactFormData) => `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f6; padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05); font-family:Arial,sans-serif;">
          <tr>
            <td style="padding:32px 32px 16px 32px; text-align:center;">
              <h2 style="margin:0; color:#222;">
                ${
                  data.type === "order"
                    ? "New Order Received"
                    : "New Contact Message"
                }
              </h2>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px 32px;">
              <p style="font-size:16px; color:#444; margin:0 0 16px 0;">
                You have received a new ${
                  data.type === "order" ? "order" : "contact"
                } submission from your portfolio website.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9; border-radius:6px;">
                <tr>
                  <td style="padding:12px 16px; font-size:15px; color:#333;">
                    <strong>Name:</strong> ${data.name || "N/A"}<br/>
                    <strong>Email:</strong> ${data.email}<br/>
                    ${
                      data.phone
                        ? `<strong>Phone:</strong> ${data.phone}<br/>`
                        : ""
                    }
                    ${
                      data.subject
                        ? `<strong>Subject:</strong> ${data.subject}<br/>`
                        : ""
                    }
                    ${
                      data.service
                        ? `<strong>Service:</strong> ${data.service}<br/>`
                        : ""
                    }
                    ${
                      data.message
                        ? `<strong>Message:</strong> ${data.message}<br/>`
                        : ""
                    }
                    ${
                      data.price
                        ? `<strong>Price:</strong> ${data.price}<br/>`
                        : ""
                    }
                  </td>
                </tr>
              </table>
              <p style="font-size:15px; color:#888; margin:24px 0 0 0;">
                Please respond to the client as soon as possible.<br/><br/>
                <strong>Murad Hossain Portfolio System</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px; text-align:center; font-size:13px; color:#aaa;">
              &copy; ${new Date().getFullYear()} Murad Hossain Portfolio. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

// ইমেইল পাঠানোর ফাংশন
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

// মূল POST ফাংশন
export async function POST(req: Request) {
  const client = await pool.connect();
  try {
    const data: ContactFormData = await req.json();

    if (data.type === "contact") {
      await client.query(
        "INSERT INTO contacts_form (name, email, phone, subject, service, message) VALUES ($1, $2, $3, $4, $5, $6)",
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
      await client.query(
        "INSERT INTO orders_contact_form (name, email, phone, subject, message, price) VALUES ($1, $2, $3, $4, $5, $6)",
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
      await client.query("INSERT INTO subscriptions_form (email) VALUES ($1)", [
        data.email,
      ]);
    } else {
      throw new Error("Invalid data type provided.");
    }

    // --- ধাপ ২: ইমেইল পাঠানো ---
    const html = getEmailHtml(data);

    // Send confirmation to user
    await sendEmail({
      to: data.email,
      subject:
        data.type === "order" ? "Order Confirmation" : "Contact Confirmation",
      html,
    });

    // Send notification to owner
    const ownerEmail = process.env.EMAIL_TO;
    if (ownerEmail) {
      await sendEmail({
        to: ownerEmail,
        subject:
          data.type === "order" ? "New Order Received" : "New Contact Message",
        html: getOwnerEmailHtml(data),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully!",
    });
  } catch (error: unknown) {
    console.error("[API_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
