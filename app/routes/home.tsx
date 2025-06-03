import { Anchor, Flex, Stack, Text } from "@mantine/core";
import { useLoaderData, type MetaFunction } from "react-router";

import { getProjects } from "~/database/utils";

import NewProject from "~/components/NewProject";
import ProjectsTable from "~/components/ProjectsTable";

export const meta: MetaFunction = () => {
	return [{ title: "Config Manager" }];
};

export async function loader() {
	const projects = await getProjects(true);

	return { projects };
}

export default function Home() {
	const { projects } = useLoaderData<typeof loader>();

	const LATEST_COMMIT_HASH = import.meta.env.VITE_LATEST_COMMIT_HASH;
	const LATEST_COMMIT_MESSAGE = import.meta.env.VITE_LATEST_COMMIT_MESSAGE;
	const COMMIT_URL = `https://github.com/Kostecki/ConfigManager/commit/${LATEST_COMMIT_HASH}`;

	return (
		<>
			<Flex justify="space-between" align="center" mb="xl">
				<Text tt="uppercase" size="xl">
					Config Manager
				</Text>
				<NewProject />
			</Flex>

			<ProjectsTable projects={projects} />

			<Stack gap={0} ta="center" mt="xl">
				<Anchor href={COMMIT_URL} target="_blank" underline="never" c="dimmed">
					<Text size="xs" fs="italic">
						{LATEST_COMMIT_HASH}
					</Text>
					<Text size="xs" fs="italic">
						{LATEST_COMMIT_MESSAGE}
					</Text>
				</Anchor>
			</Stack>
		</>
	);
}
