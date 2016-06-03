/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-05-21 17:02:17
 * @version $Id$
 */
$(function(){
    $.ajax({
        type: "GET",
        url: "/archiveDate",
        success: function(data){
            var result=eval(data);
            for(var i in result){
            creatContext(result[i]);}
        },
        error:function(){
            alert('网络异常，无法加载数据,请重新刷新页面')
        }
    });
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
        var rMore = $('<p></p>').attr('class', 'more').append(ra);
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

        $('#main').append(post);
    }
})
