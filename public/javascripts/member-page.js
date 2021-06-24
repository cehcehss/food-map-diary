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
        2: {
            icon: '/images/coffee.png'
        },
        spaghetti: {
            icon: 'https://elsiehsieh.github.io/cuisine-map/style/images/spaghetti.png'
        },
        1: {
            icon: '/images/sushi.png'
        },
        other: {
            icon: 'https://elsiehsieh.github.io/cuisine-map/style/images/pin.png'
        }
    }
    $.ajax({
        type: 'GET',
        url: `/users/getMemberData/${$("body").attr("user-id")}`,

        success: function (data) {
            var posts = data.posts;
            if (posts.length == 0) {
                $("#posts").html("No Post!");
            } else {
                posts.forEach(post => {
                    var postTemplate = `<div class="col-md-4 col-sm-12">
                                    <div class="card">
                                            <img src="${post.image}" class="card-img-top" alt="...">
                                    <div class="card-body">
                                        <i class="far fa-trash-alt text-muted float-end"></i>
                                        <i class="far fa-edit text-muted float-end me-2"></i>
                                        <h5 class="card-title">${post.title} ${post.isPublic?'<i class="fas fa-lock text-muted"></i>':""}</h5>
                                        
                                        <p class="card-text">${post.content}</p>
                                        <p class="card-text"><small class="text-muted">${post.createdAt}</small></p>
                                        <a href="https://www.google.com/maps/search/?api=1&query=${post.address}" class="btn btn-outline-secondary"
                                        target="_blank"><i class="fas fa-map-marker-alt"></i></a>
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