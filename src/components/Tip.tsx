export default (props:any) => {
  console.log("最大版本号组件被重新创建了",props);

  return <p>最大版本号是{!props.tips ? '0.0.0.0': props.tips}</p>;
};
