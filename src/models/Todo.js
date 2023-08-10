const mongoose = require('mongoose')

const {Schema} = mongoose
const {Types : {ObjectId}} = Schema

const todoSchema = new Schema({ //스키마 정의
    author: {
        type: ObjectId, // 사용자ID
        required: true,
        ref: 'User' // 사용자 모텔을 참조
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    imgUrl: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim:true
    },
    description:{
        type: String,
        trim: true
    },
    isDone: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now
    },
    finishedAt: {
        type: Date,
        default: Date.now
    }
})

//Todo => todos (컬렉션 이름) 알아서 대문자를 소문자로 바꿔지고 끝에 s를 붙여준다.
const Todo = mongoose.model('Todo', todoSchema) 
module.exports = Todo // 외부에서 해당 파일을 사용할 수 있도록 허용

// todo 데이터 생성 테스트
// const todo = new Todo({
//     author: '111111111111111111111111', // 24자리 Mongodb 고유 ID값
//     title: '주말에 공원 산택하기',
//     description: '주말에 집 주변에 있는 공원에 가서 1시간동안 산책하기'
// })
// //데이터베이스 접속 -> 비동기
// todo.save() // insert, insertMany
// .then(() => console.log('todo created !'))
// .catch(e => console.log(`Fail to create todo: ${e}`))
