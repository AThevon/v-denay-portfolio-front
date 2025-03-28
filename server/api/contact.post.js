import Mailjet from "node-mailjet";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const mailjetClient = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE,
  });

  try {
    const request = await mailjetClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "no-reply@victordenay.com",
            Name: "Portfolio Contact",
          },
          To: [
            {
              Email: process.env.CONTACT_EMAIL,
              Name: "denayvic",
            },
          ],
          ReplyTo: {
            Email: body.email,
            Name: body.name,
          },
          Subject: `Nouveau message de ${body.name} - Portfolio`,
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <h2 style="color: #333;">Nouveau message de contact</h2>
              <p><strong>Nom:</strong> ${body.name}</p>
              <p><strong>Email:</strong> ${body.email}</p>
              <p><strong>Message:</strong></p>
              <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${body.message}</p>
              <br>
              <p style="color: #999;">Ce message vous a été envoyé depuis le formulaire de contact de votre portfolio.</p>
            </div>
          `,
        },
      ],
    });

    return { success: true, result: request.body };
  } catch (error) {
    console.error("Erreur d'envoi d'email :", error);
    return { success: false, error: error.message };
  }
});
