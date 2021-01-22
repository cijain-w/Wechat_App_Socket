//引入ws模块的构造函数
var webSocketServer=require("ws").Server;
//实例化
var wss=new webSocketServer({
	port:3001
});
var sockets=[];
var index='';
//监听客户端连接
wss.on("connection",function(ws){
	console.log("服务器连接建立成功");
	sockets.push(ws);
	//监听客户端消息
	ws.on("message",function(msg){
		var that=this;
		console.log(msg);
		//获取发送者编号
		for(var i=0;i<sockets.length;i++)
		{
			if(sockets[i]==that){
				index='Customer'+(i+1);
				break;
			}
		}
		//发送消息
		for(var i=0;i<sockets.length;i++)
		{
			sockets[i].send("来自"+index+"的消息："+msg);
		}
	})
	ws.on("close",function(){
		for(var i=0;i<sockets.length;i++)
		{
			if(sockets[i]==this){
				sockets.splice(i,1);
				break;
			}
		}
	})
});