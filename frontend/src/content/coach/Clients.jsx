import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import AddButton from "../../components/AddButton/AddButton";
import ClientItem from "../../components/ClientItem/ClientItem";
import ClientOverview from "../../components/ClientOverview/ClientOverview";
import { useSubscription, gql } from "@apollo/client";
import { GRAPHQL_ENDPOINT } from "../../App";

const CLIENT_QUERY = gql`
  subscription GetData($id: Int!) {
    coach(where: { id: { _eq: $id } }) {
      clients {
        name
        id
        height
        email
        postal
        phone
        profession
        surname
        weight
        user_id
        dob
        created_at
        coach_id
        city
        address
      }
    }
  }
`;

export default function Clients() {
  const clientsSubscription = useSubscription(CLIENT_QUERY, {
    variables: {
      id: 15,
    },
  });
  const { data, errors } = clientsSubscription;

  const [selectedClient, setSelectedClient] = useState(undefined);

  const onClickItem = (e) => {
    let id = parseInt(e.currentTarget.getAttribute("data-id"));
    const client = data.coach[0].clients.find((item) => item.id === id);
    setSelectedClient(client);
  };
  return (
    <section className="clients">
      <h1 className="hidden">Clients</h1>
      <div className="clients-left">
        <div className="clients-header">
          <SearchBar />
          <AddButton text="Add" />
        </div>
        <div className="clients-list">
          <div className="client-list-header smalltext">
            <p>CLIENT NAME</p>
            <p>STATUS</p>
          </div>
          {data === undefined
            ? console.log("No data")
            : data.coach[0].clients.map((item) => (
                <ClientItem
                  key={item.id}
                  id={item.id}
                  surname={item.surname}
                  name={item.name}
                  onClick={onClickItem}
                />
              ))}
        </div>
      </div>
      <div className="clients-right">
        <ClientOverview
          client={data === undefined ? undefined : selectedClient}
        />
      </div>
    </section>
  );
}
