import {
    SENDPULSE_API_USER_ID,
    SENDPULSE_API_SECRET,
    SENDPULSE_TEMPLATE_ID,
  } from "$env/static/private";
  import sendpulse from "sendpulse-api";
  
  function initSendPulse(): Promise<void> {
    return new Promise((resolve, reject) => {
      sendpulse.init(
        SENDPULSE_API_USER_ID,
        SENDPULSE_API_SECRET,
        "/tmp",
        function (token: { is_error: any }) {
          if (token && token.is_error) {
            reject(new Error("SendPulse initialization failed"));
          } else {
            resolve();
          }
        }
      );
    });
  }
  
  interface Sender {
    email: string;
    name: string;
  }
  
  async function getFirstSender(): Promise<Sender> {
    return new Promise((resolve, reject) => {
      sendpulse.listSenders((data: Sender[]) => {
        if (data && data.is_error) {
          reject(new Error("Failed to get senders list"));
        } else if (data && data.length > 0) {
          resolve({ email: data[0].email, name: data[0].name });
        } else {
          reject(new Error("No senders found"));
        }
      });
    });
  }
  
  export interface EmailData {
    subject: string;
    recipientEmail: string;
    recipientName: string;
    variables: Record<string, string>;
  }
  
  export async function sendTemplateEmail(emailData: EmailData): Promise<unknown> {
    try {
      await initSendPulse();
      const sender = await getFirstSender();
  
      return new Promise((resolve, reject) => {
        const sendpulseEmailData = {
          template: {
            id: SENDPULSE_TEMPLATE_ID,
            variables: emailData.variables,
          },
          subject: emailData.subject,
          from: {
            name: sender.name,
            email: sender.email,
          },
          to: [
            {
              name: emailData.recipientName,
              email: emailData.recipientEmail,
            },
          ],
        };
        // console.log("Sending email with data =====>>>", sendpulseEmailData);
        sendpulse.smtpSendMail(function (data: unknown) {
          if (data && (data as any).is_error) {
            reject(new Error("Failed to send email: " + (data as any).message));
          } else {
            resolve(data);
          }
        }, sendpulseEmailData);
      });
    } catch (error) {
      console.error("Error sending template email:", error);
      throw error;
    }
  }