const express=require('express');
const http=require('http');
const {Server}=require('socket.io');
const path=require('path');
const app=express();
const server=http.createServer(app);
const io=new Server(server);
const PORT=process.env.PORT||3000;
const MAX=10;
app.use(express.static(path.join(__dirname,'public')));
const rooms=new Map();
function roomUsers(room){return rooms.get(room)||new Set()}
io.on('connection',socket=>{
  socket.on('join-room',({room,name})=>{
    room=(room||'').trim().toUpperCase(); name=(name||'Guest').trim().slice(0,30)||'Guest';
    if(!room) return socket.emit('join-error','Enter a meeting code.');
    const users=roomUsers(room);
    if(users.size>=MAX) return socket.emit('join-error','This meeting is full. Maximum 10 participants.');
    socket.data.room=room; socket.data.name=name;
    socket.join(room); users.add(socket.id); rooms.set(room,users);
    const existing=[...users].filter(id=>id!==socket.id).map(id=>({id,name:io.sockets.sockets.get(id)?.data.name||'Guest'}));
    socket.emit('room-joined',{id:socket.id,room,name,participants:existing});
    socket.to(room).emit('user-joined',{id:socket.id,name});
  });
  socket.on('signal',({to,data})=>io.to(to).emit('signal',{from:socket.id,data,name:socket.data.name}));
  socket.on('chat-message',({text})=>{if(!socket.data.room||!text?.trim())return; io.to(socket.data.room).emit('chat-message',{name:socket.data.name,text:text.trim().slice(0,500),time:Date.now()});});
  socket.on('leave-room',()=>leave(socket));
  socket.on('disconnect',()=>leave(socket));
});
function leave(socket){const room=socket.data.room;if(!room)return;const users=rooms.get(room);if(users){users.delete(socket.id);if(users.size===0)rooms.delete(room);else socket.to(room).emit('user-left',{id:socket.id});}socket.data.room=null;}
server.listen(PORT,()=>console.log(`MeetserverAimbroz running on http://localhost:${PORT}`));
