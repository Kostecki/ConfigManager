import {
  Chart as ChartJS,
  CategoryScale,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function VoltageGraph(props: { projectId: number }) {
  const { projectId } = props;

  const [voltages, setVoltages] = useState<Voltages[]>([]);

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const data = {
    labels: voltages.map((e) => dayjs(e.createdAt).format("DD/MM/YYYY HH:mm")),
    datasets: [
      {
        label: "Voltage",
        data: voltages.map((e) => e.reading),
        borderColor: "#1976D2",
        backgroundColor: "#1976D2",
      },
    ],
  };

  useEffect(() => {
    fetch(`/api/voltages/${projectId}`)
      .then((res) => res.json())
      .then((data) => setVoltages(data));
  }, [projectId]);

  return <Line options={options} data={data} />;
}
