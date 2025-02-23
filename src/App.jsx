import { useState } from "react";
import Example1 from "./components/Example1/Example1.jsx";
import Example2 from "./components/Example2/Example2.jsx";
import styles from "./App.module.css";

const COMPONENTS = [
  {
    id: "example1",
    component: <Example1 />,
    title: "Example 1",
  },
  {
    id: "example2",
    component: <Example2 />,
    title: "Example 2",
  },
]

export default function App() {
  const [component, setComponent] = useState(COMPONENTS[0]);

  return (
    <div className={styles.app}>
      <div className={styles.select}>
        <select
          onChange={(e) => setComponent(COMPONENTS.find(component => component.id === e.target.value))}
        >
          {COMPONENTS.map(component => (
            <option
              key={component.id}
              value={component.id}
            >{component.title}</option>
          ))}
        </select>
      </div>
      {component ? component.component : ''}
    </div>
  );
}
