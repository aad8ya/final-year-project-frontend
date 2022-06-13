import React, { useEffect, useState, useContext } from "react";
import Canvas from "./canvas";
import CanvasItems from "./canvasItems";
import Context from "../../store/context.js";

function BuilderContainer() {
  return (
    <div style={{ overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            // width: window.innerWidth * 0.79,
            // height: window.innerHeight * 0.89,
            width: "79%",
            height: "89%",
            margin: "10px",
            border: "2px solid #555",
          }}
        >
          <Canvas />
        </div>
        <div
          style={{
            paddingLeft: "5px",
            // width: window.innerWidth * 0.21,
            // height: window.innerHeight * 0.89,
            width: "21%",
            height: "89%",
            margin: "10px",
            border: "2px solid #222",
            overflowY: "scroll",
          }}
        >
          <CanvasItems width={"20%"} height={"80%"} />
        </div>
      </div>
    </div>
  );
}

export default BuilderContainer;
