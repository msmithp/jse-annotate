import { Chart as ChartJS, CategoryScale, 
    LinearScale, BarElement, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import { mapSkillToColor } from "../static/utils";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip
);

// Set font of chart
ChartJS.defaults.font.family = "Geologica";
ChartJS.defaults.font.size = 13;
ChartJS.defaults.color = "#eeeeee";
ChartJS.defaults.font.weight = 350;

// Set color of grid lines
ChartJS.defaults.borderColor = "#545454";

interface SkillChartProps {
    title: string
    skillData: {
        id: number,
        skillName: string,
        occurrences: number
    }[]
}

function SkillChart({ title, skillData } : SkillChartProps) {
    // Sort skill data in decreasing order by number of occurrences
    skillData.sort((x, y) => {return y.occurrences - x.occurrences});

    // Take the top 10, then reverse it so it is sorted from least to greatest
    const numSkills = skillData.length;
    skillData = skillData.slice(0, Math.min(numSkills, 10)).reverse();

    // Filter out skills with 0 occurrences
    skillData = skillData.filter(skill => skill.occurrences !== 0);

    const values = skillData.map(skill => {
        return skill.occurrences;
    });

    const labels = skillData.map(skill => {
        return skill.skillName;
    });

    const colors = skillData.map(skill => {
        return mapSkillToColor(skill.skillName);
    })

    // Set chart options
    const options = {
        responsive: true,
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Jobs"
                }
            }
        },
        plugins: {
            title: {
                display: title === "" ? false : true,
                text: title,
                font: {
                    size: 18
                }
            },
        },
        maintainAspectRatio: false,
    };

    const data = {
        labels: labels,
        datasets: [{
            label: "Jobs",
            backgroundColor: colors,
            borderColor: "#417690",
            data: values
        }]
    };

    return (
        <Bar
            data={data}
            options={options}
        />
    )
}

export default SkillChart;
