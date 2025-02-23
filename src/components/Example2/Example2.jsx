import { useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";
import ReactFlow from "reactflow";
import styles from "./Example2.module.css";
import "reactflow/dist/style.css";

// Define FSM
const fsmMachine = createMachine({
  id: "fsm",
  initial: "idle",
  states: {
    idle: {
      on: {
        click: "fetching",
      },
    },
    fetching: {
      on: {
        failure: "error",
        success: "idle",
      },
    },
    error: {
      on: {
        retry: "fetching",
      },
    },
  }
});

// ReactFlow Edges
const edges = [
  { id: "click", source: "idle", target: "fetching", label: "click" },
  { id: "failure", source: "fetching", target: "error", label: "failure" },
  { id: "retry", source: "error", target: "fetching", label: "retry" },
  { id: "success", source: "fetching", target: "idle", label: "success" },
];

export default function Example2() {
  const [state, send] = useMachine(fsmMachine);
  // ReactFlow Nodes
  const [nodes, setNodes] = useState([
    { id: "idle", data: { label: "idle" }, position: { x: 0, y: 0 } },
    { id: "fetching", data: { label: "fetching" }, position: { x: 200, y: 0 } },
    { id: "error", data: { label: "error" }, position: { x: 400, y: 0 } },
  ]);
  useEffect(() => {
    setNodes(prevNodes =>
      prevNodes.map(node => ({
        ...node,
        style: {
          ...node.style,
          backgroundColor: state.matches(node.id) ? "lightgreen" : "white"
        }
      }))
    );
    console.log("Current State:", state.value);
  }, [state]);

  return (
    <div className={styles.app}>
      <div style={{ width: "800px", height: "500px", border: "1px solid black" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
        />
      </div>
      <div className={styles.buttons}>
        <button onClick={() => send({ type: "click" })} disabled={!state.matches("idle")}>click</button>
        <button onClick={() => send({ type: "failure" })} disabled={!state.matches("fetching")}>failure</button>
        <button onClick={() => send({ type: "retry" })} disabled={!state.matches("error")}>retry</button>
        <button onClick={() => send({ type: "success" })} disabled={!state.matches("fetching")}>success</button>
      </div>
      <h1>Current state: {state.value}</h1>
    </div>
  );
}
