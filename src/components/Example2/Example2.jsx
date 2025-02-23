import { useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";
import ReactFlow, { Controls, Background, Handle } from "reactflow";
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
  {
    id: "click",
    source: "idle",
    sourceHandle: "t",
    target: "fetching",
    targetHandle: "t",
    label: "click",
  },
  {
    id: "failure",
    source: "fetching",
    sourceHandle: "t",
    target: "error",
    targetHandle: "t",
    label: "failure",
  },
  {
    id: "retry",
    source: "error",
    sourceHandle: "b",
    target: "fetching",
    targetHandle: "b",
    label: "retry",
  },
  {
    id: "success",
    source: "fetching",
    sourceHandle: "b",
    target: "idle",
    targetHandle: "b",
    label: "success",
  },
];

export default function Example2() {
  const [state, send] = useMachine(fsmMachine);
  // ReactFlow Nodes
  const [nodes, setNodes] = useState([
    {
      id: "idle",
      data: { label: "idle" },
      position: { x: 0, y: 0 },
      type: "customNode"
    },
    {
      id: "fetching",
      data: { label: "fetching" },
      position: { x: 200, y: 100 },
      type: "customNode"
    },
    {
      id: "error",
      data: { label: "error" },
      position: { x: 400, y: 0 },
      type: "customNode"
    },
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

  const nodeTypes = {
    customNode: ({ data }) => (
      <div className={styles.customNode}>
        <Handle type="source" position="top" id="t" />
        <div>{data.label}</div>
        <Handle type="source" position="bottom" id="b" />
        <Handle type="target" position="top" id="t" />
        <Handle type="target" position="bottom" id="b" />
      </div>
    )
  };

  return (
    <div className={styles.app}>
      <div style={{ width: "800px", height: "500px", border: "1px solid black" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          nodeTypes={nodeTypes}
        >
          <Controls />
          <Background />
        </ReactFlow>
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
