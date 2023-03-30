// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引用 Todo model(../是上一目錄群的相對路徑標示方法)
const Todo=require('../../models/todo')
// 引入 home 模組程式碼


router.get('/', (req, res) => {
  Todo.find()// 用find 取出 Todo model 裡的所有資料
  .sort({ _id: 'asc' }) // Mongoose 提供的排序方法，根據 _id 升冪排序；desc則是降冪
  .lean()//把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
  .then(todos=>res.render('index', { todos:todos }))// 將資料傳給 index 樣板
  .catch(error => console.error(error))//錯誤處理
})

module.exports=router