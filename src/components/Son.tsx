import { memo, useContext, useEffect } from "react";
import { NumContxet } from "../App";

export default memo(
  ({ time }: { time: number }) => {
    const data = useContext(NumContxet);
    const obj = "000";
    console.log("子组件重新渲染");

    useEffect(() => {
      console.log("useEffect执行了");
    }, [obj]); // 每次渲染 obj 都是新对象
    useEffect(() => {
      console.log("son数据发生了变化", data.res);
    }, [data]);
    useEffect(() => {
      console.log("time", time);
    }, [time]);
    return <p>Son,{JSON.stringify(data)}</p>;
  },
  (preProps, curProps) => {
    console.log('preProps.time !== curProps.time',preProps.time !== curProps.time);
    
    return preProps.time !== curProps.time;
  }
);

//1、自增版本号
//2、页面样式
//3、发布修改
