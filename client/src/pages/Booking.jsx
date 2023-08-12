import React, { useEffect, useState } from "react";
import useAppDataStore from "../store/appDataStore";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { addDays, format } from "date-fns";
import { API_BASE_URL } from "../constants";
import axios from "axios";
import { styled } from "styled-components";
import RadioGroup from "../components/RadioGroup";
import { createTimeSlots } from "../utils";


console.log(createTimeSlots(8));

function SlotPicker({ duration, setSelectedSlot }) {
  // todo: show slots by adding hours to the duration of task

  return (
    <SlotsContainer_div>
      <RadioGroup
        options={createTimeSlots(duration).map((slot) => ({
          label: slot,
          value: slot,
        }))}
        onChange={setSelectedSlot}
      />
    </SlotsContainer_div>
  );
}

const Slot_button = styled.button`
  box-shadow: 1px 1px 4px silver;
  padding: 1rem;
`;

const SlotsContainer_div = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export default function Booking() {
  const { selectedService, setActiveTab } = useAppDataStore();
  const [selectedDate, setSelectedDate] = useState();
  const [selectedSlot, setSelectedSlot] = useState();
  const [monthViewDate, setMonthViewDate] = useState();
  const [unavailableDates, setUnavailableDates] = useState([
    new Date(2023, 7, 1),
    new Date(2023, 7, 2),
  ]);
  const [availableDates, setAvailableDates] = useState([
    new Date("2023-9-1"),
    new Date(2023, 8, 2),
    new Date(2023, 8, 3),
  ]);

  const today = new Date();
  const MAX_FUTURE_DAYS = 45;
  const toDate = addDays(today, MAX_FUTURE_DAYS);

  useEffect(() => {
    console.log("SELECTED DATE UDPDATED @", selectedDate);
  }, [selectedDate]);

  let footer = <p>Please pick a day.</p>;
  if (selectedDate) {
    footer = <p>You picked {format(selectedDate, "PP")}.</p>;
  }

  // * fetch available dates on load
  useEffect(() => {
    handleMonthChange(today);
  }, [])

  function handleMonthChange(e) {
    console.log("MONTH CHANGED", e);
    setMonthViewDate(e);
    // todo: make an api call to fetch available dates for the month

    axios
      .post(API_BASE_URL + "/find-unavailable-dates", {
        service_id: selectedService.id,
        month: e,
      })
      .then((data) => {
        let datesObj = data.data;
        console.log("UNAVAILABLE DATES @", datesObj);
        let _unavailableDates = [];
        let _availableDates = [];
        Object.entries(datesObj).forEach((item) => {
          let dateNum = item[0];
          let status = item[1];

          let _date = new Date(
            e?.getFullYear(),
            e?.getMonth(),
            dateNum
          );

          if (status === "unavailable") {
            _unavailableDates.push(_date);
          } else {
            _availableDates.push(_date);
          }
        });

        setAvailableDates(_availableDates);
        setUnavailableDates(_unavailableDates);
      });
  }

  function handleBooking() {
    console.log("BOOKING");
    // todo: submit the selected date to make the booking

    const fieldData = {
      // id: 2, //* should be generated at server
      // user_id: 1, // * pass user id from auth
      // staff_id: 3, // * assign staff id at server
      // capacity: 8, // * passed under the service
      // cost: 500, // * passed under the service
      startDate: selectedDate,
      endDate: selectedDate,
      service_id: selectedService.id,
      slot: selectedSlot,
    };

    axios.post(API_BASE_URL + "/create-reservation", fieldData);

    // * refresh the available dates
    handleMonthChange(monthViewDate) 
  }

  return (
    <Container_div>
      <button onClick={() => setActiveTab("home")}>HOME</button>
      <h3>Lets book your cleaning day!</h3>
      <pre className="selected">{JSON.stringify(selectedService, null, 2)}</pre>
      <DayPicker
        fromDate={today}
        toDate={toDate}
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        onMonthChange={handleMonthChange}
        // selected={availableDates}
        modifiers={{
          available: availableDates,
          unavailable: unavailableDates,
        }}
        modifiersClassNames={{
          available: "highlight-date-available",
          unavailable: "highlight-date-unavailable",
        }}
        footer={footer}
      />
      {selectedDate && (
        <SlotPicker
          duration={selectedService?.duration || 8}
          setSelectedSlot={setSelectedSlot}
        />
      )}

      <button onClick={handleBooking}>Submit</button>
    </Container_div>
  );
}

const Container_div = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
