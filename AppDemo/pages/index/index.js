// index.js
// 获取应用实例
const app = getApp()
//全局变量
var socketOpen = false;
var wsApi = "ws://192.168.0.133:3001";
var Rmsg = "";
var phoneWidth = 0;
var barrage_style_arr = [];
var barrage_style_obj ={};
var timers = [];
var timer ;

Page({
  data: {
    bind_shootValue:"",
    barrage_style:[],
    barrage_phoneWidth:"",
  },
  barrageSwitch(){
    console.log();
    //先判断没有打开
    if(socketOpen){
    //清空弹幕
      barrage_style_arr = [];
      //设置data的值
      this.setData({
        barrageTextColor:"#D3D3D3",
        barrage_inputText:"none",
        barragefly_display:"none",
        barrage_style:barrage_style_arr,
      });
      //清除定时器
      clearInterval(timer);
    }else{
      this.setData({
        barrageTextColor:"#04BE02",
        barrage_inputText:"flex",
        barragefly_display:"block",
      });
      //打开定时器
        timer= setInterval(this.barrageText_move,800)
    }
  },
  //发送数据
  sendMsge(value){
    console.log(value);
    if (socketOpen) {
      //向服务器发送消息
      wx.sendSocketMessage({
        data: value
      })
    }
  },
  connect:function(options){
    var that = this;
    wx.connectSocket({
      url: wsApi,
      header: {
        'content-type': 'application/json'
      },
      //method:"GET",
      protocols: ['protocol1'],
      success: function () {
        console.log("客户端连接成功！");
        wx.onSocketOpen(function(){
          console.log('webSocket已打开！');
          socketOpen=true;
          wx.onSocketMessage(function(msg){
            Rmsg = msg.data
            //字体颜色随机
            var textColor = "rgb("+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+")";
            var barrageText_height = (Math.random())*266;
            barrage_style_obj = {
              // textWidth:textWidth,
              barrageText_height:barrageText_height,
              //barrage_shootText:this.data.bind_shootValue,
              barrage_shootText:msg.data,
              barrage_shoottextColor : textColor,
              barrage_phoneWidth:phoneWidth
             };
             barrage_style_arr.push(barrage_style_obj);
             console.log("接收1：",barrage_style_arr)
             that.setData({
              barrage_style:barrage_style_arr,        //发送弹幕
            })
            console.log("接收：",Rmsg)
          })
        })
      }
    })
  },
  onLoad() {
    this.connect()
      this.barrageSwitch()
      var that = this;
      //获取屏幕的宽度
        wx.getSystemInfo({
          success: function(res) {
             that.setData({
                  barrage_phoneWidth:res.windowWidth-100,
             })
          }
        })
        phoneWidth = that.data.barrage_phoneWidth;
        console.log(phoneWidth);
  },
  //发射Btn
  shoot:function(e) {
    var str = this.data.bind_shootValue
    this.sendMsge(str)
    this.setData({
      bind_shootValue:"" //清空输入框
    })
 },
 //定时器  让弹幕动起来
 barrageText_move: function(){
  var timerNum = barrage_style_arr.length;
  var textMove ;
  for(var i=0;i<timerNum;i++){
    textMove = barrage_style_arr[i].barrage_phoneWidth;
    console.log("barrage_style_arr["+i+"].barrage_phoneWidth----------:"+barrage_style_arr[i].barrage_phoneWidth);
    textMove = textMove -20;
    barrage_style_arr[i].barrage_phoneWidth = textMove;
    //走完的移除掉
    if(textMove<=-100){
//         clearTimeout(this.timer);
        barrage_style_arr.splice(0,1);
        i--;
        //全部弹幕运行完
        if(barrage_style_arr.length==0){
          this.setData({
            barrage_style:barrage_style_arr,
          })
          // clearInterval(this.timer);
          return;
        }
    }
    console.log("第"+i+"个定时器:",textMove);
    this.setData({
      barrage_style:barrage_style_arr,
    })
  }
},
   //绑定输入框，将值传递给data里的bind_shootValue，发送的时候调用
   bind_shoot:function(e){
    this.setData({
      bind_shootValue:e.detail.value
    })
  },

})
