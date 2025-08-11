import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

// ডাটাবেস কনফিগারেশন অবজেক্ট
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
  connectTimeout: 20000, // কানেকশন টাইমআউট ২০ সেকেন্ড
  ssl: {
    // SSL অপশন (ডিবাগিং এর জন্য)
    rejectUnauthorized: false,
  },
};

// ইমেইলের জন্য HTML টেমপ্লেট (কোনো পরিবর্তন নেই)
const getEmailHtml = (data: Record<string, any>) => `
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

// ইমেইল পাঠানোর ফাংশন (কোনো পরিবর্তন নেই)
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

// মূল POST ফাংশন (আপডেট করা হয়েছে)
export async function POST(req: Request) {
  let connection; // কানেকশন ভ্যারিয়েবলটি বাইরে ডিক্লেয়ার করুন

  try {
    const data = await req.json();

    // --- ধাপ ১: ডাটাবেস অপারেশন ---
    connection = await mysql.createConnection(dbConfig);

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
        "INSERT INTO orders_contact_form (name, email, phone, subject, message, price) VALUES (?, ?, ?, ?, ?, ?)",
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
      await connection.query(
        "INSERT INTO subscriptions_form (email) VALUES (?)",
        [data.email]
      );
    } else {
      // যদি কোনো পরিচিত type না পাওয়া যায়
      throw new Error("Invalid data type provided.");
    }

    // --- ধাপ ২: ইমেইল পাঠানো ---
    const html = getEmailHtml(data);

    // ব্যবহারকারীকে কনফার্মেশন ইমেইল
    await sendEmail({
      to: data.email,
      subject:
        data.type === "order" ? "Order Confirmation" : "Contact Confirmation",
      html,
    });

    // মালিককে নোটিফিকেশন ইমেইল
    const ownerEmail = process.env.EMAIL_TO;
    if (!ownerEmail) {
      console.warn(
        "Owner email (EMAIL_TO) is not set. Skipping owner notification."
      );
    } else {
      await sendEmail({
        to: ownerEmail,
        subject:
          data.type === "order" ? "New Order Received" : "New Contact Message",
        html,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully!",
    });
  } catch (error: any) {
    // --- এরর হ্যান্ডলিং ---
    console.error("[API_ERROR]", {
      message: error.message,
      code: error.code, // যেমন 'ETIMEDOUT'
      stack: error.stack,
    });

    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  } finally {
    // --- ধাপ ৩: কানেকশন বন্ধ করা ---
    // কানেকশন সফলভাবে তৈরি হয়ে থাকলে, সবশেষে এটি বন্ধ করুন
    if (connection) {
      await connection.end();
    }
  }
}
