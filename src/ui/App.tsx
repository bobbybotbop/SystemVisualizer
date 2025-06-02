import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { useStatistics } from "./useStatistics";
import { ChartContainer } from "./ChartContainer";

type ChartType = "CPU" | "RAM" | "STORAGE";
type AnimationType = "in" | "out" | null;

interface ChartAnimation {
  type: AnimationType;
  charts: ChartType[];
}

function App() {
  const stats = useStatistics(10);
  const [staticData, setStaticData] = useState<StaticData | null>(null);
  const [selectedChart, setSelectedChart] = useState<ChartType | null>(null);
  const [animation, setAnimation] = useState<ChartAnimation>({
    type: null,
    charts: [],
  });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    window.electron.getStaticData().then(setStaticData);
  }, []);

  const handleChartClick = (chartType: ChartType) => {
    if (isAnimating) return; // Prevent clicks during animation

    setSelectedChart((current) => {
      const allCharts = ["CPU", "RAM", "STORAGE"] as ChartType[];

      // Only animate when going from no selection to selection or vice versa
      if (current === null || (current === chartType && chartType !== null)) {
        setIsAnimating(true);
        setAnimation({
          type: current === null ? "in" : "out",
          charts: allCharts,
        });
        setTimeout(() => {
          setAnimation({ type: null, charts: [] });
          setIsAnimating(false);
        }, 700);
      }

      return current === chartType ? null : chartType;
    });
  };

  const cpuUsage = useMemo(
    () => stats.map((s) => ({ value: s.cpuUsage * 100 })),
    [stats]
  );
  const ramUsage = useMemo(
    () => stats.map((s) => ({ value: s.ramUsage * 100 })),
    [stats]
  );
  const storageUsage = useMemo(
    () => stats.map((s) => ({ value: s.storageUsage * 100 })),
    [stats]
  );

  const getAnimationClass = (chartType: ChartType) => {
    if (animation.charts.includes(chartType)) {
      return animation.type === "in" ? "animate-in" : "animate-out";
    }
    return "";
  };

  return (
    <>
      <div className="titlebar" />
      <div
        style={{
          margin: "0 auto",
          display: "flex",
          padding: "20px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className={`charts-layout ${isAnimating ? "animating" : ""}`}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "350px",
            }}
          >
            <ChartContainer
              label="CPU"
              value={staticData?.cpuModel ?? "Loading..."}
              data={cpuUsage}
              onClick={() => handleChartClick("CPU")}
              isSelected={selectedChart === "CPU"}
              className={getAnimationClass("CPU")}
            />

            <ChartContainer
              label="RAM"
              value={staticData ? `${staticData.totalMemGB} GB` : "Loading..."}
              data={ramUsage}
              onClick={() => handleChartClick("RAM")}
              isSelected={selectedChart === "RAM"}
              className={getAnimationClass("RAM")}
            />

            <ChartContainer
              label="STORAGE"
              value={
                staticData ? `${staticData.totalStorage} GB` : "Loading..."
              }
              data={storageUsage}
              onClick={() => handleChartClick("STORAGE")}
              isSelected={selectedChart === "STORAGE"}
              className={getAnimationClass("STORAGE")}
            />
          </div>

          {selectedChart && (
            <div
              className="selected-chart-wrapper"
              //set key just to force a remount to replay css animation
              // key={selectedChart}
            >
              <div className="selected-chart">
                <ChartContainer
                  label={selectedChart}
                  value={
                    selectedChart === "CPU"
                      ? staticData?.cpuModel ?? "Loading..."
                      : selectedChart === "RAM"
                      ? staticData
                        ? `${staticData.totalMemGB} GB`
                        : "Loading..."
                      : staticData
                      ? `${staticData.totalStorage} GB`
                      : "Loading..."
                  }
                  data={
                    selectedChart === "CPU"
                      ? cpuUsage
                      : selectedChart === "RAM"
                      ? ramUsage
                      : storageUsage
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
