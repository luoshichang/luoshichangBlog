/**
 * Created by shichangluo on 2016/5/30.
 */
$(function(){
    var urlname=window.location.search;
    $.ajax({
        type: "GET",
        url: "/lifeDate"+urlname,
        success: function(data){
            var result=eval(data);
            life(result);
        },
        error:function(){
            alert('网络异常，无法加载数据,请重新刷新页面')
        }
    });
})
function life(result){
    var liLength=result.length;
    for(var i=0;i<liLength;i++){
        var aT=$('<a>').attr('href','style?lifeid='+result[i].id).html(result[i].title);
        var divTitle=$('<div>').attr('class','post-title');
        divTitle.append(aT);
        var aD=$('<a>').attr('href','/index').html('January 31st, 2010');//还未处理
        var divDetails=$('<div>').attr('class','post-details');
        divDetails.append(aD);
        var Li=$('<li>').append(divTitle).append(divDetails);
        $('#ul').append(Li);
    }
}