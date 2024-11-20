export type Category = {
	title: string;
	image: string;
};

export type Project = {
	title: string;
	category: Category;
	image: string;
	url: string;
	roles: string[];
	date: string;
	client: string;
};

// export const projects: Project[] = [
// 	// CORPO MONTAGE
// 	{
// 		title: 'BSD - "Faire une guerre à Paris"',
// 		category: CategoryTitle.CORPORATE,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/CORPO/1_UNIBET_BSD_1.png',
// 		url: 'https://www.youtube.com/embed/CuH2ttrOmyk',
// 		roles: ['Monteur'],
// 		date: '2024-09-20',
// 		client: 'UNIBET',
// 	},
// 	{
// 		title:
// 			'BSD - "Le nom Saint Denis commence à résonner dans le monde du MMA"',
// 		category: CategoryTitle.CORPORATE,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/CORPO/2_UNIBET BSD_2.png',
// 		url: 'https://www.youtube.com/embed/q9q1SU80_6c',
// 		roles: ['Monteur'],
// 		date: '2024-02-29',
// 		client: 'UNIBET',
// 	},
// 	{
// 		title: 'MEDINE',
// 		category: CategoryTitle.CORPORATE,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/CORPO/3_MEDINE.png',
// 		url: 'https://www.youtube.com/embed/mPymN3eHgmM',
// 		roles: ['Monteur'],
// 		date: '2022-10-20',
// 		client: '777',
// 	},
// 	{
// 		title:
// 			'LA RUE HABILLE LA RUE / KAARIS, KALASH CRIMINEL, BOUCIF, ROLLAND COURBIS, CIRYL GANE...',
// 		category: CategoryTitle.CORPORATE,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/CORPO/4_FOOTKORNER.png',
// 		url: 'https://www.youtube.com/embed/TqGCcVRXB5I',
// 		roles: ['Monteur'],
// 		date: '2022-03-11',
// 		client: 'Footkorner',
// 	},
// 	{
// 		title: 'FORMATION ARBITRES ET COACHS A DJOUGOU',
// 		category: CategoryTitle.CORPORATE,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/CORPO/5_EBD_1.png',
// 		url: 'https://www.youtube.com/embed/oqZufrDbtDo',
// 		roles: ['Monteur'],
// 		date: '2023-05-08',
// 		client: 'Enfant du Benin Debout',
// 	},

// 	// MUSIC VIDEO - RÉALISATEUR
// 	{
// 		title: 'Précipice',
// 		category: CategoryTitle.MUSIQUE,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/MUSIC/pluggy-precipice.png',
// 		url: 'https://www.youtube.com/embed/W8Y6VIU2Vho',
// 		roles: ['Réalisateur', 'Monteur'],
// 		date: '2024-10-01',
// 		client: 'Plüggy',
// 	},
// 	{
// 		title: 'NIGHTMARES/LEMAL',
// 		category: CategoryTitle.MUSIQUE,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/MUSIC/jeunejr-nightmares.png',
// 		url: 'https://www.youtube.com/embed/gAc2vaURLjE',
// 		roles: ['Réalisateur', 'Monteur', 'Étalonneur'],
// 		date: '2024-02-14',
// 		client: 'JEUNEJR',
// 	},
// 	{
// 		title: 'GET OUT - Live Session',
// 		category: CategoryTitle.MUSIQUE,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/MUSIC/jeunejr-get-out.png',
// 		url: 'https://www.youtube.com/embed/x-87DUbgSRc',
// 		roles: ['Réalisateur', 'Monteur', 'Étalonneur'],
// 		date: '2023-11-14',
// 		client: 'JEUNEJR',
// 	},
// 	{
// 		title: 'INTRO',
// 		category: CategoryTitle.MUSIQUE,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/MUSIC/jeunejr-intro.png',
// 		url: 'https://www.youtube.com/embed/k_Rs_CjlqJ8',
// 		roles: ['Réalisateur', 'Monteur', 'Étalonneur'],
// 		date: '2023-10-18',
// 		client: 'JEUNEJR',
// 	},
// 	{
// 		title: 'PWAY',
// 		category: CategoryTitle.MUSIQUE,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/MUSIC/mlz-pway.png',
// 		url: 'https://www.youtube.com/embed/UyDDSzjkSCI',
// 		roles: ['Réalisateur', 'Monteur', 'Étalonneur'],
// 		date: '2023-12-08',
// 		client: 'MLZ',
// 	},
// 	{
// 		title: 'PAIN96 + ICEY',
// 		category: CategoryTitle.MUSIQUE,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/MUSIC/slimkadhafi-pain96.png',
// 		url: 'https://www.youtube.com/embed/ROwSfiBjSp0',
// 		roles: ['Réalisateur', 'Monteur'],
// 		date: '2023-07-18',
// 		client: 'SlimKadhafi & L3on',
// 	},

// 	// MUSIC VIDEO - MONTEUR
// 	{
// 		title: 'WU TANG',
// 		category: CategoryTitle.MUSIQUE,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/MUSIC/venom-wutang.png',
// 		url: 'https://www.youtube.com/embed/TKrSgEf2EJU',
// 		roles: ['Monteur'],
// 		date: '2023-09-29',
// 		client: 'VENOM CZ',
// 	},

// 	// MUSIC VIDEO - ÉTALONNEUR
// 	{
// 		title: 'Soupe',
// 		category: CategoryTitle.MUSIQUE,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/MUSIC/fluo-soupe.png',
// 		url: 'https://www.youtube.com/embed/hFfNDSolGtY',
// 		roles: ['Étalonneur'],
// 		date: '2024-09-20',
// 		client: 'FLUO',
// 	},
// 	{
// 		title: 'La beauté des maux',
// 		category: CategoryTitle.MUSIQUE,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/MUSIC/ichon-beaute.png',
// 		url: 'https://www.youtube.com/embed/aoxu62I_AGY',
// 		roles: ['Étalonneur'],
// 		date: '2024-03-26',
// 		client: 'Ichon',
// 	},
// 	{
// 		title: 'BEHERIT',
// 		category: CategoryTitle.MUSIQUE,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/MUSIC/zeu-beherit.png',
// 		url: 'https://www.youtube.com/embed/GvL0NQ_w1mc',
// 		roles: ['Étalonneur'],
// 		date: '2024-11-08',
// 		client: 'Zeu',
// 	},
// 	{
// 		title: 'WAGNER',
// 		category: CategoryTitle.MUSIQUE,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/MUSIC/zeu-wagner.png',
// 		url: 'https://www.youtube.com/embed/6zqOrK_Pl90',
// 		roles: ['Étalonneur'],
// 		date: '2024-05-31',
// 		client: 'Zeu',
// 	},
// 	{
// 		title: 'CAPTAIN TSUBASA',
// 		category: CategoryTitle.MUSIQUE,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/MUSIC/zeu-captain-tsubasa.png',
// 		url: 'https://www.youtube.com/embed/aSyVDK4wS30',
// 		roles: ['Étalonneur'],
// 		date: '2023-06-25',
// 		client: 'Zeu',
// 	},

// 	// FICTION - Chef opérateur
// 	{
// 		title: 'Le magasin des folies',
// 		category: CategoryTitle.FICTION,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/FICTION/le-magasin-des-folies.png',
// 		url: 'https://player.vimeo.com/video/697297985?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
// 		roles: ['Chef Élec'],
// 		date: '2022-04-08',
// 		client: 'Les Films du Loup Blanc',
// 	},
// 	{
// 		title: 'Star Child',
// 		category: CategoryTitle.FICTION,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/FICTION/star-child.png',
// 		url: 'https://player.vimeo.com/video/464312821?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
// 		roles: ['Élec'],
// 		date: '2020-10-02',
// 		client: 'Les Films du Loup Blanc',
// 	},
// 	{
// 		title: 'Welcome To Eden',
// 		category: CategoryTitle.FICTION,
// 		image:
// 			'https://v-denay-portfolio.s3.eu-west-3.amazonaws.com/projects/FICTION/welcome-to-eden.png',
// 		url: 'https://player.vimeo.com/video/640941838?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479',
// 		roles: ['Chef opérateur'],
// 		date: '2021-10-31',
// 		client: 'Les Films du Loup Blanc',
// 	},
// ];
