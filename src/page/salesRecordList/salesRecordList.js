/**
 * 我的分润 余额明细 lin
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/nexter',
    'h5/js/common/storage'
],function($, URL, Data, Common, Nexter, Storage){
    //获取URL参数  URL.param.mode=='obtain'

    var Page,		//页面
        main_section = '#profitPage', //主区块
        list_type= 0,
        listDiv = '.presentList',
        profitCountData     //分润统计数据
        ;

    function init() {

        profit_index(); //首页页面
        bindEvents();  //绑定事件

    }

    //首页
    function profit_index() {
        var money = URL.param.money;
        var buttom_html = '<section id="buttom_and_money"><div class="use_money_content">当前可提资金:<span class="use_money">'+money+'</span></div><div class="sub-button"><a class="withdraw">我要提现</a></div></section>';
        Page = $('<section id="profitPage"></section>'+buttom_html).appendTo('body');
        Common.headerHtml('余额明细','',false,'#profitPage');
        $('#profitPage').append('<div class="grid main page-main page-content"></div>');
        $('.main').prepend('<div class="row present-button clearfix"><div class="col active" data-status="3">全部</div><div class="col " data-status="1">可提现</div><div class="col " data-status="2">不可提现</div></div>');

        $('.present-button div').each(function (i) {
            $('.main').append('<div class="presentList" data-role-scrollable="true"><ul></ul></div>');

        });
        $('.presentList').hide();


        $('.present-button div:first-child').addClass('active');
        var tatget = $('.presentList').eq(0);
        tatget.show();
        initNexter(3, tatget);

    }


    //绑定事件
    function bindEvents() {
        Page.on('tap', '.present-button div', function (event) {
            event.preventDefault();
            var target = $(this),
                status,
                key,
                present_list;

            target.siblings().removeClass('active');
            target.addClass('active');
            status = target.data('status');
            key = $(this).index();
            present_list = $('.presentList').eq(key);
            if (present_list.find('ul li').length == 0) {
                initNexter(status, present_list);

            }

            $('.presentList').hide();
            present_list.show();

        }).on('tap','.withdraw',function(){
            location.href = URL.reqGetPayHtm;
        });

    }

    //获取分润统计数据
    function initNexter(status_code, ele) {

        var nexter = new Nexter({
            element: ele,
            dataSource: Data.salesRecordList,
            pageSize:15,
            data: {
                isCanGetPay: status_code
            },
            enableScrollLoad: true
        }).on('load:success', function (res) {
            console.log(res);
            list_type = $('.present-button .active').data('status');
            var list_key = 0;

            switch (list_type){
                case 3:
                    list_key = 0;
                    break;
                case 1:
                    list_key = 1;
                    break;
                case 2:
                    list_key = 2;
                    break;
                default:
                    break;

            }

            var rec_list_len = $('.presentList').eq(list_key).find('li').length;
            if (res.list.length > 0 || rec_list_len > 0) {
                htmlItems(res.list, ele);
            }else{
                ele.find('ul').html('<li class="emptyMsg"><img src="' + imgPath + 'common/images/balance_empty.png"/> </li>');

            }

        }).render().load();
    }

    //数据HTML
    function htmlItems(items, ele) {
            var fans_html = '<div class="row fans_info"><div class="fans">粉丝:<span class="fans_namet">{{buyerName}}</span><!--{{contactsLevel}}度--></div><div class="fans_money">推广费:<span class="money_num">{{shareFee}}</span></div></div> ',
            template = '<li><div class="row row_border"> <div class="col col-15"><p class="ellipsis">{{itemName}}</p><p class="order_num">订单号：{{tradeId}}</p><p class="order_time">下单时间：<span>{{_htmlCreateTime}}</span></p></div><div class="col col-5 fb far fvc"><span class="status_img"><img src="{{statusImg}}" alt=""></span></div></div>'+fans_html+'</li>'
        $.each(items, function (index, item) {
            item._htmlCreateTime = bainx.formatDate('Y-m-d H:i', new Date(item.dateCreated));

            //是否可提现(0=不可提现;1=可提现;)
            item.statusImg = (item.isCanGetPay == 1) ? imgPath+'common/images/icon_withdrawal.png' : imgPath+'common/images/icon_withdrawal_n.png' ;

            ele.find('ul').append(bainx.tpl(template, item));

        });

        $(listDiv, Page).on('scroll', function () {
            $(this).attr('scroll-top', $(this).scrollTop());
        });
    }

    init();
});