import React, {useState, useEffect} from 'react'
import {getReservation} from '../utils/api';
import {useParams} from 'react-router-dom';
import ReservationForm from './ReservationF';



function EditReservations() {

  const {reservation_id} = useParams();
  const [initialFormData, setInitialFormData] = useState({reservation_id: reservation_id});


  useEffect(() => {
    Promise.resolve(getReservation(reservation_id).then(setInitialFormData))
  }, [reservation_id])

  return (
    <main className = 'container'>
<div className='row'>
  <div className='col'>
    <div>
      <h1>Edit Reservation:</h1>
    </div>
    {<ReservationForm initialFormData = {initialFormData}/>}
  </div>
</div>


    </main>
  )
}

export default EditReservations
