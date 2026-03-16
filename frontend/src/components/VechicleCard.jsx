import { Link } from "react-router-dom";

function VehicleCard({ vehicle }) {

  const image = vehicle.images?.[0];

  return (

    <div style={{
      border: "1px solid #ccc",
      padding: "10px",
      width: "220px",
      borderRadius: "8px"
    }}>

      {image && (
        <img
          src={`http://localhost:5000/uploads/${image}`}
          alt={vehicle.name}
          style={{
            width: "100%",
            height: "140px",
            objectFit: "cover",
            borderRadius: "6px"
          }}
        />
      )}

      <h3>{vehicle.name}</h3>
      <p>Brand: {vehicle.brand}</p>
      <p>Type: {vehicle.type}</p>
      <p>{v.city}</p>
      <p>{v.location}</p>

      <p>₹{v.pricePerDay} / day</p>

        <p style={{
        color: v.status === "available" ? "green" : "red"
        }}>
        {v.status}
        </p>

      <Link to={`/vehicle/${vehicle._id}`}>
        View Details
      </Link>

    </div>

  );

}

export default VehicleCard;