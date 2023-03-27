// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars')
const Todo=require('./models/todo')
const bodyParser=require('body-parser')


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

app.use(bodyParser.urlencoded({ extended: true }))//body-parser，用來解析解析 request body的中介軟體

app.get('/', (req, res) => {
  Todo.find()// 用find 取出 Todo model 裡的所有資料
  .sort({ _id: 'asc' }) // Mongoose 提供的排序方法，根據 _id 升冪排序；desc則是降冪
  .lean()//把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
  .then(todos=>res.render('index', { todos:todos }))// 將資料傳給 index 樣板
  .catch(error => console.error(error))//錯誤處理
})

app.get('/todos/new',(req,res)=>{
  return res.render('new')
})

app.get('/todos/:id',(req,res)=>{
  const id=req.params.id
  return Todo.findById(id)
  .lean()
  .then(todo=>res.render('detail',{todo:todo}))
  .catch(error => console.log(error))
})

app.get('/todos/:id/edit',(req,res)=>{
  const id=req.params.id
  return Todo.findById(id)
  .lean()
  .then(todo=>res.render('edit',{todo:todo}))
  .catch(error => console.log(error))
})

app.post('/todos',(req,res)=>{
  const name = req.body.name
  return Todo.create({ name })     // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

app.post('/todos/:id/edit',(req,res)=>{
  const id = req.params.id
  const {name,isDone} = req.body//解構賦值
  return Todo.findById(id)
    .then(todo => {
      todo.name = name
      todo.isDone= isDone==='on'
      return todo.save()
    })
  .then(()=>res.redirect('/todos/${id}'))
  .catch(error => console.log(error))
})

app.post('/todos/:id/delete',(req,res)=>{
  const id=req.params.id
  return Todo.findById(id)
   .then(todo=>todo.remove())
   .then(()=>res.redirect('/'))
   .catch(error => console.log(error))
})

// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})