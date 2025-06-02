import { BaseChart } from "./BaseChart";

interface ChartContainerProps {
  label: string;
  value: string;
  data: { value: number }[];
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
}

export function ChartContainer({
  label,
  value,
  data,
  onClick,
  isSelected,
  className = "",
}: ChartContainerProps) {
  return (
    <div
      className={`chart-container ${isSelected ? "selected" : ""} ${className}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="chart-header">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="chart-box">
        <BaseChart data={data} fill="#80bfff" stroke="#00ffff" />
      </div>
    </div>
  );
}
