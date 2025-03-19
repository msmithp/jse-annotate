import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
);

interface SkillChartProps {
    skillData: {
        id: number,
        skillName: string,
        occurrences: number
    }[]
}

function SkillChart({ skillData } : SkillChartProps) {
    // Sort skill data in decreasing order by number of occurrences
    skillData.sort((x, y) => {return y.occurrences - x.occurrences});

    // Take the top 10, then reverse it so it is sorted from least to greatest
    const numSkills = skillData.length;
    skillData = skillData.slice(0, Math.min(numSkills, 10)).reverse();

    const values = skillData.map(skill => {
        return skill.occurrences;
    });

    const labels = skillData.map(skill => {
        return skill.skillName;
    });

    // Set chart options
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Chart.js Bar Chart',
          },
        },
        maintainAspectRatio: false,
      };

    const data = {
        labels: labels,
        datasets: [{
            label: "Number of occurrences in job descriptions",
            backgroundColor: "#79AEC8",
            borderColor: "#417690",
            data: values
        }]
    };

    return (
        <div style={{ height: "300px", width: "30%" }}>
            <Bar
                data={data}
                options={options}
            />
        </div>
    )
}

export default SkillChart;
