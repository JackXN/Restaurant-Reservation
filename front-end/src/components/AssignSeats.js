import React, {useState,useEffect} from 'react'
import {
    readReservation, 
    listTables,
    setReservationToTable,
    updateStatus,
}from '../utils/api'



import {useParams, useHistory} from 'react-router-dom';
import ErrorAlert from '../layout/ErrorAlert';

function AssignSeats() {
    const params = useParams();
    const history = useHistory();
    const reservation_id = params.reservation_id;

    const [reservation,setReservation] = useSate({});
const [tables,setTables] = useState([]);
const [error,setError] = useState(null);

const initialState = {table_id: ""};
const [formData, setFormData] = useState({...initialState});

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

    return (
        <div>
            
        </div>
    )
}

export default AssignSeats
