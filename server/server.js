// change the below imports to import statements
import jsonServer from "json-server";
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
import { getDaysInMonthArray, getReservationsByDay, getReservationsByMonth } from "./utils.js";

const PORT = 5000;
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get("/echo", (req, res) => {
  res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  console.log("INTERCEPTING@", req.method, req.url);
  if (req.method === "POST") {
    req.body.createdAt = new Date().toISOString(); // Date.now(); // millis
  }
  // Continue to JSON Server router
  next();
});

server.post("/create-reservation", async (req, res) => {
  const dbState = router.db.getState();

  let newId = router.db.get("reservations").createId().value();

  // * router.db is a lodash object which has a bunch of methods and supports method chaining. to evalutate final result call .value() method on it.

  // ! write to db state directly
  dbState.reservations.push({ id: newId, ...req.body });

  // * avoiding setState as it's a heavy operation
  // router.db.setState({ reservations: [...dbState.reservations, req.body] })

  router.db.write();
  return res.json({ status: "success" });
});

function getDayCapacityForService(reservations, service_id, month) {
  let filteredServices = reservations.filter(
    (reservation) => reservation.service_id == service_id
  );

  let staffs = router.db.get("staffs").value();

  let filteredStaffs = staffs.filter((staff) => {
    return staff.skill_id == service_id;
  });

  let availableCapacity = 0;
  filteredStaffs.forEach((staff) => {
    availableCapacity += staff.capacity;
  });

  let service = router.db.get("services").getById(service_id).value();

  let reservedCapacity = 0;
  filteredServices.forEach((reservation) => {
    reservedCapacity += service.duration;
  });

  // todo: check available capacity for the day
  if (availableCapacity <= reservedCapacity) {
    return "unavailable";
  }

  return availableCapacity - reservedCapacity;
}



server.post("/find-unavailable-dates", (req, res) => {
  let monthDateObj = new Date(req.body.month);
  let service_id = req.body.service_id;
  let allReservations = router.db.get("reservations").value();

  let response = {};

  let serviceReservationsByMonth = getReservationsByMonth(
    allReservations,
    new Date(monthDateObj)
  ).filter((reservation) => {
    return reservation.service_id == service_id;
  });

  // * slice only the upcoming days of the month for current month
  let sliceLimit =
    monthDateObj.getMonth() == new Date().getMonth()
      ? new Date().getDate() - 1
      : 0;

  let remainingDaysOfMonth = getDaysInMonthArray(
    monthDateObj.getMonth(),
    new Date().getFullYear()
  ).slice(sliceLimit);

  remainingDaysOfMonth.forEach((dayObj) => {
    let reservationsByDay = getReservationsByDay(
      serviceReservationsByMonth,
      new Date(dayObj)
    );
    response[dayObj.getDate()] = getDayCapacityForService(
      reservationsByDay,
      service_id,
      dayObj
    );
  });

  return res.json(response);
});

// Use default router
server.use(router);
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
