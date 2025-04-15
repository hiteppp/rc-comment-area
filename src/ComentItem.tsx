import { Avatar, Comment } from "antd";
import { CommentType } from "./interface";

// 子组件
const CommentItem: React.FC<{ item: CommentType }> = ({ item }) => {
  //console.log('item',item);

  return (
    <Comment
      actions={[
        <span key="comment-basic-reply-to">回复</span>,
        <span
          key="comment-basic-delete-to"
        >
          删除
        </span>,
        <span
          key="comment-basic-delete-to"
        >
          {item.comment_id}
        </span>,
      ]}
      author={item.user.name}
      avatar={<Avatar src={item.user.avatar} />}
      content={item.content}
    ></Comment>
  );
};

export default CommentItem;
