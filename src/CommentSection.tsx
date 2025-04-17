import { useEffect, useRef, useState } from "react";
import { CommentType } from "./interface";
import { fetchMoreData } from "./api/getData";
import ComentItem from "./ComentItem";
import InfiniteScroll from "./components/InfiniteScroll";
import PullToRefresh from "./components/PullToRefresh";
import { nanoid } from "nanoid";

export default () => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const pn = useRef<number>(0); //用于下拉加载, startIndex / 10
  const pullToPage = useRef<number>(0)
  let pageSum = useRef<number>(0)
  let canPullToFresh = useRef(false)
  //console.log('comments.length',comments.length);
  
  const init = async () => {
    try {
      let res = await fetchMoreData(0);
      setComments(res.comments);
      pageSum.current = Math.ceil(res.total / 10) //一共有多少页,42条数据算5页
    } catch (error) {
      console.log("err", error);
    }
  };
  useEffect(() => {
    init();
  }, []);
  const loadMoreHandler = () =>
    
    new Promise((r) => {
      console.log('pn.current',pn.current, pageSum.current);
      
      if(pn.current >= pageSum.current) return
      pn.current++
      if(pn.current >= pageSum.current) return
      pullToPage.current = pn.current > 3 ? (pn.current - 3) : 0
      fetchMoreData(pn.current).then((res) => {
        if (res.comments.length > 0) {
          setHasMore(true);
          setComments((oldComments) => {
            if(oldComments.length >= 30){
              canPullToFresh.current = true
              return [...oldComments.slice(10), ...res.comments]
            }else{
              return [...oldComments, ...res.comments]
            }
          });
        } else {
          setHasMore(false);
        }
      });
      r(comments);
    });
  const PullToLoadMore = () => {
    console.log("page", pullToPage.current);
    if(canPullToFresh.current){
      //console.log('66666',pn.current);
      //pn.current = pullToPage.current > 3 ? (pullToPage.current + 3) : 0
      fetchMoreData(pullToPage.current).then((res) => {
        pullToPage.current--
        pn.current--
        if(pullToPage.current < 0) canPullToFresh.current = false
        setComments((oldComments: CommentType[]) => {
          return [...res.comments, ...oldComments.slice(0, 20)];
        });
      });
    }
  };
  return (
    <div>
      {" "}
      <PullToRefresh
        onRefresh={PullToLoadMore}
      >
        <div style={{ minHeight: "100vh" }}>
          {comments.map((comment: CommentType) => {
            return <ComentItem item={comment} key={nanoid()} />;
          })}
        </div>
      </PullToRefresh>
      <InfiniteScroll hasMore={hasMore} loadMore={loadMoreHandler} key={nanoid()}/>
    </div>
  );
};
