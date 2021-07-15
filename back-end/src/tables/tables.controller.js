const service = require("./tables.service");
const asyncBoundary = require("../errors/asyncErrorBoundary");
const {
  read: readReservation,
} = require("../reservations/reservations.service");
const hasProperties = require("../errors/hasProperties");

const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id"];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter((field) => {
    !VALID_PROPERTIES.includes(field);
  });
  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(",")}`,
    });
  next();
}

const hasRequiredProperties = hasProperties("table_name", "capacity");

const hasRequiredUpdateProperties = hasProperties("reservation_id");

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);
  if (!table) {
    next({
      status: 404,
      message: `Table ${table_id} does not exist`,
    });
  }
  res.locals.table = table;
  next();
}

function hasValidTableName(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length < 2) {
    return next({
      status: 400,
      message: "table_name invalid.",
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await readReservation(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({
    status: 404,
    message: `reservation_id ${reservation_id} not found.`,
  });
}

function validCapacity(req, res, next) {
  const { people } = res.locals.reservation;
  const { capacity } = res.locals.table;

  if (capacity < people) {
    return next({
      status: 400,
      message: "Party size exceeds table capacity",
    });
  }
  next();
}

function read(req, res) {
  res.json({ data: res.locals.table });
}

function occupiedTable(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (reservation_id) {
    return next({
      status: 400,
      message: "Table is already occupied.",
    });
  }
  return next();
}

function tableOccupied(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (!reservation_id) {
    return next({
      status: 400,
      message: "Table is not occupied.",
    });
  }
  next();
}

async function list(req, res) {
  const result = await service.list();
  const sortedResult = result.sort((a, b) =>
    a.table_name > b.table_name ? 1 : -1
  );
  res.json({ data: sortedResult });
}

async function update(req, res) {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  const updatedTable = {
    reservation_id: reservation_id,
    table_id: table_id,
  };
  const data = await service.update(updatedTable);
  res.json({ data });
}

async function create(req, res) {
  const newTable = await service.create(req.body.data);
  res.status(201).json({ data: newTable });
}

async function finish(req, res) {
  const { table_id } = req.params;
  const { reservation_id } = res.locals.table;
  const reservation = await service.finish(table_id, reservation_id);

  res.json({ data: reservation });
}

function reservationNotSeated(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "seated") {
    return next({
      status: 400,
      message: "Reservation is already seated.",
    });
  }
  next();
}

module.exports = {
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidTableName,
    asyncBoundary(create),
  ],
  list: [asyncBoundary(list)],
  update: [
    hasOnlyValidProperties,
    hasRequiredUpdateProperties,
    asyncBoundary(tableExists),
    asyncBoundary(reservationExists),
    reservationNotSeated,
    occupiedTable,
    validCapacity,
    asyncBoundary(update),
  ],
  read: [tableExists, asyncBoundary(read)],
  finish: [asyncBoundary(tableExists), tableOccupied, asyncBoundary(finish)],
};