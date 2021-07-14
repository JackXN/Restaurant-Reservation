const knex = require('../db/connection');




const list = () => {
    return knex('tables').select('*');
}

const read = (tableId) => {
return knex('tables').select('*').where({table_id: tableId}).first();
}

const update = ({table_id, reservation_id}) => {
    return knex.transaction((trx) => {
        return knex('reservations')
        .transacting(trx)
        .where({reservation_id: reservation_id})
        .update({status: 'seated'})
        .then(() => {
            return knex('tables')
            .where({table_id: table_id})
            .update({reservation_id: reservation_id})
            .returning('*')
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
}


const finish = (table_id, reservation_id) => {
    return knex.transaction((trx) => {
        return knex('reservations')
        .transacting(trx)
        .where({reservation_id: reservation_id})
        .update({status: 'finished'})
        .returning('*')
        .then(() => {
            return knex('tables')
            .where({table_id: table_id})
            .update({reservation_id:null})
            .returning('*')
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
}

module.exports = {
    create,
    list,
    read,
    update,
    finish,
}