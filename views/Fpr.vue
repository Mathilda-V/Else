<template>
<div>
  <div  :style="{paddingTop:statusbarHeight+'px',backgroundImage:'linear-gradient(to left, #e5345f, #ff7d49)'}" >
    <wxc-minibar background-color="">
      <image :src="arrowLeft" slot="left"  style="width:60px;height:60px;"/>
      <image slot="middle"
            :src="tbRush"
            style="height: 60px;width: 200px"/>
    </wxc-minibar>
  </div>
    <wxc-tab-page ref="wxc-tab-page"
                :tab-titles="tabTitles"
                :tab-styles="tabStyles"
                class="tab-bar"
                title-type="text"
                :need-slider="need_silder"
                :title-use-slot="usesolt"
                :tab-page-height="tabPageHeight"
                @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
      <div v-for="(item,i) in tabTitles" class="tab-item" :key="i" :slot="'tab-title-'+i">
        <text :class="[(i==0)?'tab-title-first':'tab-title']">{{item.title}}</text>
        <text class="tab-text">{{item.text}}</text>
      </div>            
      <waterfall v-for="(item,i) in tabTitles" :key="i" @loadmore="loadmore" show-scrollbar="false" left-gap="0" right-gap="0" column-gap="0" column-count="1"
          class="item-container hg-list"
          :style="{ height: (tabPageHeight - tabStyles.height) + 'px'}">
        <header class="border-cell">
          <text class="header-text">限时限量 疯狂抢购</text>
          <text v-if="i==0" class="header-time">已开抢</text>
          <text v-if="i==1" class="header-time">正在抢购中</text>
          <wxc-countdown v-if="i>1" class="header-time" :timeBoxStyle="{backgroundColor:'#f1f1f1',borderRadius:'6px'}" :timeTextStyle="{fontSize: '22px', color: 'green'}" tpl="距离开始:{h}:{m}:{s}" :time="timer[i]"></wxc-countdown>
        </header>
        <cell v-for="(o,key) in item.dataList"
            class="cell hg-list"
            :key="key" @click="openDetailByUrl(o.click_url,o.title)">
            <div class='A-image-box hg-row' v-if="i<2" >
              <image class="A-image" :src="o.pic_url+'_320x320q80s100.jpg_.webp'" />
              <div class="A-tit">
                <text class="A-title">{{o.title}}</text>
                <div class="card-progress">
                  <progress class="progress"
                            :progress-styles="progressStyles"
                            :total="o.total_amount"
                            :current="o.sold_num"></progress>
                  <text class="card-got">已抢 {{ Math.round((o.sold_num/o.total_amount)*100)}} %</text>
                </div>
                <div class="A-parameter hg-row">
                  <div class="hg-row between">
                    <div class="hg-row">
                      <text class="A-sold rc">￥</text><text class="A-vp" >{{o.zk_final_price}}</text>
                      <text class="A-price rc">￥{{o.reserve_price}}</text>
                    </div>
                    <text class="btn rg wc">马上抢</text>
                  </div>
                </div>
              </div>        
            </div>
            <div class='A-image-box hg-row' v-else>
              <image class="A-image"  :src="o.pic_url+'_320x320q80s100.jpg_.webp'" />
              <div class="A-tit">
                <text class="A-title">{{o.title}}</text>
                <div class="A-parameter hg-row">
                  <div class="hg-row between">
                    <div class="hg-row">
                      <text class="A-sold gc">￥</text><text class="A-vp gc" >{{o.zk_final_price}}</text>
                      <text class="A-price">￥{{o.reserve_price}}</text>
                    </div>
                    <text class="btn gb wc">即将开场</text>
                  </div>
                </div>
              </div>                     
            </div>
          </cell>
        
      </waterfall>
    </wxc-tab-page>
    <load :show="loadShow"></load>
  </div>
</template>

<script>
  const storage = weex.requireModule("storage");
  import { WxcMinibar,WxcTabPage, WxcPanItem, Utils, BindEnv,WxcCountdown } from 'weex-ui';
  import Load from 'base/load'
  import Util from "common/js/util"
  import { TB_RUSH, DIRECTION_ARROW } from 'common/js/icon-type.js'
  import progress from "base/progress"
  export default {
    components:{WxcMinibar,WxcTabPage,WxcPanItem,Load,WxcCountdown, progress},
    mixins:[Util],
    data () {
      return {
        arrowLeft: DIRECTION_ARROW[1],
        tbRush: TB_RUSH,
        tabTitles:[],
        timer:[],
        need_mask:true,
        loadShow:true,
        activePage:1,
        usesolt:true,
        setInt:null,
        need_silder:true,
        pagesize:40,
        statusbarHeight:40,
        tabStyles:{
          bgColor: '#2e3a47',
          titleColor: '#666666',
          activeBgColor: '#e82c65',
          isActiveTitleBold: true,
          width: 187.5,
          height: 100,
          fontSize: 28,
          hasActiveBottom: true,
          activeBottomColor: '#FFC900',
          activeBottomHeight: 3,
          activeBottomWidth: 120,
          
        },
        progressStyles: {
          width: 220,
          height: 30,
          frontColor: '#FEC1C1',
          bgColor: '#ededed'
        },
        tabList:[],
        tabPageHeight:''
      }
    },
    created(){
      //计算整点抢时间
      this.createTime();
    },
    mounted(){
      storage.getItem('viewport',(e)=>{
        if(e.result == "success"){
          this.calcHeight(JSON.parse(e.data).deviceHeight)
        }
      })
      storage.getItem("fpr", (e) => {
        let index = JSON.parse(e.data).index
        this.$refs['wxc-tab-page'].setPage(index,null,false);
      })
    },
    methods:{
      calcHeight(deviceHeight){
        this.tabPageHeight = deviceHeight - this.statusbarHeight - 90
      },
      setTime(){
        var self=this;
        clearTimeout(self.setInt);
        var activePageItem=self.tabTitles[self.activePage];
        const nowTime=Math.round(new Date()/1000)+(8*3600);
        const remainTime=nowTime%(3600*24);
        activePageItem.timer= remainTime-activePageItem.nowpart;
      },

      createTime(){
        const self=this;
        const nowGMTTime=new Date();//当前日期
        var hourParts=[0,8,10,11,12,13,14,15,17,19,21,22,23,24,32,34,35,36,37,38,39,41,43,45,47,48];//抽象抢购场次列表
        // if(nowGMTTime.getDay()==1){
        //   hourParts=[0,8,10,11,12,13,14,15,17,19,21,22,23,24];
        // }
        const nowTime=Math.ceil(nowGMTTime.getTime()/1000)+(8*3600);//当前时间戳
        const remainTime=nowTime%(3600*24);//今天的时间
        const todayTime=nowTime-remainTime;//今天的凌晨的时间戳
        const todayTimeTemp=todayTime-8*3600//子午线时间 用于控件显示 
        var nowPartPoint=0;//当前场次处于时间段
        let hour=Math.floor(remainTime/3600);
        let len=hourParts.length
        for(var i=0;i<len;i++){
          if(hour<hourParts[i]){
            nowPartPoint=(i-1);//当前所在时间节点
            break;
          }
        }
        
        //设置已开场时间参数
        Vue.set(self.tabTitles,0,{
          title:"热卖榜单",
          text:"已开抢",
          nowpart:(hourParts[nowPartPoint])*3600,
          pageno:1,
          dataList:[],
          startTime:self.format(todayTime-(3600*24)),//开始时间为前一天0点开始
          endTime:self.format(todayTime+((hourParts[nowPartPoint]-2)*3600))
        });
        Vue.set(self.timer,0,(todayTime-(3600*24))*1000);
       
        //设置正在进行的场次参数
         self.tabTitles.push({
          title:(hourParts[nowPartPoint]<10?"0"+hourParts[nowPartPoint]:hourParts[nowPartPoint])+":00",
          text:'抢购进行中',
          nowpart:hourParts[nowPartPoint]*3600,
          pageno:1,
          dataList:[],
          startTime:self.format(todayTime+(hourParts[nowPartPoint]*3600)),
          endTime:self.format(todayTime+(hourParts[nowPartPoint+1]*3600))
        });
        self.timer.push((todayTime+(hourParts[nowPartPoint]*3600))*1000);
        //设置待开枪场次参数
        len=hourParts.length;
        for(var i=nowPartPoint+1;i<len-1;i++){
          let hourStr=0;
          let text="";
          if(hourParts[i]<24){//今日待抢参数
            hourStr=hourParts[i];
            text="即将开抢";
          }else{//明日待抢参数
            hourStr=hourParts[i]-24;
            text="明日开抢";
          }
           self.tabTitles.push({
              title:(hourStr<10?("0"+hourStr):hourStr)+":00",
              text:text,
              nowpart:hourParts[i]*3600,
              pageno:1,
              dataList:[],
              startTime:self.format(todayTime+(hourParts[i]*3600)),
              endTime:self.format(todayTime+(hourParts[i+1]*3600))
            });
            self.timer.push((todayTimeTemp+hourParts[i]*3600)*1000);
        }
      },
      format(timestamp){
        timestamp=timestamp-(8*3600);
        var year,month,dateStr,hour;
        var date=new Date();
        date.setTime(timestamp*1000)
        year=date.getFullYear();
        month=date.getMonth()+1;
        dateStr=date.getDate();
        hour=date.getHours();
        return year+"-"+(month<10?("0"+month):month)+"-"+(dateStr<10?("0"+dateStr):dateStr)+" "+(hour<10?("0"+hour):hour)+":00:00";
      },
      getData(){
        var self=this;
        var activePageItem=self.tabTitles[self.activePage];
        //console.log(encodeURI(activePageItem.startTime));
        this.post('appapi','gettqglist',{starttime:activePageItem.startTime,endtime:activePageItem.endTime,pageno:activePageItem.pageno,pagesize:self.pagesize},function(data){
          self.loadShow=false;
          console.log(data);
          //self.tabList.push(data);
          if(data.results){
            activePageItem.dataList=activePageItem.dataList.concat(data.results.results)
            
            activePageItem.pageno++;
          }
          
        });
      },
      wxcTabPageCurrentTabSelected(e){
        const self=this;
        self.activePage=e.page;
        if(self.tabTitles[self.activePage].pageno==1){
          self.getData();
        }
        //self.setTime()
      },
      loadmore(e){
        //上拉加载
        const self=this;
        self.getData();
      }
    }
  }
</script>

<style scoped>
  .list{
    width: 750px;
  }
  .item-container {
    width: 750px;
  }

  .border-cell {
    background-color: #f2f3f4;
    width: 750px;
    height: 60px;
    align-items:center;
    flex-direction:row;
    justify-content:space-between;
  }
 
  .header-text{
    border-left-color: red;
    border-left-width: 4px;
    border-left-style: solid;
    margin-left:10px;
    padding-left: 10px;
    line-height: 30px;
    height: 30px;
    font-size: 24px;
    color:#333;
  }
  .header-time{
    margin-right:20px;
    line-height: 50px;
    font-size: 20px;
    color:#999;
  }
  .cell {
    border-bottom-style: solid;
    border-bottom-color: #eee;
    border-bottom-width: 1px;
    /* width: 360px; */
  }

  .content{
    width:750px;
    height:300px;
    border-bottom-width:1px;
    align-items: center;
    justify-content: center;
  }
  .hg-tbox1{
    background-color:#f1f1f1;
  }
  .hg-row {
    flex-direction: row;
  }
  .hg-list {
    background-color:#ededed;
  }
  .A-tit{
    margin-left: 20px;
    width:470px;
    height:240px;
    /* background-color: #333; */
  }
  .between{
    justify-content:space-between;
    width:460px;
  }
  .A-title {
    height: 100px;
    line-height: 50px;
    font-size: 30px;
    padding-left: 10px;
    padding-right: 10px;
    text-overflow:ellipsis;
    lines:2;
    font-size: 28px;
  }
  .A-sold,.A-price{
    font-size: 18px;
    color: #999;
  }
  .A-sold{
    margin-top:11px;
  }
  .A-price{
    margin-left:10px;
    margin-top:19px;
    text-decoration: line-through;
  }
  .btn{
    height:50px;
    line-height:50px;
    width:120px;
    text-align: center;
    border-radius:8px;
    font-size:24px;
  }
  .wc{
    color:white;
  }
  .rc{
    color: #e82c65;
  }
  .gc{
     color: green;
  }
  .rg{
    background-color: #e82c65;
  }
  .gb{
    background-color: green;
  }
  .A-vp{
    padding-left:5px;
    font-size: 34px;
    font-weight: bold;
    color:#e82c65;
    line-height: 50px;
  }
  .A-vp1{    
    padding-left:5px;
    font-size: 34px;
    color:green;
    line-height: 30px;
  }
  .A-vp2{    
    font-size: 26px;
    color:green;
    line-height: 30px;
  }

  .A-image-box{
    width:750px;
    padding-top: 20px;
    padding-bottom: 20px;
    background-color:white;
  }
  .A-parameter{
    height:50px;
    width:470px;
    position:absolute;
    bottom:0;
    left:10px;
  }
  .A-image {
    width: 240px;
    height: 240px;
    border-top-left-radius:2px;
    border-top-right-radius:2px;
    
  }
  .card-progress {
    width: 220px;
    height: 30px;
    /* border-radius: 20px; */
    position: absolute;
    bottom:70px;
    left: 10px;
  }
  .progress{
     /* width: 220px;
     height: 30px;
     border-radius: 20px;
     position: relative;
     background-color: #ededed;
     flex-direction:row;
     align-items: center; */
     /* position: relative; */
     border-width:1px; 
     border-style:solid; 
     border-color:#ffcccc; 
  }
  /* .card-progress-to {
    height: 30px;
    background-color:#FEC1C1;
    border-bottom-left-radius: 20px;
    border-top-left-radius: 20px;
  }
  .card-progress-end {
    height: 30px;
    border-bottom-right-radius: 20px;
    border-top-right-radius: 20px;  
  } */
  .card-got {
    width: 150px;
    color: #e82c65;
    position: absolute;
    top:0px;
     font-size: 20px;
     line-height: 30px;
     text-align:center;
  } 
  .tab-bar{
    background: #2e3a47;
  }
  .tab-item{
    width: 187.5px;
    height: 90px;
    justify-content:center;
  }
  .tab-title,.tab-title-first{
    font-weight:bold;
    color: #eee;
    text-align: center;
    margin-bottom: 5px;
  }
  .tab-title{
    font-size:34px;
  }
  .tab-title-first{
    font-size:30px;
  }
  .tab-text{
    color: #eee;
    font-size:22px;
    text-align: center;
  }
 
</style>