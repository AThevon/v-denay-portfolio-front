import { serve } from 'https://deno.land/std@0.179.0/http/server.ts';
import { Client } from 'https://deno.land/x/postgres/mod.ts';

// Configuration du client PostgreSQL
const client = new Client({
	user: Deno.env.get('POSTGRES_USER'),
	database: Deno.env.get('POSTGRES_DB'),
	password: Deno.env.get('POSTGRES_PASSWORD'),
	hostname: Deno.env.get('POSTGRES_HOST'),
	port: 5432,
});

// Connexion à la base de données
await client.connect();

// Démarrer le serveur HTTP
serve(
	async (req) => {
		// Ajouter des en-têtes CORS
		const headers = new Headers({
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*', // Permet à tous les domaines d'accéder à l'API
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', // Méthodes autorisées
			'Access-Control-Allow-Headers': 'Content-Type', // En-têtes autorisés
		});

		// Gérer les requêtes OPTIONS pour CORS
		if (req.method === 'OPTIONS') {
			return new Response(null, {
				headers,
			});
		}

		try {
			// Effectuer la requête SQL
			const result = await client.queryArray('SELECT * FROM projects'); // Utiliser queryArray pour obtenir les résultats sous forme de tableau

			// Convertir le résultat en JSON
			const projects = result.rows.map((row) => ({
				id: row[0],
				title: row[1],
				category: row[2],
				image: row[3],
				url: row[4],
				role: row[5],
				description: row[6],
				date: row[7],
			}));

			// Retourner les résultats sous forme de JSON
			return new Response(JSON.stringify(projects), {
				headers,
			});
		} catch (error) {
			console.error('Erreur lors de la requête à la base de données:', error);
			return new Response('Erreur lors de la requête à la base de données.', {
				status: 500,
				headers,
			});
		}
	},
	{ port: 8000 },
);
