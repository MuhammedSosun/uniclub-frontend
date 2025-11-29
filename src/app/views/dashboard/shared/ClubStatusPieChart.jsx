import { Card, Typography } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ClubStatusPieChart({ clubs }) {
  const active = clubs.filter(c => c.status === "Active").length;
  const suspended = clubs.filter(c => c.status === "Suspended").length;
  const terminated = clubs.filter(c => c.status === "Terminated").length;
  const privates = clubs.filter(c => c.status === "Private").length;

  const data = {
    labels: ["Active", "Suspended", "Terminated", "Private"],
    datasets: [
      {
        data: [active, suspended, terminated, privates],
        backgroundColor: [
          "#4caf50", // Active
          "#ff9800", // Suspended
          "#f44336", // Terminated
          "#3f51b5", // Private
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Kulüp Durum Dağılımı
      </Typography>

      <Doughnut
        data={data}
        height={280}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { usePointStyle: true }
            }
          }
        }}
      />
    </Card>
  );
}
