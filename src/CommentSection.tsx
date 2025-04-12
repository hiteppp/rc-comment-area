import { useEffect, useState } from "react";
import { Comment, Avatar, Form, Button, Input } from "antd";
// import { formatDistanceToNow } from "date-fns";
// import { zhCN } from "date-fns/locale/zh-CN";
import { CommentType } from "./interface";
import { request } from "./api";
import CommentItemHoc from "./ComentItem";

const { TextArea } = Input;

const CommentSection = () => {
  const [comments, setComments] = useState<CommentType[]>();
  const [value, setValue] = useState("");
  const [form] = Form.useForm();
  const [loading,setLoading] = useState(false)
  const init = async () => {
    setLoading(true)
    let res = await request("getComments", { count: 20, startIndex: 0 });
    setComments(res.data.data.comments);
    setLoading(false)
  };
  useEffect(() => {
    init();
  }, []);
  const deleteCommentClick = async (comment_id: number) => {
    try {
      await request("deleteComment", { comment_id });
      console.log("删除成功");
    } catch (error) {
      console.log("error", error);
    }
  };
  // 处理提交评论
  const handleSubmit = async () => {
    if (!value.trim()) return;

    const newComment: CommentType = {
      comment_pics: [],
      content: value,
      parent_comment_id: 0,
      like_nums: 0,
      user: {
        id: 2,
        name: "Join",
        avatar: "https://picsum.photos/200",
      },
    };

    // @ts-ignore
    setComments([newComment, ...comments]);
    setValue("");
    const params = {
      user_id: newComment.user.id,
      createCommentDto: {
        parent_comment_id: newComment.parent_comment_id,
        content: value,
        like_nums: newComment.like_nums,
        comment_pics: newComment.comment_pics,
      },
    };
    try {
      await request("createComment", params);
    } catch (error) {
      console.log(error);
    }

    form.resetFields();
  };

  // // 格式化时间显示
  // const formatTime = (time: any) => {
  //   return formatDistanceToNow(new Date(time), {
  //     addSuffix: true,
  //     locale: zhCN,
  //   });
  // };

  return !loading ? <div style={{ maxWidth: 800, margin: "0 auto", height: "100vh",paddingLeft:'20px',paddingRight:'20px'}}>
      {/* 评论表单 */}
      <Comment
        style={{
          position: "sticky",
          top: 0,
          zIndex: 8888,
          backgroundColor: "skyblue",
          height:'20vh',
        }}
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
      <CommentItemHoc list={comments || []}/>
    </div> : <h2>Loading...</h2>
  }

export default CommentSection;
