/**
 * Created by shichangluo on 2016/5/30.
 */

$(function(){
    xhrimg();
})
var iPage = 0;//请求次数
var bSite = true;  //判断是否满足条件
var bHold = true; //判断是否加载完成
$(window).on('scroll',function(){
    var minH = Math.min.apply({},box)+225;
    bSite = $(window).scrollTop()+document.body.clientWidth>minH;
    if(bSite && bHold && (iPage<5)){
        iPage++;
        bHold=false;
        xhrimg();
    }
})

function xhrimg(){       //请求图片数据
    $.ajax({
        type: "GET",
        url: "/imgdata",
        beforeSend:function(){
            $('#loading').show();
        },
        success: function(data){
            var result=eval(data);
            createbox(result);
        },
        error:function(){
            alert('网络异常，无法加载数据')
        },
        complete:function(){
            $('#loading').hide();
        }
    });
}
//动态插入图片
function createbox(result){
   for(var i in result){
       var iH=getH(result[i].width,result[i].height);

       var img=$('<img>').attr({
           alt:'图像正在加载中',
           onerror:"imgError.call(this);",
           onload:"imgLoad.call(this);",
           src:result[i].imagepath
       })
       var box=$('<div>').attr('class','box').css('height',iH).append(img).append('<div class="loading"></div>');
       $('#mainwater').append(box)
   }
    var margin=30;
    waterfall(margin);
}
function imgError(){                 //图片加载失败处理情况
    $(this).attr('alt',' :( 图像加载失败!');
    $(this).parent().find('.loading').remove();
}
function imgLoad(){                  //延迟加载函数
    $(this).parent().find('.loading').remove();
}
function getH(w,h){
    return parseInt(120/w*h);
}
//瀑布流布局函数
var box = [];
var count=0;
function waterfall(margin){
    var abox =  $('#mainwater .box');
    var oParent=  $('#mainwater');
    abox.each(function(i){
        if(i<count){
            return;
        }                                      //保证每次遍历只会遍历新的元素
        if(i<5){
            box[i] = abox.eq(i).innerHeight()+margin;//获取前五个的高度保存到数组里
        }else{
            var minH = Math.min.apply({},box);//获取最小的高度
            var minK = getMinKey(box,minH);    //获取最小高度的索引
            var minL = abox.eq(minK)[0].offsetLeft;//获取当前索引的的Lef值
            abox.eq(i).css({
                position:'absolute',
                top:minH,
                left:minL
            })
            box[minK] +=  abox.eq(i).innerHeight()+margin;//将新的图片高度加入到数组里
        }
        count = i+1;
    });
    var maxH = Math.max.apply({},box);//设置父级高度，防止底部元素被遮住
    oParent.css({
        height:maxH+margin+30,
        overflow:'hidden'
    })
    bHold = true;
    function getMinKey(arr,min){        //防止多个相同时能够取到其中一个
        for(var key in arr){
            if(arr[key] == min){
                return key;
            }
        }
    }
}

