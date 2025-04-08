import { useEffect, useState } from "react";
import { Comment, List, Avatar, Form, Button, Input } from "antd";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale/zh-CN";
import { CommentType } from "./interface";
const { TextArea } = Input;

const CommentSection = () => {
  const [comments, setComments] = useState<CommentType[]>();
  const [value, setValue] = useState("");
  const [form] = Form.useForm();
  useEffect(() => {
    fetch(
      `http://8.152.163.66:3003/comment/top-level-comments?count=${10}&startIndex=${10}`
    )
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setComments(res.data.comments);
      });
  }, []);
  const actions = [<span key="comment-basic-reply-to">Reply to</span>];
  // 处理提交评论
  const handleSubmit = () => {
    if (!value.trim()) return;

    const newComment = {
      comment_id: 100,
      comment_pics: [],
      content: value,
      parent_comment_id: 0,
      user: {
        id: 2,
        name: "Join",
        avatar: "https://picsum.photos/200",
      },
    };

    //@ts-ignore
    setComments([newComment, ...comments]);
    setValue("");
    //向后端发请求
    fetch("http://8.152.163.66:3003/comment/createCommnet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entity: {
          parent_comment_id: 0,
          content: value,
          like_nums: 0,
          comment_pics: [],
        },
        user_id: 1,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("网络响应状态异常");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("请求出错:", error);
      });
    form.resetFields();
  };

  // 格式化时间显示
  const formatTime = (time: any) => {
    return formatDistanceToNow(new Date(time), {
      addSuffix: true,
      locale: zhCN,
    });
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", height: "2000px" }}>
      {/* 评论表单 */}
      <Comment
        style={{
          position: "sticky",
          top: 0,
          zIndex: 8888,
          backgroundColor: "white",
        }}
        actions={actions}
        avatar={<Avatar src="https://picsum.photos/100/100" alt="当前用户" />}
        content={
          <Form form={form}>
            <Form.Item name="content">
              <TextArea
                rows={4}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="输入你的评论..."
              />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                onClick={handleSubmit}
                type="primary"
                disabled={!value.trim()}
              >
                发布评论
              </Button>
            </Form.Item>
          </Form>
        }
      />

      {/* 评论列表 */}
      <List
        header={`XX 条评论`}
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(item: CommentType) => (
          <li>
            <Comment
              actions={actions}
              avatar={<Avatar src={item.user.avatar} />}
              content={item.content}
              datetime={formatTime(item.updated_at)}
            ></Comment>
          </li>
        )}
      />
    </div>
  );
};

export default CommentSection;
