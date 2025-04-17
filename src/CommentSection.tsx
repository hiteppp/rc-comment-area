import { useEffect, useRef, useState } from "react";
import { CommentType } from "./interface";
import { fetchMoreData } from "./api/getData";
import ComentItem from "./ComentItem";
import InfiniteScroll from "./components/InfiniteScroll";
import PullToRefresh from "./components/PullToRefresh";
import { List } from "antd";
export default () => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const pn = useRef<number>(1);
  const init = async () => {
    try {
      let res = await fetchMoreData(0);
      setComments(res.comments);
    } catch (error) {
      console.log("err", error);
    }
  };
  useEffect(() => {
    init();
  }, []);
  const loadMoreHandler = () =>
    new Promise((r) => {
      fetchMoreData(pn.current++).then((res) => {
        if (res.comments.length > 0) {
          setHasMore(true);
          setComments((oldComments) => {
            if(oldComments.length >= 30){
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
    console.log('page',pn.current);
    
  }
  return (
    <div>
      {" "}
      <PullToRefresh
        onRefresh={PullToLoadMore}
      >
        <div style={{ minHeight: "100vh" }}>
          {comments.map((comment: CommentType) => {
            return <ComentItem item={comment} key={comment.comment_id} />;
          })}
        </div>
      </PullToRefresh>
      <InfiniteScroll hasMore={hasMore} loadMore={loadMoreHandler} />
    </div>
  );
};
