import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, createReservation } from "../utils/api";

function NewReservation() {
  const history = useHistory();
  const abortController = new AbortController();
  const params = useParams();
  const reservation_id = params.reservation_id;

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "10:30",
    people: 0,
  };
  const [reservation, setReservation] = useState({ ...initialFormState });

  const noTues = (
    <p className="alert alert-danger">
      We are closed on Tuesdays. Please pick another day.
    </p>
  );

  const noPast = (
    <p className="alert alert-danger">
      Cannot pick a past date for your reservation
    </p>
  );

  const noBefore1030 = (
    <p className="alert alert-danger">
      Cannot make a reservation before 10:30am
    </p>
  );

  const noAfter2130 = (
    <p className="alert alert-danger">
      Cannot make a reservation after 9:30pm.
    </p>
  );

  const dateObject = new Date(
    `${reservation.reservation_date} ${reservation.reservation_time}`
  );

  function before1030() {
    if (dateObject.getHours() < 10) {
      return true;
    }
    if (dateObject.getHours() <= 10 && dateObject.getMinutes() < 30) {
      return true;
    }
    return false;
  }

  function after2130() {
    if (dateObject.getHours() > 21) {
      return true;
    }
    if (dateObject.getHours() >= 21 && dateObject.getMinutes() > 30) {
      return true;
    }
    return false;
  }

  function pastResCheck() {
    let today = new Date();
    if (dateObject.getTime() < today.getTime()) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (reservation_id) {
      const abortController = new AbortController();

      async function loadData() {
        try {
          const single = await readReservation(
            reservation_id,
            abortController.signal
          );
          setReservation(single);
        } catch (error) {
          if (error.name === "AbortError") {
            console.log("Aborted");
          } else {
            throw error;
          }
        }
      }
      loadData();
    }
  }, [reservation_id]);

  const handleChange = ({ target }) => {
    let newValue = target.value;
    if (target.name === "people") {
      newValue = Number(target.value);
    }
    setReservation({ ...reservation, [target.name]: newValue });
    console.log(reservation);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    async function updateData() {
      try {
        await createReservation(reservation, abortController.signal);
        history.push(`/dashboard/${reservation.reservation_date}`);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Aborted");
        } else {
          throw error;
        }
      }
    }
    updateData();
    return () => abortController.abort();
  };

  return (
    <div>
      <h1 className="text-center display-4">Create New Reservation</h1>
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
            {dateObject.getDay() === 2 ? noTues : null}
            {pastResCheck() && reservation.reservation_date !== ""
              ? noPast
              : null}
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
            {before1030() ? noBefore1030 : null}
            {after2130() ? noAfter2130 : null}
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
          <button
            className="mx-2 btn btn-dark"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
          <button
            className="mx-2 border border-dark btn btn-light"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewReservation;