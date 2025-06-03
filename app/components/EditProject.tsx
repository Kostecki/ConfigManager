import {
	ActionIcon,
	Button,
	Group,
	Modal,
	Switch,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconPencil } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { InsertProjects } from "~/database/schema.types";

type InputProps = {
	project: InsertProjects;
};

export default function EditProject({ project }: InputProps) {
	const [loading, setLoading] = useState(false);
	const [opened, { open, close }] = useDisclosure(false);

	const fetcher = useFetcher();

	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			projectName: project.name,
			repoLink: project.repoLink,
			batteryProject: project.batteryProject,
		},
	});

	const handleClose = () => {
		close();
		setLoading(false);
	};

	const handleSubmit = async (formValues: typeof form.values) => {
		setLoading(true);

		const formData = new FormData();
		formData.append("projectName", formValues.projectName);
		if (formValues.repoLink) {
			formData.append("repoLink", formValues.repoLink);
		}
		formData.append("batteryProject", String(formValues.batteryProject));

		fetcher.submit(formData, {
			method: "PATCH",
			action: `/api/projects/${project.id}`,
		});

		handleClose();
	};

	useEffect(() => {
		if (fetcher.state === "idle" && fetcher.data) {
			console.log(fetcher.data);

			if (fetcher.data.status === "success") {
				showNotification({
					message: fetcher.data.message,
					color: "green",
				});
			} else {
				showNotification({
					message: fetcher.data.message,
					color: "red",
				});
			}
		}
	}, [fetcher.state, fetcher.data]);

	return (
		<>
			<Modal
				opened={opened}
				onClose={close}
				title="Edit Project"
				closeOnClickOutside={false}
			>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<TextInput
						label="Project Name"
						key={form.key("projectName")}
						{...form.getInputProps("projectName")}
						mb="md"
					/>

					<TextInput
						label="Repository Link"
						key={form.key("repoLink")}
						{...form.getInputProps("repoLink")}
						mb="md"
					/>

					<Switch
						label="Battery Project"
						key={form.key("batteryProject")}
						{...form.getInputProps("batteryProject", { type: "checkbox" })}
						mb="md"
					/>

					<Group justify="flex-end" mt="md">
						<Button type="submit" size="xs" loading={loading}>
							SAVE
						</Button>
					</Group>
				</form>
			</Modal>

			<ActionIcon variant="subtle" color="black" onClick={open}>
				<IconPencil />
			</ActionIcon>
		</>
	);
}
