// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars')
const Todo=require('./models/todo')
const bodyParser=require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes')// 引用路由器routes


// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB。mongoose.connect其實直接用連線字串就好，但因為連線字串裡有密碼，所以改用環境中載入；process.env 是 Node.js 提供的一個介面，可以調用宣告在系統層的環境變數。

app.use(methodOverride('_method'))//參數 _method=method-override 的路由覆蓋機制，只要我們在網址上使用 query string (也就是 ?) 帶入這組指定字串，就可以把路由覆蓋掉
app.use(routes)// 將 request 導入路由器
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

app.use(bodyParser.urlencoded({ extended: true }))//body-parser，用來解析解析 request body的中介軟體


// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})