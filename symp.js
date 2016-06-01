var jing = ["太阳", "阳明", "少阳", "厥阴", "少阴", "太阴", "太阳 太阴","太阴 厥阴",
	"太阳 阳明", "太阳 少阳", "太阳 少阴", "阳明 太阳", "太阳 阳明 少阳", "太阴 少阴 厥阴", ""];

                        //   0,     1,     2,      3,      4,     5,     6,      7,     8,     9,     10,    11,    12,      13,      14,     15
var zconts = new Array(     " ",   " ",   "痰",  "咳",   "呕",   "气",  "晕",   "悸",  "痛",  "痒",  "疮",   "疹",  "胀",   "伤",    "寒",   "热",
		                    "苦",  "甜",  "酸",  "辛",   "咸",   "烦",  "闷",   "狂",  "干",  "湿",  "黄",   "黑",  "绿",   "白",    "红",   "强", 
							"弱",  "浮",  "沉",  "数",   "迟",   "滑",  "弦",   "细",  "芤",  "涩",  "代 ",  "平",   " ",   "  ",     " ",    " ",  "" );
var bcolms = new Array(      " ",  " ",   "心",  "头",   "眼",   "口",  "舌",   "鼻",  "耳",  "咽",  "面",   "脑后","颈",   "胸",     "胃",  "少腹",
                            "背",  "腰",  "臀",  "生殖", "臂",   "腿",  "膝",  "腘窝", "脚",  "大便","小便", "形",  "脉",  "骨",    " ",      " ",  " ", " ");

var tmsg = "头疼";
var ARRAYLEN = 32*48;
var ARRAYWIDTH = 32;
var symp_array = [0];

var hintmsg = "";


function getbody(smsg)
{
	var get_tou = RegExp("头|脑");
	var get_touding = RegExp("顶");
	var get_touhou = RegExp("后脑|脑后");
	var get_yan = RegExp("眼|睛|目");
	var get_kou = RegExp("口|嘴");
	var get_she = RegExp("舌|舌胎");
	var get_yang = RegExp("[咽喉]|嗓子");
	var get_bi = RegExp("鼻");
	var get_xing = RegExp("形|身|身体");
	var get_er = RegExp("耳");
	var get_mian = RegExp("面|脸");
	var get_jing = RegExp("颈|脖子");
	var get_xiong = RegExp("胸");
	var get_wei = RegExp("胃");
	var get_fu = RegExp("腹|肚子");
	var get_bei = RegExp("背|后背");
	var get_yao = RegExp("腰");
	var get_tun = RegExp("臀|屁股");
	var get_shengzhi = RegExp("阳|阴|生殖|阴器|阴茎|阴道");
	var get_tui = RegExp("腿");
	var get_gebo = RegExp("臂|胳膊|膀|肘|手");
	var get_xi = RegExp("膝");
	var get_guowo = RegExp("腘窝");
	var get_jiao = RegExp("脚|踝");
	var get_dabian = RegExp("大便|屎");
	var get_xiaobian = RegExp("小便|尿");
	var get_mai = RegExp("脉");
	var get_xin = RegExp("心|感觉|眠|睡");
	
	for (var i = 0; i < bcolms.length; i++) {
		if (bcolms[i].match(get_tou) && smsg.match(get_tou)) {
			console.log(smsg);
			return i;
		}
		if (bcolms[i].match(get_xin) && smsg.match(get_xin)) {
			return i;
		}
		if (bcolms[i].match(get_touhou) && smsg.match(get_touhou)) {
			return i;
		}
		if (bcolms[i].match(get_touding) && smsg.match(get_touding)) {
			return i;
		}
		if (bcolms[i].match(get_yan) && smsg.match(get_yan)) {
		    return i;
		}
		if (bcolms[i].match(get_kou) && smsg.match(get_kou)) {
			return i;
		}
		if (bcolms[i].match(get_she) && smsg.match(get_she)) {
			return i;
		}
		if (bcolms[i].match(get_yang) && smsg.match(get_yang)) {
			return i;
		}
		if (bcolms[i].match(get_bi) && smsg.match(get_bi)) {
			return i;
		}
		if (bcolms[i].match(get_er) && smsg.match(get_er)) {
			return i;
		}
		if (bcolms[i].match(get_mian) && smsg.match(get_mian)) {
			return i;
		}
		if (bcolms[i].match(get_jing) && smsg.match(get_jing)) {
			return i;
		}
		if (bcolms[i].match(get_xiong) && smsg.match(get_xiong)) {
			return i;
		}
		if (bcolms[i].match(get_fu) && smsg.match(get_fu)) {
			return i;
		}
		if (bcolms[i].match(get_bei) && smsg.match(get_bei)) {
			return i;
		}
		if (bcolms[i].match(get_yao) && smsg.match(get_yao)) {
			return i;
		}
		if (bcolms[i].match(get_tun) && smsg.match(get_tun)) {
			return i;
		}
		if (bcolms[i].match(get_shengzhi) && smsg.match(get_shengzhi)) {
			return i;
		}
		if (bcolms[i].match(get_tui) && smsg.match(get_tui)) {
			return i;
		}
		if (bcolms[i].match(get_gebo) && smsg.match(get_gebo)) {
			return i;
		}
		if (bcolms[i].match(get_xi) && smsg.match(get_xi)) {
			return i;
		}
		if (bcolms[i].match(get_guowo) && smsg.match(get_guowo)) {
			return i;
		}
		if (bcolms[i].match(get_jiao) && smsg.match(get_jiao)) {
			return i;
		}
		if (bcolms[i].match(get_dabian) && smsg.match(get_dabian)) {
			return i;
		}
		if (bcolms[i].match(get_xiaobian) && smsg.match(get_xiaobian)) {
			return i;
		}
		if (bcolms[i].match(get_mai) && smsg.match(get_mai)) {
			return i;
		}
		if (bcolms[i].match(get_xing) && smsg.match(get_xing)) {
			return i;
		}
	}
	return 0xff;
}

function getsymptom(smsg)
{
    var re = new RegExp("[\u4e00-\u9fa5]+", 'g');
	var fix_tong = new RegExp("[痛疼]");
	var fix_tan = new RegExp("痰");
	var fix_ke = new RegExp("[咳嗽喘]");
	var fix_tu = new RegExp("[吐呕]|恶心");
	var fix_yun = new RegExp("[晕昏眩]|迷糊");
	var fix_ji = new RegExp("[悸慌]");
	var fix_yang = new RegExp("痒|刺痒");
	var fix_chuang = new RegExp("[疮痈脓]");
	var fix_zhen = new RegExp("[疹]|疙瘩");
	var fix_zhang = new RegExp("[胀肿满]");
	var fix_shang = new RegExp("伤|破了|破皮");
	var fix_han = new RegExp("[寒冷凉冰]");
	var fix_re = new RegExp("热");
	var fix_ku = new RegExp("苦" );
	var fix_tian = new RegExp("[甜甘]");
	var fix_xin = new RegExp("[辛辣]");
	var fix_suan = new RegExp("酸");
	var fix_xian = new RegExp("咸");
	var fix_fan = new RegExp("烦燥|烦躁|烦");
	var fix_men = new RegExp("闷|憋|堵");
	var fix_kuang = new RegExp("狂|狂妄|疯");
	var fix_gan = new RegExp("干|干躁|干燥");
	var fix_shi = new RegExp("湿|汗");
	var fix_huang = new RegExp("黄|橙");
	var fix_hei = new RegExp("黑|灰|不醒");
	var fix_bai = new RegExp("白|不着");
	var fix_hong = new RegExp("红|紫");
	var fix_qing = new RegExp("青|绿|翠");
	var fix_lan = new RegExp("蓝");
	var fix_qiang = new RegExp("强|壮");
	var fix_ruo = new RegExp("弱|瘦|不举|痿");
	var fix_mfu = new RegExp("浮");
	var fix_mchen = new RegExp("沉|重");
	var fix_mchi = new RegExp("迟|缓");
	var fix_mshuo = new RegExp("数|洪|大");
	var fix_mxian = new RegExp("弦|紧");
	var fix_mhua = new RegExp("滑");
	var fix_mdai = new RegExp("代");
	var fix_mjie = new RegExp("节");
	var fix_mkou = new RegExp("芤");
	var fix_mse = new RegExp("涩");
    
	for (var i = 0; i < zconts.length; i++) {
		if (zconts[i].match(fix_tong) && smsg.match(fix_tong)) {
			hintmsg = "胃痛吗？"
            return i;
		}
		if (zconts[i].match(fix_tan) && smsg.match(fix_tan)) {
            return i;
		}
		if (zconts[i].match(fix_ke) && smsg.match(fix_ke)) {
            return i;
		}
		if (zconts[i].match(fix_tu) && smsg.match(fix_tu)) {
            return i;
		}
		if (zconts[i].match(fix_yun) && smsg.match(fix_yun)) {
            return i;
		}
		if (zconts[i].match(fix_ji) && smsg.match(fix_ji)) {
            return i;
		}
		if (zconts[i].match(fix_yang) && smsg.match(fix_yang)) {
            return i;
		}
		if (zconts[i].match(fix_chuang) && smsg.match(fix_chuang)) {
            return i;
		}
		if (zconts[i].match(fix_zhen) && smsg.match(fix_zhen)) {
            return i;
		}
		if (zconts[i].match(fix_zhang) && smsg.match(fix_zhang)) {
            return i;
		}
		if (zconts[i].match(fix_shang) && smsg.match(fix_shang)) {
            return i;
		}
		if (zconts[i].match(fix_han) && smsg.match(fix_han)) {
            return i;
		}
		if (zconts[i].match(fix_re) && smsg.match(fix_re)) {
            return i;
		}
		if (zconts[i].match(fix_ku) && smsg.match(fix_ku)) {
            return i;
		}
		if (zconts[i].match(fix_tian) && smsg.match(fix_tian)) {
            return i;
		}
		if (zconts[i].match(fix_suan) && smsg.match(fix_suan)) {
            return i;
		}
		if (zconts[i].match(fix_xin) && smsg.match(fix_xin)) {
            return i;
		}
		if (zconts[i].match(fix_xian) && smsg.match(fix_xian)) {
            return i;
		}
		if (zconts[i].match(fix_fan) && smsg.match(fix_fan)) {
            return i;
		}
		if (zconts[i].match(fix_men) && smsg.match(fix_men)) {
            return i;
		}
		if (zconts[i].match(fix_kuang) && smsg.match(fix_kuang)) {
            return i;
		}
		if (zconts[i].match(fix_gan) && smsg.match(fix_gan)) {
            return i;
		}
		if (zconts[i].match(fix_shi) && smsg.match(fix_shi)) {
            return i;
		}
		if (zconts[i].match(fix_huang) && smsg.match(fix_huang)) {
            return i;
		}
		if (zconts[i].match(fix_qing) && smsg.match(fix_qing)) {
            return i;
		}
		if (zconts[i].match(fix_hong) && smsg.match(fix_hong)) {
            return i;
		}
		if (zconts[i].match(fix_hei) && smsg.match(fix_hei)) {
            return i;
		}
		if (zconts[i].match(fix_bai) && smsg.match(fix_bai)) {
            return i;
		}
		if (zconts[i].match(fix_qiang) && smsg.match(fix_qiang)) {
            return i;
		}
		if (zconts[i].match(fix_ruo) && smsg.match(fix_ruo)) {
            return i;
		}
		if (zconts[i].match(fix_mhua) && smsg.match(fix_mhua)) {
            return i;
		}
		if (zconts[i].match(fix_mshuo) && smsg.match(fix_mshuo)) {
            return i;
		}
		if (zconts[i].match(fix_mfu) && smsg.match(fix_mfu)) {
            return i;
		}
		if (zconts[i].match(fix_mchen) && smsg.match(fix_mchen)) {
            return i;
		}
		if (zconts[i].match(fix_mchi) && smsg.match(fix_mchi)) {
            return i;
		}
		if (zconts[i].match(fix_mxian) && smsg.match(fix_mxian)) {
            return i;
		}
		if (zconts[i].match(fix_mjie) && smsg.match(fix_mjie)) {
            return i;
		}
		if (zconts[i].match(fix_mdai) && smsg.match(fix_mdai)) {
            return i;
		}
		if (zconts[i].match(fix_mkou) && smsg.match(fix_mkou)) {
            return i;
		}
		if (zconts[i].match(fix_mse) && smsg.match(fix_mse)) {
            return i;
		}
	}
	
	return 0xff;
	//return smsg.match(fix_tong);
	//return strfang.match(re);
}

var ttmsg = "头疼";
//console.log(getsymptom(ttmsg));
//console.log(getbody(ttmsg));

function reset_symparray ()
{
	for (var i = 0; i < ARRAYLEN; i++)
	    symp_array[i] = 0;
};

var defaultmsg = ["请直接说不舒服之处", "不舒服?", "好吧，说你哪里病了", "。。。", "你没事吧？"];
var symp_answer = ["还有呢？","其他还有么","嗯。。。还有么？"];
var brain_answer = "are you ok?";
var sc = 0;

function get_symparray(smsg)
{
	var i, j;
	i = getsymptom(smsg);
	j = getbody(smsg);
	if (i === 0xff && j === 0xff) {
		symp.state = "askall";
		symp.hintmsg = defaultmsg[Math.round(Math.random() % defaultmsg.length)];
	   	return;
	}
	if (i === 0xff) {
		symp.state = "asksymp";
		symp.hintmsg = "您"+bcolms[j]+"怎么了？";
		return;
	}
	if (j === 0xff) {
		symp.state = "askbody";
		symp.hintmsg = "您哪里"+zconts[i]+"了？";
	   	return;
	}
    symp.state = "";
	symp.hintmsg = "";
	if (sc == 0)
		symp.reset();
	sc += 1;
	if (sc === 4) {
	    symp.doit = 0xaa, sc = 0;
	}
	symp.answer = symp_answer[Math.round(Math.random() % symp_answer.length)];
	symp_array[(i-1)*(ARRAYWIDTH+1)+j-1] = 0xff;
}

function get_symp_array()
{
	console.log(symp_array.join());
	return symp_array;
}

function giveme_symparray (smsg)
{
	var msg_type = Object.prototype.toString.call(smsg);

	if (msg_type === "[object Array]") {
		var symp_count = 0;
        for (var i = 0; i < smsg.length; i++) {
			symp_count += getsymptom(smsg[i]);
		}
		var symp = getsymptom(smsg[smsg.length-1]);
		if (Math.floor(symp_count/0xff) === (smsg.length-1)) {
			for (var i = 0; i < smsg.length-1; i++) {
				smsg[i] = smsg[i] + zconts[symp];
			}
		}
		smsg.forEach(function(msg) {
				get_symparray(msg);
		});
		
	}
	if (msg_type === "[object String]") {
		get_symparray(smsg);
	}
	console.log("symp "+smsg);
}
var symp = {};
symp.state = "";
symp.getarray = get_symp_array;
module.exports = symp;
symp.reset = reset_symparray;
symp.giveme = giveme_symparray;
symp.hintmsg = hintmsg;
//giveme_symparray(["头疼","腿疼"].join());
//giveme_symparray("头疼");
