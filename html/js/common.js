/**
 * Created by shichangluo on 2016/5/29.
 */
/*var timeout = false;
$(window).on('scroll',function(){
    var scroll=$(window).scrollTop();
    if (timeout){clearTimeout(timeout);}
    timeout = setTimeout(function(){

        if(scroll>200)
        {
            scroll=200;
        }
        $('#sidebar').animate({
            paddingTop:scroll
        })

    },100);

})*/
$(function(){
    $.ajax({
        type: "GET",
        url: "/ajax",
        success: function(data){
            var result=eval(data);
            sort(result);
        },
        error:function(){
            alert('网络异常，无法加载数据,请重新刷新页面')
        }
    });
    $.ajax({
        type: "GET",
        url: "/archiveDate",
        success: function(data){
            var result=eval(data);
            sortTime(result)
            sortHot(result)
        },
        error:function(){
            alert('网络异常，无法加载数据,请重新刷新页面')
        }
    });
    $.ajax({
        type: "GET",
        url: "/imgdata",
        success: function(data){
            var result=eval(data);
            inmgesChang(result)
        },
        error:function(){
            alert('网络异常，无法加载数据,请重新刷新页面')
        }
    });
    if($('#gallery').find('img')){
        imgbig();
    }
    function imgbig() {
        var img = $('#gallery').find('img');
        var zmaxindex = 2;
        for (var i = 0; i < img.length; i++) {
            img[i].style.left = img[i].offsetLeft + 'px';
        }

        for (var i = 0; i < img.length; i++) {
            img[i].style.position = 'absolute';
            // img[i].style.margin=0;
        }
        for (var i = 0; i < img.length; i++) {
            img[i].index = i
            img[i].onmouseover = function () {
                this.style.zIndex = zmaxindex;
                zmaxindex++;
                img.eq(this.index).stop().animate({height: "100", width: '100', marginLeft: '-30', marginTop: '-30'})
            }
        }
        for (var i = 0; i < img.length; i++) {
            img[i].onmouseout = function () {
                img.eq(this.index).stop().animate({height: "40", width: '40', marginLeft: '0', marginTop: '10'})

            }
        }
    }
})

//文章分类
function sort(result){
    var menu1=$('#menu1');
    var length=result.length;
    var ul1=$('<ul></ul>');
    for(var i=0;i<length;i++) {
        var a1 = $('<a></a>').attr('href', '/archives?articleid='+result[i].id).html(result[i].Type)
        var Li1= $('<li></li>');
        Li1.append(a1);
        ul1.append(Li1);
    }
    menu1.append(ul1);
}
//文章归档
function sortTime(result){
    var length=result.length;
    var ul2=$('<ul></ul>');
    var menu2=$('#menu2');
    for(var i=0;i<length;i++) {
        var time=new Date(result[i].jointime);
        var year=time.getFullYear();
        var month=time.getMonth()+1;
        var day=time.getDate();
        var a2 = $('<a></a>').attr('href', '/archives?id='+result[i].id).html(year+'年'+month+'月'+day+'日')
        var Li2 = $('<li></li>');
        Li2.append(a2);
        ul2.append(Li2);
    }
    menu2.append(ul2);
}
//热门文章
function sortHot(result){
    var length=result.length;
    var menu3=$('#menu3');
    var ul3=$('<ul></ul>');
    for(var i=0;i<length;i++) {
        var a3 = $('<a></a>').attr('href','/style?id='+result[i].id).html(result[i].title)
        var Li3 = $('<li></li>');
        Li3.append(a3);
        ul3.append(Li3);
    }
    menu3.append(ul3);
}
function inmgesChang(result){
   var img=$('#gallery').find('img');
    for(var i=0;i<img.length;i++){
        img[i].src=result[i].imagepath
    }
}
//格式化日期
function formateDate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var mi = date.getMinutes();
    m = m > 9 ? m : '0' + m;
    return y + '-' + m + '-' + d + ' ' + h + ':' + mi;
}