import { Fragment, useEffect, useRef, useState } from "react";
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
          setComments((oldComments) => [...oldComments, ...res.comments]);
        } else {
          setHasMore(false);
        }
      });
      r(comments);
    });

  return (
    <div>
      {" "}
      <PullToRefresh
        onRefresh={() => {
          console.log("onRefresh");
        }}
      >
        <List style={{ minHeight: "100vh",overflow:'scroll' }}>
          {" "}
          {comments.map((comment: CommentType) => {
            return <ComentItem item={comment} key={comment.comment_id} />;
          })}
        </List>
      </PullToRefresh>
      <InfiniteScroll hasMore={hasMore} loadMore={loadMoreHandler} />
    </div>
  );
};
