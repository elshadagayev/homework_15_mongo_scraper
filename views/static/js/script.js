const scrape = () => {
    $.ajax({
        url: '/api/articles/scrape',
        method: 'POST',
        dataType: 'json'
    }).then((res) => {
        if(res.statusCode !== 200) {
            console.log(res.message);
            $('.modal .modal-body p').text(res.message);
            $('.modal').modal();
        } else {
            $('.modal .modal-body p').text('Scraped ' + res.body.count + ' articles');
            $('.modal').modal();
            displayNewArticles();
        }
    });
}

const displayNewArticles = () => {
    $.ajax({
        url: '/api/articles/unsaved',
        method: 'GET',
        dataType: 'json'
    }).then((res) => {
        if(res.statusCode !== 200)
            return $('.articles').html('<div class="alert alert-danger" role="alert">' + res.message + '</div>')

        if(!res.body.length)
            return

        let ul = $('<ul>');
        $('.articles').html(ul);
        $(res.body).each((ind, el) => {
            let li = $('<li class="row">');
            let col1 = $('<div class="col-lg-11">');
            let col2 = $('<div class="col-lg-1">');
            let button = $('<button>');
            button
                .addClass('btn btn-danger')
                .text('Save')
                .data('id', el._id);
            col1.append('<time>' + new Date(el.date).toLocaleDateString() + '</time>')
            col1.append('<a target="_blank" href="' + el.link + '">' + el.title + '</a>');
            col2.append(button);
            li.append(col1).append(col2);
            ul.append(li);

            button.on('click', function() {
                let id = $(this).data('id');
                $.ajax({
                    url: '/api/articles/save/' + id,
                    method: 'PUT',
                    dataType: 'JSON',
                }).then(res => {
                    if(res.statusCode == 200) {
                        li.remove();
                    }
                });
            })
        })
    })
}

const displaySavedArticles = () => {
    $.ajax({
        url: '/api/articles/saved',
        method: 'GET',
        dataType: 'json'
    }).then((res) => {
        if(res.statusCode !== 200)
            return $('.articles').html('<div class="alert alert-danger" role="alert">' + res.message + '</div>')

        if(!res.body.length)
            return;
            
        let ul = $('<ul>');
        $('.articles').html(ul);
        $(res.body).each((ind, el) => {
            let li = $('<li class="row" id="' + el._id + '">');
            let col1 = $('<div class="col-lg-8">');
            let col2 = $('<div class="col-lg-4">');
            let buttonNotes = $('<button>');
            let buttonRemove = $('<button>');

            buttonNotes
                .addClass('btn btn-danger')
                .text('ARTICLE NOTES')
                .data('id', el._id);
            buttonRemove
                .addClass('btn btn-danger')
                .text('DELETE FROM SAVED')
                .data('id', el._id);

            col1.append('<time>' + new Date(el.date).toLocaleDateString() + '</time>')
            col1.append('<a target="_blank" href="' + el.link + '">' + el.title + '</a>');
            col2.append(buttonNotes).append(buttonRemove);
            li.append(col1).append(col2);
            ul.append(li);

            buttonNotes.on('click', () => {
                displayArticleNotes(el._id);

                $('.modal .modal-title').text(el.title);
                $('.modal #add_note').unbind('click').on('click', () => {
                    $.ajax({
                        url: '/api/articles/notes/' + el._id,
                        method: 'POST',
                        dataType: 'JSON',
                        data: {
                            note: $('.modal #note').val()
                        }
                    }).then(res => {
                        if(res.statusCode !== 200)
                            return
                        displayArticleNotes(el._id);
                    })
                });
                $('.modal').modal();
            })

            buttonRemove.on('click', () => {
                if(!confirm("Are you sure?"))
                    return;
                $.ajax({
                    url: '/api/articles/' + el._id + '/remove_from_saved',
                    method: 'PUT',
                    dataType: 'JSON'
                }).then(res => {
                    if(res.statusCode !== 200)
                        return;
                    
                    li.remove();
                })
            })
        })
    })
}

const displayArticleNotes = (id) => {
    $.ajax({
        url: '/api/articles/notes/' + id,
        method: 'GET',
        dataType: 'JSON'
    }).then(res => {
        if(res.statusCode !== 200)
            return;

        if(!res.body.length) {
            $('#notes').text('No notes for this article yet')
            return;
        }
        
        let ul = $('<ul>');
        $('#notes').html(ul);
        $(res.body).each((ind, el) => {
            let li = $('<li>');
            let buttonRemove = $('<button>');
            buttonRemove
                .data('id', el._id)
                .text('x');
            buttonRemove.on('click', () => {
                if(!confirm("Are you sure?"))
                    return;

                $.ajax({
                    url: '/api/articles/notes/remove',
                    method: 'DELETE',
                    dataType: 'JSON',
                    data: {
                        id: el._id
                    }
                }).then(res => {
                    if(res.statusCode === 200)
                        li.remove();
                });
            });

            li.append(el.note);
            li.append(buttonRemove);
            ul.append(li);
        });

        $('#note').val('');
    })
}


{
    $('.btn.scrape').on('click', () => {
        scrape();
    })
}