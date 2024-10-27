import client from '../db.ts';

export type ProjectType = {
	id?: number;
	title?: string;
	category?: string;
	image?: string;
	url?: string;
	role?: string;
	description?: string;
	date?: string;
	client?: string;
};

export class ProjectService {
	// Initialisation de la table `projects` avec les nouvelles colonnes
	static async initialize() {
		await client.queryObject<ProjectType>`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        image VARCHAR(100),
        url TEXT,
        role VARCHAR(50),
        description TEXT,
        date DATE,
        client VARCHAR(100)
      )
    `;
	}

	// Créer un nouveau projet
	static async createProject(
		title: string,
		category: string,
		image: string,
		url: string,
		role: string,
		description: string,
		date: string,
		projectClient: string,
	) {
		const result = await client.queryObject<ProjectType>`
      INSERT INTO projects (title, category, image, url, role, description, date, client) 
      VALUES (${title}, ${category}, ${image}, ${url}, ${role}, ${description}, ${date}, ${projectClient}) 
      RETURNING id
    `;
		return result.rows[0];
	}

	// Récupérer tous les projets
	static async getAllProjects() {
		const result = await client.queryObject`SELECT * FROM projects`;
		return result.rows;
	}

	// Récupérer un projet par ID
	static async getProjectById(id: number) {
		const result =
			await client.queryObject`SELECT * FROM projects WHERE id = ${id}`;
		return result.rows[0];
	}

	// Mettre à jour un projet existant
	static async updateProject(
		id: number,
		title: string,
		category: string,
		image: string,
		url: string,
		role: string,
		description: string,
		date: string,
		projectClient: string,
	) {
		await client.queryObject`
      UPDATE projects 
      SET title = ${title}, category = ${category}, image = ${image}, url = ${url}, role = ${role}, description = ${description}, date = ${date}, client = ${projectClient} 
      WHERE id = ${id}
    `;
	}

	// Supprimer un projet
	static async deleteProject(id: number) {
		await client.queryObject`DELETE FROM projects WHERE id = ${id}`;
	}
}
