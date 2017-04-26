/**
 * 页面全部是图片的活动页
 */
require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/storage',
    'h5/js/common/url'
], function ($, Data, Common, Storage, URL) {
    var Page,
    pUserId = URL.param.pUserId;

    function init() {
        $('.waitting').hide();
        render();
        Common.to_Top('#indexPage');        //返回顶部
    }

    function render() {
        var active_name = URL.param.active_name,
            goods_key = (active_name ? active_name : 'cg'),
            goods_list_html = '',
            page_title = '女人，要能驾驭红色',
        goods_list = {  //第一个位置是图片的类名字,默认100%;img50表示宽度为:50%
            cg:['',8974,8706,8684,8695,8865,8864,8867,8868,8869,8383], //唇膏页面
            jmg:['',8836,8654,8678,8835,8834,8837,8679,8981,8647,8207,9101,8943,8646,8872,8871,8944,8940], //睫毛膏页面
            kxcz:['',8213,8167,8171,8221,8219,8197,8181,8199,8195,8191], //开学彩妆页面
            qd:['',8952,8890,8183,8395,8211], //祛痘页面
            hghzp:['',8189,8191,8203,8357,8366,8367,8368,8369,8370,8373], //韩国化妆品
            fsgls:['',8357,8694,8859,8860,9048,10596,10602,10603,10616,10774,10875], //防晒隔离霜
            jmgyxb:['',8643,8644,8645,8936,8937,10388,10389,10418,10419,10403],//睫毛膏眼线笔
            qdbb:['',8213,8842,10550,10563,10572,10767,10774,11127], //气垫BB
            xzs:['',8167,8171,8219,8221,8361,8365,8396,8657,8942,9071,10574], //卸妆水
            xzs2:['',8167,8171,8219,8221,8361,8365,8396,8657,8942,9071,10574], //卸妆水 跟上面一样
            chjzy:['',12275,12276,12274,12277,12278], //吃货集中营
            jfzc: ['',10506, 10502, 11433, 11161, 11427], //减肥专场
            mbzc: ['',8169, 8829, 10394, 8682, 10395, 10876], //眉笔专场
            czfd:['',8699,8702,8842,8855,10398,10400,8856,8857,10401,10801,10802,10803,10804,11705,8841,8870,10406,10407,8700,10408,10409,10410], //彩妆粉底
            ppxs:['img50',8660,8947,8966,8977,9563,9564,9566,9568,9576,9577,9579,9582,9583,9586,9590,9594,11906,11912], //品牌香水
            spzc:['img50',9191,9190,9194,9203,9196,9197,9189,9204,9177,9198,9179,9182,9185,9202,9178,9326,9307,9307], //食品
            xmnzc:['',8373,8965,8666,8364,8848,10568,11123,10879,11322,12498], //洗面奶专场
            xfsxf:['',8387,8346,8355,8384,12105,11762,8367,12831,12834,12856,12869],  //洗发水修复
            bbbjp:['',11573,11425,11575,12803,12789,12763,12751,11087,11099,11407,11577],//宝宝保健品
            mm:['',8960,8225,8103,8215,8237,8231,11808,8165,8227,8351,8358,8388,8826,10439,10579,13113,13115], //面膜
            xzls:['img50',10867,11856,12048,9004,9170,10787,10792,11836,11838,12002,12032,12144,10793,10795,10865,11832,11834,12152,12154,12156], //小资零食
            bbxh:['',10619,10624,11888,12228,13252,13265,13276,13272,10609], //宝宝洗护
            xhjp:['img50',12881,12411,12407,12405,12391,12385,12369,12361,12353,12341,12337,12335,12331,12322,12321,12319,12315,12226,12224,10626], //洗护精品
            zjyzc:['',8638,10454,10456,10455,10463,10464,10465,10466,8932],//指甲油
            sfszc:['img50',8235,8223,8239,8689,8686,8844,8845,9052,9113,10766,10522,10528,10537,10569,11207,11304,11121,11125,8175,11709,11735,11942,12549,12611],//护肤水专场
            zxzc:['img50',11229,10774,8662,11127,14810,10767,11687,13165,13169,13153,11358,11261,12109,10797,10798,10799,10800,10404,10405,8933],//遮瑕专场
            tnsgzc:['',11093,15363,'',15365,15366,11095,11097,11091,11089],//童年时光专场
            swybysy:['',9344,14898,12273,11707,15148,15145],//15元包月试用
            csypzchd:['img50',13980,13984,13988,13990,13994,13998,14002,14008,14012,14018,14020,13970,14220,14218,14214,14210,14204,14202,14308,14305,14303,14297],//床上用品专场活动

        };

        //更改页面标题
        switch (goods_key){
            case 'jmg':
                page_title = '将你的眼变成最亮的星';
                break;
            case 'kxcz':
                page_title = '开学不吃土，美丽hold的住';
                break;
            case 'qd':
                page_title = '全民打痘痘';
                break;
            case 'hghzp':
                page_title = '看太阳的后裔，留住青春的美丽';
                break;
            case 'fsgls':
                page_title = '防晒隔离  做阳光女神';
                break;
            case 'jmgyxb':
                page_title = '眼线笔  放肆流泪，放肆笑，坚守女人最后的骄傲';
                break;
            case 'qdbb':
                page_title = 'BB霜  让肌肤轻“妆”上阵';
                break;
            case 'xzs':
                page_title = '卸妆油   卸妆之后，美丽依旧';
                break;
            case 'chjzy':
                page_title = '吃货集中营';
                break;
            case "jfzc":
                page_title = "三月不减肥五月徒伤悲";
                break;
            case "mbzc":
                page_title = "美妹一定要有美眉";
                break;
            case "czfd":
                page_title = "让你的脸和春花一起姹紫嫣红";
                break;
            case "ppxs":
                page_title = "有缘千里来香会";
                break;
            case "spzc":
                page_title = "吃不了兜着走";
                break;
            case "xmnzc":
                page_title = "给面部春春雨般的滋润";
                break;
            case "xfsxf":
                page_title = "秀发也要像肌肤一样呵护";
                break;
            case "bbbjp":
                page_title = "让孩子赢在起跑之后";
                break;
            case "mm":
                page_title = "出门在外要有面子";
                break;
            case "xzls":
                page_title = "白领必备小资零食";
                break;
            case "bbxh":
                page_title = "天然洗护，呵护宝宝的肌肤";
                break;
            case "xhjp":
                page_title = "居家小达人，让你衣物洁净如新";
                break;
            case "zjyzc":
                page_title = "绚丽多彩【指】为你绽放";
                break;
            case "sfszc":
                page_title = "洁面后要给肌肤喝点水";
                break;
            case "zxzc":
                page_title = "无暇脸蛋也靠“妆”（遮瑕专场全场5.2折起）";
                break;
            case "tnsgzc":
                page_title = "ChildLife宝宝之家";
                break;
            case "swybysy":
                page_title = "15元包邮试用";
                break;
            case "csypzchd":
                page_title = "床上用品专场活动";
                break;
        }

        var bannerNum = 0;

        switch (goods_key) {
            case 'test':        //可轮播设置。bannerNum为轮播图的个数
                bannerNum = 2;
                break;
            default:
                break;
        }

        document.title = page_title;
        var goods_list_len = goods_list[goods_key].length,
            banner = '';

        for(var i=1;i<goods_list_len;i++){
            var _href=URL.goodsDetail+'?gid='+goods_list[goods_key][i];
            if(goods_list[goods_key][i]==''){
                _href='';
            }
            goods_list_html += '<img class="'+goods_list[goods_key][0]+'" src="'+imgPath+'allImgPage/'+goods_key+'/'+(i)+'.jpg" href="'+_href+'" tj_category="商品" tj_action="'+goods_list[goods_key][i]+'" tj_label="活动专场" />';
        }

        if (bannerNum > 0 ) {     //可轮播     top图片命名为top1、top2、top3、……
            var bannerHtml = [];
            for(var i =1;i < bannerNum+1 ;i++){
                bannerHtml.push('<li><img src="'+imgPath+'allImgPage/'+goods_key+'/top'+i+'.jpg" </li>');
            }
            banner = '<div id="banner" class="banner"><div class="slider-outer"><ul>'+bannerHtml.join('')+'</ul></div> <div class="carousel-status"> <ul></ul> </div></div>'
        }else{              //不可轮播
            banner ='<img src="'+imgPath+'allImgPage/'+goods_key+'/top.jpg">';
        }
        var html = '<div class="main" id="indexPage">'+banner+goods_list_html+'</div>';

        Page = $(html).appendTo('body');

        var _bLen = $('#banner img').length;
        if(_bLen > 1){
            require('slider', function(Slider) {

                Slider({
                    slideCell:"#banner",
                    titCell:".carousel-status ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                    mainCell:".slider-outer ul",
                    effect:"left",
                    autoPlay:true,//自动播放
                    autoPage:true, //自动分页
                    switchLoad:"_src" //切换加载，真实图片路径为"_src"
                });
            });
        }

        bindEvents();

    }

    function bindEvents() {
        Page.on('tap', '.shop-signs', function(event) {

        }).on('tap','.tit-search',function(event){
            //location.href = '';
        }).on('tap','[href]',function(event){
            event.preventDefault();
            Common.addPUserId($(this));
        });

    }

    init();
});

