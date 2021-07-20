import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function NewTable() {
  const history = useHistory();
  const abortController = new AbortController();

  const initialState = {
    table_name: "",
    capacity: "",
  };

  const [table, setTable] = useState({ ...initialState });
  const [error, setError] = useState(null);

  const handleChange = ({ target }) => {
    setTable({ ...table, [target.name]: target.value });
    console.log(table);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    async function updateData() {
      try {
        await createTable(table, abortController.signal);
        history.push("/dashboard");
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Aborted");
        } else {
          setError(error);
        }
      }
    }
    updateData();
    return () => abortController.abort();
  };

  return (
    <div>
      <ErrorAlert error={error} />
      <h1 className="text-center display-4">Create New Table</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="table_name">Table Name:</label>
            <input
              type="text"
              className="form-control"
              id="table_name"
              name="table_name"
              onChange={handleChange}
              value={table.table_name}
              required={true}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="capacity">Capacity:</label>
            <input
              type="number"
              className="form-control"
              id="capacity"
              name="capacity"
              onChange={handleChange}
              value={table.capacity}
              required={true}
            />
          </div>
        </div>
        <div className="text-center">
          <button
            className=" mx-2 btn btn-dark"
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

export default NewTable;