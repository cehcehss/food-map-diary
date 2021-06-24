$('#new-post-form').on('keyup keypress', function (e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
        e.preventDefault();
        return false;
    }
});
$("#tags").tagsinput({
    tagClass: 'get-tags',
    maxTags: 5,
    maxChars: 10
});
$("#new-post-form").submit(function(e){
    e.preventDefault();
    var formData = new FormData(this);
    // $.each($(':input', form), function(i, fileds){
    //     data.append($(fileds).attr('name'), $(fileds).val());
    // });
    // $.each($('input[type=file]',form )[0].files, function (i, file) {
    //     data.append(file.name, file);
    // });
    // var tags = [];
    // $(".get-tags").each(function(){
    //     tags.push($(this).text());
    // })
    // console.log($(".get-tags").text());
    formData.append('tags',$(".get-tags").text());
    // data.append('_csrf',$('#_csrf').val());
    $.ajax({
        url: '/posts/new',
        headers: {"X-CSRF-TOKEN": $('#_csrf').val()},
        type: 'POST',
        data: formData,
        processData: false,
        contentType : false,
        success: function(response) {
            console.log(response);
            window.location.href = "/posts/new";
        }
        // error: function(error) {
        //     console.log(error);
        // }
    });
});