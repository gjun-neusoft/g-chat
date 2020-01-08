<template>
<div id="chat">
  <!-- <div class="chat-content">
    {{text}}
  </div>
  <div class="chat-input">
    <el-input
      type="textarea"
      :rows="2"
      placeholder="请输入内容"
      v-model="textarea"
      resize = "none"
      class="chat-text"
    ></el-input>
    <el-button type="success" class="chat-button">发送</el-button>
  </div> -->
  <el-container class="chat-box">
    <el-aside class="chat-list">
      <el-select v-model="value" placeholder="请选择" @change="changeUser">
        <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        ></el-option>

      </el-select>
      <el-row class="author-list" v-for="(user,key) in userStore" :key="key">
        <el-col class="author-img" :span="8"><img :src="user.author" alt=""></el-col>
        <el-col class="author-name" :span="16">{{user.name}}</el-col>
      </el-row>
      
    </el-aside>
    <el-container>
      <el-main class="chat-main">
        <!-- <p class="chat-label" v-for="(t, index) in textlist" :key="index">
          {{t}}
        </p> -->
        <div class="chat-tip" v-for="(text, index) in textlist" :key="index">
          <div class="chat-direction" :class="[text.state == 0 ? 'chat-direction-reverse':'']">
            <div class="author">
              <img :src="text.author" alt="" srcset="">
            </div>
            <div class="chat-default" :class="[text.state == 0&&'chat-green',text.state == 1 && 'chat-white']">{{text.msg}}</div>
          </div>
        </div>
      </el-main>
      <el-footer class="chat-footer">
        <el-input
          type="input"
          :rows="2"
          placeholder="请输入内容"
          v-model="textarea"
          resize="none"
          class="chat-text"
          :disabled="disabled"
          @keyup.enter.native="sendmsg"
        ></el-input>
        <el-button :disabled="disabled" class="chat-button" type="success" @click="sendmsg">发送</el-button>
      </el-footer>
    </el-container>
  </el-container>
</div>
</template>

<script>
export default {
  name: 'home',
  components: {
    
  },
  data(){
    return {
      options: [
        {
          value: '01',
          label: '王大拿',
          author: '../images/01.jpeg'
        },
        {
          value: '02',
          label: '谢大脚',
          author: '../images/02.jpg'
        }
      ],
      value: '',
      textarea: '',
      textlist: [],
      user:{
        sid: '',
        id: '',
        name: '',
        author: ''
      },
      userStore:{},
      disabled: true
    }
  },
  mounted(){
    window.addEventListener('beforeunload', ()=>{
      this.$socket.emit('refreshWindow',this.user.sid)

    })

  },
  created(){

  },
  
  sockets: {
    replySendUser(data){
      this.user.sid = data.sid;
    },
    replyConnectStatus(data){
      if(data.code === 0){
        this.disabled = false
      }
    },
    replyUserStore(data){
      this.userStore = data
      this.textlist = []
      Object.values(data).map(v=>{
        if(v.sid !== this.user.sid){
          this.textlist.push({msg: v.name+'已上线', state: 2})
        }
      })
    },
    replyMsg(data){
      this.textlist.push(data)
    }
  },
  
  methods: {
    changeUser(v){
      let name = '', author = ""
      this.options.map(val=>{
        if(val.value === v){
          name = val.label
          author = val.author
        }
      })
      this.user.uid = v
      this.user.name = name
      this.user.author = author
      this.$socket.emit('getUserInfo',{sid: this.user.sid,uid: v, name, author})
    },
    sendmsg(){
      this.$socket.emit('sendMsg',this.textarea)
      this.textarea = ''
    }
  }
}
</script>

<style lang="scss">
  .chat-main{
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 500px;
    height: calc(100vh - 100px);
    border: 1px solid #ccc;
    .chat-tip{
      .chat-direction{
        display: flex;
        flex-direction: row;
        .chat-default{
          margin: 10px 0;
          padding: 10px;
          width: 200px;
          height: 80px;
          line-height: 30px;
          border-radius: 5px;
          text-align: left;
          word-break:break-all;
          background-color: #b3d8ff;
        }
        .chat-green{
          background-color: #67C23A;
          color: #fff;
        }
        .chat-white{
          background-color: #dcdfe6;
        }
      }
      .chat-direction-reverse{
        flex-direction: row-reverse
      }
    }
  }
  .author-list{
    .author-img{
      width: 50px;
      height: 50px;
      img{
        
        height: 50px;
      }
    }
    .author-name{
      width: calc(100% - 50px);
      height: 50px;
      line-height: 50px;
      text-align: left;
    }
  }
  .chat-footer{
    padding: 0;
    margin: 0 auto;
    width: 500px;
    height: 100px;
    .chat-text{
      width: 80%;
      height: 40px
    }
    .chat-button{
      width: 20%;
      height: 40px;
    }
  }
  .chat-list{
    width: 200px !important
  }

  
</style>
