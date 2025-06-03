import React, { useEffect, useState } from "react";

// Define the structure of a skip object
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

  useEffect(() => {
    fetch("https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft")
      .then((res) => res.json())
      .then((json) => {
        console.log("ONE SKIP:", json[0]); // 👈 Useful to understand the data structure
        setData(json);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data || data.length === 0) return <p>No skips available.</p>;

  return (
    <div className="container">
      <h1>Choose Your Skip Size</h1>

      <div className="grid">
        {data.map((skip) => (
          <div className="card" key={skip.id}>
            <h2>{skip.size} Yard Skip</h2>
            <p>Price: £{(skip.price_before_vat * (1 + skip.vat / 100)).toFixed(2)}</p>
            <p>Hire Period: {skip.hire_period_days} days</p>
            <p>Allowed on Road: {skip.allowed_on_road ? "✔️ Yes" : "❌ No"}</p>
            <p>Heavy Waste: {skip.allows_heavy_waste ? "✔️ Yes" : "❌ No"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;