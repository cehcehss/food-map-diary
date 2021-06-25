var map;

function initMap() {
    var myLatLng = {
        lat: 25.045355,
        lng: 121.523706
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 13,
        styles: [{
                "featureType": "water",
                "stylers": [{
                    "color": "#0e171d"
                }]
            },
            {
                "featureType": "landscape",
                "stylers": [{
                    "color": "#1e303d"
                }]
            },
            {
                "featureType": "road",
                "stylers": [{
                    "color": "#1e303d"
                }]
            },
            {
                "featureType": "poi.park",
                "stylers": [{
                    "color": "#1e303d"
                }]
            },
            {
                "featureType": "transit",
                "stylers": [{
                        "color": "#182731"
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": [{
                        "color": "#f0c514"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.stroke",
                "stylers": [{
                        "color": "#1e303d"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels.text.fill",
                "stylers": [{
                        "color": "#e77e24"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#677374"
                }]
            },
            {
                "featureType": "administrative",
                "elementType": "labels",
                "stylers": [{
                        "visibility": "simplified"
                    },
                    {
                        "color": "#e84c3c"
                    }
                ]
            },
            {
                "featureType": "poi",
                "stylers": [{
                        "color": "#e84c3c"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            }
        ]
    });
    var icons = {
        1: {
            icon: '/icons/sushi.png'
        },
        2: {
            icon: '/icons/coffee.png'
        },
        3: {
            icon: '/icons/cake.png'
        },
        4: {
            icon: '/icons/brunch.png'
        },
        5: {
            icon: '/icons/other.png'
        },
    }
    $.ajax({
        type: 'GET',
        url: `/users/getMemberData`,
        success: function (data) {
            var posts = data.posts;
            if (posts.length == 0) {
                $("#posts").html(`<div class="col text-center">
                <h2>No Post</h2>
            </div>`);
            } else {
                posts.forEach(post => {
                    var postTemplate = `<div class="col-md-4 col-sm-12 my-3">
                                    <div class="card">
                                            <img src="${post.image}" class="card-img-top" alt="...">
                                    <div class="card-body">
                                        <a post-id="${post.id}" class="delete-btn"><i class="far fa-trash-alt text-muted float-end"></i></a>
                                        <a href="/posts/edit-page/${post.id}" post-id="${post.id}" class="edit-btn"><i class="far fa-edit text-muted float-end me-2"></i></a>
                                        <h5 class="card-title">${post.title} ${post.isPublic?'':'<i class="fas fa-lock text-muted"></i>'}</h5>
                                        
                                        <p class="card-text">${post.content}</p>
                                        <p class="card-text"><small class="text-muted">${post.createdAtFormat}</small></p>
                                        <a href="https://www.google.com/maps/search/?api=1&query=${post.address}" class="btn btn-outline-secondary"
                                        target="_blank"><i class="fas fa-map-marker-alt"></i></a>
                                        <div id="tag-box">
                                            ${(post.tags !== undefined) ? post.tags.map(function(tag){return '<a href="/posts/tag/'+tag+'" class="tags">#'+tag+'</a>'}).join(""):""}
                                        </div>
                                    </div>
                                    </div>
                                </div>`;
                    $("#posts").append(postTemplate);

                    var contentString = `<h5>${post.title}</h5>
                            <p>${post.content}</p>
                            <img src="${post.image}" width="300px">`;

                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });
                    var geocoder = new google.maps.Geocoder();
                    var addr = `${post.address}`;
                    var marker;
                    //地址轉座標
                    geocoder.geocode({
                        'address': addr
                    }, function (results, status) {

                        if (status == google.maps.GeocoderStatus.OK) {

                            var latlng = results[0].geometry.location;
                            //將地圖中心定位到最新一筆資料
                            map.setCenter(latlng);
                            marker = new google.maps.Marker({
                                position: latlng,
                                map: map,
                                icon: icons[`${post.shopType}`].icon,
                                title: `${post.title}`
                            });
                            infowindow.open(map, this.marker);
                            marker.addListener('click', function () {
                                infowindow.open(map, marker);
                            });
                        }
                    });
                });

            }
        }
    });

}

$("#posts").on("click",".delete-btn",function(e){
    e.preventDefault();
    var postId = $(this).attr('post-id');
    $.ajax({
        url: `/posts/delete/${postId}`,
        headers: {"X-CSRF-TOKEN": $('#_csrf').val()},
        type: 'DELETE',
        success: function(response) {
            if(response.status == 200){
                alert("刪除成功");
                window.location.href = "/users/user";
            }else{
                alert(response.message);
            }
            // window.location.href = "/users/user";
        }
    });
});