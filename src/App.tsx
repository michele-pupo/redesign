import React, { useEffect, useState } from "react";
import "./styles.css";

type Skip = {
  id: number;
  size: number;
  price_before_vat: number;
  vat: number;
  hire_period_days: number;
  allowed_on_road: boolean;
  allows_heavy_waste: boolean;
  area: string;
  postcode: string;
  forbidden: boolean;
  created_at: string;
  updated_at: string;
  per_tonne_cost: number | null;
  transport_cost: number | null;
};

const App = () => {
  const [data, setData] = useState<Skip[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSkipId, setSelectedSkipId] = useState<number | null>(null);

  useEffect(() => {
    fetch(
      "https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft"
    )
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data || data.length === 0) return <p>No skips available.</p>;

  return (
    <div className="container">
      <h1 className="title">Choose Your Skip Size</h1>

      <div className="grid">
        {data.map((skip: Skip) => (
          <div
            key={skip.id}
            className={`card ${selectedSkipId === skip.id ? "selected" : ""}`}
            onClick={() => {
              console.log("Selected skip id:", skip.id);
              setSelectedSkipId(skip.id);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setSelectedSkipId(skip.id);
              }
            }}
          >
            <h2 className="skip-title">{skip.size} Yard Skip</h2>
            <p className="price">
              £{(skip.price_before_vat * (1 + skip.vat / 100)).toFixed(2)} inc
              VAT
            </p>
            <p>Hire period: {skip.hire_period_days} days</p>
            <p>Allowed on road: {skip.allowed_on_road ? "✔️ Yes" : "❌ No"}</p>
            <p>Heavy waste: {skip.allows_heavy_waste ? "✔️ Yes" : "❌ No"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
