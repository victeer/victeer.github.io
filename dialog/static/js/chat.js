$(document).ready(function(){
//result变量是从远端服务器拿回来的关于这张图片的标签和相似图片的HTML代码。
var WIDTH_PX="250px";
var WIDTH=250;
$("#btn-input").trigger("focus");


$('#btn-input').keypress(function (e) {
  var key = e.which;
  if(key == 13)  // the enter key code
  {
		$('#btn-chat').click();
    return false;  
  }
});

$("#btn-chat").on("click", function() {
	var input = $("#btn-input");
	var utterance = $.trim(input.val());
	if (utterance !== "") {
		var user_node = $("ul.chat li.right.clearfix:first").clone();
		user_node.find('p').text(utterance);
		user_node.css('display', 'block');
		$("ul.chat").append(user_node);
        if(utterance=="换一个"){
            if(result.images.length){
    			// var index=Math.floor(Math.random()*result.images.length);
                var index = 0;
    			var img_src=result.images[index];
                result.images.splice(index,1);
    			var user_node = $("ul.chat li.left.clearfix:first").clone();
    			var img= $('#form-imgPre').clone();
    			$(img).attr("src",img_src);
    			//img.css("width","450px");				
    			user_node.find('p').empty().append(img);
    			// user_node.find('p > img').css('width',WIDTH_PX);
    			user_node.css('display', 'block');
    			$("ul.chat").append(user_node);
            }else{
                showMessage("没有图片了呢~~");
            }
		}else{// 将用户输入的语句传输到后台，后台处理。
			$.post("newRequire",
				{
					reply:utterance,
				},
			function(data,status){
                if(data.hasOwnProperty("images")){
                    result = data;
                    index = 0;
                    showNewImage(result.images[index]);
                    result.images.splice(index,1);
                }else if(data.hasOwnProperty("msg")){//show the message.
                    result.msg =data.msg;
                    showMessage(result.msg);
                }
			});
		}
        $(".panel-body").scrollTop($(".panel-body")[0].scrollHeight);
        // 清空输入框
        var input = $("#btn-input");
        input.val('');
        input.trigger("focus");

	}
});

//当选择的图片变化时，文本框中图片的路径变化，并且图片的预览也随着变化
$('#img_file').on('change',function(){
	// console.log('hello');
	document.getElementById('textfield').value=document.getElementById('img_file').value;
        var url =window.URL.createObjectURL(document.getElementById('img_file').files.item(0)); 
	//document.getElementById('textfield').value=this.value;
        //var url = getFileUrl(this.value); 
	var imgPre = document.getElementById('form-imgPre'); 
	imgPre.src = url; 
});
function showMessage(msg){
    var user_node = $("ul.chat li.left.clearfix:first").clone();
    user_node.find('p').text(msg);
    user_node.css('display', 'block');
    $("ul.chat").append(user_node);
    // 滚动条到最下面
    $(".panel-body").scrollTop($(".panel-body")[0].scrollHeight);
    // 清空输入框
    var input = $("#btn-input");
    input.val('');
    input.trigger("focus");

};

function showNewImage(img_src){
	var user_node = $("ul.chat li.left.clearfix:first").clone();

	var img= $('#form-imgPre').clone();
	$(img).attr("src",img_src);
	//img.css("width","450px");				
	user_node.find('p').empty().append(img);
	// user_node.find('p > img').css('width',WIDTH_PX);
	user_node.css('display', 'block');
	$("ul.chat").append(user_node);
    // 滚动条到最下面
    $(".panel-body").scrollTop($(".panel-body")[0].scrollHeight);
    // 清空输入框
    var input = $("#btn-input");
    input.val('');
    input.trigger("focus");


};

/**
提交图片之后，从服务器端返回的结果是json格式的，具体有
images:大小为12的数组，放着相似图片的地址
**/
function uploadDone(e, data) {
		
		// console.log(data.result);
		//result是全局变量 
		result=data.result;
		//获取第一个图片地址——最相似的
		showNewImage(result.images[0]);
        //删除这张图片
        result.images.splice(0,1);
		// var img_src=result.images[0];
        $(".file-box").hide();
        $(".input-group").show();

}
   
   function  uploadFail(e, data) {
    // data.errorThrown
    // data.textStatus;
    // data.jqXHR;
	 //$('.fileupload-loading').hide();
     alert(data.errorThrown);
   }

$('#img_file').fileupload({
		url:'upload',
        previewMaxWidth: 100,
        autoUpload: true,
        sequentialUploads: true,
        crossDomain : true,
	// limitConcurrentUploads: 1,
        acceptFileTypes: /(\.|\/)(png|gif|jpe?g)$/i,
        prependFiles: true,
        processQueue: [
          {
            action: 'validate',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
          },
          {
            action: 'loadImageMetaData'
          },
          {
            action: 'loadImage',
            fileTypes: /^image\/(gif|jpeg|png)$/,
            maxFileSize: 20000000 // 20MB
          },
          {
            action: 'resizeImage',
            prefix: 'image',
            maxWidth: 256,
            minWidth: 256,
            orientation: true,
            canvas: true
          },
          {
            action: 'saveImage'
          },
          {
            action: 'setImage'
          },
          {
            action: 'loadVideo'
          },
          {
            action: 'setVideo'
          }
        ],
		done:uploadDone,
		fail:uploadFail,
		start:	function (e, data) {
		// console.log('start');
		//如果选择了一张图片，那么展示出来

		var user_node = $("ul.chat li.right.clearfix:first").clone();
		var img= $('#form-imgPre').clone().show();	
		img.css("width",WIDTH_PX);
		user_node.find('p').empty().append(img);
		user_node.css('display', 'block');
		$("ul.chat").append(user_node);

		}
    });


});

