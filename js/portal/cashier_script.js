function loadOrderGroupByTableInArea(areaId) {
  var link = "/v1/areas/"+areaId+"/orders";
  console.log(link)
  $.getJSON(link, function(response) {
    var $tableBody = $('#order_body');
    $tableBody.empty();
    //title
    $.each(response, function(i, order) {
      console.log(order);
      var orderNumberId = order.orderNumberID
      var $row = $('<tr onclick="onOrderTableItemClick(' + orderNumberId + ',event)"></tr>');
      $row.append('<td class="text-align--left width--full"><strong class="color--blue">[' + orderNumberId + ']' + order.tableName + '</strong></td>')
        .append('<td class="text-align--center"><span class="rounded background-color--green padding">' + order.countSum + '</span></td>')
        .append('<td class="white-space--nowrap text-align--right"><span class="rounded background-color--yellow padding">' + formatCurrency(order.priceSum) + '</span></td>')
        .append('<td onclick="editOrder(event,' + orderNumberId + ');return false;"><img width="24px" height="24px" src="'+window.designUrl+'/images/ic_edit.png" alt="Them"></td>')
        .append('<td onclick="deleteOrder(event,' + orderNumberId + ');return false;"><img width="24px" height="24px" src="'+window.designUrl+'/images/ic_close.png" alt="Xoa"></td>');
      $tableBody.append($row);
    });
    //if ok set pressed on menu
    $(".scroll-menu > *").each(function() {
      $this = $(this);
      if ($this.data('id') == areaId) $this.addClass('active');
      else $this.removeClass('active');
    });
  }).fail(function(response) {
    if (response.status == 401) location.href = window.loginUrl + '?origin=' + location.href;
    else showAlertDialog('That bai', response.responseJSON.errorMessage, false, false);
  });
}

function editOrder(event, numberId) {
  $(location).attr('href', '/portal/order?orderNumberID=' + numberId);
  event.stopPropagation();
}

function deleteOrder(event, numberId) {
  var $modalDialog = $(".modal-dialog");
  console.log(JSON.stringify({
    orderNumberID: numberId,
    data: []
  }));
  $modalDialog.find('.modal-dialog__ok').on('click', function() {
    $modalDialog.find('.modal-dialog__ok').off('click');
    closeAlertDialog();
    $.ajax({
      url: "/v1/orders",
      type: "PUT",
      contentType: 'application/json',
      data: JSON.stringify({
        orderNumberID: numberId,
        data: []
      }),
      success: function(result) {
        console.log(result);
        if(parseInt(result.orderNumberID) > 0 ){
          location.href='/portal/cashier';
        }
      },
      error: function(xhr, resp, text) {
        if (resp.code == 306) location.href = window.loginUrl + '?from=' + location.href;
        else showAlertDialog('That bai', resp.errorMessage, false, false);
      }
    });
  });
  showAlertDialog('Xac nhan thuc hien', 'Ban co muon xoa khong, lich su se duoc luu lai tren may chu', true, true);
  event.stopPropagation();
}

function onSoftKeyboardNumber(value) {
  if ($numberIdInput.val().length === 0 && value === 0) return;
  $numberIdInput.val($numberIdInput.val() + value);
}

function onOrderTableItemClick(value) {
  var div = document.getElementById("numberIdInput");
  div.value = value;
}
//page run setting
//not allow 0 in the first input
$numberIdInput = $("#numberIdInput");
$numberIdInput.on('input', function() {
  console.log($numberIdInput.val());
  if ($numberIdInput.val() === '0') $numberIdInput.val('');
});
