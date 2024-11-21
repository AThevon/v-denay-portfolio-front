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

export type SocialLink = {
	platform: string;
	url: string;
  description: string;
};
