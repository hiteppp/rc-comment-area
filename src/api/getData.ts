import { request } from ".";

export const fetchMoreData = async (page: number) => {
  try {
    let res = await request("getComments", {
      count: 10,
      startIndex: page * 10,
    });
    return res.data.data;
  } catch (error) {
    console.log("err", error);
  }
};
