import { useState } from "react";
import Example1 from "./components/Example1/Example1.jsx";
import styles from "./App.module.css";

const COMPONENTS = [
  {
    id: 1,
    component: <Example1 />,
    title: "Example 1",
  }
]

export default function App() {
  const [component, setComponent] = useState(COMPONENTS[0]);

  return (
    <div className={styles.app}>
      <div className={styles.select}>
        <select
          onChange={(e) => setComponent(COMPONENTS.find(component => component.id === e.target.value)[0])}
        >
          {COMPONENTS.map(component => (
            <option key={component.id}>{component.title}</option>
          ))}
        </select>
      </div>
      {component ? component.component : ''}
    </div>
  );
}
