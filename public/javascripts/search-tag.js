$('#search').keypress(function (e) {
    if (e.which == 13) {
        var tag = $("#search").val();
        window.location = `/posts/${tag}`;
    }
  });