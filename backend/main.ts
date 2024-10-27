import { Application, Router } from './deps.ts';
import { oakCors } from './deps.ts';
import projectRoutes from './routes/projectRoutes.ts';
import { ProjectService } from './services/ProjectService.ts';

const app = new Application();
const router = new Router();

// Middleware pour CORS
app.use(
	oakCors({
		origin: '*',
	}),
);

// Initialiser la table
await ProjectService.initialize();

// Routes
router.use('/projects', projectRoutes.routes(), projectRoutes.allowedMethods());
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 8000;
console.log(`🚀 Server is running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
