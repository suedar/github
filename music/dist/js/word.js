(function($, root) {
    var obj = {}
        // var html = "<div class='word-name'><div></div></div>"
    var $scope = $(document.body);
    var Data = '';
    var minute, second, hSecond;
    var arr = [];
    var $word = $('.word-name');
    var topVal = 540;
    var iIndex;

    function getData(data) {
        // console.log(data);
        Data = data;
    }

    function getWord(index) {
        // console.log(index);
        var word = typeof(index) == 'number' ? Data[index].word : index;
        var reg = /([^\[(*)\[]+)(?=\[)/g;
        $scope.find('.word-name').html("");
        arr = [];
        var reg1 = /(\d\d\:\d\d)\.(\d)(\d)/g;
        // console.log(index);
        topVal = 540;
        word.replace(reg, function($1) {
            var san = $1.split("]");
            // arr.push(san[0]);
            arr.push(san[0].replace(reg1, function($, $1, $2, $3) {
                return $1 + '.' + $2 + 0;
            }));
            // console.log(arr);
            obj[san[0]] = san[1];
            var text = $("<div>").text(san[1]);
            $scope.find('.word-name').append(text);

        })

    }
    // var q;

    function play(percent) {
        // console.log(11);
        var time = minute + ":" + second + "." + hSecond;
        // console.log(time);
        var height = $word[0].clientHeight;
        topVal = 540;

        for (let i in arr) {
            // console.log(time, arr[i]);
            if (time == arr[i]) {
                // console.log(time, arr[i]);
                // q = i;
                arr[i] = 0;
                $scope.find('.play').removeClass('play');
                $word.find('div').eq(i).addClass('play');
                // console.log(i);
                topVal -= i * 34.5;
                // console.log(topVal);
                $word.css({ top: topVal });
            }
        }

        // var height = $word[0].clientHeight;
        // var topVal = 570 - height * percent + 'px';
        // $word.css({ top: topVal });
    }

    function getIn(index) {
        getWord(Data, index);
    }

    function getTime(dur) {
        var duration = Math.round(dur * 100) / 100;
        minute = Math.floor(duration / 60);
        second = duration - 60 * minute;
        hSecond = Math.floor(second * 10 % 10);
        hSecond = hSecond + "0";
        second = Math.floor(second);
        if (minute < 10) {
            minute = "0" + minute;
        }
        if (second < 10) {
            second = "0" + second;
        }
        // if (hSecond < 10) {
        //     hSecond = "0" + hSecond;
        // }
        // console.log(minute, second, hSecond);
    }
    root.word = {
        getWord: getWord,
        getTime: getTime,
        getIn: getIn,
        play: play,
        getData: getData
    }
}(window.Zepto, window.player || (window.player = {})))