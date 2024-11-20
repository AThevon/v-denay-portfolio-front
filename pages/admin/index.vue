<template>
	<div class="container mx-auto p-6">
		<h1 class="text-3xl font-bold mb-6 text-center">Admin Page</h1>
		<form
			@submit.prevent="submitForm"
			class="bg-white shadow-md rounded-lg p-8"
		>
			<div class="mb-4">
				<label for="title" class="block text-gray-700 text-sm font-bold mb-2"
					>Titre:</label
				>
				<input
					type="text"
					v-model="formData.title"
					id="title"
					required
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					placeholder="Entrez le titre"
				/>
			</div>
			<div class="mb-4">
				<label for="category" class="block text-gray-700 text-sm font-bold mb-2"
					>Catégorie:</label
				>
				<select
					v-model="formData.category"
					id="category"
					required
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				>
					<option value="musique">Musique</option>
					<option value="corporate">Corporation</option>
          <option value="fiction">Fiction</option>
				</select>
			</div>
			<div class="mb-4">
				<label for="image" class="block text-gray-700 text-sm font-bold mb-2"
					>Image:</label
				>
				<input
					type="text"
					v-model="formData.image"
					id="image"
					required
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					placeholder="Entrez le nom de l'image"
				/>
			</div>
			<div class="mb-4">
				<label for="url" class="block text-gray-700 text-sm font-bold mb-2"
					>URL:</label
				>
				<input
					type="url"
					v-model="formData.url"
					id="url"
					required
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					placeholder="https://www.youtube.com/embed/dummyURL1"
				/>
			</div>
			<div class="mb-4">
				<label for="role" class="block text-gray-700 text-sm font-bold mb-2"
					>Rôle:</label
				>
				<input
					type="text"
					v-model="formData.role"
					id="role"
					required
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					placeholder="Entrez le rôle"
				/>
			</div>
			<div class="mb-4">
				<label
					for="description"
					class="block text-gray-700 text-sm font-bold mb-2"
					>Description:</label
				>
				<textarea
					v-model="formData.description"
					id="description"
					required
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					placeholder="Décrivez votre projet ici..."
				></textarea>
			</div>
			<div class="mb-4">
				<label for="date" class="block text-gray-700 text-sm font-bold mb-2"
					>Date:</label
				>
				<input
					type="date"
					v-model="formData.date"
					id="date"
					required
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
			<div class="mb-4">
				<label for="client" class="block text-gray-700 text-sm font-bold mb-2"
					>Client:</label
				>
				<input
					type="text"
					v-model="formData.client"
					id="client"
					required
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					placeholder="Entrez le nom du client"
				/>
			</div>
			<button
				type="submit"
				class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
			>
				Ajouter
			</button>
		</form>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useFetch } from '#app';

definePageMeta({
  layout: 'admin',
});

const formData = ref({
  title: '',
  category: '',
  image: '',
  url: '',
  role: '',
  description: '',
  date: '',
  client: '',
});

const submitForm = async () => {
  try {
    const { data, error } = await useFetch('http://localhost:8000/projects', {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (error.value) {
      console.error("Erreur lors de l'ajout des données:", error.value);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } else if (data.value) {
      alert('Données ajoutées avec succès!');
      // Reset the form data
      formData.value = {
        title: '',
        category: '',
        image: '',
        url: '',
        role: '',
        description: '',
        date: '',
        client: '',
      };
    }
  } catch (error) {
    console.error("Erreur inattendue:", error);
    alert('Une erreur est survenue. Veuillez réessayer.');
  }
};
</script>