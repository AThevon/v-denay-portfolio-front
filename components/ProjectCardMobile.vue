<template>
	<div
		class="card bg-neutral-300/30 dark:bg-neutral-700/30 backdrop-blur-md py-10 relative overflow-hidden"
	>
		<NuxtImg
			:src="project.image"
			:alt="project.title"
			class="absolute inset-0 -z-20 object-cover w-full h-full blur-[3px]"
		/>
		<div
			class="-z-10 absolute inset-0 bg-gradient-to-r from-neutral-900/20 to-neutral-950"
		></div>
		<div class="grid h-full">
			<p
				class="font-second tracking-widest text-gray-400 w-full text-center mb-6 text-xl"
			>
				{{ formatDate(project.date) }}
			</p>
			<iframe
				class="w-full aspect-video place-self-center"
				:src="project.url"
				width="620"
				height="300"
				title="Video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>
			<div class="px-8 mt-10 text-neutral-100">
				<div class="h-full flex flex-col gap-8 items-center">
					<div class="flex flex-col items-center">
						<h3 class="text-2xl text-center font-bold">
							{{ project.title }}
						</h3>
						<p class="w-fit font-second text-xl tracking-widest text-gray-300">
							<span
								class="block h-[1.5px] bg-neutral-400 -translate-x-[12.5%] w-[125%] my-2 rounded"
							/>
							{{ project.client }}
						</p>
					</div>
					<div class="text-lg font-light text-gray-300">
						Rôle :
						<span
							class="font-bold text-neutral-100"
							v-for="(role, index) in project.roles"
							:key="role"
						>
							{{ role
							}}<span
								class="font-normal"
								v-if="index < project.roles.length - 1"
								>,
							</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { type Project } from '~/data/projects';

	const props = defineProps({
		project: {
			type: Object as PropType<Project>,
			required: true,
		},
		index: {
			type: Number,
			required: true,
		},
	});

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('fr-FR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		}).format(date);
	};
</script>
