const knex = require('../db/connection');

const list = () => {
    return knex('reservations')
    .select('*')
    .whereNot({status: 'finished'})
    .orderBy('reservation_time')
}

module.exports = {
    list, 
}