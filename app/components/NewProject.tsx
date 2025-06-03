import { Button, Group, Modal, Switch, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";

export default function NewProject() {
	const [loading, setLoading] = useState(false);
	const [opened, { open, close }] = useDisclosure(false);

	const fetcher = useFetcher();

	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			projectName: "",
			repoLink: "",
			batteryProject: false,
		},
	});

	const handleClose = () => {
		form.reset();
		close();
		setLoading(false);
	};

	const handleSubmit = (formValues: typeof form.values) => {
		setLoading(true);

		const formData = new FormData();
		formData.append("projectName", formValues.projectName);
		formData.append("repoLink", formValues.repoLink);
		formData.append("batteryProject", String(formValues.batteryProject));

		fetcher.submit(formData, {
			method: "POST",
			action: "api/projects",
		});

		handleClose();
	};

	useEffect(() => {
		if (fetcher.state === "idle" && fetcher.data) {
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
				title="Create Project"
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
						{...form.getInputProps("batteryProject")}
					/>

					<Group justify="flex-end" mt="md">
						<Button type="submit" size="xs">
							Submit
						</Button>
					</Group>
				</form>
			</Modal>

			<Button
				variant="gradient"
				gradient={{ from: "blue", to: "cyan", deg: 90 }}
				leftSection={<IconPlus />}
				onClick={open}
				loading={loading}
			>
				New Project
			</Button>
		</>
	);
}
