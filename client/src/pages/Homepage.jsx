import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import deepCleaningImg from "../assets/deep-cleaning.webp";
import pestControlImg from "../assets/pest-control.webp";
import paintingImg from "../assets/painting.webp";
import useAppDataStore from "../store/appDataStore";
import { API_BASE_URL } from "../constants";


export default function Homepage() {
  const { services, setServices, setSelectedService, setActiveTab } =
    useAppDataStore();

  // * fetch services on moount
  useEffect(() => {
    fetch(`${API_BASE_URL}/services`)
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
        console.log(data);
      });
  }, []);

  // return <pre>{JSON.stringify(services, null, 2)}</pre>

  function handleBooking(item) {
    console.log(item);
    setSelectedService(item);
    setActiveTab("booking");
  }

  return (
    <div>
      <h1>Book your service now!</h1>
      <h3>Home Cleaning</h3>
      <CardsContainer_div>
        {services?.map((item) => (
          <Card_div key={item.name}>
            <div>{item.name}</div>
            <div>Price: {item.price}</div>
            <img src={deepCleaningImg}></img>
            <button onClick={() => handleBooking(item)}>Book now</button>
          </Card_div>
        ))}
      </CardsContainer_div>

      {/* <pre>{JSON.stringify(services, null, 2)}</pre> */}
    </div>
  );
}

const Card_div = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-shadow: 1px 1px 4px silver;

  img {
    width: 20vw;
  }
`;

const CardsContainer_div = styled.div`
  display: flex;
  flex-wrap: wrap;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;
