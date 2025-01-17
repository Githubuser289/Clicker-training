import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color === "#000000" ? generateRandomColor() : color;
};

const generateRandomShape = () => {
  const shapes = ["circle", "square", "triangle", "rectangle"];
  return shapes[Math.floor(Math.random() * shapes.length)];
};

const App = () => {
  const [shapes, setShapes] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [clickedShapes, setClickedShapes] = useState(0);

  const containerRef = useRef(null);

  const startGame = () => {
    setIsRunning(true);
    setStartTime(Date.now());
    setShapes(
      Array.from({ length: 10 }, () => ({
        id: Math.random(),
        shape: generateRandomShape(),
        color: generateRandomColor(),
        x: Math.random() * 90,
        y: Math.random() * 90,
        dx: (Math.random() < 0.5 ? -1 : 1) * 0.2, // Reduced speed
        dy: (Math.random() < 0.5 ? -1 : 1) * 0.2, // Reduced speed
        clicked: false,
      }))
    );
  };

  const stopGame = () => {
    setIsRunning(false);
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    alert(`Ai făcut clic pe ${clickedShapes} obiecte! Timp total: ${elapsedTime} secunde.`);
    setShapes([]);
    setClickedShapes(0);
    setStartTime(null);
  };

  const handleShapeClick = (id) => {
    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.id === id ? { ...shape, color: generateRandomColor(), clicked: true } : shape
      )
    );
    setClickedShapes((prev) => prev + 1);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setShapes((prevShapes) =>
        prevShapes.map((shape) => {
          let newX = shape.x + shape.dx;
          let newY = shape.y + shape.dy;

          if (newX <= 0 || newX >= 90) shape.dx *= -1;
          if (newY <= 0 || newY >= 90) shape.dy *= -1;

          return { ...shape, x: newX, y: newY };
        })
      );
    }, 16);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="App">
      <div className="controls">
        <button onClick={startGame} disabled={isRunning}>
          Start
        </button>
        <button onClick={stopGame} disabled={!isRunning}>
          Stop
        </button>
      </div>
      <div className="container" ref={containerRef}>
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className={`shape ${shape.shape}`}
            style={{
              backgroundColor: shape.shape !== "triangle" ? shape.color : "transparent",
              borderColor: shape.shape === "triangle" ? `transparent transparent ${shape.color} transparent` : "",
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              opacity: shape.clicked ? 0.7 : 1, // Slight transparency for clicked shapes
            }}
            onClick={() => handleShapeClick(shape.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
