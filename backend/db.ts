import { Client } from './deps.ts';

const postgres = new Client({
	hostname: Deno.env.get('POSTGRES_HOST'),
	user: Deno.env.get('POSTGRES_USER'),
	password: Deno.env.get('POSTGRES_PASSWORD'),
	database: Deno.env.get('POSTGRES_DB'),
	port: 5432,
});

await postgres.connect();

export default postgres;
