import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Hello World</h2>
    </>
  );
}

export default App;
