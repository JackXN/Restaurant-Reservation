const { whereNot, returning } = require('../db/connection');
const knex = require('../db/connection');




const create = (newReservation) => {
    return knex('reservations').insert(newReservation).returning('*')
}

const listByDate = (date) => {
    return knex('reservations')
    .select('*')
    .where({reservation_date: date})
    .whereNot({ status: 'finished'})
    .orderBy({reservation_time})
}



const list = () => {
    return knex('reservations')
    .select('*')
    .orderBy('reservation_time')
}

const read = (id) => {
    return knex('reservations')
    .select('*')
    .where({reservation_id: Number(id)})
    .then((reservation) => reservation[0])
}


const updateStatus = (updatedReservation) => {
    return knex('reservations')
    .select('*')
    .where({reservation_id: updatedReservation.reservation_id})
    .update({status: updatedReservation.status})
    .returning('*')
}

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

  const update = (updatedReservation) => {
return knex('reservations')
.select('*')
.where({reservation_id: updatedReservation.reservation_id})
.update(updatedReservation, '*')
.then((reservation) => reservation[0])
  }


module.exports = {
   create,
   listByDate,
   list,
   read,
   search,
   updateStatus,
   update,
}