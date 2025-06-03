import { ActionIcon, Button, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useRevalidator } from "react-router";

type InputProps = {
	projectId: number;
};

export default function DeleteProject({ projectId }: InputProps) {
	const [loading, setLoading] = useState(false);
	const [opened, { open, close }] = useDisclosure(false);

	const { revalidate } = useRevalidator();

	const handleClose = () => {
		revalidate();
		close();
		setLoading(false);
	};

	const handleSubmit = async () => {
		setLoading(true);

		try {
			await fetch(`/api/projects/${projectId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			});

			notifications.show({
				message: "Project deleted successfully!",
				color: "green",
			});

			setLoading(false);
		} catch (error) {
			console.error("Failed to delete project:", error);

			notifications.show({
				message: "Error deleting project.",
				color: "red",
			});

			setLoading(false);
		}

		handleClose();
	};

	return (
		<>
			<Modal
				opened={opened}
				onClose={close}
				title="Are you sure?"
				closeOnClickOutside={false}
			>
				<Text>This will delete the project and cannot be undone.</Text>
				<Group justify="flex-end" mt="md">
					<Button variant="transparent" onClick={close}>
						NO
					</Button>
					<Button
						variant="transparent"
						onClick={handleSubmit}
						loading={loading}
					>
						YES
					</Button>
				</Group>
			</Modal>

			<ActionIcon variant="subtle" color="black" onClick={open}>
				<IconTrash />
			</ActionIcon>
		</>
	);
}
