/**
 * Created by shichangluo on 2016/5/29.
 */
$(function(){
    var urlname=window.location.search;
    $.ajax({
        type: "GET",
        url: "/archiveDate"+urlname,
        success: function(data){
            var result=eval(data);
            archives(result);
        },
        error:function(){
            alert('网络异常，无法加载数据,请重新刷新页面')
        }
    });
})
function archives(result){
    var liLength=result.length;
    for(var i=0;i<liLength;i++){
        var aT=$('<a>').attr('href','style?id='+result[i].id).html(result[i].title);
        var divTitle=$('<div>').attr('class','post-title');
        divTitle.append(aT);
        var aD=$('<a>').attr('href','/index').html('January 31st, 2010');//还未处理
        var divDetails=$('<div>').attr('class','post-details');
        divDetails.append(aD);
        var Li=$('<li>').append(divTitle).append(divDetails);
        $('#ul').append(Li);
    }
}