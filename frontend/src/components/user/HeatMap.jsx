import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

// Function to generate random activity
const generateActivityData = (startDate, endDate) => {
  const data = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const count = Math.floor(Math.random() * 50);
    data.push({
      date: currentDate.toISOString().split("T")[0],
      count: count,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

// Function to generate panel colors based on logo color
const getPanelColors = (maxCount) => {
  const colors = {};
  const logoColor = { r: 246, g: 200, b: 95 };
  const darkBackground = { r: 50, g: 50, b: 50 };

  for (let i = 0; i <= maxCount; i++) {
    const ratio = i / maxCount;
    const r = Math.round(
      darkBackground.r + (logoColor.r - darkBackground.r) * ratio
    );
    const g = Math.round(
      darkBackground.g + (logoColor.g - darkBackground.g) * ratio
    );
    const b = Math.round(
      darkBackground.b + (logoColor.b - darkBackground.b) * ratio
    );
    colors[i] = `rgb(${r}, ${g}, ${b})`;
  }

  return colors;
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);
  const [panelColors, setPanelColors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const startDate = "2001-01-01";
      const endDate = "2001-01-31";
      const data = generateActivityData(startDate, endDate);
      setActivityData(data);

      const maxCount = Math.max(...data.map((d) => d.count));
      setPanelColors(getPanelColors(maxCount));
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-md w-full max-w-xl mx-auto">
      <h4 className="text-lg font-semibold mb-4" style={{ color: "#F6C85F" }}>
        Recent Contributions
      </h4>
      <HeatMap
        value={activityData}
        startDate={new Date("2001-01-01")}
        rectSize={16}
        space={3}
        panelColors={panelColors}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        monthLabels={[
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ]}
        rectProps={{ rx: 4, ry: 4, stroke: "#333" }}
        style={{ color: "#ffffff" }}
      />
    </div>
  );
};

export default HeatMapProfile;
