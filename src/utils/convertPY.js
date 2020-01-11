/**
 * 中文字符串转化为拼音
 */
function hash(_key, _value) {
  this.key = _key; // 拼音*/
  this.value = _value; // ascii码*/
}
// javascript 的自定义对象，用于存放汉字拼音数据字典*/
function dictionary() {
  this.items = [];
  this.add = function(_key, _value) {
    this.items[this.items.length] = new hash(_key, _value);
  }
}
var d = new dictionary();
d.add("a", [38463]);
d.add("an", [23433, 38797]);
d.add("ba", [24052, 22365]);
d.add("bai", [30333, 30334]);
d.add("bao", [21253, 23453, 20445]);
d.add("bei", [21271]);
d.add("ben", [26412]);
d.add("beng", [34444]);
d.add("bi", [27605]);
d.add("bin", [28392]);
d.add("bo", [20147, 21338]);
d.add("cang", [27815]);
d.add("chang", [38271, 26124, 24120]);
d.add("chao", [26397, 28526]);
d.add("chen", [37108]);
d.add("cheng", [25104, 25215, 28548, 22478]);
d.add("chi", [27744, 36196]);
d.add("chong", [37325, 23815]);
d.add("chu", [28353, 26970]);
d.add("da", [36798, 22823]);
d.add("dan", [20025, 20747]);
d.add("de", [24503]);
d.add("di", [36842]);
d.add("ding", [23450]);
d.add("dong", [19996]);
d.add("e", [37122]);
d.add("en", [24681]);
d.add("er", [23572]);
d.add("fang", [38450]);
d.add("feng", [39118]);
d.add("fo", [20315]);
d.add("fu", [31119, 25242, 38428]);
d.add("gan", [29976, 36195]);
d.add("gu", [22266]);
d.add("guan", [35266]);
d.add("guang", [24191]);
d.add("gui", [36149, 26690]);
d.add("guo", [26524]);
d.add("ha", [21704]);
d.add("hai", [28023]);
d.add("han", [37039, 27721]);
d.add("hang", [26477]);
d.add("he", [21512, 21644, 27827, 33743, 36154, 40548]);
d.add("hei", [40657]);
d.add("heng", [34913]);
d.add("hong", [32418]);
d.add("hu", [21628, 28246, 33899]);
d.add("hua", [33457]);
d.add("huai", [24576, 28142]);
d.add("huang", [40644]);
d.add("hui", [24800]);
d.add("ji", [40481, 21513, 27982]);
d.add("jia", [20339, 22025]);
d.add("jiang", [27743]);
d.add("jiao", [28966]);
d.add("jie", [25581]);
d.add("jin", [37329, 38182, 26187]);
d.add("jing", [33606, 26223]);
d.add("jiu", [20061, 37202]);
d.add("ka", [21888]);
d.add("kai", [24320]);
d.add("kang", [24247]);
d.add("ke", [21487, 20811]);
d.add("kui", [33909]);
d.add("kun", [26118]);
d.add("la", [25289]);
d.add("lai", [26469, 33713]);
d.add("lan", [20848]);
d.add("lang", [24266]);
d.add("le", [20048, 21202]);
d.add("li", [31163, 20029, 37324]);
d.add("lian", [36830]);
d.add("liang", [20937]);
d.add("liao", [36797, 32842]);
d.add("lin", [26519, 20020]);
d.add("ling", [38517]);
d.add("liu", [26611, 20845]);
d.add("long", [40857, 38471]);
d.add("lou", [23044]);
d.add("lu", [27896, 36335]);
d.add("lv", [21525]);
d.add("luo", [27931, 28463]);
d.add("ma", [39532]);
d.add("mao", [33538]);
d.add("mei", [30473, 26757]);
d.add("mian", [32501]);
d.add("mu", [29281]);
d.add("na", [37027]);
d.add("nan", [21335]);
d.add("nei", [20869]);
d.add("ning", [23425]);
d.add("nu", [24594]);
d.add("pan", [25856, 30424]);
d.add("ping", [24179, 33805]);
d.add("pu", [33670, 28654, 26222]);
d.add("qi", [19971, 40784]);
d.add("qian", [28508, 40660]);
d.add("qin", [38054, 31206]);
d.add("qing", [38738, 28165, 24198]);
d.add("qiong", [29756]);
d.add("qu", [26354, 34914]);
d.add("quan", [27849, 33603]);
d.add("ri", [26085]);
d.add("san", [19977]);
d.add("se", [33394]);
d.add("sha", [27801]);
d.add("shan", [23665, 27733, 21892]);
d.add("shang", [21830, 19978]);
d.add("shao", [38902, 37045, 32461]);
d.add("shen", [28145, 31070, 27784]);
d.add("sheng", [22307]);
d.add("shi", [21313, 30707, 24066]);
d.add("shuang", [21452]);
d.add("shuo", [26388]);
d.add("shun", [39034]);
d.add("si", [22235]);
d.add("song", [26494]);
d.add("su", [33487, 23487, 33487]);
d.add("sui", [32485, 38543, 36930]);
d.add("ta", [22612]);
d.add("tai", [21488, 22826, 27888]);
d.add("tang", [21776]);
d.add("tian", [22825]);
d.add("tie", [38081]);
d.add("tong", [36890, 38108]);
d.add("tu", [22270, 21520]);
d.add("tun", [23663]);
d.add("wan", [28286, 19975]);
d.add("wang", [26395]);
d.add("wei", [23041, 28493, 28205]);
d.add("wen", [28201, 25991]);
d.add("wu", [20044, 26080, 21556, 33436, 26791, 20116, 27494]);
d.add("xi", [35199, 38177]);
d.add("xia", [21414]);
d.add("xian", [20185, 21688]);
d.add("xiang", [28248, 35140]);
d.add("xiao", [23389]);
d.add("xin", [24571, 26032, 20449]);
d.add("xing", [37026, 20852]);
d.add("xu", [24464, 35768]);
d.add("xuan", [23459]);
d.add("ya", [38597]);
d.add("yan", [28895, 24310, 30416, 24422]);
d.add("yang", [25196, 38451]);
d.add("yi", [20234, 23452, 30410]);
d.add("yin", [38134, 38899]);
d.add("ying", [40560, 33829]);
d.add("yong", [27704]);
d.add("you", [27833]);
d.add("yu", [27014, 29577]);
d.add("yuan", [20803]);
d.add("yue", [23731]);
d.add("yun", [20113, 36816]);
d.add("zao", [26531]);
d.add("zhan", [28251]);
d.add("zhang", [24352, 28467]);
d.add("zhao", [26157, 32903]);
d.add("zheng", [38215, 37073]);
d.add("zhong", [20013]);
d.add("zhou", [33311, 21608]);
d.add("zhu", [26666, 29664, 39547]);
d.add("zi", [36164, 28100, 33258]);
d.add("zun", [36981]);
//通过查找字典得到与ascii码对应的拼音*/
function getKey(code) {
  let res = ''
  d.items.filter(v => {
    if (v.value.indexOf(code) != -1) {
      res = v.key
      return
    }
  })
  return res
}
//转为小写*/
function convertToPinyinLower(str) {
  // let arr = []
  // str.forEach(v => {
  //   var result = "";
  //   let ascCode = v.charCodeAt(0)
  //   result = getKey(ascCode);
  //   arr.push(ascCode)
  // })
  // console.log(arr)

  var result = [];
  for (let i = 0; i < str.length; i++) {
    let ascCode = str.charCodeAt(i)
    result.push(getKey(ascCode));
  }
  return result;
}
module.exports = {
  convertToPinyinLower: convertToPinyinLower
}