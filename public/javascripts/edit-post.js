$('#edit-post-form').on('keyup keypress', function (e) {
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
$.ajax({
    type: 'GET',
    url: `/posts/edit/${$("#edit-post-form").attr("post-id")}`,
    success: function (data) {
        var tags = data.tags;
        if (tags.length !== 0) {
            tags.forEach(function(tag){
                $("#tags").tagsinput('add', tag.tagName);
            });
        }
    }
});
$("#edit-post-form").submit(function(e){
    e.preventDefault();
    var formData = new FormData(this);
    $.ajax({
        url: `/posts/edit/${$("#edit-post-form").attr("post-id")}`,
        headers: {"X-CSRF-TOKEN": $('#_csrf').val()},
        type: 'POST',
        data: formData,
        processData: false,
        contentType : false,
        success: function(response) {
            if(response.status == 200){
                alert("更新成功");
                window.location.href = "/users/user";
            }else{
                alert(response.message);
                window.location.href = "/";
            }
        }
    });
});