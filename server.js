const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 💡 直接把網頁寫在後端裡，輸入 http://localhost:3001 直接回傳精美介面
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
      <meta charset="UTF-8">
      <title>✨ 匿名留言板</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: sans-serif; background: #0d1117; color: #c9d1d9; max-width: 680px; margin: 40px auto; padding: 20px; }
        h1 { text-align: center; color: #58a6ff; margin-bottom: 20px; }
        .card, .post { background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
        input, textarea, button { width: 100%; padding: 10px; margin-top: 10px; background: #0d1117; border: 1px solid #30363d; color: #fff; border-radius: 6px; }
        button { background: #238636; font-weight: bold; cursor: pointer; border: none; }
        button:hover { background: #2ea043; }
        .post-header { font-weight: bold; color: #79c0ff; margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <h1>💬 匿名留言板</h1>
      <div class="card">
        <input type="text" id="nickname" placeholder="暱稱">
        <textarea id="content" rows="3" placeholder="說點什麼吧..."></textarea>
        <button onclick="sendPost()">發布留言</button>
      </div>
      <div id="postsList">載入中...</div>

      <script>
        loadPosts();
        async function loadPosts() {
          const res = await fetch('/api/posts');
          const result = await res.json();
          const posts = result.data || result;
          const list = document.getElementById('postsList');
          if (posts.length === 0) {
            list.innerHTML = '<p style="text-align:center;color:#8b949e">目前沒有留言</p>';
            return;
          }
          list.innerHTML = posts.slice().reverse().map(p => \`
            <div class="post">
              <div class="post-header">\${p.nickname}</div>
              <div>\${p.content}</div>
              <button style="margin-top:10px;background:#21262d;color:#f85149;border:1px solid #30363d;padding:4px 8px;width:auto;" onclick="deletePost(\${p.id})">刪除</button>
            </div>
          \`).join('');
        }

        async function sendPost() {
          const nickname = document.getElementById('nickname').value;
          const content = document.getElementById('content').value;
          if (!content.trim()) return alert('請輸入內容！');
          await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname, content })
          });
          document.getElementById('content').value = '';
          loadPosts();
        }

        async function deletePost(id) {
          await fetch(\`/api/posts/\${id}\`, { method: 'DELETE' });
          loadPosts();
        }
      </script>
    </body>
    </html>
  `);
});

// 模擬資料庫
let posts = [{ id: 1, nickname: "柴犬阿福", content: "測試留言！", likes: 5 }];

app.get("/api/posts", (req, res) => {
  res.json({ success: true, data: posts });
});

app.post("/api/posts", (req, res) => {
  const { nickname, content } = req.body;
  const newPost = {
    id: Date.now(),
    nickname: nickname || "熱心匿名人士",
    content: content,
    likes: 0,
  };
  posts.push(newPost);
  res.status(201).json({ success: true, data: newPost });
});

app.delete("/api/posts/:id", (req, res) => {
  const postId = Number(req.params.id);
  posts = posts.filter((p) => p.id !== postId);
  res.json({ success: true, message: "已刪除" });
});

app.listen(PORT, () => {
  console.log(`🚀 伺服器順利運作中：http://localhost:${PORT}`);
});
