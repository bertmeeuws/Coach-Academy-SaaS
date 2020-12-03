import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Cross as Hamburger } from "hamburger-react";
import MobileMenu from "../../components/MobileMenu/MobileMenu";
import { TweenLite, Power3 } from "gsap";
import { format } from "date-fns";
import { eoLocale } from "date-fns/locale/eo";

export default function MobileHeader() {
  const [isOpen, setOpen] = useState(false);

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
        <Link>
          <div className="header-profile"></div>
        </Link>
      </header>
    </>
  );
}
