import {
	ActionIcon,
	Box,
	Button,
	Flex,
	Group,
	PasswordInput,
	Switch,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconRestore, IconX } from "@tabler/icons-react";
import { useState } from "react";

import type {
	SelectProjects,
	SelectProjectsFull,
} from "~/database/schema.types";

type InputProps = {
	project: SelectProjects | SelectProjectsFull;
};

export default function KeyValuesForm({ project }: InputProps) {
	const [loading, setLoading] = useState(false);

	if (!("keyValuePairs" in project) || !project.keyValuePairs) {
		console.warn("No keyValuePairs found in project:", project);
		return null;
	}

	const form = useForm({
		initialValues: {
			fields: (project.keyValuePairs ?? []).map((kv) => ({
				id: kv.id,
				label: kv.label,
				key: kv.key,
				value: kv.value,
				enabled: kv.enabled ?? false,
				markedForDeletion: false,
			})),
		},
	});

	const addField = () => {
		form.insertListItem("fields", {
			label: "",
			key: "",
			value: "",
			enabled: true,
			markedForDeletion: false,
		});
	};

	const removeField = (index: number) => {
		const field = form.values.fields[index];

		if (field.id) {
			// Mark for deletion
			form.setFieldValue(`fields.${index}.markedForDeletion`, true);
		} else {
			// Just remove it
			form.removeListItem("fields", index);
		}
	};

	const restoreField = (index: number) => {
		form.setFieldValue(`fields.${index}.markedForDeletion`, false);
	};

	const handleSubmit = async () => {
		setLoading(true);

		const { fields } = form.values;

		const toCreate = fields.filter((f) => !f.id && !f.markedForDeletion);
		const toEdit = fields.filter((f) => f.id && !f.markedForDeletion);
		const toDelete = fields.filter((f) => f.id && f.markedForDeletion);

		try {
			// Create new key-value pairs
			await Promise.all(
				toCreate.map((f) =>
					fetch("/api/kv", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ ...f, projectId: project.id }),
					}).then((res) => {
						if (!res.ok) throw new Error("Failed to create key-value pair");
						return res.json();
					}),
				),
			);

			// Edit existing key-value pairs
			await Promise.all(
				toEdit.map((f) =>
					fetch(`/api/kv/${f.id}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							label: f.label,
							key: f.key,
							value: f.value,
							enabled: f.enabled,
						}),
					}).then((res) => {
						if (!res.ok) throw new Error("Failed to edit key-value pair");
						return res.json();
					}),
				),
			);

			// Delete marked key-value pairs
			await Promise.all(
				toDelete.map((f) =>
					fetch(`/api/kv/${f.id}`, {
						method: "DELETE",
					}).then((res) => {
						if (!res.ok) throw new Error("Failed to delete key-value pair");
						return res.json();
					}),
				),
			);

			// Remove deleted rows from form state:
			const remainingFields = form.values.fields.filter(
				(f) => !f.markedForDeletion,
			);
			form.setFieldValue("fields", remainingFields);

			notifications.show({
				message: "Changes saved successfully!",
				color: "green",
			});

			setLoading(false);
		} catch (error) {
			console.error("Error saving changes:", error);

			notifications.show({
				message: "Error saving changes.",
				color: "red",
			});

			setLoading(false);
		}
	};

	const rows = form.values.fields.map((field, index) => {
		const isFirstField = index === 0;
		const isMarked = field.markedForDeletion;

		return (
			<Group
				key={field.id ?? `new-${index}`}
				gap="sm"
				mt="xs"
				align="center"
				justify="space-between"
				wrap="nowrap"
				style={{ width: "100%" }}
			>
				<Box pt={isFirstField ? 22 : 0}>
					<Switch
						disabled={isMarked}
						{...form.getInputProps(`fields.${index}.enabled`, {
							type: "checkbox",
						})}
					/>
				</Box>

				<Flex gap="sm" style={{ flex: 1 }}>
					<TextInput
						label={isFirstField ? "Label" : undefined}
						placeholder="Label"
						disabled={isMarked}
						{...form.getInputProps(`fields.${index}.label`)}
						style={{ flex: 1 }}
					/>
					<TextInput
						label={isFirstField ? "Key" : undefined}
						placeholder="Key"
						disabled={isMarked}
						{...form.getInputProps(`fields.${index}.key`)}
						style={{ flex: 1 }}
					/>
					<PasswordInput
						label={isFirstField ? "Value" : undefined}
						placeholder="Value"
						disabled={isMarked}
						{...form.getInputProps(`fields.${index}.value`)}
						style={{ flex: 1 }}
					/>
				</Flex>

				<Box pt={isFirstField ? 22 : 0}>
					<ActionIcon
						variant="subtle"
						color="black"
						onClick={() =>
							isMarked ? restoreField(index) : removeField(index)
						}
					>
						{isMarked ? <IconRestore size={18} /> : <IconX size={18} />}
					</ActionIcon>
				</Box>
			</Group>
		);
	});

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			{rows}

			<Flex justify="center" mt="xl" mb="sm">
				<Button
					size="xs"
					variant="outline"
					leftSection={<IconPlus size={17} />}
					onClick={addField}
				>
					ADD FIELD
				</Button>
			</Flex>

			<Flex justify="flex-end">
				<Button type="submit" size="xs" loading={loading}>
					SAVE CONFIG
				</Button>
			</Flex>
		</form>
	);
}
