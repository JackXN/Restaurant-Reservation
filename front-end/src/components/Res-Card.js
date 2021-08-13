import React from "react";
import { Link } from "react-router-dom";

//change each reservation to be it's own card

function DisplayReservations({ reservations }) {
  const reservationCards = reservations.map((res) => (
    <div className="my-2 card border border-dark" key={res.reservation_id}>
      <div className="card-body">
        <h5 className="card-title text-center">Reservation Info:</h5>
        <p className="card-text">
          {res.first_name} {res.last_name}
        </p>
        <p className="card-text">Mobile: {res.mobile_number}</p>
        <p className="card-text">Date: {res.reservation_date}</p>
        <p className="card-text">Time: {res.reservation_time}</p>
        <p className="card-text">Party Size: {res.people}</p>
        <Link to={`/reservations/${res.reservation_id}/seat`}>
          <button className="mx-2 border border-dark btn btn-light">
            Seat
          </button>
        </Link>
        <Link to={`reservations/${res.reservation_id}/edit`}>
          <button className=" mx-2 border border-dark btn btn-light">
            Edit
          </button>
        </Link>
        <button
          data-reservation-id-cancel={res.reservation_id}
          className=" mx-2 btn btn-dark"
        >
          Cancel
        </button>
      </div>
    </div>
  ));

  return <div>{reservationCards}</div>;
}

export default DisplayReservations;