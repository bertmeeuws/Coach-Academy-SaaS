import React from "react";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import { useStoreState } from "easy-peasy";
import { gql, useMutation } from "@apollo/client";

const AUTHORIZE = gql`
  mutation MyMutation($id: IdInput!) {
    getSteps(id: $id) {
      url
    }
  }
`;

export default function Settings() {
  const id = useStoreState((state) => state.user_id);

  const [GETSTEP] = useMutation(AUTHORIZE);

  const getSteps = async () => {
    const { data, error } = await GETSTEP({
      variables: {
        id: { id: id },
      },
    });
    console.log(error);
    console.log(data.getSteps.url);
    window.location.href = data.getSteps.url;
  };

  return (
    <div>
      <MobileHeader />
      <div className="client-settings">
        <h1 className="client-settings-title">
          In order for us to see your steps and weight in Google Fit you must
          authorize our app.
        </h1>
        <button
          className="button synchronize-google-button"
          onClick={() => getSteps()}
        >
          Synchronize google account
        </button>
      </div>
    </div>
  );
}
