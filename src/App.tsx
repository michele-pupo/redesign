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
  // New fields for badges
  most_popular?: boolean;
  best_value?: boolean;
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
        // For demo, manually add badge flags to some skips
        const enriched = json.map((skip: Skip, index: number) => ({
          ...skip,
          most_popular: index === 1, // second item is most popular
          best_value: index === 2, // third item is best value
        }));
        setData(enriched);
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
      <div className="title">
        <h1>Choose Your Skip Size</h1>
        <p className="subtitle">
          Select the skip size that best suits your needs
        </p>
      </div>

      <div className="grid">
        {data.map((skip) => (
          <div
            key={skip.id}
            className={`card 
            ${selectedSkipId === skip.id ? "selected" : ""} 
            ${skip.forbidden ? "unavailable" : ""} 
            ${skip.most_popular ? "most-popular" : ""} 
            ${skip.best_value ? "best-value" : ""} 
            ${skip.allowed_on_road ? "road-allowed" : "road-denied"}
            ${skip.allows_heavy_waste ? "heavy-waste" : ""}
          `}
            onClick={() => !skip.forbidden && setSelectedSkipId(skip.id)}
            role="button"
            tabIndex={skip.forbidden ? -1 : 0}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !skip.forbidden) {
                setSelectedSkipId(skip.id);
              }
            }}
            aria-disabled={skip.forbidden}
          >
            <span className="road-badge">
              {skip.allowed_on_road ? "Road Approved" : "Not Road Approved"}
            </span>
            <img src="/images/skip.png" alt="Skip" className="card-image" />

            <div className="badge-container">
              {skip.most_popular && (
                <span className="badge popular">Most Popular</span>
              )}
              {skip.best_value && (
                <span className="badge value">Best Value</span>
              )}
              {skip.allows_heavy_waste && (
                <span className="badge heavy">Heavy Waste</span>
              )}
            </div>

            <h2 className="skip-title">{skip.size} Yard Skip</h2>
            <p className="price">
              £{(skip.price_before_vat * (1 + skip.vat / 100)).toFixed(2)} inc
              VAT
            </p>
            <p>Hire period: {skip.hire_period_days} days</p>
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
              <span role="img" aria-label="cart" style={{ marginRight: 6 }}>
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
