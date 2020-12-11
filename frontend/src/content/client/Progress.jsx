import React, { useState, useEffect, useReducer } from "react";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import { useStoreState, useLocalStore } from "easy-peasy";
import {
  gql,
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { LoaderLarge } from "../../components/Loaders/Loaders";
import "../../styles/progress.css";
import axios from "axios";

const GET_PROGRESS = gql`
  query GetProgress($id: Int!, $date: date!) {
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

const UPLOAD_FILE = gql`
  mutation insert_weighins($file: weighins_insert_input!) {
    insert_weighins(objects: [$file]) {
      returning {
        id
      }
    }
  }
`;

const IMAGES = gql`
  query getImages($id: Int!) {
    weighins(where: { user_id: { _eq: $id } }) {
      originalName
      mimetype
      key
      id
    }
  }
`;

export default function Progress() {
  const id = useStoreState((state) => state.user_id);

  const [file, setFile] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [submitted, setSubmitted] = useState(true);
  const [popUp, setPopUp] = useState("");

  //let pictures = [];

  const [INSERT_FILE] = useMutation(UPLOAD_FILE);

  const [GET_IMAGES, { data: images, loading }] = useLazyQuery(IMAGES, {
    variables: {
      id: id,
    },
  });

  const fetchURL = async () => {
    let pics = [];
    images.weighins.map((item) => {
      //console.log(item);
      axios
        .get("http://host.docker.internal:3001/storage/file" + item.key)
        .then((response) => {
          pics.push(response.data.viewingLink);
        })
        .catch((error) => {
          console.log(error);
        });
    });

    setPictures(pics);
    console.log(pictures);
  };

  useEffect(async () => {
    console.log("In use effect");
    if (images) {
      fetchURL();
    } else {
      await GET_IMAGES();
    }
  }, [images, submitted]);

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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (file !== null) {
      const form_data = new FormData();
      form_data.append("files", file);

      const response = await axios.post(
        `http://host.docker.internal:3001/storage/upload`,
        form_data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-path": "/upload-folder",
          },
          withCredentials: true,
        }
      );
      console.log({ response });

      const inserted_file = response.data[0];

      const { data } = await INSERT_FILE({
        variables: {
          file: {
            key: inserted_file.key,
            mimetype: inserted_file.mimetype,
            originalName: inserted_file.originalname,
            user_id: id,
          },
        },
      });
      console.log("File has been inserted");
      setSubmitted(!submitted);
    }
  };

  if (!data || loading) {
    return <LoaderLarge />;
  }

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
        <form onSubmit={handleUpload} className="client-weighins-form">
          <div className="client-weighins-browse">
            <input
              required
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
            />
          </div>
          <input type="submit" className="button" value="Submit video" />
        </form>
        <p className="client-dashboard-subtext client-progress-smalltitle">
          Your previous weigh-ins
        </p>
        <div className="client-progress-previousweighins">
          {pictures.map((link, index) => {
            return (
              <div key={index}>
                <img src={link} width="100" height="100" alt="" />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
