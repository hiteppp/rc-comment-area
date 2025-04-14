import { Avatar, Comment } from "antd";
import { CommentType } from "./interface";
import HOC from "./HOC";
// 子组件
const CommentItem: React.FC<{ item: CommentType }> = ({ item }) => {
  //console.log('item',item);

  return (
    <div>
      <Comment
        actions={[
          <span key="comment-basic-reply-to">回复</span>,
          <span
            key="comment-basic-delete-to"
            //@ts-ignore
            // onClick={() => deleteCommentClick(item.comment_id)}
          >
            删除
          </span>,
          <span
            key="comment-basic-delete-to"
            //@ts-ignore
            // onClick={() => deleteCommentClick(item.comment_id)}
          >
            {item.comment_id}
          </span>,
        ]}
        author={item.user.name}
        avatar={<Avatar src={item.user.avatar} />}
        content={item.content}
      ></Comment>
    </div>
  );
};

export default HOC(CommentItem);
