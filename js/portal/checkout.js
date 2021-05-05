function onSoftKeyboardNumber(value){
    var $moneyInput=$('#moneyInput');
    if(value==='C'){
      $moneyInput.val('');
    }else if(value === '<='){
      if($moneyInput.val().length>0){
        var maskValue=$moneyInput.val();
        $moneyInput.val(maskValue.substring(0,$moneyInput.val().length-1));
        $moneyInput.val(formatCurrency(div.value.replace(/,/g,'')));
      }
    }else if(parseInt(value) !== 0 || $moneyInput.val() !== ''){
        var maskValue=$moneyInput.val()+value;
        $moneyInput.val(formatCurrency(maskValue.replace(/,/g,'')));
    }
}

$('#moneyInput').on('input',function() {
  var $moneyInput=$('#moneyInput');
  if($moneyInput.val() === '0') $moneyInput.val('');
  else $moneyInput.val(formatCurrency($moneyInput.val().replace(/,/g,'')));
});
