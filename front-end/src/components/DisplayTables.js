import React from "react";
import { useHistory } from "react-router-dom";
import { finishTable } from "../utils/api";


function DisplayTables({ tables }) {
  const history = useHistory();

  function occupied(tab) {
    return tab.reservation_id === null;
  }

  function handleFinish({ target }) {
    const confirmation = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );

    if (confirmation) {
      let tabId = target.id;

      const abortController = new AbortController();

      finishTable(tabId, abortController.signal).then(() => {
        history.push("/");
      });
    }
  }

  const tableCards = tables.map((tab) => (
    <div className="card border border-dark mb-2 my-2" key={tab.table_id}>
      <div className="card-body">
        <h4 className="card-title text-left lead">Table Info:</h4>
        <h5 data-table-id-status={tab.table_id} className="card-text text-left">
          {occupied(tab) ? (
            "Free"
          ) : (
            <button
              className="border border-dark btn btn-light"
              data-table-id-finish={tab.table_id}
              value={tab.reservation_id}
              id={tab.table_id}
              onClick={handleFinish}
            >
              Finish
            </button>
          )}
        </h5>
        <p className="card-text text-center">Table ID: {tab.table_id}</p>
        <p className="card-text text-center">Name: {tab.table_name}</p>
        <p className="card-text text-center">Capacity: {tab.capacity}</p>
        <p className="card-text text-center">
          Reservation ID: {tab.reservation_id}
        </p>
      </div>
    </div>
  ));

  return <div>{tableCards}</div>;
}

export default DisplayTables;
