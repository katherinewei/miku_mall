require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/countDown'
],function($, URL, Data, Common, CountDown){
    var count_down_time = 0;
    function init(){

        var page = renderPage();

        bindEvents(page);
    }

    function renderPage(){
        var template = '<section id="loginPage"><!--<h1 class="title">一键登录</h1>--><div class="grid"><div class="row mobileRow"><div class="col col-4 tr fb fvc far"><label class="pd-10">+86</label></div><div class="col col-21"><input class="mobile pd-10" type="tel" placeholder="请输入11位手机号" maxlength="11"></div></div><div class="row"><div class="col col-15"><input class="vercode tc pd-10" type="tel" placeholder="请输入4位验证码" maxlength="4"></div><div class="col col-10"><div class="button sendvercode ml-05">发送验证码</div></div></div></div><div class="panel"><div class="button submit">登录</div></div></section>';
        $('body').append(template);

        return $('#loginPage');
    }

    function bindEvents(page){
        page.on('keyup','.mobile',function(){
            getImgVerCode($(this).val());
        }).on('tap','.imgVerCode img',function(){
            $(this).attr('src',URL.getMobileVerificationCode+'?mobile='+$('.mobile').val()+'&r='+Math.random());
        }).on('tap', '.sendvercode', function(event){

            event.preventDefault();
            if(count_down_time == 0){
                sendVerCode(page, $(this));
            }
        }).on('tap', '.submit', function(event){

            event.preventDefault();
            submit(page, $(this));
        });
    }

    //获取图片验证码
    function getImgVerCode(vmobile){
        if (/^[\d]{11}$/gi.test(vmobile) && $('.imgVerCode').length == 0){
            $('.mobileRow').after('<div class="row imgVerCode"><div class="col col-15"><input class="imgvercodeI tc pd-10" type="tel" placeholder="请输入图中验证码获取短信验证码" maxlength="4"></div><div class="col col-7 fb fvc"><div class="imgVeC ml-05"><img src="'+URL.getMobileVerificationCode+'?mobile='+vmobile+'"/></div></div></div>');
        }else{
            $('.imgVerCode').remove();
        }
    }

    function startCountDown(btn){
        (new CountDown({
            time: 60,
            change: function(){
                count_down_time = this.time;
                btn.text(this.time + '秒');
                return this;
            },
            end: function(){
                btn.text('发送验证码').removeClass('disable');
                return this;
            }
        })).start();
    }

    function sendVerCode(page, btn){

        var mobile = $('.mobile', page),
            vmobile = $.trim(mobile.val()),
            yzmNO = $('.imgvercodeI', page),
            vyzmNO = $.trim(yzmNO.val());

        if (!vmobile) {
            bainx.broadcast(mobile.attr('placeholder'));
            return false;
        } else if (!/^[\d]{11}$/gi.test(vmobile)) {
            bainx.broadcast('请输入正确的手机号码！');
            return false;
        }
        else if(!vyzmNO){
            bainx.broadcast(yzmNO.attr('placeholder'));
            return false;
        }

        var doneFn = function(res) {
                btn.addClass('disable').text('60秒');
                startCountDown(btn);
            },
            failFn = function(code, json) {
                setTimeout(function() {
                    if (code === 7) {
                        btn.removeClass('disable').text('发送验证码');
                    } else {
                        btn.removeClass('disable').text('重新发送');
                    }
                }, 1000);
            };

        Common.statistics('login', 'sendcode', 'invoke', 1);

        btn.addClass('disable').text('正在处理..');

        return Data.checkMobile(vmobile,vyzmNO).done(doneFn).fail(failFn);
    }

    var startTime = new Date().getTime();

    function submit(page, btn){
        var mobile = $('.mobile', page),
            vercode = $('.vercode', page),
            data = {
                mobile: $.trim(mobile.val()),
                checkNO: $.trim(vercode.val()),
                pUserId:URL.param.pUserId
            };

        if (!data.mobile) {
            bainx.broadcast(mobile.attr('placeholder'));
            return;
        } else if (!/^[\d]{11}$/gi.test(data.mobile)) {
            bainx.broadcast('请输入正确的手机号码！');
            return;
        }

        if (!data.checkNO) {
            bainx.broadcast(vercode.attr('placeholder'));
            return;
        } else if (data.checkNO.length !== 4) {
            bainx.broadcast('请输入4位数字验证码');
            return;
        }

        btn.addClass('disable').text('用户登录中.');

        var doneFn = function(res) {
                btn.text('登录成功');
                if(URL.param.refurl){
                    URL.assign(decodeURI(URL.param.refurl));
                }else{
                    history.back();
                }
            },
            failFn = function() {
                btn.removeClass('disable').text('重新登录');
            };

        Common.statistics('login', 'sendcode', 'success', new Date().getTime() - startTime);


        return Data.login(data).done(doneFn).fail(failFn);
    }

    //入口
    init();
});