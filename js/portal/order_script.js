function getOrder(isCheckOutAfterSubmit=false){
  var $rows=$tableBody.children();
  var rowCount=$rows.length;
  var $numberId=$('#number_id');

  if(rowCount<2 && $numberId.length<1){
    showAlertDialog("Goi mon","Xin vui long chon mon",false,true);
    return;
  }
  var orders = {};
  if($numberId.length>0){
    orders.orderNumberID=parseInt($numberId.val());
  }
  orders.data=[];
  $tableBody.find('tr:has(td)').each(function(){
    var $row=$(this);
    var commentTmp='';
    if($row.children().eq(1).children().length>1){
      commentTmp=$row.children().eq(1).children().eq(1).text();
    }
    var order={
      tableID:$row.data('table-id'),
      productID:$row.data('pid'),
      comments:commentTmp
    }
    if($row.data('order-id') !== undefined){
      order.id=$row.data('order-id');
    }
    orders.data.push(order);
  });

  var dbParam, xmlhttp;
  dbParam = JSON.stringify(orders);
  console.log(dbParam);
  $.ajax({
       url: "/v1/orders",
       type : "PUT",
       contentType : 'application/json',
       data : dbParam,
       success : function(response) {
         console.log(response);
         if(parseInt(response.orderNumberID) > 0 ){
           if(isCheckOutAfterSubmit){
             location.href='/portal/checkout?orderNumberID='+response.orderNumberID;
           }else{
             location.href='/portal/order';
           }
         }
       },
       error: function(xhr, resp, text){
         if(resp.code == 306) location.href=window.loginUrl+'?from='+location.href;
         else showAlertDialog('That bai',resp.errorMessage,false,false);
       }
   });
  /*ajaxLoadPage("php/order_container_controller.php?action="+action+"&value=" + dbParam,function(xHttp){
    console.log(xHttp.responseText);
    var response=JSON.parse(xHttp.responseText);
    if(response.status=="ok"){
      if(isCheckout){
        location.href="index.php?pageId=checkOut&numberId="+response.message;
      }else{
        removeAllOrder();
      }
    }
  });*/
}
function submitAndCheckOutOrder(){
  getOrder(true);
}
function submitOrder(){
  getOrder(false);
}
function removeAllOrder(){
  $tableBody.find('tr:has(td)').each(function(){
    $(this).remove();
  });
  $tableBody.data('currentPressedIndex',undefined);
  sumPriceAndDisplay();
  hideComments();
}
function onOrderProductClick(id,name,count,price,comment){
  var $trs=$tableBody.children();
  var insertIndex=$trs.length-1;
  var $selectedTable=$('#select_table');
  //find same product
  for(var i=insertIndex;i>0;i--){
    var pId=$trs.eq(i).data('pid');
    //console.log("find "+i+" of "+insertIndex);
    if(pId==id){
      console.log("BANG NHAU");
      insertIndex=i;
      break;
    }
  }
  var $row = $('<tr/>');
  var htmlComment=(comment!=null && comment!='') ? "<div>"+comment+"</div>" : '';
  $row.data('table-id',parseInt($selectedTable.val())).data('pid',id).data('name',name).data('price',price).data('count',count);
  $row.append('<td><strong class="white-space--nowrap rounded background-color--gray padding">'+$selectedTable.find("option:selected").text()+'</strong></td>')
      .append('<td class="width--full"><strong class="color--blue">['+count+']'+name+'</strong>'+htmlComment+'</td>')
      .append('<td class="text-align--right white-space--nowrap"><span class="rounded background-color--yellow padding">'+formatCurrency(count*price)+'</span></td>')
      .append('<td class="text-align--center"><img onclick="onAddRow(this)" width="24px" height="24px" src="http://localhost/pos/pos-lib/images/ic_add.png" alt="Them"></td>')
      .append('<td class="text-align--center"><img onclick="onDeleteRow(this)" width="24px" height="24px" src="http://localhost/pos/pos-lib/images/ic_close.png" alt="Xoa"></td>');
  console.log('insert= '+insertIndex);
  //add row to table
  $row.insertAfter($trs.eq(insertIndex));
  //set focus
  $row.trigger('click');
  //price
  sumPriceAndDisplay();
}
function onAddRow(target){
  $row=$(target).parent().parent();
  console.log($row.html());
  var $td1=$row.children().eq(1);
  var comment=$td1.children().length > 1 ? $td1.children().eq(1).text() : '';
  onOrderProductClick($row.data('pid'),
                      $row.data('name'),
                      $row.data('count'),
                      $row.data('price'),
                      comment);
  sumPriceAndDisplay();
  event.stopPropagation();
}
function onDeleteRow(target){
  $row=$(target).parent().parent();
  var rowIndex=$row.index();
  $row.remove();
  $trs=$tableBody.children();
  var currentPressedIndex=parseInt($tableBody.data('currentPressedIndex'));
  if(currentPressedIndex !== 'NaN'){
    if(currentPressedIndex >= $trs.length-1){
      $trs.eq($trs.length-1).trigger('click');
    }else if(rowIndex < currentPressedIndex){
      if(currentPressedIndex==1){
        $trs.eq(1).trigger('click');
      }else{
        $trs.eq(currentPressedIndex-1).trigger('click');
      }
    }else if(rowIndex == currentPressedIndex){
      $trs.eq(currentPressedIndex).trigger('click');
    }
  }
  sumPriceAndDisplay();
  if($tableBody.children().length<2) hideComments();
  event.stopPropagation();
}
function sumPriceAndDisplay(){
  var priceSum=0;
  var orderedProductCount=0;
  $tableBody.find('tr:has(td)').each(function(){
    priceSum+=Number($(this).data('price'));
    orderedProductCount++;
  });
  $tableTitle=$tableBody.children().eq(0);
  $tableTitle.children().eq(1).html('['+orderedProductCount+'] mon');
  $tableTitle.children().eq(2).html('Tong tien ['+formatCurrency(priceSum)+' VND]');
}
function onOrderProductCommentClick(name){
  var currentPressedIndex=parseInt($tableBody.data('currentPressedIndex'));
  if(currentPressedIndex !== 'NaN'){
    console.log("addComment at "+currentPressedIndex);
    var $trs=$tableBody.children();
    //because index 0 is <th> tag
    if(currentPressedIndex > 0 && currentPressedIndex<$trs.length){
      var $tr=$trs.eq(currentPressedIndex);
      var $td=$tr.children().eq(1);
      var $tdChilds=$td.children();
      console.log($tdChilds.text());
      if($tdChilds.length>1){
        var comment=$tdChilds.eq(1);
        if(comment.text().length>0){
          comment.text(comment.text()+', ' +name);
        }else{
          comment.text(name);
        }
      }else{
        $td.append('<div>'+name+'</div>');
      }
    }
  }
}

function loadOrderProducts(element) {
  var selectedCateId=$(element).data("id");
  var link='/v1/categories/'+selectedCateId+'/products';
  $.getJSON(link, function(response){
    var $productList= $('#order_center_list');
    $productList.empty();
    //title
    $.each(response, function(i, product){
      $productList.append('<div class="hover--blue" onclick="onOrderProductClick('+product.id+',\''+product.name+'\','+product.quantityOnSingleOrder+','+product.price+');" >'+product.name+'</div>');
    });
    //if ok set pressed on menu
    $("#category_menu > *").each(function(){
      $this=$(this);
      if($this.data('id') == selectedCateId) $this.addClass('active');
      else $this.removeClass('active');
    });
  }).fail(function(jqXHR) {
    if(jqXHR.status == 306){
      location.href=window.loginUrl+'?from='+location.href;
    }else {
      showAlertDialog('That bai'+link,response.message,false,false);
    }
  });
}
function loadProductComments(pId){
  var link='/v1/products/'+pId+'/comments';
  $.getJSON(link, function(response){
    var $commentList= $('#order_bottom_list');
    $commentList.empty();
    console.log(response)
    //title
    $.each(response, function(i, comment){
      $commentList.append('<div class="hover--green"  onclick="onOrderProductCommentClick(\''+comment.name+'\');" >'+comment.name+'</div>');
    });
  }).fail(function(jqXHR) {
    if(jqXHR.status == 306){
      location.href=window.loginUrl+'?from='+location.href;
    }else {
      showAlertDialog('That bai'+link,response.message,false,false);
    }
  });
}

function removePressedTableRow(){
  $tableBody.find('.pressed--forcus').removeClass('pressed--forcus')
}
function showComments(){
  $('#order_bottom_list').removeClass("hide");
}
function hideComments(){
  $('#order_bottom_list').addClass("hide");
}
//reload table list when change area
$('#select_area').on('change', function(){
  var areaId=$(event.target).val();
  var link='/v1/areas/'+areaId+'/tables';
  $.getJSON(link, function(response){
    var $tableZone= $('#select_table');
    $tableZone.empty();
    $.each(response, function(i, table){
      $tableZone.append('<option value="'+table.id+'">'+table.name+'</option>');
    });
  }).fail(function(jqXHR) {
    if(jqXHR.status == 306){
      location.href=window.loginUrl+'?from='+location.href;
    }else {
      showAlertDialog('That bai'+link,response.message,false,false);
    }
  });
});
//table set click add addEventListener
$tableBody=$("#ordered_list_table tbody");
$tableBody.on('click','tr:has(td)',function(event){
  var $this=$(this);
  var thisIndex=$this.index();
  var $rows=$tableBody.children();
  removePressedTableRow();
  $this.addClass('pressed--forcus');
  $tableBody.data('currentPressedIndex',thisIndex);
  console.log("click "+(thisIndex)+"of "+($rows.length)+" with pID="+$(this).data('pid'));
  showComments();
  loadProductComments($(this).data('pid'))
});
