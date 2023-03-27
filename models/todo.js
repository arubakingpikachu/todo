const mongoose=require('mongoose')
const Schema =mongoose.Schema
const todoSchema = new Schema({
  name: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  },
 isDone: {
  type: Boolean,
  default:false
  }
})
module.exports = mongoose.model('Todo', todoSchema)//mongoose.model 會複製我們定義的 Schema 並編譯成一個可供操作的 model 物件，匯出的時候我們把這份 model 命名為 Todo，以後在其他的檔案直接使用 Todo 就可以操作和「待辦事項」有關的資料了！
