import { useState } from "react";
import Son from "./Son";

export default () => {
  const [time, setTime] = useState(0);
  const [count, setCount] = useState(0);
  return (
    <>
      <button
        onClick={() => {
          setTime(time + 1);
        }}
      >
        time加加加{time}
      </button>
      <button
        onClick={() => {
          //setTime(time + 1);
          setCount(count + 1);
        }}
      >
        count加加加{count}
      </button>
      <p>Parent</p>
      <Son time={time} />
    </>
  );
};
