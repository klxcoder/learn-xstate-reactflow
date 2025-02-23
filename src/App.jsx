import { useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

// Define FSM
const fsmMachine = createMachine({
  id: "fsm",
  initial: "start",
  states: {
    start: { on: { NEXT: "processing" } },
    processing: { on: { SUCCESS: "final", FAIL: "trap" } },
    trap: {}, // Dead state (no transitions out)
    final: { type: "final" }, // Final state
    isolated: {} // Isolated state (no connections)
  }
});

// ReactFlow Edges
const edges = [
  { id: "e1", source: "start", target: "processing", label: "NEXT" },
  { id: "e2", source: "processing", target: "final", label: "SUCCESS" },
  { id: "e3", source: "processing", target: "trap", label: "FAIL" }
  // No edges for isolated (it's disconnected)
];

export default function FSMVisualizer() {
  const [state, send] = useMachine(fsmMachine);
  // ReactFlow Nodes
  const [nodes, setNodes] = useState([
    { id: "start", data: { label: "Start" }, position: { x: 0, y: 0 } },
    { id: "processing", data: { label: "Processing" }, position: { x: 200, y: 0 } },
    { id: "trap", data: { label: "Trap State" }, position: { x: 400, y: 50 } },
    { id: "final", data: { label: "Final State" }, position: { x: 200, y: 100 } },
    { id: "isolated", data: { label: "Isolated State" }, position: { x: 400, y: -50 } }
  ]);
  useEffect(() => {
    setNodes(prevNodes =>
      prevNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          style: {
            backgroundColor: state.matches(node.id) ? "lightgreen" : "white"
          }
        }
      }))
    );
    console.log("Current State:", state.value);
  }, [state]);

  return (
    <div className="app">
      <div style={{ width: "800px", height: "500px", border: "1px solid black" }}>
        <ReactFlow nodes={nodes} edges={edges} fitView />
      </div>
      <div className="buttons">
        <button onClick={() => send({ type: "NEXT" })} disabled={!state.matches("start")}>Next</button>
        <button onClick={() => send({ type: "SUCCESS" })} disabled={!state.matches("processing")}>
          Success
        </button>
        <button onClick={() => send({ type: "FAIL" })} disabled={!state.matches("processing")}>
          Fail
        </button>
      </div>
      <h1>Current state: {state.value}</h1>
    </div>
  );
}
