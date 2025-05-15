// import Parent from "./Parent";

// export default () => {
//   return (
//     <>
//       <p>GrandParent</p>
//       <Parent />
//     </>
//   );
// };
import { Button } from "antd";
import FormRender, { useForm } from "form-render";
import Tip from "./Tip";
import { request } from "../api";
import { useState } from "react";
const schema = {
  type: "object",
  properties: {
    select2: {
      title: "单选",
      type: "string",
      enum: ["111", "211", "311"],
      enumNames: ["123", "245", "356"],
    },
    input1: {
      title: "单选input1",
      type: "string",
      enum: ["1", "2", "3"],
      enumNames: ["1", "2", "3"],
    },
    select1: {
      title: "单选",
      type: "string",
      enum: ["1", "2", "3"],
      enumNames: ["1", "2", "3"],
    },

    tip: {
      title: "单选",
      type: "string",
      // enum: ["1", "2", "3"],
      // enumNames: ["1", "2", "3"],
      key: "222",
      widget: "Tip",
    },
  },
};

const Demo = () => {
  const form = useForm();
  const [data, setData] = useState({ select1: "", input1: "" });
  const [tipData, setTipData] = useState("");
  //@ts-ignore
  const onFinish = (formData, errors) => {
    console.log("formData:", formData, "errors", errors);
  };
  const watch = {
    // # 为全局
    //@ts-ignore
    "#": async (val) => {
      console.log("表单的实时数据为：", val);
      if (val.select1 && val.input1) {
        //两个都有才发请求
        let res = await request("test", {
          select1: val.select1,
          input1: val.input1,
        });
        setTipData(res.data.tip);
      }
    },
    //@ts-ignore
    input1: (val) => {
      //form.setValueByPath("input2", val);
      setData({ select1: data.select1, input1: val });
    },
    //@ts-ignore
    select1: (val) => {
      //form.setValueByPath("select1", val);
      setData({ select1: val, input1: data.input1 });
    },
  };
  return (
    <div>
      <FormRender
        form={form}
        schema={schema}
        onFinish={onFinish}
        widgets={{
          Tip: (props:any) => <Tip {...props} tips={tipData}/>,
        }}
        watch={watch}
      />
      <Button type="primary" onClick={form.submit}>
        提交
      </Button>
    </div>
  );
};

export default Demo;
