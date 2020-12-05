import React from "react";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import { useStoreState, useLocalStore } from "easy-peasy";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { LoaderLarge } from "../../components/Loaders/Loaders";
import "../../styles/progress.css";

export default function Progress() {
  const id = useStoreState((state) => state.user_id);

  return (
    <div>
      <MobileHeader />
      <section className="section client-progress">
        <h1 className="client-dashboard-hero">Your progress</h1>
        <p className="client-dashboard-subtext">View your progress here.</p>
        <article className="client-progress-stats shadow rounded">
          <h2 className="hidden">Stats</h2>
          <p className="progress-stats-left">Current weight:</p>
          <p className="progress-stats-right">89.8kg</p>
          <p className="progress-stats-left">Steps today:</p>
          <p className="progress-stats-right">2301</p>
          <p className="progress-stats-left">Avg. weight:</p>
          <p className="progress-stats-right">88.5kg</p>
          <p className="progress-stats-left">Avg. steps:</p>
          <p className="progress-stats-right">3400</p>
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
