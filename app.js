// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars')
const Todo=require('./models/todo')


// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB。mongoose.connect其實直接用連線字串就好，但因為連線字串裡有密碼，所以改用環境中載入；process.env 是 Node.js 提供的一個介面，可以調用宣告在系統層的環境變數。

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.get('/', (req, res) => {
  Todo.find()// 用find 取出 Todo model 裡的所有資料
  .lean()//把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
  .then(todos=>res.render('index', { todos:todos }))// 將資料傳給 index 樣板
  .catch(error => console.error(error))//錯誤處理
})

// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})