import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cross as Hamburger } from "hamburger-react";
import MobileMenu from "../../components/MobileMenu/MobileMenu";
import { TweenLite, Power3 } from "gsap";
import { format } from "date-fns";
import { gql, useLazyQuery } from "@apollo/client";
import { eoLocale } from "date-fns/locale/eo";
import { useStoreState, useStoreActions } from "easy-peasy";
import Dummy from "../../assets/images/profile1.jpg";
import axios from "axios";

const GET_AVATAR = gql`
  query GetImage($id: Int!) {
    avatars(
      order_by: { id: desc }
      where: { id: {}, user_id: { _eq: $id } }
      limit: 1
    ) {
      user_id
      mimetype
      originalName
      key
      id
    }
  }
`;

export default function MobileHeader() {
  const id = useStoreState((state) => state.user_id);
  const profilePic = useStoreState((state) => state.profile_pic);

  const [isOpen, setOpen] = useState(false);

  const ADD_AVATAR_STORE = useStoreActions((actions) => actions.addProfilePic);

  const [FETCH_AVATAR, { data, loading }] = useLazyQuery(GET_AVATAR, {
    variables: {
      id: id,
    },
  });

  const fetchURL = async (data) => {
    console.log(data);
    //console.log(item);
    axios
      .get("http://host.docker.internal:3001/storage/file" + data.key)
      .then((response) => {
        //setAvatar(response.data.viewingLink);
        console.log(response.data.viewingLink);
        ADD_AVATAR_STORE(response.data.viewingLink);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (data) {
      if (data.avatars.length !== 0) {
        if (profilePic === null) {
          fetchURL(data.avatars[0]);
        }
      }
    } else {
      FETCH_AVATAR();
    }
  }, [data]);

  const clicked = () => {
    console.log("button-transparent");
    setOpen(false);
    if (isOpen === false) {
      TweenLite.to(".mobile-menu", 0.2, {
        left: "0",
        ease: Power3.easeOut,
      });
      TweenLite.from(".menu-list-item", 0.2, {
        opacity: "0",
        translateX: "-200",
        stagger: 0.1,
        ease: Power3.easeOut,
      });
    } else {
      TweenLite.to(".mobile-menu", 0.8, {
        left: "-100vw",
        ease: Power3.easeOut,
      });
    }
  };

  const date = format(new Date(), "dddd, DD MMMM YYYY", {
    locale: eoLocale,
  });

  return (
    <>
      <MobileMenu clicked={clicked} />

      <header className="client-header">
        <Hamburger
          color="var(--darkblue)"
          zindex="10"
          toggled={isOpen}
          toggle={setOpen}
          label="Show menu"
          onToggle={(toggled) => {
            if (toggled) {
              TweenLite.to(".mobile-menu", 0.8, {
                left: "0",
                ease: Power3.easeIn,
              });
              TweenLite.from(".menu-list-item", 0.5, {
                opacity: "0",
                translateX: "-200",
                stagger: 0.1,
                ease: Power3.easeIn,
              });
            } else {
              TweenLite.to(".mobile-menu", 0.8, {
                left: "-100vw",
                ease: Power3.easeOut,
              });
            }
          }}
          rounded
        />

        <p className="header-date">{date}</p>

        <Link to="/clientedit">
          {!data ? (
            ""
          ) : (
            <img
              src={profilePic === null ? Dummy : profilePic}
              className="shadow"
              height="46"
              width="46"
              alt=""
            />
          )}
        </Link>
      </header>
    </>
  );
}
