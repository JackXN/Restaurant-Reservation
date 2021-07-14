
const knex = require("../db/connection");

function create(newReservation) {
  return knex("reservations").insert(newReservation).returning("*");
}

function listByDate(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function list() {
  return knex("reservations as r")
    .select("r.*")
    .orderBy("reservation_date")
    .orderBy("reservation_time");
}

function read(id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: Number(id) })
    .then((reservation) => reservation[0]);
}

function updateStatus(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update({ status: updatedReservation.status })
    .returning("*");
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((reservation) => reservation[0]);
}

module.exports = {
  create,
  listByDate,
  list,
  read,
  search,
  updateStatus,
  update,
};