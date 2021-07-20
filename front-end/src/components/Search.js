import React, { useState } from "react";
import { listReservations } from "../utils/api";
import DisplayReservations from "./DisplayReservation";
import ErrorAlert from "../layout/ErrorAlert";

function Search() {
  const [search, setSearch] = useState({ mobile_number: "" });
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const abortController = new AbortController();

  function submitHandler(event) {
    event.preventDefault();
    listReservations(search, abortController.signal)
      .then(setReservations)
      .catch(setError);
    return () => abortController.abort();
  }

  function changeHandler({ target }) {
    setSearch((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  }

  return (
    <section>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler} className="text-center">
        <div className="container">
        <h1 className="display-4">Mobile Number Search</h1>
          <div className="row justify-content-center">
            <div className="pt-2 mt-2 col-6 form-group">
              <input
                className="form-control"
                type="text"
                onChange={changeHandler}
                value={search.mobile_number}
                id="mobile_number"
                placeholder="Enter a customer's phone number"
                name="mobile_number"
              />
            </div>
            <div className="pt-2 mt-2 col-1">
              <button className="btn btn-dark"type="submit">Find</button>
            </div>
          </div>
        </div>
      </form>
      <div className="container">
        <div className="row justify-content-center">
          <div className="pt-2 mt-3 col-6">
            <DisplayReservations reservations={reservations} />
          </div>
        </div>
      </div>
      
    </section>
  );
}

export default Search;
