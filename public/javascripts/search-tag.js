$('#search').keypress(function (e) {
    // e.preventDefault();
    if (e.which == 13) {
        var tag = $("#search").val();
        window.location = `/posts/tag/${tag}`;
    }
  });