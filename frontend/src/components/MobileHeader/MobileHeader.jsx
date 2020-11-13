import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Cross as Hamburger } from "hamburger-react";
import MobileMenu from "../../components/MobileMenu/MobileMenu";
import { TweenLite, Power3 } from "gsap";

export default function MobileHeader() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <MobileMenu />

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
                ease: Power3.easeOut,
              });
              TweenLite.from(".menu-list-item", 0.5, {
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
          }}
          rounded
        />

        <p className="header-date">Tuesday, 10 November 2020</p>
        <Link>
          <div className="header-profile"></div>
        </Link>
      </header>
    </>
  );
}
