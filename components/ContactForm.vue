<template>
	<UForm
		:schema="schema"
		:state="form"
		@submit="sendContactForm"
		class="space-y-3 mb-12 xl:mb-0"
	>
		<UFormGroup label="Nom" name="name">
			<UInput v-model="form.name" placeholder="Votre nom" required size="lg" />
		</UFormGroup>

		<UFormGroup label="Email" name="email">
			<UInput
				v-model="form.email"
				type="email"
				placeholder="Votre email"
				required
				size="lg"
			/>
		</UFormGroup>

		<UFormGroup label="Message" name="message">
			<UTextarea
				v-model="form.message"
				type="textarea"
				placeholder="Votre message..."
				:rows="5"
				required
				size="lg"
			/>
		</UFormGroup>

		<UButton :disabled="!isFormValid" type="submit" size="xl" block color="black" class="font-second tracking-widest">
			Envoyer
			<Send class="w-4 h-4" />
		</UButton>
	</UForm>
</template>

<script lang="ts" setup>
	import { z } from 'zod';
	import { computed, reactive } from 'vue';
	import { Send } from 'lucide-vue-next';

	const toast = useToast();

	const schema = z.object({
		name: z.string().min(1, 'Veuillez renseigner votre nom'),
		email: z.string().email('Veuillez renseigner un email valide'),
		message: z.string().min(1, 'Veuillez renseigner un message'),
	});

	type Schema = z.output<typeof schema>;

	const form = reactive<Schema>({
		name: '',
		email: '',
		message: '',
	});

	const isFormValid = computed(() => {
		const result = schema.safeParse(form);
		return result.success;
	});

	const sendContactForm = async () => {
		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});
			const result = await response.json();
			if (result.success) {
				toast.add({
					title: 'Génial !',
					description: 'Votre message a bien été envoyé',
				});
				form.name = '';
				form.email = '';
				form.message = '';
			} else {
				toast.add({
					title: 'Oups...',
					description: "Erreur lors de l'envoi du message",
				});
			}
		} catch (error: any) {
			toast.add({
				title: 'Oups...',
				description: "Erreur lors de l'envoi du message",
			});
		}
	};
</script>
