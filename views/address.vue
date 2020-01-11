<template>
  <div>
    <navbar :title="title"></navbar>
    <scroller class="address" show-scrollbar="false">  
      <div style="height: 20px;"></div> 
      <div class="info" v-for="(item,index) in addressList" :key="index"> 
        <div class="info-content" @click="addressModi(item)" @longpress="copyAddress(item)">
          <!-- 用户信息 -->
          <div class="between">
            <text class="info-name font-big">{{item.name}}</text>
            <text class="info-tel font-big">{{item.telphone}}</text>
          </div>
          <div class="info-address">
            <text class="address-default" v-if="item.is_default=='1'">默认</text>
            <text class="address-txt font-normal">{{item.is_default=='1'?'&emsp;&emsp;&ensp;&ensp;'+item.address:item.address}}</text>
          </div>
        </div>
        <!-- 地址操作 -->
        <div class="info-operate between">
          <div class="row">
            <div class="info-default-btn row"
                :style="{backgroundColor: item.is_default=='1'?'#000000':'#eeeeee',
                          justifyContent: item.is_default=='1'?'flex-end':'flex-start'}" 
                @click="onChange(item,index)">
              <div class="default-btn-circle"></div>
            </div>  
            <text class="ml-space font-small">默认地址</text>
          </div>
          <div class="row" @click="addressDel(item)">
            <image class="btn-img" :src="deleteImg" style="width:30px;height:30px;"/>
            <text class="info-set ml-space font-small">删除</text>
          </div>
        </div>
      </div>
      <div style="height: 120px;"></div> 
    </scroller>
    <div class="btn-ui row" @click="toAddressAdd">
      <image class="btn-img" :src="addImg" style="width:50px;height:50px;"/>
      <text class="btn-txt">添加新地址</text>
    </div>
    <!-- 删除弹框 -->
    <dialog 
      :title="dialogTitle"
      :rightTxt="dialogRightTxt" 
      :show="show"
      @toCancle="toCancle"
      @toConfirm="toConfirm">
    </dialog>    
  </div>
</template>
<script>
const storage = weex.requireModule("storage");
const modal = weex.requireModule("modal");
const clipboard = weex.requireModule('clipboard')
import navbar from "base/navbar";
import Dialog from "base/dialog";
import { ADD, DELETE } from 'common/js/icon-type'
import util from "common/js/util";

export default {
  mixins: [util],
  components: {  navbar, Dialog },
  data() {
    return {
      title: "收货地址",
      addressList: [],
      stat: 4,
      delId: "",
      defaultIndex: "",
      show: false,
      addImg: ADD,
      deleteImg: DELETE,
      dialogTitle: "确定要删除该地址吗",
      dialogRightTxt: "删除"
    };
  },
  created() {
    var self = this;
    this.getData();
    const allMessage = new BroadcastChannel("allMessage"); // 添加地址后，刷新列表
    allMessage.onmessage = function(e) {
      if(e.data.type == "addressAdd") {
        self.getData();
      }
    }    
    storage.getItem("Site", e => {
      if (e.result == "success") {
        if (JSON.parse(e.data).stat == 1) {
          self.stat = 1;
          storage.removeItem("Site", e => {});
        }
      }
    });
  },
  methods: {
    getData() { // 获取地址数据
      this.post("user", "getAddressList", {}, res => {
        if (!res.success)  return; 
        var addressList = res.data;
        addressList.forEach( (item, i) => {
          item.address = item.region_address.replace(/,|\s/g, "") + " " + item.address;
          if(item.is_default == "1"){
            this.defaultIndex = i;
          }
        });
        this.addressList = addressList;
      });
    },
    toAddressAdd() { // 添加地址
      storage.setItem("adinfo", "", d => {
        if (d.result) this.open("addressAdd", "true", () => {});
      });
    },
    addressModi(e) { // 修改地址
      storage.setItem("adinfo", JSON.stringify(e), d => {
        if (d.result)  this.open("addressAdd", "true", () => {}); 
      });
    },
    addressDel(e) { // 删除地址
      if (e.is_default == "1") {
        modal.toast({message: "该地址为默认地址，请重新设置默认地址再选择删除！"});
        return;
      }
      this.delId = e.id;
      this.show = true;
    },
    toCancle() { // 删除弹窗提示
      this.show = false;
    },
    toConfirm() {
      this.show = false;
      this.post("user", "deleteAddress", { id: this.delId }, res => {
        if (!res.success) return;  
        this.getData();
        modal.toast({message: '删除成功！'});
      });
    },
    onChange(e, index) { // 设置默认地址
      var index = index;
      if(this.defaultIndex == index) return; 
      this.post("user", "addOrUpdateUserAddressInfo", { id: e.id, is_default: "1" }, res => {
        if (!res.success) {
          modal.toast({ message: res.message });
          return;
        }
        Vue.set(this.addressList[index], 'is_default', '1' )
        Vue.set(this.addressList[this.defaultIndex], 'is_default', '0')
        this.defaultIndex = index;
        if (this.stat == 1) {
          this.stat = 0;
          this.close("true", () => {
            const allMessage = new BroadcastChannel("allMessage");
            allMessage.postMessage({type:"addressChange"})
          });
        }
      });
    },
    copyAddress(item){ // 复制地址
      var copyCon = `收货人:${item.name}\n手机号码:${item.telphone}\n所在地区:${item.region_address.replace(/,|\s/g, "")}\n详细地址:${item.address.split(' ')[1]}\n`;
      clipboard.setString(copyCon);
      modal.toast({message:"复制成功！"})
    }
  },
};
</script>
<style scoped>
.row {
  flex-direction: row;
  align-items: center;
}
.between {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.font-big {
  font-size: 30px;
  color: #666666;
}
.font-normal {
  font-size: 28px;
  color: #999999;
}
.font-small {
  font-size: 26px;
  color: #666666;
}
.ml-space {
  margin-left: 10px;
}
.address {
  width: 750px;
  align-items: center;
  background-color: #ededed;
}
.info {
  width: 710px;
  padding-top: 35px;
  padding-right: 30px;
  padding-left: 30px;
  margin-bottom: 20px;
  background-color: #ffffff;
  border-radius: 8px;
}
.info-content {
  padding-bottom: 10px;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #ededed;
}
/* 用户信息 */
.info-name {
  max-width: 450px;
}
.info-address {
  position: relative;
  padding-top: 20px;
  padding-bottom: 20px;
}
.address-default {
  position: absolute;
  top: 23px;
  left: 0;
  height: 30px;
  line-height: 30px;
  background-color: #f56a33;
  padding-right: 15px;
  padding-left: 15px;
  border-radius: 20px;
  color: #ffffff;
  font-size: 20px;
}
/* 地址操作 */
.info-operate {
  width: 650px;
  height: 100px;
  align-items: center;
}
.info-default-btn {
  align-items: center;
  justify-content: flex-start;
  padding: 0 2px;
  width: 80px;
  height: 40px;
  border-radius: 20px;
}
.default-btn-circle {
  width: 36px;
  height: 36px;
  background-color: #ffffff;
  border-radius: 18px;
}
/* 添加按钮 */
.btn-ui {
  position: absolute;
  left: 125px;
  bottom: 30px;
  justify-content: center;
  width: 500px;
  border-radius: 50px;
  background-image: linear-gradient(to right, #f82833, #fd6925); 
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
}
.btn-txt {
  line-height: 80px;
  color: #ffffff;
  font-size: 30px;
}
.btn-ui:active {
  background-image: linear-gradient(to right, #f00f1b, #f85311); 
}
</style>