import { ProjectService } from '../services/ProjectService.ts';
import { RouterContext, State } from '../deps.ts';

// Récupérer tous les projets
export const getAllProjects = async (
	context: RouterContext<string, Record<string, string>, State>,
) => {
	try {
		const projects = await ProjectService.getAllProjects();
		context.response.status = 200;
		context.response.body = projects;
	} catch (_error) {
		context.response.status = 500;
		context.response.body = { error: 'Failed to retrieve projects' };
	}
};

// Récupérer un projet par ID
export const getProjectById = async (
	context: RouterContext<string, { id: string }, State>,
) => {
	const id = context.params.id ? Number(context.params.id) : null;

	if (!id) {
		context.response.status = 400;
		context.response.body = { error: 'Invalid project ID' };
		return;
	}

	const project = await ProjectService.getProjectById(id);

	if (project) {
		context.response.status = 200;
		context.response.body = project;
	} else {
		context.response.status = 404;
		context.response.body = { error: 'Project not found' };
	}
};

// Créer un nouveau projet
export const createProject = async (
	context: RouterContext<string, Record<string, string>, State>,
) => {
	const body = await context.request.body({ type: 'json' }).value;

	const { title, category, image, url, role, description, date, client } = body;

	if (!title || !category) {
		context.response.status = 400;
		context.response.body = { error: 'Missing required fields' };
		return;
	}

	const newProject = await ProjectService.createProject(
		title,
		category,
		image || '',
		url || '',
		role || '',
		description || '',
		date || '',
		client || '',
	);

	context.response.status = 201;
	context.response.body = { message: 'Project created', project: newProject };
};

interface UpdateProjectBody {
	title?: string;
	category?: string;
	image?: string;
	url?: string;
	role?: string;
	description?: string;
	date?: string;
	client?: string;
}

// Mettre à jour un projet existant
export const updateProject = async (
	context: RouterContext<string, { id: string }, State>,
) => {
	const id = context.params.id ? Number(context.params.id) : null;

	if (!id) {
		context.response.status = 400;
		context.response.body = { error: 'Invalid project ID' };
		return;
	}

// deno-lint-ignore no-explicit-any
	const existingProject: any = await ProjectService.getProjectById(id);
	if (!existingProject) {
		context.response.status = 404;
		context.response.body = { error: 'Project not found' };
		return;
	}

	const body = (await context.request.body({ type: 'json' })
		.value) as UpdateProjectBody;
	const updates = {
		title: body.title || existingProject.title,
		category: body.category || existingProject.category,
		image: body.image || existingProject.image,
		url: body.url || existingProject.url,
		role: body.role || existingProject.role,
		description: body.description || existingProject.description,
		date: body.date || existingProject.date,
		client: body.client || existingProject.client,
	};

	await ProjectService.updateProject(
		id,
		updates.title,
		updates.category,
		updates.image,
		updates.url,
		updates.role,
		updates.description,
		updates.date,
		updates.client,
	);

	context.response.status = 200;
	context.response.body = { message: 'Project updated', project: updates };
};

// Supprimer un projet par ID
export const deleteProject = async (
	context: RouterContext<string, { id: string }, State>,
) => {
	const id = context.params.id ? Number(context.params.id) : null;

	if (!id) {
		context.response.status = 400;
		context.response.body = { error: 'Invalid project ID' };
		return;
	}

	const existingProject = await ProjectService.getProjectById(id);
	if (!existingProject) {
		context.response.status = 404;
		context.response.body = { error: 'Project not found' };
		return;
	}

	await ProjectService.deleteProject(id);
	context.response.status = 200;
	context.response.body = { message: 'Project deleted' };
};
