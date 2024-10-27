import { Router } from '../deps.ts';
import {
	getAllProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
} from '../controllers/projectController.ts';

const router = new Router();

// Récupérer tous les projets
router.get('/', getAllProjects);

// Récupérer un projet par ID
router.get('/:id', getProjectById);

// Créer un nouveau projet
router.post('/', createProject);

// Mettre à jour un projet existant
router.put('/:id', updateProject);

// Supprimer un projet par ID
router.delete('/:id', deleteProject);

export default router;
