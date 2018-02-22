$(document).ready(function () {
    
    user = getUser();
    
    if (typeof user !== 'undefined' && user !== null) {
        $.getJSON('/keep/' + user, {userId: user}, printTerms);
    } else {
        $('<dt>').text('Whoops').appendTo('body>dl');
        $('<dd>').text('Invalid User').appendTo('body>dl');
    }
    $('form').submit(function (e) {
        console.log(user);
        e.preventDefault();
        if (typeof user !== 'undefined' && user !== null) {
            var contentText = $('#content').val();
            $.post('/keep/' + user, {title: $('#id').val(), content: contentText}, printTerms);
            this.reset();
        } else {
            console.log("i m in else");
            $('<dt>').text('Whoops').appendTo('body>dl');
            $('<dd>').text('Invalid User').appendTo('body>dl');
        }
    });

});

function printTerms(terms) {
    $('body>dl').empty();
    $.each(terms, function (index) {
        $('<dt id="' + index + '">').text(this.title).appendTo('body>dl');
        $('<dd>').text(this.content).appendTo('body>dl');
    });
    $('dt').off('dblclick').dblclick(function() {
        $.ajax({
            url: '/keep/' + getUser() + '/' + $(this).attr('id'),
            type: 'DELETE',
            success: printTerms
        });
    });
}

function getUser() {
    var user,
        url;
    url = window.location.href;
    url = new URL(url);
    user = url.searchParams.get("user") || undefined;

    return user;
}
