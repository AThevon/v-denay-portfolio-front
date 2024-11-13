import { AudioLines, Briefcase, Film } from 'lucide-vue-next';
import Category from '~/pages/projects/[category].vue';

export type Category = {
	title: CategoryTitle;
	image: string;
	icon: any;
};

export enum CategoryTitle {
	MUSIQUE = 'musique',
	CORPORATE = 'corporate',
	FICTION = 'fiction',
}

export const categories: Category[] = [
	{
		title: CategoryTitle.MUSIQUE,
		image: 'music.jpg',
		icon: AudioLines,
	},
	{
		title: CategoryTitle.CORPORATE,
		image: 'corpo.jpg',
		icon: Briefcase,
	},
	{
		title: CategoryTitle.FICTION,
		image: 'fiction.jpg',
		icon: Film,
	},
];

export type Project = {
	title: string;
	category: string;
	image: string;
	url: string;
	role: string;
	description: string;
	date: string;
	client?: string;
};

export const projects: Project[] = [
	{
		title: 'Street Vibes',
		category: CategoryTitle.MUSIQUE,
		image: 'street-vibes.jpg',
		url: 'https://www.youtube.com/embed/dummyURL1',
		role: 'Réalisateur',
		description:
			'Clip explosif dans les rues de Marseille, une énergie brute avec un montage nerveux.',
		date: '2023-07-22',
		client: 'Keny Arkana',
	},
	{
		title: 'Innovation en Santé',
		category: CategoryTitle.CORPORATE,
		image: 'innovation-sante.jpg',
		url: 'https://www.youtube.com/embed/dummyURL2',
		role: 'Monteur',
		description:
			'Présentation des nouvelles avancées technologiques d’une entreprise de biotech.',
		date: '2022-05-12',
		client: 'John Doe',
	},
	{
		title: 'La Nuit des Rêves',
		category: CategoryTitle.FICTION,
		image: 'nuit-reves.jpg',
		url: 'https://www.youtube.com/embed/dummyURL3',
		role: 'Scénariste',
		description:
			'Un voyage onirique dans un monde où les rêves et la réalité se confondent.',
		date: '2021-11-15',
		client: 'Jane Doe',
	},
	{
		title: 'No Limit',
		category: CategoryTitle.MUSIQUE,
		image: 'no-limit.jpg',
		url: 'https://www.youtube.com/embed/dummyURL4',
		role: 'Réalisateur',
		description:
			'Un clip minimaliste mais percutant mettant en avant un rappeur montant de Paris.',
		date: '2023-03-08',
	},
	{
		title: "L'avenir du Digital",
		category: CategoryTitle.CORPORATE,
		image: 'avenir-digital.jpg',
		url: 'https://www.youtube.com/embed/dummyURL5',
		role: 'Monteur',
		description:
			'Présentation des solutions numériques pour les entreprises du futur.',
		date: '2021-08-30',
	},
	{
		title: 'Ombres et Lumières',
		category: CategoryTitle.FICTION,
		image: 'ombres-lumieres.jpg',
		url: 'https://www.youtube.com/embed/dummyURL6',
		role: 'Monteur',
		description:
			'Un thriller psychologique où les ombres cachent plus que des secrets.',
		date: '2020-02-19',
	},
	{
		title: 'Dans la Brume',
		category: CategoryTitle.MUSIQUE,
		image: 'dans-la-brume.jpg',
		url: 'https://www.youtube.com/embed/dummyURL7',
		role: 'Directeur Photo',
		description:
			'Un clip en noir et blanc qui reflète la mélancolie d’un rappeur en pleine ascension.',
		date: '2023-06-05',
	},
	{
		title: 'Recyclage et Innovation',
		category: CategoryTitle.CORPORATE,
		image: 'recyclage.jpg',
		url: 'https://www.youtube.com/embed/dummyURL8',
		role: 'Réalisateur',
		description:
			'Documentaire sur une startup qui révolutionne le recyclage des plastiques.',
		date: '2022-09-17',
	},
	{
		title: 'Le Dernier Voyage',
		category: CategoryTitle.FICTION,
		image: 'dernier-voyage.jpg',
		url: 'https://www.youtube.com/embed/dummyURL9',
		role: 'Réalisateur',
		description: 'Un court-métrage touchant sur les adieux et la rédemption.',
		date: '2022-03-11',
	},
	{
		title: 'Dans le Game',
		category: CategoryTitle.MUSIQUE,
		image: 'dans-le-game.jpg',
		url: 'https://www.youtube.com/embed/dummyURL10',
		role: 'Scénariste',
		description:
			'Un rappeur émergeant exprime sa lutte pour percer dans l’industrie.',
		date: '2023-10-07',
	},
	{
		title: 'Sécurité au Travail',
		category: CategoryTitle.CORPORATE,
		image: 'securite-travail.jpg',
		url: 'https://www.youtube.com/embed/dummyURL11',
		role: 'Monteur',
		description:
			'Sensibilisation sur les bonnes pratiques de sécurité en entreprise.',
		date: '2021-06-18',
	},
	{
		title: 'Une Seconde Chance',
		category: CategoryTitle.FICTION,
		image: 'seconde-chance.jpg',
		url: 'https://www.youtube.com/embed/dummyURL12',
		role: 'Monteur',
		description:
			'L’histoire d’un homme qui reçoit une seconde chance dans la vie.',
		date: '2021-01-24',
	},
	{
		title: 'Démonstration',
		category: CategoryTitle.MUSIQUE,
		image: 'demonstration.jpg',
		url: 'https://www.youtube.com/embed/dummyURL13',
		role: 'Monteur',
		description:
			'Un clip puissant illustrant la montée en puissance d’un jeune artiste.',
		date: '2022-12-14',
	},
	{
		title: 'Leadership Féminin',
		category: CategoryTitle.CORPORATE,
		image: 'leadership.jpg',
		url: 'https://www.youtube.com/embed/dummyURL14',
		role: 'Réalisateur',
		description: 'Portrait de femmes leaders dans le secteur technologique.',
		date: '2023-09-28',
	},
	{
		title: 'Silence des Mots',
		category: CategoryTitle.FICTION,
		image: 'silence-mots.jpg',
		url: 'https://www.youtube.com/embed/dummyURL15',
		role: 'Réalisateur',
		description: 'Un drame familial intense centré sur les non-dits.',
		date: '2020-05-13',
	},
	{
		title: 'Lueur Nocturne',
		category: CategoryTitle.MUSIQUE,
		image: 'lueur-nocturne.jpg',
		url: 'https://www.youtube.com/embed/dummyURL16',
		role: 'Directeur Artistique',
		description:
			'Un clip sombre et poétique mettant en scène la ville endormie.',
		date: '2023-02-20',
	},
	{
		title: 'Durabilité en Action',
		category: CategoryTitle.CORPORATE,
		image: 'durabilite-action.jpg',
		url: 'https://www.youtube.com/embed/dummyURL17',
		role: 'Monteur',
		description:
			'Vidéo de présentation sur les pratiques durables dans une grande entreprise.',
		date: '2021-04-11',
	},
	{
		title: "L'Inconnu",
		category: CategoryTitle.FICTION,
		image: 'inconnu.jpg',
		url: 'https://www.youtube.com/embed/dummyURL18',
		role: 'Monteur',
		description:
			'Un thriller mystérieux où un homme se réveille sans souvenirs.',
		date: '2022-11-29',
	},
	{
		title: 'Sous les Lumières',
		category: CategoryTitle.MUSIQUE,
		image: 'sous-lumieres.jpg',
		url: 'https://www.youtube.com/embed/dummyURL19',
		role: 'Réalisateur',
		description:
			'Clip urbain filmé sous les néons de la ville, reflétant la gloire et la solitude.',
		date: '2023-09-02',
	},
	{
		title: "Esprit d'Équipe",
		category: CategoryTitle.CORPORATE,
		image: 'esprit-equipe.jpg',
		url: 'https://www.youtube.com/embed/dummyURL20',
		role: 'Monteur',
		description:
			'Focus sur le travail d’équipe au sein d’une entreprise internationale.',
		date: '2020-12-10',
	},
];
