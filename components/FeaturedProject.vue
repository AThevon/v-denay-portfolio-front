<template>
	<div class="relative h-full md:rounded-3xl overflow-hidden">
		<div v-if="error">
			<p>Error: {{ error }}</p>
		</div>
		<div v-else-if="status === 'pending'">
			<p>Loading...</p>
		</div>
		<div
			v-else-if="project"
			class="flex h-full flex-col justify-center items-center"
		>
			<NuxtImg
				class="absolute inset-0 -z-20 object-cover w-full h-full"
				:src="project.image"
				:alt="project.title"
			/>
			<div
				class="-z-10 absolute inset-0 bg-gradient-to-bl from-neutral-900/20 to-neutral-900/70"
			></div>
			<h3
				class="mb-8 text-4xl text-center font-bold text-neutral-50 px-4 md:px-10 lg:px-20"
			>
				{{ project.title }}
			</h3>
			<iframe
				class="md:rounded-lg w-full md:w-[80%] lg:w-[620px] xl:w-[820px] h-[250px] sm:h-[400px] xl:h-[500px] aspect-video place-self-center"
				:src="project.url"
				width="820"
				height="500"
				title="Video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>
			<p class="w-fit font-second text-2xl tracking-widest text-gray-300 mt-8">
				{{ project.client }}
				<span
					class="block h-[1.5px] bg-neutral-400 -translate-x-[12.5%] w-[125%] my-2 rounded"
				/>
			</p>
			<div
				class="text-lg font-light text-gray-300 text-center px-4 md:px-10 lg:px-20"
			>
				Rôle :
				<span
					class="font-bold text-neutral-100"
					v-for="(role, index) in project.roles_list"
					:key="role"
				>
					{{ role
					}}<span
						class="font-normal"
						v-if="index < project.roles_list.length - 1"
						>,
					</span>
				</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import type { Project } from '~/types';

	const config = useRuntimeConfig();
	const apiUrl = config.public.API_URL;

	const { data, status, error } = useFetch<Project>(
		`${apiUrl}/featured-project`,
		{ key: 'featured-project' },
	);

	const project = ref<Project | null>(data.value || null);
</script>
