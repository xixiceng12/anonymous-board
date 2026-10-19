const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 模擬資料庫
let posts = [
  { id: 1, nickname: "柴犬阿福", content: "Apidog 測試第一條留言！", likes: 5 },
  {
    id: 2,
    nickname: "匿名訪客",
    content: "這是一個用於 API 測試的留言板。",
    likes: 12,
  },
];

// 1. 取得所有留言 (GET)
app.get("/api/posts", (req, res) => {
  res.json({ success: true, data: posts });
});

// 2. 新增留言 (POST)
app.post("/api/posts", (req, res) => {
  const { nickname, content } = req.body;
  if (!content) {
    return res
      .status(400)
      .json({ success: false, message: "留言內容不能為空！" });
  }
  const newPost = {
    id: Date.now(),
    nickname: nickname || "熱心匿名人士",
    content: content,
    likes: 0,
  };
  posts.push(newPost);
  res.status(201).json({ success: true, data: newPost });
});

// 3. 給留言按讚 (POST /api/posts/:id/like)
app.post("/api/posts/:id/like", (req, res) => {
  const postId = Number(req.params.id);
  const post = posts.find((p) => p.id === postId);
  if (!post) {
    return res.status(404).json({ success: false, message: "找不到該筆留言" });
  }
  post.likes += 1;
  res.json({ success: true, data: post });
});

// 4. 刪除留言 (DELETE /api/posts/:id)
app.delete("/api/posts/:id", (req, res) => {
  const postId = Number(req.params.id);
  posts = posts.filter((p) => p.id !== postId);
  res.json({ success: true, message: `ID ${postId} 的留言已刪除` });
});

app.listen(PORT, () => {
  console.log(`🚀 API 伺服器運作中：http://localhost:${PORT}`);
});
