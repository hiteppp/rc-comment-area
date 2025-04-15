import { useEffect, useState } from "react";
import { CommentType } from "./interface";
import { fetchMoreData } from "./api/getData";

export default () => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const init = async () => {
    try {
      let res = await fetchMoreData(0);
      setComments(res.comments);
    } catch (error) {
      console.log("err", error);
    }
  };
  useEffect(()=>{init()},[])

  return (
    <div>
      {comments.map((comment: CommentType) => {
        return <p>{JSON.stringify(comment)}</p>;
      })}
    </div>
  );
};
