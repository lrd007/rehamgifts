import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sendTemplateEmail, type EmailData } from "$lib/services/sendpulse";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, name, subject, variables } = await request.json();

    const emailData: EmailData = {
      subject,
      recipientEmail: email,
      recipientName: name,
      variables,
    };

    const result = await sendTemplateEmail(emailData);

    return json({ success: true, message: "Email sent successfully", result });
  } catch (error) {
    console.error("Failed to send email:", error);
    return json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to send email",
      },
      { status: 500 }
    );
  }
};