import React, { useState, useEffect } from "react";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import { useStoreState } from "easy-peasy";
import { gql, useMutation, useQuery } from "@apollo/client";
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

const GENERATE_LINK = gql`
  mutation MyQuery($key: String!) {
    getS3ImageUrl(key: $key) {
      viewingLink
    }
  }
`;

export default function Progress() {
  const id = useStoreState((state) => state.user_id);

  const [file, setFile] = useState(null);
  const [pictures, setPictures] = useState([]);

  const [INSERT_FILE] = useMutation(UPLOAD_FILE);
  const [GET_IMAGES] = useMutation(GENERATE_LINK);

  const { data: images, loading } = useQuery(IMAGES, {
    variables: {
      id: id,
    },
  });

  const fetchURL = async () => {
    let array = [];
    images.weighins.map(async (item) => {
      const { data } = await GET_IMAGES({
        variables: {
          key: item.key,
        },
      });
      array.push(data.getS3ImageUrl.viewingLink);
    });

    setPictures(array);
  };

  useEffect(async () => {
    if (images) {
      await fetchURL();
    } else {
    }
  }, [images]);

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
        `https://174.138.12.116:5000/storage/upload`,
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

      //setPictures(pictures.push(String(URL.createObjectURL(file))));

      fetchURL();
    }
  };

  const renderPictures = () => {
    return pictures.map((link, index) => {
      return (
        <div key={index}>
          <img src={link} width="100" height="100" alt="" />
        </div>
      );
    });
  };

  if (!data) {
    return <LoaderLarge />;
  }
  if (loading) {
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
          <input type="submit" className="button" value="Submit photo" />
        </form>
        <p className="client-dashboard-subtext client-progress-smalltitle">
          Your previous weigh-ins
        </p>
        <div className="client-progress-previousweighins">
          {pictures === undefined ? <p>Nothing found</p> : renderPictures()}
        </div>
      </section>
    </div>
  );
}
