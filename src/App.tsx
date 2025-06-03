import React, { useEffect, useRef, useState } from "react";
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
  const detailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch(
      "https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft"
    )
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        if (json.length > 0) setSelectedSkipId(json[0].id);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedSkipId]);

  if (loading) return <p>Loading...</p>;
  if (!data || data.length === 0) return <p>No skips available.</p>;

  const selectedSkip = data.find((skip) => skip.id === selectedSkipId);

  return (
    <div className="container">
      <h1 className="title">Choose Your Skip Size</h1>

      <div className="grid">
        {data.map((skip) => (
          <div
            key={skip.id}
            className={`card ${selectedSkipId === skip.id ? "selected" : ""}`}
            onClick={() => setSelectedSkipId(skip.id)}
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

      {selectedSkip && (
        <div className="details" ref={detailsRef}>
          <h2>Details for {selectedSkip.size} Yard Skip</h2>
          <p>Price (before VAT): £{selectedSkip.price_before_vat.toFixed(2)}</p>
          <p>VAT: {selectedSkip.vat}%</p>
          <p>Hire period: {selectedSkip.hire_period_days} days</p>
          <p>Allowed on road: {selectedSkip.allowed_on_road ? "Yes" : "No"}</p>
          <p>
            Allows heavy waste: {selectedSkip.allows_heavy_waste ? "Yes" : "No"}
          </p>
          <p>
            Per tonne cost:{" "}
            {selectedSkip.per_tonne_cost !== null
              ? `£${selectedSkip.per_tonne_cost.toFixed(2)}`
              : "Not specified"}
          </p>
          <p>
            Transport cost:{" "}
            {selectedSkip.transport_cost !== null
              ? `£${selectedSkip.transport_cost.toFixed(2)}`
              : "Not specified"}
          </p>

          <div className="button-group">
            <button
              className="book-button"
              onClick={() =>
                alert(`You selected ${selectedSkip.size} yard skip!`)
              }
            >
              <span role="img" aria-label="cart">
                🛒
              </span>
              Book Now
            </button>
            <button
              className="clear-button"
              onClick={() => setSelectedSkipId(null)}
            >
              <span role="img" aria-label="trash">
                🗑️
              </span>
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
