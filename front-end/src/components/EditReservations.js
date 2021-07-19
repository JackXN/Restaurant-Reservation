import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, editReservation } from "../utils/api";
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-time";
import ErrorAlert from "../layout/ErrorAlert";

function EditReservations() {
  const history = useHistory();
  const params = useParams();
  const reservation_id = params.reservation_id;

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: "booked",
  };

  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState({ ...initialFormState });

  useEffect(() => {
    async function loadReservation() {
      if (reservation_id) {
        const abortController = new AbortController();
        setError(null);
        readReservation(reservation_id, abortController.signal)
          .then(formatReservationDate)
          .then(formatReservationTime)
          .then(setReservation)
          .catch(setError);
        return () => abortController.abort();
      }
    }

    loadReservation();
  }, [reservation_id]);

  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    if (reservation_id) {
      editReservation(reservation, abortController.signal)
        .then(() => {
          history.push(`/dashboard/?date=${reservation.reservation_date}`);
        })
        .catch(setError);
      return () => abortController.abort();
    }
  }

  function handleChange({ target }) {
    let newValue = target.value;
    if (target.name === "people") {
      newValue = Number(target.value);
    }
    setReservation((previousReservation) => ({
      ...previousReservation,
      [target.name]: newValue,
    }));
  }

  return (
    <div>
      <ErrorAlert error={error} />
      <h1 className="text-center">Edit Reservation</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="first_name">First Name:</label>
            <input
              type="text"
              className="form-control"
              id="first_name"
              name="first_name"
              onChange={handleChange}
              value={reservation.first_name}
              required={true}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="last_name">Last Name:</label>
            <input
              type="text"
              className="form-control"
              id="last_name"
              name="last_name"
              onChange={handleChange}
              value={reservation.last_name}
              required={true}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="mobile_number">Phone Number:</label>
            <input
              type="text"
              className="form-control"
              id="mobile_number"
              name="mobile_number"
              onChange={handleChange}
              value={reservation.mobile_number}
              required={true}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="reservation_date">Reservation Date:</label>
            <input
              type="date"
              className="form-control"
              id="reservation_date"
              name="reservation_date"
              onChange={handleChange}
              value={reservation.reservation_date}
              required={true}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="reservation_time">Reservation Time:</label>
            <input
              type="time"
              className="form-control"
              id="reservation_time"
              name="reservation_time"
              onChange={handleChange}
              value={reservation.reservation_time}
              required={true}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="people">Group Size:</label>
            <input
              type="number"
              className="form-control"
              id="people"
              name="people"
              onChange={handleChange}
              value={reservation.people}
              required={true}
            />
          </div>
        </div>
        <div className="text-center">
          <button className="btn btn-danger" onClick={() => history.goBack()}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditReservations;