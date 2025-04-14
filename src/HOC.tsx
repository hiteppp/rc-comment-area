import { useEffect, useRef } from 'react';
import useReactive from './hooks/useReactive'
import useEventListener from './hooks/useEventListener'
import useCreation from './hooks/useCreation'
let page = 1
const HOC = (Component:any) => ({list, onRequest, passBottomData,isOver}:any) => {
  console.log('listsssss',list);
  
  const loadingRef = useRef(null)
  const state = useReactive<any>({
    data: [], //渲染的数据
    scrollAllHeight: '80vh', // 容器的初始高度
    listHeight: 0, //列表高度
    itemHeight: 0, // 子组件的高度
    renderCount: 0, // 需要渲染的数量
    bufferCount: 6, // 缓冲的个数 
    start: 0, // 起始索引
    end: 0, // 终止索引
    currentOffset: 0, // 偏移量
    positions: [ //需要记录每一项的高度
      // index         // 当前pos对应的元素的下标
      // top;          // 顶部位置
      // bottom        // 底部位置
      // height        // 元素高度
      // dHeight        // 用于判断是否需要改变
    ], 
    initItemHeight: 50, // 预计高度
  })

  const allRef = useRef<any>(null) // 容器的ref
  const scrollRef = useRef<any>(null) // 检测滚动
  const ref = useRef<any>(null) // 检测滚动

  useEffect(() => {
    // 初始高度
    initPositions()
  }, [])

  const initPositions =  () => {
    const data = []
   // console.log('list',list);
    
    for (let i = 0; i < list.length; i++) {
      //@ts-ignore
      data.push({
        index: list[i].comment_id,
        height: state.initItemHeight,
        top: i * state.initItemHeight,
        bottom: (i + 1) * state.initItemHeight,
        dHeight: 0
      })
    }
    state.positions = [...data]
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 当 loading 元素进入视口时，发起请求加载更多数据
            console.log("isOverrrrrr", isOver);

            if (isOver) return;
            passBottomData(true);
          }
        });
      },
      {
        root: null,
        threshold: 0,
      }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      // if (loadingRef.current) {
      //     observer.unobserve(loadingRef.current);
      // }
    };
  }, []);
  useEffect(() => {

    // 子列表高度：为默认的预计高度
    const ItemHeight = state.initItemHeight

    // // 容器的高度
    const scrollAllHeight = allRef.current.offsetHeight

    // 列表高度：positions最后一项的bottom
    const listHeight = state.positions[state.positions.length - 1]?.bottom;

    //渲染节点的数量
    const renderCount = Math.ceil(scrollAllHeight / ItemHeight) 

    state.renderCount = renderCount
    state.end = renderCount + 1
    state.listHeight = listHeight
    state.itemHeight = ItemHeight
    console.log('state.start, state.end',state.start, state.end);
    
    state.data = list.slice(state.start, state.end)
  }, [allRef, list.length])

  useEffect(() => {
    setPostition()
  }, [ref.current])

  const setPostition = () => {
    const nodes = ref.current.childNodes //获取子节点标签组件的数组 NodeList(2) [p, div]
   // console.log('nodes',nodes);
    
    if(nodes.length === 0) return
    console.log(nodes);
    
    nodes.forEach((node: HTMLDivElement,index:number) => {
      if (!node) return;
      const rect = node.getBoundingClientRect(); // 获取对应的元素信息
      //console.log('node',node);
      
      console.log('state.positions[index]',state.positions[index].height);
      
      const oldHeight = state.positions[index].height | 50 // 旧的高度
      const dHeight = oldHeight - rect.height  // 差值
      if(dHeight){
        state.positions[index].height = rect.height //真实高度
        state.positions[index].bottom = state.positions[index].bottom - dHeight
        state.positions[index].dHeight = dHeight //将差值保留
      }
    });
    //  重新计算整体的高度
    const startId = 0
    //console.log('nodesssss',nodes,nodes[0].id,state.positions);

    const positionLength = state.positions.length;
    let startHeight = state.positions[0].dHeight;
    state.positions[0].dHeight = 0;

    for (let i = startId + 1; i < positionLength; ++i) {
      const item = state.positions[i];
      state.positions[i].top = state.positions[i - 1].bottom;
      state.positions[i].bottom = state.positions[i].bottom - startHeight;
      if (item.dHeight !== 0) {
        startHeight += item.dHeight;
        item.dHeight = 0;
      }
    }


    // 重新计算子列表的高度
    state.itemHeight = state.positions[positionLength - 1].bottom;
  }

  useCreation(() => {
    state.data = list.slice(state.start, state.end)

    if(ref.current){
      setPostition()
    }
  }, [state.end])

  useEventListener('scroll', () => {

    // 顶部高度
    const { scrollTop, clientHeight, scrollHeight } = scrollRef.current
    state.start =  binarySearch(state.positions, scrollTop);
    state.end  =  state.start + state.renderCount + 1
    //console.log('state',state.start,state.end);
    
    // 计算偏移量
    state.currentOffset = state.start > 0 ? state.positions[state.start - 1].bottom : 0

    // 滚动条距离的高度
   // const button = scrollHeight - clientHeight - scrollTop
    // console.log('button',button);
    
    // if(button === 0 && onRequest){
    //   onRequest(page++)
    // }
  }, scrollRef)

  // 二分查找
  const binarySearch = (list:any[], value: any) =>{
    let start:number = 0;
    let end:number = list.length - 1;
    let tempIndex = null;
    //console.log('binarySearch',start,end);
    
    while(start <= end){
      let midIndex = parseInt(String( (start + end)/2));
      let midValue = list[midIndex].bottom;
      if(midValue === value){
        return midIndex + 1;
      }else if(midValue < value){
        start = midIndex + 1;
      }else if(midValue > value){
        if(tempIndex === null || tempIndex > midIndex){
          //@ts-ignore
          tempIndex = midIndex;
        }
        end = end - 1;
      }
    }
    return tempIndex;
  }


  return (
    <div ref={allRef}>
      <div
        style={{
          height: state.scrollAllHeight,
          overflow: "scroll",
          position: "relative",
        }}
        ref={scrollRef}
      >
        {/* 占位，列表的总高度，用于生成滚动条 */}
        <div
          style={{
            height: state.listHeight,
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
          }}
        ></div>
        {/* 内容区域 */}
        <div
          ref={ref}
          style={{
            //transform: `translate3d(0, ${state.currentOffset}px, 0)`,
            // position: "relative",
            // left: 0,
            // top: 0,
            // right: 0,
          }}
        >
          {/* 渲染区域 */}
          {state.data.map((item: any) => {
            return (
              <div id={String(item.comment_id)} key={item.comment_id}>
                {/* 子组件 */}
                <Component item={item} />
              </div>
            );
          })}
        </div>
        <div
        ref={loadingRef}
        style={{
          textAlign: "center",
          marginTop: "20px",
          backgroundColor: "aqua",
          height: "20px",
        }}
      >
        加载更多...
      </div>
      </div>

    </div>
  );
}

export default HOC;
