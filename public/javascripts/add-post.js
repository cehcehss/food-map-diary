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
})