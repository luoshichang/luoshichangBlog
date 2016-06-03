/**
 * Created by shichangluo on 2016/5/29.
 */
$(function(){
    var timer=null;
    var urlname=window.location.search;
    //请求文章的数据
    $.ajax({
        type: "GET",
        url: "/archiveDate"+urlname,
        success: function(data){
            var result=eval(data);
                creatContext(result[0]);
        },
        error:function(){
            alert('网络异常，无法加载数据,请重新刷新页面')
        }
    });
    //请求评论信息
    $.ajax({
        type: "GET",
        url: "/comment"+urlname,
        success: function(data){
            var result=eval(data);
            for(var i in result){
                commentShow(result[i])
            }
        },
        error:function(){
            alert('网络异常，无法加载数据,请重新刷新页面')
        }
    });
    //处理评论框
    $('.comment').eq(0).focus(function(){
        $(this).parent().attr('class','text-box text-box-on');
        var val=$(this).val();
        $(this).val(val=='评论'?'':val);
        $(this).keyup();
    }).blur(function(){
        var that=this
        timer=setTimeout(function(){
            $(that).parent().attr('class','text-box')
        },200)
    }).keyup(function(){
      var length=$(this).val().length;
        if(length<=0||length>140){
            $(this).next().attr('class','btn btn-off');
        }else{
            $(this).next().attr('class','btn');
        }
        $(this).next().next().html(length+'/140');
    });
    //事件委托的方式处理评论
    $('#comment').delegate('','click',function(event){
        var event = event || window.event;
        var target = event.target || event.srcElement;
        switch(event.target.className){
            case 'comment-praise':
                praiseReply(target)
                break;
            case 'comment-operate':
                if(timer){
                    clearTimeout(timer);
                }
                operate(target)
                break;
            case 'btn':
                if(timer){
                    clearTimeout(timer);
                }
                reply();
                break;
            case 'btn btn-off':
                if(timer){
                    clearTimeout(timer);
                }
                break;
        }
    })
    //文章内容
    function creatContext(result) {
        Ncontent =result.content;
        //动态创建元素
        var post = $('<div>').attr('class', 'post');
        var right = $('<div>').attr('class', 'right');
        var left = $('<div>').attr('class', 'left');
        //右侧内容
        var rTitle = $('<h2><a></a></h2>').find('a').attr('href', 'index.html').html(result.title).end();
        var rP = $('<p></p>').attr('class', 'post-info').html('文章来源 <a href="index.html">weibo </a><a href="index.html">internet</a>');
        var rcontent = $('<p></p>').html(Ncontent);
        var ra=$('<a>').attr('class','more').attr('href','style?id='+result.id).html('阅读全文&raquo;');
        var rMore = $('<p></p>').attr('class', 'more')
        //左侧内容
        var lDateinfo = $('<p></p>').attr('class', 'dateinfo').html('JAN<span>31</span>');
        var lPost_meta = $('<div></div>').attr('class', 'post-meta');
        var lh4 = $('<h4></h4>').html('相关信息')
        var lul = $('<ul></ul>');
        var liLength = 5;
        var className = ['user', 'time', 'comment', 'permalink', 'permalink']
        var userName = ['luoshichang', '12:30 PM', '共2条评论', '相关话题', '赞(']
        for (var i = 0; i < liLength-1; i++) {
            var Li = $('<li></li>').attr('class', className[i]).html(userName[i]);
            lul.append(Li);
        };
        var Li2 = $('<li></li>').attr('class', className[liLength-1]).html(userName[liLength-1]+result.praise+')');
        lul.append(Li2);
        lPost_meta.append(lh4).append(lul);
        //组装
        right.append(rTitle).append(rP).append(rcontent).append(rMore);
        left.append(lDateinfo).append(lPost_meta);
        post.append(right).append(left)

        $('#mainpost').append(post);
    }

})
//点赞函数
function praiseReply(target) {
    var myPraise = parseInt($(target).attr('my'));
    var oldTotal = parseInt($(target).attr('total'));
    var newTotal;
    if (myPraise == 0) {
        newTotal = oldTotal + 1;
        $(target).attr('total',newTotal)
        $(target).attr('my',1);
        $(target).html(newTotal + ' 取消赞')
    }
    else {
        newTotal = oldTotal - 1;
        $(target).attr('total', newTotal);
        $(target).attr('my', 0);
        $(target).html ((newTotal == 0) ? '赞' : newTotal + ' 赞');
    }
    $(target).css({display:(newTotal == 0) ? '' : 'inline-block'})

    //将newTotal发送回后台
}
function operate(target) {
    var target=$(target);
    var commentContent= target.parent().parent();
    var user=commentContent.find('.user').eq(0).html();
    var textarea=commentContent.parent().parent().parent().find('.comment').eq(0);
   // var box = commentBox.parentNode.parentNode.parentNode;
    var txt = target.html();
    if (txt == '回复') {
        textarea.html('回复@' + user);
        textarea.focus();
        textarea.keyup()
    }else {
        commentContent.parent().remove();
    }
}
function reply(){
    var val=$('.comment').eq(1).val();
    if(val=='评论'||val==''){
        alert('请留下你宝贵的意见')
        return;
    }
    $('<div>').attr({
        class:'comment-box clearfix',
        user:'self'
    }).html(
        '<img class="myhead" src="images/4.jpg" alt=""/>' +
        '<div class="comment-content">' +
        '<p class="comment-text"><span class="user">游客：</span>' + $('.comment').eq(1).val() + '</p>' +
        '<p class="comment-time">' +
        formateDate(new Date()) +
        '<a href="javascript:;" class="comment-praise" total="0" my="0" style="">赞</a>' +
        '<a href="javascript:;" class="comment-operate">删除</a>' +
        '</p>' +
        '</div>').appendTo($('.comment-list').eq(0)
    )
    $('.comment').eq(1).val('评论').blur();

}
//处理后台发来的评论数据的数据
function commentShow(result){
    $('<div>').attr({
        class:'comment-box clearfix',
        user:'other'
    }).html(
        '<img class="myhead" src="images/4.jpg" alt=""/>' +
        '<div class="comment-content">' +
        '<p class="comment-text"><span class="user">'+result.name+'：</span>' +result.content + '</p>' +
        '<p class="comment-time">' +
        formateDate(new Date(result.sendtime)) +
        '<a href="javascript:;" class="comment-praise" total="'+result.praise+'" my="0" style="">赞</a>' +
        '<a href="javascript:;" class="comment-operate">回复</a>' +
        '</p>' +
        '</div>').appendTo($('.comment-list').eq(0)
    )
}