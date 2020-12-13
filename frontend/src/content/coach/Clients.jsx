import React, { useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import AddButton from "../../components/AddButton/AddButton";
import ClientItem from "../../components/ClientItem/ClientItem";
import ClientOverview from "../../components/ClientOverview/ClientOverview";
import { useSubscription, gql, useQuery } from "@apollo/client";
import { useStoreState } from "easy-peasy";

const CLIENT_QUERY = gql`
  query GetData($id: Int!) {
    coach(where: { user_id: { _eq: $id } }) {
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
        user {
          avatars(order_by: { id: desc }, limit: 1) {
            key
            id
            originalName
            mimetype
          }
        }
      }
    }
  }
`;

export default function Clients() {
  const id = useStoreState((state) => state.user_id);

  const { data, error } = useQuery(CLIENT_QUERY, {
    variables: {
      id: id,
    },
  });

  const [selectedClient, setSelectedClient] = useState(undefined);

  const onClickItem = (e) => {
    let id = parseInt(e.currentTarget.getAttribute("data-id"));
    const client = data.coach[0].clients.find((item) => item.id === id);
    setSelectedClient(client);
  };

  if (data) {
    console.log(data);
  }
  console.log(error);

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
                  avatar={item.user.avatars[0]}
                  onClick={onClickItem}
                />
              ))}
        </div>
      </div>

      <ClientOverview
        client={data === undefined ? undefined : selectedClient}
      />
    </section>
  );
}
