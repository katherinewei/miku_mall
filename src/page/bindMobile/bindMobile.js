/**
 *    绑定手机号
 */
define('h5/js/page/bindMobile',[
    'jquery',
    'h5/js/common',
    'h5/js/widget/page'
], function($, Global, Page) {
    var S = new Page({
        element: $('#bindMobilePage'),
        checkInWxp : true,
        showCartCount:false,
        bar: 'user-bar',
        title: '绑定手机永久免登',
        events: {
            'tap .sendvercode': function(event) {
                event.preventDefault();
                Global.sendCheckNum(S, $(event.currentTarget));
            },
            'tap .button.submit': function(event) {
                event.preventDefault();
                S.submit($(event.currentTarget));
            }

        }
    });

    /*.after('render', function(){
        if(!wxopenid){
            var mf = $('<div id="must-follow"></div>').appendTo('body');
            var ps = ['/api/h/1.0/bindMobile.htm'];
            if(ps.indexOf(location.pathname)===-1){
                mf.on('touch', function() {
                    mf.remove();
                });
            }
        }
    });*/

    S.submit = function(btn) {
        var mobile = S.$('.mobile'),
            vercode = S.$('.vercode'),
            data = {
                mobile: $.trim(mobile.val()),
                checkNO: $.trim(vercode.val())
            };
        if (!data.mobile) {
            bainx.broadcast(mobile.attr('placeholder'));
            return S;
        } else if (!/^[\d]{11}$/gi.test(data.mobile)) {
            bainx.broadcast('请输入正确的手机号码！');
            return S;
        }

        if (!data.checkNO) {
            bainx.broadcast(vercode.attr('placeholder'));
            return S;
        } else if (data.checkNO.length !== 4) {
            bainx.broadcast('请输入4位数字验证码');
            return S;
        }

        btn.addClass('disable').text('绑定用户手机中.');

        var doneFn = function(result) {
                btn.text('绑定成功');
                S.trigger('submit:success', result);
                history.back();
                //S.hide();
            },
            failFn = function() {
                S.trigger('submit:fail');
                btn.removeClass('disable').text('重新绑定');
            };
        return Global.Data.synCheckMobile(data).done(doneFn).fail(failFn);
    };
    return S;
});
