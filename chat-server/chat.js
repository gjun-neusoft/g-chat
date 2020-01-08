const koa = require('koa')
const app = new koa()
const server = require('http').Server(app.callback())
const io = require('socket.io')(server)
const port = 8081
const serverListen = ()=>{
    server.listen(process.env.PORT || port, ()=>{
        console.log('app run at: http://localhost:'+port)
    })
}
let userStore = {}
const connection = ()=>{
    io.on('connection', (socket)=>{
        let send_id = ''
        //测试连接状态
        socket.emit('connect')
        //返回给发送端sid
        socket.emit('replySendUser', {sid: socket.id})
        //接收发送端返回用户信息
        socket.on('getUserInfo',data=>{
            //如果前台返回用户数据说明握手成功，这时反回一个成功状态给前台
            socket.emit('replyConnectStatus', {code: 0})
            //用户不存在，存用户
            if(!userStore[data.sid]){
                userStore[socket.id] = {
                    name: data.name,
                    uid: data.uid,
                    author: data.author
                }
            }
            //返回用户仓库给前台
            
            //通知房间内所有人，除了发送者
            socket.broadcast.emit('replyUserStore', userStore)
            //通知发送者
            socket.emit('replyUserStore', userStore)
            //存储发送者id
            send_id = data.sid
        })
        socket.on('refreshWindow',(sid)=>{
            if(userStore[sid]){
                delete userStore[sid]
            }
        })
        socket.on('sendMsg', msg=>{
            socket.broadcast.emit('replyMsg', {msg,state: 1})
            socket.emit('replyMsg', {msg, state: 0})
        })
        
    })
    
}
const chat= ()=>{
    serverListen()
    connection()
}
module.exports = chat

