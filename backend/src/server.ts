import express from "express"

const app = express()

const PORT = 3000

app.get("/", (req, res) => {
    res.send("バックエンド初期化が成功しました 🚀")
})

app.listen(PORT, () => {
    console.log(`サーバーが http://localhost:${PORT} で待ち受けています`)
})