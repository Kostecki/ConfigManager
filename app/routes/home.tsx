import { Flex, Text } from "@mantine/core";
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

	return (
		<>
			<Flex justify="space-between" align="center" mb="xl">
				<Text tt="uppercase" size="xl">
					Config Manager
				</Text>
				<NewProject />
			</Flex>

			<ProjectsTable projects={projects} />
		</>
	);
}
