const SORT_BY_TIME = 1;
const SORT_BY_PRODUCT = 2;
var sort_type;

$(function() {
    $('#tab_sort_by_time').unbind("click").on('click', function() {
        sort_type = SORT_BY_TIME
        $this = $(this)
        $.getJSON("/v1/orders?orderBy=time", function(response) {
            var $tabContent = $('.tab__content');
            $tabContent.empty();
            //title
            $.each(response, function(i, order) {
                var $row = $('<div class="order card"></div>');
                $row.append('<div class="order__title background-color--gray padding">[' + order.count + ']' + order.productName + '</div>')
                    .append('<div class="color--gray padding--3 word-break--break-word font-size--14 dashed">' + order.tableName + '</div>')
                    .append('<div class="color--gray padding--3 word-break--break-word font-size--14">' + order.comments + '</div>')
                $tabContent.append($row);
            });
            $this.addClass("active")
            $('#tab_sort_by_product').removeClass("active")
        }).fail(function(response) {
            if (response.status == 401) location.href = window.loginUrl + '?origin=' + location.href;
            else showAlertDialog('That bai', response.responseJSON.errorMessage, false, false);
        });
    });
    $('#tab_sort_by_product').unbind("click").on('click', function() {
        sort_type = SORT_BY_PRODUCT
        sort_type = SORT_BY_TIME
        $this = $(this)
        $.getJSON("/v1/orders?orderBy=product&groupBy=product", function(response) {
            var $tabContent = $('.tab__content');
            $tabContent.empty();
            //title
            $.each(response, function(i, orders) {
                var $row = $('<div class="order card"></div>');
                var count = 0;
                var productName;
                var tableNameArr = [];
                var commentArr = [];
                $.each(orders, function(j, order) {
                    count += order.count
                    if (productName === undefined) {
                        productName = order.productName
                    }
                    if (tableNameArr.indexOf(order.tableName) === -1) {
                        tableNameArr.push(order.tableName);
                    }
                    if (order.comments != "") {
                        commentArr.push('- [' + order.count + ']' + order.comments);
                    }
                })
                $row.append('<div class="order__title background-color--gray padding">[' + count + ']' + productName + '</div>')
                    .append('<div class="color--gray padding--3 word-break--break-word font-size--14 dashed">' + tableNameArr.join(', ') + '</div>')
                    .append('<div class="color--gray padding--3 word-break--break-word font-size--14">' + commentArr.join('<br/>') + '</div>')
                $tabContent.append($row);
            });
            $this.addClass("active")
            $('#tab_sort_by_time').removeClass("active")
        }).fail(function(response) {
            if (response.status == 401) location.href = window.loginUrl + '?origin=' + location.href;
            else showAlertDialog('That bai', response.responseJSON.errorMessage, false, false);
        });
    }).trigger("click");
});