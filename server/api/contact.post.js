export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	const { sendMail } = useNodeMailer();

	try {
		await sendMail({
			to: process.env.CONTACT_EMAIL,
			subject: `Nouveau message de ${body.name} - Portfolio`,
			html: `
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
			from: body.email,
		});
		return { success: true };
	} catch (error) {
		return { success: false, error: error.message };
	}
});
