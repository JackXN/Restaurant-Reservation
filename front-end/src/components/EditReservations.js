import React from 'react'
import {useHistory, useParams} from 'react-router-dom';
import {readReservation, editReservation} from '../utils/api';
import formatReservationDate from '../utils/api';
import formatReservationTime from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';



function EditReservations() {
    const history = useHistory();
    const params = useParams();
    const reservation_id = params.reservation_id;
    const initialFormState = {
        first_name: '',
        last_nameL:'',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: '',
        status: 'booked',
    }

    const [error,setError] = useState(null);
    const [reservation,setReservation] = useState({...initialFormState})

    useEffect(() => {
        async function loadReservation() {
            if(reservation_id) {
                const abortController = new AbortController.list();
                setError(null);
                readReservation(reservation_id, abortController.signal)
                .then(formatReservationDate)
                .then(formatReservationTime)
                .catch(error)
                return () => abortController.abort();
            }
        }

        loadReservation();

    }, [reservation_id]);

    const handleSubmit = event => {
        event.preventDefault();
        const abortController = new AbortController();
        if(reservation_id) {
            editReservation(reservation,abortController.signal)
            .then(() => {
                history.push(`/dashboard/?date=${reservation.reservation_date}`);
            })
            .catch(setError)
            return () => abortController.abort();
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
            <h1 className='text-center'>Edit Reservation</h1>
            <form onSubmit={handleSubmit}>


            </form>
        </div>
    )
}

export default EditReservations
