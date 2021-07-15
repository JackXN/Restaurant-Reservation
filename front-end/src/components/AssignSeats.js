import React, { useEffect, useState } from "react";
import {
  readReservation,
  listTables,
  setReservationToTable,
  updateStatus,
} from "../utils/api";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function AssignSeats() {
  const params = useParams();
  const history = useHistory();
  const reservation_id = params.reservation_id;

  const [reservation, setReservation] = useState({});
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  const initialState = { table_id: "" };
  const [formData, setFormData] = useState({ ...initialState });

  useEffect(() => {
    const abortController = new AbortController();

    async function loadData() {
      try {
        const resResult = await readReservation(
          reservation_id,
          abortController.signal
        );
        const tabResult = await listTables(abortController.signal);
        setReservation(resResult);
        setTables(tabResult);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Aborted");
        } else {
          setError(error);
        }
      }
    }
    loadData();
  }, [reservation_id]);

  const changeHandler = ({ target }) => {
    let value = target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.table_id !== "x") {
      const abortController = new AbortController();
      //let status = "seated";
      // await updateStatus(status, reservation_id, abortController.signal)
      await setReservationToTable(
        parseInt(formData.table_id),
        reservation.reservation_id,
        abortController.signal
      ).then(() => {
        history.push("/dashboard");
      });
    }
  };

  let free = tables.filter(
    (table) =>
      table.reservation_id === null && table.capacity >= reservation.people
  );

  return (
    <main>
      <ErrorAlert error={error} />
      <div className="card">
        <div className="card-header">
          <h4>
            {reservation.first_name} {reservation.last_name}
          </h4>
          <div className="card-body">
            <p className="card-text">Date: {reservation.reservation_date}</p>
            <p className="card-text">Time: {reservation.reservation_time}</p>
            <p className="card-text">Mobile Number: {reservation.mobile_number}</p>
            <p className="card-text">Party Size: {reservation.people}</p>
          </div>
        </div>
      </div>

      <div className="my-4 container">
        <div className="row justify-content-center">
          <div className="col-4">
            <form onSubmit={handleSubmit}>
              <select
                name="table_id"
                onChange={changeHandler}
                className="form-control form-control-lg"
                value={formData.table_id}
              >
                <option value="x">--- Select A Table ---</option>
                {free.map((table) => (
                  <option key={table.table_id} value={table.table_id}>
                    {table.table_name} - {table.capacity}
                  </option>
                ))}
              </select>
              <div className="text-center my-2">
                <button
                  type="button"
                  onClick={() => history.goBack()}
                  className="mx-2 btn btn-dark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mx-1 border border-dark btn btn-light"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}