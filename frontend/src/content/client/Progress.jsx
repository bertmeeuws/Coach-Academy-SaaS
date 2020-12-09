import React from "react";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import { useStoreState, useLocalStore } from "easy-peasy";
import { gql, useQuery } from "@apollo/client";
import { LoaderLarge } from "../../components/Loaders/Loaders";
import "../../styles/progress.css";

const GET_PROGRESS = gql`
  subscription GetProgress($id: Int!, $date: date!) {
    weight(
      where: { user_id: { _eq: $id } }
      order_by: { date: desc, created_at: desc }
      distinct_on: date
      limit: 1
    ) {
      date
      weight
    }
    steps(
      where: { user_id: { _eq: $id }, _and: { date: { _eq: $date } } }
      distinct_on: date
      order_by: { date: desc, created_at: desc }
      limit: 1
    ) {
      steps
      date
    }
    weight_aggregate(
      where: { user_id: { _eq: $id } }
      distinct_on: date
      order_by: { date: desc, created_at: desc }
    ) {
      aggregate {
        avg {
          weight
        }
        min {
          weight
        }
        max {
          weight
        }
      }
    }
    steps_aggregate(
      distinct_on: date
      order_by: { date: desc, created_at: desc }
      where: { user_id: { _eq: $id } }
    ) {
      aggregate {
        avg {
          steps
        }
        min {
          steps
        }
        max {
          steps
        }
      }
    }
  }
`;

export default function Progress() {
  const id = useStoreState((state) => state.user_id);

  const getDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    return (today = yyyy + "-" + mm + "-" + dd);
  };

  const { data } = useQuery(GET_PROGRESS, {
    variables: {
      id: id,
      date: getDate(),
    },
  });

  if (!data) {
    return <LoaderLarge />;
  }
  console.log(data);

  return (
    <div>
      <MobileHeader />
      <section className="section client-progress">
        <h1 className="client-dashboard-hero">Your progress</h1>
        <p className="client-dashboard-subtext">View your progress here.</p>
        <article className="client-progress-stats shadow rounded">
          <h2 className="hidden">Stats</h2>
          <p className="progress-stats-left">Current weight:</p>
          <p className="progress-stats-right">
            {data.weight[0]
              ? data.weight[0].weight.toFixed(1) + "kg"
              : "Not found"}
          </p>
          <p className="progress-stats-left">Steps today:</p>
          <p className="progress-stats-right">
            {data.steps[0] ? data.steps[0].steps + " steps" : "Not found"}
          </p>
          <p className="progress-stats-left">Avg. weight:</p>
          <p className="progress-stats-right">
            {data.weight_aggregate
              ? data.weight_aggregate.aggregate.avg.weight.toFixed(1) + "kg"
              : "Not found"}
          </p>
          <p className="progress-stats-left">Avg. steps:</p>
          <p className="progress-stats-right">
            {data.steps_aggregate
              ? Math.round(data.steps_aggregate.aggregate.avg.steps) + " steps"
              : "Not found"}
          </p>
        </article>
        <h1 className="client-progress-title">View your weigh-ins</h1>
        <p className="client-progress-subtext">View your progress here.</p>
        <form className="client-weighins-form">
          <div className="client-weighins-browse">
            <input required type="file" />
          </div>
          <input type="submit" className="button" value="Submit video" />
        </form>
        <p className="client-dashboard-subtext client-progress-smalltitle">
          Your previous weigh-ins
        </p>
        <div className="client-progress-previousweighins">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </section>
    </div>
  );
}
