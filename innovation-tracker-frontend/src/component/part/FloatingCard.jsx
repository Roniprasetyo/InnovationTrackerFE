import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";

const FloatingCard = () => {
  const cardWidth = 250;
  const cardHeight = 120;
  const offset = 20;

  const [position, setPosition] = useState(null);

  useEffect(() => {
    const x = window.innerWidth - cardWidth - offset;
    const y = window.innerHeight - cardHeight - offset;
    setPosition({ x, y });
  }, []);

  const handleStop = (e, data) => {
    const { innerWidth, innerHeight } = window;

    const corners = [
      { x: offset, y: offset },
      { x: innerWidth - cardWidth - offset, y: offset },
      { x: offset, y: innerHeight - cardHeight - offset },
      { x: innerWidth - cardWidth - offset, y: innerHeight - cardHeight - offset },
    ];

    const dist = (p1, p2) =>
      Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

    let nearestCorner = corners.reduce((prev, curr) =>
      dist(data, curr) < dist(data, prev) ? curr : prev
    );

    setPosition(nearestCorner);
  };

  if (!position) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      <Draggable position={position} onStop={handleStop} bounds="parent">
        <div
        className="d-flex flex-column align-items-center"
          style={{
            width: cardWidth,
            height: cardHeight,
            padding: "16px",
            color: "white",
            backgroundColor: "#0d6efd",
            boxShadow: "0 2px 10px rgba(13, 110, 253, 0.75)",
            borderRadius: "10px",
            cursor: "move",
            pointerEvents: "auto",
            position: "absolute",
            transition: "all 0.1s ease",
          }}
        >
          <h5>Total Score</h5>
          <div
            style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "16px",
            }}
            >
            <h1
            style={{ margin: 0, fontSize: "40px" }}
            >0
            </h1>
        </div>
        </div>
      </Draggable>
    </div>
  );
};

export default FloatingCard;
