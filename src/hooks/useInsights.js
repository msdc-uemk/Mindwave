import { useEffect, useState } from "react";
export default function useInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/insights");
        const json = await res.json();
        if (alive) setData(json);
      } catch (e) {
        if (alive) setErr(e?.message || "Failed to load insights");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { data, loading, err };
}
