import { useEffect, useState } from "react";

export function useStatistics(dataPointCount: number) {
  const [value, setValue] = useState<Statistics[]>([]);

  useEffect(() => {
    const unsub = window.electron.subscribeStatistics((stats) =>
      setValue((prev) => {
        const ans = [...prev, stats];
        if (ans.length > dataPointCount) {
          ans.shift();
        }
        return ans;
      })
    );
    return unsub;
  }, []);

  return value;
}
