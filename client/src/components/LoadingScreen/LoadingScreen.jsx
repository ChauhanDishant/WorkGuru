import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "./../../../src/App.css";

function LoadingScreen() {
  const loadingRef = useRef(null);
  const logoTextRef = useRef(null);

  useEffect(() => {
    // Logo text animation
    gsap.fromTo(
      logoTextRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 2, delay: 0.5 }
    );

    // Loading screen fade out
    gsap.fromTo(
      loadingRef.current,
      { opacity: 1 },
      { opacity: 0, display: "none", duration: 1.5, delay: 3.5 }
    );
  }, []);

  return (
    <div className="loading-page" ref={loadingRef}>
      <svg id="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <text
          x="50%"
          y="50%"
          text-anchor="middle"
          fill="white"
          font-family="Michroma"
          font-size="500"
          dy=".35em"
        >
          W
        </text>
      </svg>

      <div className="name-container">
        <div className="logo-name" ref={logoTextRef}>
          Work-Guru
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
