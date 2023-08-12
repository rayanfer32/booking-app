let today = new Date();

today.getDate();

export function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

let days = getDaysInMonth(1, today.getFullYear());

let daysArr = [];
for (let i = 1; i <= days; i++) {
  daysArr.push(i);
}
// let remainingDays = daysArr.slice(today.getDate() - 1);

/** 
 Example usage:
  let daysInFebruary2023 = getDaysInMonth(1, 2023); // February is 1 (0-based month index)
  console.log(daysInFebruary2023);
*/
export function getDaysInMonthArray(month, year) {
  // Use the year argument if provided, otherwise use the current year.
  year = year || new Date().getFullYear();

  // Create a date for the next month and then subtract one day
  // to get the last day of the requested month.
  let date = new Date(year, month, 1);
  let days = [];

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
}

export function getReservationsByMonth(reservations, dateObject) {
  return reservations.filter((reservation) => {
    const reservationDate = new Date(reservation.startDate);
    return (
      reservationDate.getMonth() === dateObject.getMonth() &&
      reservationDate.getFullYear() === dateObject.getFullYear()
    );
  });
}

export function getReservationsByDay(reservations, dateObject) {
  return reservations.filter((reservation) => {
    const reservationDate = new Date(reservation.startDate);
    return (
      reservationDate.getDate() === dateObject.getDate() &&
      reservationDate.getFullYear() === dateObject.getFullYear()
    );
  });
}