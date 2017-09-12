var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);
var index = 0;
var songList;
var controlManager = root.controlManager;
var controlmanager;
var audiomanager = new root.audioManager();
var processor = root.processor;
var playList = root.playList;
var word = root.word;

function bindTouch() {
    var $slidePoint = $scope.find(".slider-point");
    var offset = $scope.find(".pro-wrapper").offset();
    var left = offset.left;
    var width = offset.width;
    $slidePoint.on("touchstart", function() {
        processor.stop();
    }).on("touchmove", function(e) {
        var x = e.changedTouches[0].clientX;
        var percent = (x - left) / width;
        if (percent < 0 || percent > 1) {
            percent = 0;
        }
        processor.update(percent);
    }).on("touchend", function(e) {
        var x = e.changedTouches[0].clientX;
        var percent = (x - left) / width;
        var duration = percent * songList[controlmanager.index].duration;
        audiomanager.jumptoPlay(duration);
        processor.startProcessor(percent);
        $scope.find(".play-btn").addClass("playing");
        word.play(percent);
    })
}

function bindClick() {
    $scope.on("play:change", function(event, index, flag) {
        root.render(songList[index]);
        audiomanager.setAudioSource(songList[index].audio);
        if (audiomanager.status == "play" || flag) {
            audiomanager.play();
            processor.startProcessor();
        }
        processor.renderAllTime(songList[index].duration);
        processor.update(0);
        word.getWord(index);
        // word.play();
    })
    $scope.find(".prev-btn").on("click", function() {
        var index = controlmanager.prev();
        $scope.trigger("play:change", [index]);
    })
    $scope.find(".next-btn").on("click", function() {
        var index = controlmanager.next();
        $scope.trigger("play:change", [index]);
    })
    $scope.find(".play-btn").on("click", function() {
        if (audiomanager.status === "pause") {
            audiomanager.play();
            processor.startProcessor();
            $(this).addClass('playing');
        } else {
            audiomanager.pause();
            processor.stop();
            $(this).removeClass('playing');
        }
    })
    $scope.find(".list-btn").on("click", function() {
        playList.show(controlmanager);
    })
}

function getData(url, callback) {
    $.ajax({
        url: url,
        type: "GET",
        success: callback,
        error: function(error) {
            console.log(error);
        }
    })
}

function successCall(data) {
    bindClick();
    bindTouch();
    songList = data;
    $scope.trigger("play:change", [0]);
    controlmanager = new controlManager(data.length);
    playList.renderPlayList(data);
    word.getData(data);
    // console.log(data);
    word.getWord(data[controlmanager.index].word);
    // console.log(controlmanager.index);
}
getData("./mock/data.json", successCall);