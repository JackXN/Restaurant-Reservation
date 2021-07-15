/**
 * List handler for reservation resources
 */
 const service = require("./reservations.service");
 const asyncBoundary = require("../errors/asyncErrorBoundary");
 const hasProperties = require("../errors/hasProperties");
 
 const VALID_PROPERTIES = [
   "first_name",
   "last_name",
   "mobile_number",
   "reservation_date",
   "reservation_time",
   "people",
   "reservation_id",
   "status",
   "created_at",
   "updated_at",
 ];
 
 function hasOnlyValidProperties(req, res, next) {
   const { data = {} } = req.body;
   const invalidFields = Object.keys(data).filter(
     (field) => !VALID_PROPERTIES.includes(field)
   );
 
   if (invalidFields.length) {
     return next({
       status: 400,
       message: `Invalid field(s): ${invalidFields.join(", ")}`,
     });
   }
   return next();
 }
 
 const hasRequiredProperties = hasProperties(
   "first_name",
   "last_name",
   "mobile_number",
   "reservation_date",
   "reservation_time",
   "people"
 );
 
 const hasRequiredUpdateProperties = hasProperties("status");
 
 function hasPeople(req, res, next) {
   const { people } = req.body.data;
   const validNum = Number.isInteger(people);
   if (!validNum || people <= 0) {
     return next({
       status: 400,
       message: "Number of people entered is an invalid number.",
     });
   }
   next();
 }
 
 function validateResDate(req, res, next) {
   const date = req.body.data.reservation_date;
   let year;
   if (date) {
     let parts = date.split("-");
     year = Number(parts[0]);
   }
   if (!date || isNaN(year) || year < 1000) {
     next({
       status: 400,
       message: `reservation_date is invalid`,
     });
   }
   next();
 }
 
 function validateResTime(req, res, next) {
   const time = req.body.data.reservation_time;
   let hours;
   if (time) {
     hours = Number(time.split(":")[0]);
   }
   if (!time || isNaN(hours)) {
     next({
       status: 400,
       message: `reservation_time is invalid`,
     });
   }
   next();
 }
 
 async function reservationExists(req, res, next) {
   const { reservation_id } = req.params;
   const reservation = await service.read(reservation_id);
   if (!reservation) {
     next({
       status: 404,
       message: `reservation id: ${reservation_id} could not be found`,
     });
   }
   res.locals.reservation = reservation;
   next();
 }
 
 function hasValidDateTime(req, res, next) {
   const { reservation_date, reservation_time } = req.body.data;
   let today = new Date();
   let resDateTime = reservation_date + " " + reservation_time;
   let resAsDate = new Date(resDateTime);
 
   const timeReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
 
   if (reservation_time.match(timeReg) === null) {
     return next({
       status: 400,
       message: `reservation_time is not a valid time.`,
     });
   }
   if (reservation_time < "10:30" || reservation_time > "21:30") {
     return next({
       status: 400,
       message: "Reservation must be between 10:30AM and 9:30PM.",
     });
   }
   if (isNaN(resAsDate.getDate())) {
     return next({
       status: 400,
       message: "reservation_date is not a valid date.",
     });
   }
   if (resAsDate < today) {
     return next({
       status: 400,
       message: "Reservation must be booked for future date.",
     });
   }
 
   if (resAsDate && resAsDate.getDay() === 2) {
     return next({
       status: 400,
       message: "Restaurant closed on Tuesdays.",
     });
   }
   next();
 }
 
 function read(req, res) {
   res.json({ data: res.locals.reservation });
 }
 
 async function list(req, res, next) {
   const { date, mobile_number } = req.query;
   if (date) {
     let reservationsByDate = await service.listByDate(date);
     res.json({ data: reservationsByDate });
   } else if (mobile_number) {
     let reservationsByNum = await service.search(mobile_number);
     res.json({ data: reservationsByNum });
   } else {
     let reservations = await service.list();
     res.json({ data: reservations });
   }
 }
 
 async function create(req, res) {
   const newReservation = await service.create(req.body.data);
   res.status(201).json({ data: newReservation[0] });
 }
 
 async function updateStatus(req, res, next) {
   const { reservation_id } = req.params;
   const updatedReservation = {
     ...req.body.data,
     reservation_id,
   };
   const updatedRes = await service.updateStatus(updatedReservation);
   res.json({ data: updatedRes[0] });
 }
 
 function hasNotFinishedStatus(req, res, next) {
   const { status } = res.locals.reservation;
   if (status === "finished") {
     return next({
       status: 400,
       message: `Status ${status} cannot be updated.`,
     });
   }
   next();
 }
 

 
 function hasBookedStatus(req, res, next) {
   const { status } = req.body.data;
   if (status === "seated" || status === "finished") {
     return next({
       status: 400,
       message: `Reservation status ${status} is invalid.`,
     });
   }
   return next();
 }
 
 function hasValidStatus(req, res, next) {
   //check the status in the request
   const { status } = req.body.data;
   const validStatus = ["booked", "seated", "finished", "cancelled"];
   if (!validStatus.includes(status)) {
     return next({
       status: 400,
       message: `Status ${status} is not valid.`,
     });
   }
   next();
 }
 
 async function update(req, res, next) {
   const { reservation_id } = res.locals.reservation;
 
   const updatedReservation = {
     ...req.body.data,
     reservation_id,
   };
   const updatedRes = await service.update(updatedReservation);
   res.json({ data: updatedRes });
 }
 
 module.exports = {
   list: asyncBoundary(list),
   read: [asyncBoundary(reservationExists), read],
   create: [
     hasOnlyValidProperties,
     hasRequiredProperties,
     hasPeople,
     validateResDate,
     validateResTime,
     hasValidDateTime,
     hasBookedStatus,
     asyncBoundary(create),
   ],
   updateStatus: [
     hasRequiredUpdateProperties,
     asyncBoundary(reservationExists),
     hasNotFinishedStatus,
     hasValidStatus,
     asyncBoundary(updateStatus),
   ],
   update: [
     hasRequiredProperties,
     hasOnlyValidProperties,
     asyncBoundary(reservationExists),
     hasPeople,
     hasValidDateTime,
     hasBookedStatus,
     asyncBoundary(update),
   ],
 };