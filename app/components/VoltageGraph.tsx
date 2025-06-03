import { LineChart } from "@mantine/charts";
import type {
	SelectProjects,
	SelectProjectsFull,
} from "~/database/schema.types";

type InputProps = {
	project: SelectProjects | SelectProjectsFull;
};

function roundTo(num: number, decimals = 3) {
	const factor = 10 ** decimals;
	return Math.round(num * factor) / factor;
}

const defaultLowVoltageThreshold = "3.2";

export default function VoltageGraph({ project }: InputProps) {
	if (!("voltages" in project) || !project.voltages) {
		console.warn("No voltages found in project:", project);
		return null;
	}

	const lowVoltageThreshold = Number.parseFloat(
		project.keyValuePairs.find((kv) => kv.key === "low-voltage-threshold")
			?.value || defaultLowVoltageThreshold,
	);

	const voltages = project.voltages;
	const latestReading = voltages[voltages.length - 1];

	const downsampledVoltages = voltages
		.filter((_, i) => i % 10 === 0)
		.concat(latestReading)
		.reduce(
			(acc, curr) => {
				if (!acc.some((v) => v.id === curr.id)) {
					acc.push(curr);
				}
				return acc;
			},
			[] as typeof voltages,
		)
		.map((v) => ({ ...v, reading: v.reading.toFixed(3) }));

	const readings = downsampledVoltages.map((v) => Number(v.reading));
	const maxReading = Math.max(...readings);
	const yDomain = [lowVoltageThreshold, roundTo(maxReading + 0.1)];

	return (
		<LineChart
			h={400}
			w="100%"
			data={downsampledVoltages}
			dataKey="createdAt"
			series={[{ name: "reading", label: "Voltage", color: "indigo.6" }]}
			yAxisProps={{ domain: yDomain }}
			withXAxis={false}
			withDots={false}
			strokeWidth={2.5}
			type="gradient"
			referenceLines={[
				{
					y: lowVoltageThreshold,
					label: "Low Voltage Threshold",
					color: "red.6",
				},
			]}
			my="lg"
		/>
	);
}
