function onNotifiClose(element){
    var $parentElement = $(element).parent();
    $parentElement.addClass("opacity--hide");
    setTimeout(function(){
      $parentElement.remove();
    }, 200);
}
function showAlertDialog(title,message,okButton=false,cancelButton=false){
  $modalDialog=$(".modal-dialog");
  $modalDialog.find('.modal-dialog__content__title').text(title);
  $modalDialog.find('.modal-dialog__content__message').text(message);
  if(!okButton){
    $modalDialog.find('.modal-dialog__cancel').css('display','none');
  }
  if(!cancelButton){
    $modalDialog.find('.modal-dialog__cancel').css('display','none');
  }
  $modalDialog.css('display','block');
}
function closeAlertDialog(t){
  $modalDialog=$(".modal-dialog");
  $modalDialog.css('display','none');
}
function showLoader(isShow=true){
  var loader=document.getElementById("loading_page");
  if(isShow){
    loader.style.display="block";
  }else{
    loader.style.display="none";
  }
}
/* @Deprecated*/
function ajaxLoadPage(ajax_link,functionX){
  var xhttp = null;
  if (window.XMLHttpRequest) {
      // code for modern browsers
      xhttp = new XMLHttpRequest();
  } else {
      // code for old IE browsers
      xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhttp.onreadystatechange = function() {
    //if(this.readyState==)
  //  if(this.readyState==1) showLoader(true);
  //  else if (this.readyState == 4) {
    if (this.readyState == 4) {
      if(this.status == 200 && functionX!=null) functionX(this);
    //  showLoader(false);
    }
  };
  xhttp.open("GET", ajax_link, true);
  xhttp.send();
}

function formatCurrency(total){
  return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
/*DRAG*/
var dragBar=$('.dragbar-container__dragbar');
var dragBarContainerLeft=$('.dragbar-container__left');
if(dragBar && dragBarContainerLeft){
  dragBar.applyDrag($('.dragbar-container__left'));
}
/** IMAGE **/
// image upload onclick
function uploadImageChange(elem){
  $this=$(elem);
  if($this.prop('files')[0] === undefined) return;
  var formData = new FormData();
  formData.append("fileToUpload", $this.prop('files')[0]);
  formData.append("folder", $this.data('folder').length > 0 ? $this.data('folder') : 'pos');
  $.ajax({
      url: window.imageUrl+"paste.php",
      type: "POST",
      data : formData,
      xhrFields: {
        withCredentials: true
      },
      processData: false,
      contentType: false,
      beforeSend: function(xhr) {
        $('.loader').css('display','inline-block');
        $('#label_image').css('display','none');
      },
      success: function(response){
        $('.loader').css('display','none');
        $('#label_image').css('display','inline-block');
        console.log(response);
        var jsonResponse=null;
        try {
           jsonResponse=JSON.parse(response);
           //must be valid JSON
        } catch(e) {
            jsonResponse=response//must not be valid JSON
        }
        if(jsonResponse.status === true){
          $('img[name=image_displayer]').attr('src',window.imageUrl+jsonResponse.file_path);
          $('input[name=image]').val(jsonResponse.file_path);
        }else{
          if(jsonResponse.code == 306) location.href='../login?from='+location.href;
          else showAlertDialog('That bai',jsonResponse.message,false,false);
        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
        $('.loader').css('display','none');
        $('#label_image').css('display','inline-block');
        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        showAlertDialog('That bai',xhr.responseText,false,false);
      }
  });
  /*
  console.log('hehrhe');
  var $this=$(this);
  var reader = new FileReader();
  reader.onload = function(){
    $('img[name=image_displayer]').attr('src',reader.result);
  };
  reader.readAsDataURL($this.prop('files')[0]);
  */
}
/*
function setToDrag(barVar,leftContainerVar){
  console.log('here');
  bar=barVar;
  leftContainer=leftContainerVar;
  drag = (e) => {
    document.selection ? document.selection.empty() : window.getSelection().removeAllRanges();
    leftContainer.width(e.pageX - bar.outerWidth() / 2);
  }
  $document=$(document);
  bar.on('touchstart', () => {
    $document.on('touchmove', drag);
  });
  bar.on('mousedown', () => {
    $document.on('mousemove', drag);
  });
  $document.on('touchstop', () => {
    $document.off('touchmove', drag);
  });
  $document.on('mouseup', () => {
    $document.off('mousemove', drag);
  });
}
*/

/*DRAG*/
//set sticky bar scrool
/*var prevScrollpos = window.pageYOffset;
function setStickyBar(navbar){
window.onscroll = function() {
  if(navbar!=null){
    var currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        navbar.style.top = "0";
      } else {
        navbar.style.top = -navbar.style.offsetHeight;
      }
      prevScrollpos = currentScrollPos;
    }
}*/
