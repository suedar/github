(function($, root) {
    var frameId, startTime;
    var curDuration, lastPercent = 0;
    var $scope = $(document.body);

    function formatTime(duration) {
        word.getTime(duration);
        duration = Math.round(duration);
        var minute = Math.floor(duration / 60);
        var second = duration - 60 * minute;
        if (minute < 10) {
            minute = "0" + minute;
        }
        if (second < 10) {
            second = "0" + second;
        }
        return minute + ":" + second;
    }

    function renderAllTime(duration) {
        curDuration = duration;
        lastPercent = 0;
        var allTime = formatTime(duration);
        $scope.find(".all-time").text(allTime);
    }

    function stop() {
        var stopTime = new Date().getTime();
        lastPercent = lastPercent + (stopTime - startTime) / (curDuration * 1000);
        cancelAnimationFrame(frameId);
    }

    function process(percent) {
        var percentage = (percent - 1) * 100 + '%';
        $scope.find(".pro-top").css({
            transform: "translateX(" + percentage + ")"
        })
    }

    function update(percent) {
        var curTime = percent * curDuration;
        var time = formatTime(curTime);
        $scope.find(".current-time").text(time);
        process(percent);
    }

    function startProcessor(percentage) {
        lastPercent = percentage == undefined ? lastPercent : percentage;
        cancelAnimationFrame(frameId);
        startTime = new Date().getTime();

        function frame() {
            var curTime = new Date().getTime();
            var percent = lastPercent + (curTime - startTime) / (curDuration * 1000);
            if (percent < 1) {
                frameId = requestAnimationFrame(frame);
                word.play(percent);
                update(percent);
            } else {
                cancelAnimationFrame(frameId);
            }
            // console.log(percent);
            // word.getWord(controlmanager.index, data);
        }
        frame();
    }
    root.processor = {
        startProcessor: startProcessor,
        renderAllTime: renderAllTime,
        update: update,
        stop: stop
    }
})(window.Zepto, window.player || (window.player = {}))