export function createTimeSlots(durationHours) {
    let result = [];
    let startHour = 9; // Assuming we start at 9:00am
  
    // Continue while end hour is less than or equal to 12 hours from start time
    while (true) {
      let endHour = startHour + durationHours;
      let startTime =
        startHour < 12
          ? `${startHour}:00am`
          : startHour === 12
          ? `${startHour}:00pm`
          : `${startHour - 12}:00pm`;
      let endTime =
        endHour < 12
          ? `${endHour}:00am`
          : endHour === 12
          ? `${endHour}:00pm`
          : endHour > 12
          ? `${endHour - 12}:00pm`
          : `${endHour}:00am`;
  
      // Break the loop if endHour is more than 12 hours from start
      if (endHour > 18) break;
  
      result.push(`${startTime} - ${endTime}`);
      startHour++;
    }
    return result;
  }
  