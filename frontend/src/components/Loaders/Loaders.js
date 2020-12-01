import React from "react";
import Loader from "react-loader-spinner";

export const LoaderLarge = () => (
  <div className="loader">
    <Loader type="ThreeDots" color="var(--green)" height={100} width={100} />
  </div>
);

export const LoaderSmall = () => (
  <div className="loader">
    <Loader type="ThreeDots" color="var(--green)" height={28} width={28} />
  </div>
);
