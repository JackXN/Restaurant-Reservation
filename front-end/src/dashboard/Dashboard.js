import React, { useEffect, useState } from "react";
import useQuery from "../utils/useQuery";
import { useHistory } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import DisplayReservations from "../components/DisplayReservation";
import DisplayTables from "../components/DisplayTables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);

  // let query = new URLSearchParams(useLocation().search);

  // const queryDate = query.get("date");

  // let [date, setDate] = useState(queryDate ? queryDate : defaultDate)
  const history = useHistory();
  const query = useQuery().get("date");
  if (query) date = query;

  // const buttons = (
  //   <div className="row p-3 justify-content-around">
  //     <button onClick={()=> setDate(previous(date))} name="previous" className="btn btn-outline-secondary btn-lg">Previous Day</button>
  //     <button
  //       onClick={()=> setDate(today())}
  //       name="today"
  //       className={defaultDate===date ? "btn btn-success btn-lg" : "btn btn-outline-success btn-lg"}>Today</button>
  //     <button onClick={() => setDate(next(date))} name="next" className="btn btn-outline-secondary btn-lg">Next Day</button>
  //   </div>
  // )

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const handlePreviousDate = () => {
    history.push(`dashboard?date=${previous(date)}`);
  };

  const handleNextDate = () => {
    history.push(`dashboard?date=${next(date)}`);
  };

  const handleCurrentDate = () => {
    history.push(`dashboard?date=${today(date)}`);
  };

  return (
    <main>
      <div className="text-center">
        <h1 className="display-3">Dashboard</h1>
        <h4 className="lead">Reservations for {date} </h4>
      </div>
      <ErrorAlert error={reservationsError} />

      <div className="row p-3 justify-content-around">
        <button
          onClick={handlePreviousDate}
          name="previous"
          className="btn btn-outline-secondary btn-lg"
        >
          Previous Day
        </button>
        <button
          onClick={handleCurrentDate}
          name="today"
          className="btn btn-outline-secondary btn-lg"
        >
          Today
        </button>
        <button
          onClick={handleNextDate}
          name="next"
          className="btn btn-outline-secondary btn-lg"
        >
          Next Day
        </button>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <DisplayReservations reservations={reservations} />
          </div>
          <div className="col-md-6">
            <DisplayTables tables={tables} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;