mdui.setColorScheme('#ff0000');
mdui.$.ajax({
    url: 'https://forthezero.pythonanywhere.com/ab',
    dataType: 'json',
    success: function (data) {
        //console.log(data);
        let items = data.items;
        let element_html = '';
        for(let i=0;i<items.length;i++){
            let item = items[i];
            let tmb = item.snippet.thumbnails.high.url;
            let title = item.snippet.title;
            let time = item.snippet.publishTime;
            let description = item.snippet.description;
            let this_ele = `
            <mdui-card class="mdui-prose" variant="elevated" clickable href="https://www.youtube.com/watch?v=${item.id.videoId}">
                <img src="https://wsrv.nl/?url=${tmb}" loading="lazy">
                <h3 class="video-title">${title}</h3>
                <p class="video-description">${description}</p>
                <p class="video-time">${time}</p>
            </mdui-card>`;
            
            element_html += this_ele;
        };
        mdui.$('.container').html(element_html);
    },
    error: function (xhr, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        mdui.snackbar({
            message: 'Error:'+ textStatus,
        });
    }
});
/*
{
    "etag": "T2ftPe6JFl4_emEI6hqN4HmPflU",
    "items": [
        {
            "etag": "MqEJz7x_pbOYdl-UPXX4hNNOMWE",
            "id": {
                "kind": "youtube#video",
                "videoId": "CIVtD7ftOEM"
            },
            "kind": "youtube#searchResult",
            "snippet": {
                "channelId": "UCbKWv2x9t6u8yZoB3KcPtnw",
                "channelTitle": "Alan Becker",
                "description": "Idea & Writer: @its_me_skim Animation: @tjb7345 @SimpleFox1 @ablerai Sounds: @dan_loeb.",
                "liveBroadcastContent": "none",
                "publishTime": "2025-07-12T12:00:19Z",
                "publishedAt": "2025-07-12T12:00:19Z",
                "thumbnails": {
                    "default": {
                        "height": 90,
                        "url": "https://i.ytimg.com/vi/CIVtD7ftOEM/default.jpg",
                        "width": 120
                    },
                    "high": {
                        "height": 360,
                        "url": "https://i.ytimg.com/vi/CIVtD7ftOEM/hqdefault.jpg",
                        "width": 480
                    },
                    "medium": {
                        "height": 180,
                        "url": "https://i.ytimg.com/vi/CIVtD7ftOEM/mqdefault.jpg",
                        "width": 320
                    }
                },
                "title": "Flip The Screen - An Actual Short"
            }
        },
        ...
    ],
    "kind": "youtube#searchListResponse",
    "nextPageToken": "CAoQAA",
    "pageInfo": {
        "resultsPerPage": 30,
        "totalResults": 418
    },
    "regionCode": "US"
}
*/