import React from 'react'
import {useHistory, useLocation} from 'react-router-dom';
import {createReservation, editReservation} from '../utils/api';
import {today,formatDate,asDateString} from '../utils/date-time';
import ErrorAlert from '../layout/ErrorAlert';
import {changeStatus} from '../utils/api';

const newToday=today();



function ReservationForm({initialFormData}) {
    const history = useHistory();

    const isEdit = pathname.includes('edit');

    const isNew = pathname.includes('new');

    const [reservation,setReservation] = useState({...initialFormData});

    const [error,setError] = useState('');

    const [submitAttempt, setSubmitAttempt] = useState(false);

    useEffect(() => {
        let dataChose = new Date(initialFormData.reservation_date);
        if(isEdit) {
            setReservation({
                ...initialFormData,
                reservation_date: asDateString(dateChosen),
            })
        }

    }, [initialFormData])



    const validReservationDates = ({target}) => {
        const dateChosen = new Date(formatDate(target.value));
        const today = new Date(formatDate(newToday));
        const isNotTuesday = dateChosen.getDay() !== 2; 
        const isThisDayOrAfter = dateChosen.getDate() >= today.getDate();
        const isThisMonthOrAfter = dateChosen.getMonth() >= today.getMonth();
        const isThisYearOrAfter = dateChosen.getFullYear() >= today.getFullYear();
        const isAfterThisYear = dateChosen.getFullYear() - today.getFullYear() > 0;
    
        if (
            (isNotTuesday &&
              isThisDayOrAfter &&
              isThisMonthOrAfter &&
              isThisYearOrAfter) ||
            isAfterThisYear
          ) {
            setError("");
            setSubmitAttempt(false);
            setReservation(
              (form) => (form = { ...form, reservation_date: target.value })
            );
          } else {
            setReservation(
              (form) => (form = { ...form, reservation_date: target.value })
            );
            setError({
              message: "Please enter a valid date. (We are closed on tuesdays)",
            });
          }
      
  validReservationTimes();
    
    
    }

    return (
        <div>
            
        </div>
    )
}

export default ReservationForm
