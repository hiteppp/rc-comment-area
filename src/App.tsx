import { createContext, useState } from "react";
import GrandParent from "./components/GrandParent";
import Waterfall from "./components/Waterfall";
export const NumContxet = createContext({ res: 1, count: 1 });

const App = () => {
  const [num, setNum] = useState(1);
  const [count, setCount] = useState(1);
  return (
    <>
      <NumContxet.Provider value={{ res: num, count }}>
        <button
          onClick={() => {
            setNum(num + 1);
          }}
        >
          点击想让他们都知道num
        </button>
        <button
          onClick={() => {
            setCount(count + 1);
          }}
        >
          点击想让他们都知道count
        </button>
        <GrandParent />
      </NumContxet.Provider>
    </>
  );
};

export default App;
