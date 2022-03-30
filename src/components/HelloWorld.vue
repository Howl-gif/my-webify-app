
<template>
  <div class="hello">
    <LoginState v-slot="{ loginState, loading }">
      <h1>
        {{ docs[0].name
        }}{{ loading ? "加载中" : loginState ? "已登录" : "没登录" }}
      </h1>
    </LoginState>
    <h2>图片上传</h2>
    <el-upload 
      :on-progress="onprogress"
      class="upload-demo"
      drag
      action="#"
      multiple
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </el-upload>
  <br>
    <h2>识别结果：{{imageResult}}</h2>
  </div>
</template>

<script>
import Vue from "vue";
import Cloudbase from "@cloudbase/vue-provider";
import tcb from "@cloudbase/js-sdk";

//第二步，初始化
const app = tcb.init({
  env: "my-webify-app-0g9xwgxn5bf25b1b"
});

Vue.use(Cloudbase, {
  env: "my-webify-app-0g9xwgxn5bf25b1b",
});
export default {
  async created() {
    // 以匿名登录为例
    await this.$cloudbase
      .auth({ persistence: "local" })
      .anonymousAuthProvider()
      .signIn();
    // 数据库查询
    const queryResult = await this.$cloudbase
      .database()
      .collection("users")
      .where({})
      .get();
    this.docs = queryResult.data;
    
  },
  name: "HelloWorld",
  data() {
    return {
      docs: [],
      envId: "my-webify-app-0g9xwgxn5bf25b1b",
      callFunctionResult: "",
      imageResult: '',
    };
  },
  props: {
    msg: String,
  },
  methods: {
    onprogress(event, file) {
      app.uploadFile({
   
        cloudPath: "images/"+file.raw.name,
       
        filePath: file.raw,
      }).then((res) => {
        this.callFunctionimage(res.fileID)
      });
    },

    async callFunctionimage(fileid) {
      try {
        const res = await this.$cloudbase.callFunction({
          name: "wechat",
          data: {
            way: "image",
            fileid:fileid
          },
        });
        var data = JSON.parse(res.result.body);
        var resultstr = ''
        for(var i=0;i<data.words_result.length;i++){
            resultstr = resultstr+data.words_result[i].words
        }
        this.imageResult =resultstr;
      
      } catch (e) {
        console.error(e);
        this.callFunctionResult = e.message;
      }
    }, 
  },
};
</script>


"
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.hello {
  max-width: 500px;
  margin: 0 auto;
  word-break: break-all;
}
</style>
