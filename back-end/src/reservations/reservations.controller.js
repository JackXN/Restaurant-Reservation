const reservationsService = require('./reservations.service');






async function list(req, res,next) {
  reservationsService
  .list()
  .then((data) => res.json({ data }))
  .catch(next)
}

module.exports = {
  list,
};
