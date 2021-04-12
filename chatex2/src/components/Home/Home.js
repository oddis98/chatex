import React, { useEffect } from "react";
import "./Animate.css";
import anime from "animejs";

const Home = () => {
  useEffect(() => {
    const container = document.querySelector(".container");
    for (var i = 0; i <= 30; i++) {
      const blocks = document.createElement("div");
      blocks.classList.add("block");
      container.appendChild(blocks);
    }

    animateBlocks();
    return () => {};
  });

  const animateBlocks = () => {
    anime({
      targets: ".block",
      translateX: () => {
        return anime.random(-1200, 1200);
      },
      translateY: () => {
        return anime.random(-500, 500);
      },
      scale: () => {
        return anime.random(1, 5);
      },
      easing: "linear",
      duration: 10000,
      delay: anime.stagger(10),
      complete: animateBlocks,
    });
  };

  return (
    <div className="container">
      <h2>ChatEx</h2>
      <h2 id="subText">Free. Private. Simple.</h2>
    </div>
  );
};

export default Home;
