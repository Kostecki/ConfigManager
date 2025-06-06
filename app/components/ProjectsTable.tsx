import {
	ActionIcon,
	Anchor,
	Box,
	Collapse,
	Flex,
	Table,
	Tabs,
	Text,
} from "@mantine/core";
import {
	IconBatteryVertical4,
	IconLink,
	IconPlug,
	IconRefresh,
} from "@tabler/icons-react";
import { useState } from "react";
import { useRevalidator } from "react-router";

import dayjs from "~/utils/dayjs";

import DeleteProject from "./DeleteProject";
import EditProject from "./EditProject";
import KeyValuesForm from "./KeyValuesForm";
import VoltageGraph from "./VoltageGraph";

import type {
	SelectProjects,
	SelectProjectsFull,
} from "~/database/schema.types";

type InputProps = {
	projects: SelectProjects[] | SelectProjectsFull[];
};

export default function ProjectsTable({ projects }: InputProps) {
	const [openRow, setOpenRow] = useState<number | null>(null);
	const [activeTab, setActiveTab] = useState<string | null>("config");

	const { revalidate } = useRevalidator();

	const toggleRow = (id: number) => {
		setOpenRow((prev) => (prev === id ? null : id));
	};

	const stopPropagation = (event: React.MouseEvent) => {
		event.stopPropagation();
	};

	const rows = projects.flatMap((project) => {
		const { id, batteryProject, name, repoLink } = project;
		const isBatteryProject = Boolean(batteryProject);

		let lastSeen = project.lastSeen;
		if (batteryProject && "voltages" in project) {
			const full = project as SelectProjectsFull;
			lastSeen = full.voltages.at(-1)?.createdAt ?? lastSeen;
		}

		return [
			<Table.Tr
				key={id}
				onClick={() => toggleRow(id)}
				style={{ cursor: "pointer" }}
			>
				<Table.Td>
					<Flex>
						{batteryProject ? <IconBatteryVertical4 /> : <IconPlug />}
					</Flex>
				</Table.Td>

				<Table.Td>{name}</Table.Td>

				<Table.Td>
					{repoLink ? (
						<Anchor
							href={repoLink}
							target="_blank"
							size="sm"
							onClick={stopPropagation}
						>
							{repoLink}
						</Anchor>
					) : (
						""
					)}
				</Table.Td>

				<Table.Td>
					{lastSeen
						? dayjs.utc(lastSeen).local().format("DD-MM-YYYY, HH:mm")
						: "Never"}
				</Table.Td>

				<Table.Td>
					<Box onClick={stopPropagation} style={{ textAlign: "center" }}>
						<Anchor href={`/api/kv/${id}`} target="_blank">
							<ActionIcon
								variant="subtle"
								color="black"
								onClick={stopPropagation}
								aria-label="Link action"
							>
								<IconLink />
							</ActionIcon>
						</Anchor>
					</Box>
				</Table.Td>

				<Table.Td>
					<Box onClick={stopPropagation} style={{ textAlign: "center" }}>
						<EditProject project={project} />
					</Box>
				</Table.Td>

				<Table.Td>
					<Box onClick={stopPropagation} style={{ textAlign: "center" }}>
						<DeleteProject projectId={id} />
					</Box>
				</Table.Td>
			</Table.Tr>,

			<Table.Tr key={`details-${id}`}>
				<Table.Td colSpan={7} style={{ padding: 0 }}>
					<Collapse in={openRow === id} transitionDuration={200}>
						<Tabs
							value={isBatteryProject ? activeTab : "config"}
							onChange={setActiveTab}
							p="md"
							pos="relative"
						>
							<Tabs.List>
								<Tabs.Tab value="config" style={{ fontWeight: "bold" }}>
									CONFIG
								</Tabs.Tab>
								{isBatteryProject && (
									<Tabs.Tab value="voltage" style={{ fontWeight: "bold" }}>
										VOLTAGE
									</Tabs.Tab>
								)}
							</Tabs.List>

							<Tabs.Panel value="config" pt="sm">
								<KeyValuesForm project={project} />
							</Tabs.Panel>
							{isBatteryProject && (
								<Tabs.Panel value="voltage" pt="sm">
									<VoltageGraph project={project} />
								</Tabs.Panel>
							)}

							<Box pos="absolute" top={0} right={0} p="md">
								<ActionIcon
									variant="subtle"
									color="black"
									onClick={() => revalidate()}
								>
									<IconRefresh size={16} />
								</ActionIcon>
							</Box>
						</Tabs>
					</Collapse>
				</Table.Td>
			</Table.Tr>,
		];
	});

	return (
		<Table withTableBorder bg="white" style={{ borderRadius: 8 }}>
			<Table.Thead>
				<Table.Tr>
					<Table.Th />
					<Table.Th>Project</Table.Th>
					<Table.Th>Github</Table.Th>
					<Table.Th>Last Seen</Table.Th>
					<Table.Th>
						<Text size="sm" fw="bold" ta="center">
							JSON
						</Text>
					</Table.Th>
					<Table.Th>
						<Text size="sm" fw="bold" ta="center">
							Edit
						</Text>
					</Table.Th>
					<Table.Th align="center">
						<Text size="sm" fw="bold" ta="center">
							Delete
						</Text>
					</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>{rows}</Table.Tbody>
		</Table>
	);
}
