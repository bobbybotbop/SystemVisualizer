import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { useStatistics } from "./useStatistics";
import { BaseChart } from "./BaseChart";

function App() {
  const stats = useStatistics(10);

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

  return (
    <>
      <div
        style={{
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        <div style={{ height: 200 }}>
          <BaseChart data={cpuUsage} fill="#80bfff" stroke="#00ffff" />
        </div>
        <div style={{ height: 200 }}>
          <BaseChart data={ramUsage} fill="#80bfff" stroke="#00ffff" />
        </div>
        <div style={{ height: 200 }}>
          <BaseChart data={storageUsage} fill="#80bfff" stroke="#00ffff" />
        </div>
      </div>
    </>
  );
}

export default App;
