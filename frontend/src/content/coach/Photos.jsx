import React, { useEffect, useState } from "react";
import "../../styles/photos.css";
import { Link, useParams } from "react-router-dom";
import ArrowLeft from "../../assets/images/svg/ArrowLeft.svg";
import ArrowRight from "../../assets/images/svg/ArrowRight.svg";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import Breadcrumb from "../../assets/images/breadcrumbs.png";
import { LoaderLarge } from "../../components/Loaders/Loaders";

const GET_CLIENT_PHOTOS = gql`
  query MyQuery($id: Int!) {
    weighins(
      where: { user: { clients: { id: { _eq: $id } } } }
      order_by: { date: desc }
    ) {
      id
      key
      mimetype
      originalName
      user_id
      date
    }
    weight(
      where: { user: { clients: { id: { _eq: $id } } } }
      distinct_on: date
      order_by: { date: asc }
    ) {
      date
      created_at
      updated_at
      weight
      user_id
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

export default function Photos() {
  const { id } = useParams();

  const [matches, setMatches] = useState([]);
  const [nav, setNav] = useState(undefined);
  const [image, setImage] = useState(null);

  const [GET_IMAGES] = useMutation(GENERATE_LINK);

  const [FETCH_DATA, { data }] = useLazyQuery(GET_CLIENT_PHOTOS, {
    variables: {
      id: id,
    },
  });

  const runFetch = async () => {
    await FETCH_DATA();
  };

  useEffect(async () => {
    async function effect() {
      if (data) {
        let dataSet = [];
        console.log(data);
        data.weighins.map((image) => {
          data.weight.map((weight) => {
            if (image.date === weight.date) {
              dataSet.push({
                key: image.key,
                date: image.date,
                weight: weight.weight,
              });
            }
          });
        });
        console.log(dataSet);
        setMatches(dataSet);
      } else {
        runFetch();
      }
    }
    effect();
  }, [data]);

  if (!data) {
    return <LoaderLarge />;
  }

  console.log(nav);

  const changeData = async (index) => {
    const { data } = await GET_IMAGES({
      variables: {
        key: matches[index].key,
      },
    });
    console.log(data.getS3ImageUrl.viewingLink);
    setImage(data.getS3ImageUrl.viewingLink);
  };

  const renderButtons = () => {
    return matches.map((item, index) => {
      return (
        <button
          onClick={(e) => {
            setNav(index);
            changeData(index);
          }}
          className="client-photos-button shadow"
        >
          {item.weight}kg - {String(item.date)}
        </button>
      );
    });
  };

  return (
    <>
      <section className="client-photos-container">
        <div className="client-workout-breadcrumbs">
          <Link className="client-workout-breadcrumbs--link" to="/clients">
            All clients
          </Link>
          <img
            className="client-workout-breadcrumbs-icon"
            src={Breadcrumb}
            alt="photo of client"
          ></img>
          <Link
            className="client-workout-breadcrumbs--link"
            to={"/client/" + id}
          >
            Maxime Vercruysse
          </Link>{" "}
          <img
            className="client-workout-breadcrumbs-icon"
            src={Breadcrumb}
            alt="photo of client"
          ></img>
          <Link className="client-workout-breadcrumbs--link">
            Weigh in photos
          </Link>
        </div>
        <div className="rounded shadow client-photos">
          <div className="client-photos-header">
            <h1>Client weigh ins</h1>
            <Link
              to={"/client/" + id}
              className="client-photos-exit-button shadow"
            >
              Close photos
            </Link>
          </div>
          <div className="client-photos-buttons">
            {matches === undefined ? "" : renderButtons()}
          </div>
          <div className="client-photos-preview">
            <div className="hidden client-photos-nav">
              <img className="nav-arrow" alt="Arrow" src={ArrowLeft} />
              <p>1/1</p>
              <img className="nav-arrow" alt="Arrow" src={ArrowRight} />
            </div>
            <img
              src={image !== null ? image : ""}
              alt="Picture of weighin client"
            />
          </div>
        </div>
      </section>
    </>
  );
}
