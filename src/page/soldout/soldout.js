define('h5/js/page/soldout', [
    'jquery',
    'h5/js/common',
    'h5/js/widget/page'
], function($, Global, Page) {

    var advanceMap = {
            '22' : { 
                text : '1月22日 10:00',
                img :'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150121/vNTT-0-1421828563118.jpg',
                href : '/api/h/1.0/detailPage.htm'
            },
            '23' : {
                text : '1月23日 10:00',
                img : 'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150121/vNTT-0-1421828562278.jpg',
                href : '/api/h/1.0/detailPage.htm?gid=2157'
            }
        };
    var bannerImg = 'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150121/vNTT-0-1421828563080.jpg';

    var recommendArray = [{
            img : 'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150121/vNTT-0-1421828563373.jpg',
            gid : '2197',
        },{
            img : 'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150121/vNTT-0-1421828565011.jpg',
            gid : '2196',
            className :'ml-05'
        }];

    var recommendTemplate = '<div class="col {{className}}" href="/api/h/1.0/detailPage.htm?gid={{gid}}"><img src="{{imgSrc}}"></div>';

    var S = new Page({
        element: $('#soldoutPage')
    }).after('render', function() {
        //init banner
        S.$('.soldout-banner').html('<img src="'+ Global.imgSrc(bannerImg) +'" />');

        //init advance
        var date = new Date().getDate() + 1;
            advance = advanceMap[date] || advanceMap['23'];
        S.$('.advance-time').text(advance.text);
        S.$('.advance-banner').html('<img src="'+ Global.imgSrc(advance.img) +'" />');//.attr('href', advance.href);
        
        //init recommend
        var html = [];
        recommendArray.forEach(function(item, index){
            item.imgSrc = Global.imgSrc(item.img);
            html.push(bainx.tpl(recommendTemplate, item));
        });
        S.$('.recommend-list').html(html.join(''));
        S.$('.recommend-grid').show();
    });

    return S;
});
