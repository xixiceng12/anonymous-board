# 1. 選擇官方的 Node.js 輕量版映像檔
FROM node:20-alpine

# 2. 設定容器內的工作目錄
WORKDIR /app

# 3. 先複製 package.json 和 package-lock.json 來安裝依賴
COPY package*.json ./

# 4. 安裝專案相依套件
RUN npm install

# 5. 複製專案裡的所有其他檔案到容器中
COPY . .

# 6. 開放容器的 3000 連接埠
EXPOSE 3000

# 7. 啟動伺服器的指令
CMD ["node", "server.js"]