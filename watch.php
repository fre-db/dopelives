<!DOCTYPE html>
<html>
    <head>
        <title>Dopefish Lives</title>
        <meta charset="utf-8" /> 
        <link rel="icon" href="/images/favicon.png" sizes="16x16" type="image/png" />

        <link rel="stylesheet" type="text/css" href="style/font.css" />
        <link rel="stylesheet" type="text/css" href="style/watch.css" />

        <script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
        
        <link href="https://vjs.zencdn.net/8.19.1/video-js.min.css" rel="stylesheet">
        <script src="https://vjs.zencdn.net/8.19.1/video.min.js"></script>
        
        <script src="script/functions.js"></script>
        <script src="script/watch.js"></script>
        <script>
            $(function() {
                initPlayer();
            });
        </script>
        
    </head>

    <body>
        <video-js id="video" class="vjs-default-skin vjs-fill" controls>
        </video-js>
    </body>
</html>
