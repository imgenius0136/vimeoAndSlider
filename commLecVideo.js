var commLec = (function (seconds){

    var player;
    let player_mask;
    let loading_bar;
    let video_container, video_div, progress_bar;
    let height_block;

    let swipe_box, option_chinese, option_pinyin, option_korean;
    let chinese_subtitle, pinyin_subtitle, korean_subtitle;
    let swipe , word_swipe;

    let isChineseClick = false;
    let isPinyinClick = false;
    let isKoreanClick = false;
    let isRepeat = false;

    let interval = null;
    let progress_interval = null;
    let progress_IncreasePerOne = 0;
    let progress_now = 0;

    let tc_info;
    let tc_start;
    let tc_end;
    let video_tc;
    let offset;
    let player_width;

    let part_loop_flag = false;

    let now_tc_in;
    let now_tc_out;

    let userSlide = false;
    let changeFlag = false;
    let isTouch = false;
    let isAnother = false;
    let isPause = true;
    let isPlayerReady = false;
    let currentSwipe;

    let clientH;
    let playerH;

    var obj = {
        init : function (data) {

            console.log(data.result);



            tc_info = data.result;
            tc_start = tc_info[0].tc_in;
            tc_end = tc_info[tc_info.length - 1].tc_out;
            video_tc = tc_end - tc_start;
            offset = player_width / video_tc ;

            now_tc_in = tc_start;
            now_tc_out = tc_end;

            video_container = document.querySelector(".is-fixed-top");
            height_block = document.querySelector(".hei_auto");
            swipe_box = document.querySelector(".swipe-box");

            chinese_subtitle = document.querySelector(".main_title");
            pinyin_subtitle = document.querySelector(".sub_title");
            korean_subtitle = document.querySelector(".contents");

            progress_bar = document.querySelector(".progress_now");



            player = new Vimeo.Player("player", {
                playsinline: false
                /* data-vimeo-요소의 특성으로 사용 하거나 Vimeo.Player생성자에 전달 된 개체 로 사용할 수 있습니다 . */
                /* id : 290222902 동영상의 ID 또는 URL입니다. */
                /* , autopause : true 다른 동영상이 재생되면 자동으로 동영상을 일시 중지하십시오. */
                /* , autoplay : false 자동으로 비디오 재생을 시작합니다. 일부 장치에서는 작동하지 않습니다. */
                /* , background : false 컨트롤을 숨기고 비디오를 자동 재생 및 반복하는 플레이어의 배경 모드를 활성화합니다 (Plus, PRO 또는 Business 회원이 사용할 수 있음). */
                /* , byline : true 비디오에 바이 라인을 표시하십시오. */
                /* , color : "00adef" 비디오 컨트롤의 색상을 지정하십시오. 색상은 비디오의 포함 설정에 의해 무시 될 수 있습니다. */
                /* , height : 0 비디오의 정확한 높이. 기본값은 사용 가능한 가장 큰 비디오 버전의 높이입니다. */
                /* , loop : false 비디오가 끝나면 다시 재생하십시오. */
                /* , maxheight : 0 높이와 같지만 동영상은 동영상의 기본 크기를 초과하지 않습니다. */
                /* , maxwidth : 0 너비와 동일하지만 비디오는 비디오의 원래 크기를 초과하지 않습니다. */
                /* , muted : false 로드시이 비디오를 음소거합니다. 특정 브라우저에서 자동 재생해야합니다. */
                /* , playsinline : true 모바일 장치에서 비디오를 인라인으로 재생하고 재생시 전체 화면으로 자동 이동하여이 매개 변수를로 설정합니다 false. */
                /* , portrait : true 비디오에 인물 사진을 보여줍니다. */
                /* , speed : false 환경 설정 메뉴에 속도 컨트롤을 표시하고 재생 속도 API (PRO 및 Business 계정에서 사용 가능)를 사용합니다. */
                /* , title : true 비디오에 제목을 표시하십시오. */
                /* , transparent : true 반응 형 플레이어와 투명한 배경은 기본적으로 사용하도록 설정되어이 매개 변수를 사용하지 않도록 설정됩니다 false. */
                /* , width : 0 동영상의 정확한 너비입니다. 기본값은 사용 가능한 가장 큰 비디오 버전의 너비입니다. */
            });

            player_width = player.element.clientWidth;
            progress_IncreasePerOne = player_width / 100;
            offset = player_width / video_tc;

            player_mask = document.querySelector(".custom-mask");
            player_mask.onclick = () =>{
                if(isPlayerReady){
                    player.getPaused().then(function(paused) {
                        if(paused){
                            //정지상태
                            player.play();
                            player_mask.style.display = "none";
                        }else{
                            //재생중
                            player.pause();
                            player_mask.style.display = "block";
                        }
                    });
                }
            };
            // console.log(clientH - playerH - 70);
            swipe = new Swiper(".swiper-container-comm", {
                effect: "slide",
                spaceBetween: 20,
                on: {
                    init: function () {
                        console.log("subtitle swipe init");
                        console.log(this.slides[this.realIndex].querySelector(".option_chinese"));
                        for (let i = 0; i < this.slides.length; i++) {
                            let slider = this.slides[i];
                            let repeat_icon = this.slides[i].querySelector(".repeat-icon");
                            let bt_loop_off = repeat_icon.querySelector(".bt_loop_off");
                            let bt_loop_on = repeat_icon.querySelector(".bt_loop_on");

                            // let chinese_button = this.slides[i].querySelector(".option_chinese");
                            // let pinyin_button = this.slides[i].querySelector(".option_pinyin");
                            // let korean_button = this.slides[i].querySelector(".option_korean");

                            // let option_1 = slider.querySelector(".main_title");
                            // let option_2 = slider.querySelector(".sub_title");
                            // let option_3 = slider.querySelector(".contents");
                            //
                            // let chinese_button_active_none = chinese_button.className;
                            // let chinese_button_active = chinese_button.className + " active";
                            // let pinyin_button_active_none = pinyin_button.className;
                            // let pinyin_button_active = pinyin_button.className + " active";
                            // let korean_button_active_none = korean_button.className;
                            // let korean_button_active = korean_button.className + " active";

                            let repeat_active_none = repeat_icon.className;
                            let repeat_active = repeat_icon.className + " active";

                            slider.onclick = function (e) {
                                if (isAnother) {
                                    isAnother = false;
                                    return;
                                }
                                // if(isPause){
                                //     player.play();
                                //     isTouch = false;
                                //     isPause = false;
                                // }
                                if (isPlayerReady) {
                                    player.getPaused().then(function (paused) {
                                        if (paused) {
                                            //정지상태
                                            player.play();
                                            player_mask.style.display = "none";
                                        } else {
                                            //재생중
                                            player.pause();
                                            player_mask.style.display = "block";
                                        }
                                    });
                                }

                                // if(!isTouch){
                                //     player.pause();
                                //     isTouch = true;
                                // }else{
                                //     player.play();
                                //     isTouch = false;
                                // }
                            };

                            repeat_icon.onclick = function (e) {
                                isAnother = true;
                                if (repeat_icon.className !== repeat_active) {
                                    repeat_icon.className = repeat_active;
                                    repeat_icon.style.color = "#ff8300";
                                    bt_loop_off.style.display = "none";
                                    bt_loop_on.style.display = "block";
                                    part_loop_flag = true;
                                } else {
                                    repeat_icon.className = repeat_active_none;
                                    repeat_icon.style.color = "#5d5d5d";
                                    bt_loop_off.style.display = "block";
                                    bt_loop_on.style.display = "none";
                                    part_loop_flag = false;
                                }
                            };


                            let slider_len = this.slides.length;
                            let tmp_chinese_btn_active_none = "button option_chinese";
                            let tmp_chinese_btn_active = tmp_chinese_btn_active_none + " active";
                            let tmp_pinyin_btn_active_none = "button option_pinyin";
                            let tmp_pinyin_btn_active = tmp_pinyin_btn_active_none + " active";
                            let tmp_korean_btn_active_none = "button option_korean";
                            let tmp_korean_btn_active = tmp_korean_btn_active_none + " active";

                            for (let i = 0; i < slider_len; i++) {
                                let tmp_slider = this.slides[i];
                                let tmp_chinese_btn = tmp_slider.querySelector(".option_chinese");
                                let tmp_pinyin_btn = tmp_slider.querySelector(".option_pinyin");
                                let tmp_korean_btn = tmp_slider.querySelector(".option_korean");
                                tmp_chinese_btn.onclick = (e) => {
                                    isAnother = true;
                                    for (let j = 0; j < slider_len; j++) {
                                        let tmp_slider2 = swipe.slides[j];
                                        let tmp_chinese_btn2 = tmp_slider2.querySelector(".option_chinese");
                                        let tmp_chinese_txt = tmp_slider2.querySelector(".main_title");
                                        if (tmp_chinese_btn2.className !== tmp_chinese_btn_active) {
                                            tmp_chinese_btn2.className = tmp_chinese_btn_active;
                                            tmp_chinese_txt.style.display = "none";
                                            obj.setDisableColor(tmp_chinese_btn2);
                                        } else {
                                            tmp_chinese_btn2.className = tmp_chinese_btn_active_none;
                                            tmp_chinese_txt.style.display = "block";
                                            obj.setClickableColor(tmp_chinese_btn2);
                                        }
                                    }
                                };
                                tmp_pinyin_btn.onclick = (e) => {
                                    isAnother = true;
                                    for (let j = 0; j < slider_len; j++) {
                                        let tmp_slider2 = swipe.slides[j];
                                        let tmp_pinyin_btn2 = tmp_slider2.querySelector(".option_pinyin");
                                        let tmp_pinyin_txt = tmp_slider2.querySelector(".sub_title");
                                        if (tmp_pinyin_btn2.className !== tmp_pinyin_btn_active) {
                                            tmp_pinyin_btn2.className = tmp_pinyin_btn_active;
                                            tmp_pinyin_txt.style.display = "none";
                                            obj.setDisableColor(tmp_pinyin_btn2);
                                        } else {
                                            tmp_pinyin_btn2.className = tmp_pinyin_btn_active_none;
                                            tmp_pinyin_txt.style.display = "block";
                                            obj.setClickableColor(tmp_pinyin_btn2);
                                        }
                                    }
                                };
                                tmp_korean_btn.onclick = (e) => {
                                    isAnother = true;
                                    for (let j = 0; j < slider_len; j++) {
                                        let tmp_slider2 = swipe.slides[j];
                                        let tmp_korean_btn2 = tmp_slider2.querySelector(".option_korean");
                                        let tmp_korean_txt = tmp_slider2.querySelector(".contents");
                                        if (tmp_korean_btn2.className !== tmp_korean_btn_active) {
                                            tmp_korean_btn2.className = tmp_korean_btn_active;
                                            tmp_korean_txt.style.display = "none";
                                            obj.setDisableColor(tmp_korean_btn2);
                                        } else {
                                            tmp_korean_btn2.className = tmp_korean_btn_active_none;
                                            tmp_korean_txt.style.display = "block";
                                            obj.setClickableColor(tmp_korean_btn2);
                                        }
                                    }
                                };
                            }


                        }
                    },
                    slideChange: function () {
                        console.log(swipe.realIndex);
                        if (part_loop_flag === true) {
                            part_loop_flag = false;
                        }

                        if (userSlide) {
                            let tmp = tc_info[this.realIndex].tc_in;
                            player.setCurrentTime(tmp);
                            player.pause();
                            userSlide = false;
                            let tmp_seconds = player.getCurrentTime();
                            progress_bar.style.width = ((tmp_seconds - tc_start) * offset) + "px";
                        }

                        now_tc_in = tc_info[this.realIndex].tc_in;
                        now_tc_out = tc_info[this.realIndex].tc_out;
                    },
                    sliderMove: function () {
                        player.pause();
                        let repeat_icon = this.slides[this.realIndex].querySelector(".repeat-icon");
                        repeat_icon.className = "repeat-icon";
                        repeat_icon.style.color = "#5d5d5d";
                        let bt_loop_off = this.slides[this.realIndex].querySelector(".bt_loop_off");
                        let bt_loop_on = this.slides[this.realIndex].querySelector(".bt_loop_on");
                        bt_loop_off.style.display = "block";
                        bt_loop_on.style.display = "none";
                        part_loop_flag = false;
                        userSlide = true;
                    },
                    touchStart: function () {
                        console.log("touch!!!");
                        userSlide = false;
                    },
                    touchEnd: function () {
                        console.log("touch end");
                    }
                }
            });

            // for(let i = 0 ; i < tc_info.length ; i++){
            //     obj.setBoxMinHeight(swipe.slides[i]);
            // }


            word_swipe = new Swiper(".swiper-container-word", {
                effect: "slide",
                spaceBetween: 20,
                on: {
                    init: function() {

                        console.log("word swipe init");
                        for(let i = 0 ; i < this.slides.length ; i++){
                            let repeat_icon = this.slides[i].querySelector(".tts_word");
                            let repeat_active_none = repeat_icon.className;
                            let repeat_active = repeat_icon.className + " active";
                            let word = this.slides[i].querySelector(".word-chinese");
                            let word_str = word.innerHTML;
                            repeat_icon.onclick = function(e){
                                if (repeat_icon.className !== repeat_active) {
                                    repeat_icon.className = repeat_active;
                                    repeat_icon.style.color = "#ff8300";
                                    if(data.os_name === "ANDROID"){
                                        //window.App.showToast("소리재생준비중"+word_str);
                                        window.App.playTTS(word_str);
                                        setTimeout(function() {
                                            repeat_icon.className = repeat_active_none;
                                            repeat_icon.style.color = "#5d5d5d";
                                        }, 3000);
                                        player.pause();
                                    }else if(data.os_name ==="IOS"){

                                    }else{
                                        //web
                                        alert("웹에선 지원하지 않는 기능입니다.");
                                    }
                                }else {
                                    repeat_icon.className = repeat_active_none;
                                    repeat_icon.style.color = "#5d5d5d";

                                }
                            };
                        }
                    }
                }
            });

            player.ready().then( () => {
                console.log("준비완료");
                userSlide = false;
                obj.setProgressBar(0);
                player.setCurrentTime(tc_start);
                isPlayerReady = true;

                player.play();
                if(isPlayerReady){
                    player.getPaused().then(function(paused) {
                        if(paused){
                            //정지상태
                            player.play();
                            player_mask.style.display = "none";
                        }else{
                            //재생중
                            player.pause();
                            player_mask.style.display = "block";
                        }
                    });
                }

            });
            player.on("play", (data) => {
                console.log("재생");
                if(interval === null || interval === undefined){
                    interval = window.setInterval(playerListener, 200);
                }
                if(progress_interval === null || progress_interval === undefined){
                    progress_interval = window.setInterval(progressListener, 100);
                }

            });
            player.on("pause", (data) => {
                console.log("정지");
                isPause = true;
                player_mask.style.display = "block";
                // userSlide = false;
                if(interval !== null || true){
                    window.clearInterval(interval);
                    interval = null;
                }
                if(!userSlide){
                    if(progress_interval !== null || true){
                        window.clearInterval(progress_interval);
                        progress_interval = null;
                    }
                }
            });
            player.on("ended", (data) => {
                userSlide = false;
                if(interval !== null || true){
                    window.clearInterval(interval);
                    interval = null;
                }
                if(progress_interval !== null || true){
                    window.clearInterval(progress_interval);
                    progress_interval = null;
                }
            });
            player.on("bufferstart", (data) => {
                console.log("버퍼링시작됨");
            });
            player.on("bufferend", (data) => {
                console.log("버퍼링끝남");
            });
            player.on("error", (data) => {
                console.log("에러 시작됨");
                if(interval !== null || true){
                    window.clearInterval(interval);
                    interval = null;
                }
                if(progress_interval !== null || true){
                    window.clearInterval(progress_interval);
                    progress_interval = null;
                }
            });
            // player.getPaused().then(function(paused) {
            //     console.log(paused);
            //     if (paused == true) {
            //         player.play();
            //     } else {
            //         player.pause();
            //     }
            // });
            this.responseFunc();


        }, remove_character : (str, char_pos) => {
            part1 = str.substring(0, char_pos);
            part2 = str.substring(char_pos + 1, str.length);
            return (part1 + part2);
        },
        responseFunc: () => {
            height_block.style.height = video_container.offsetHeight + "px";
            video_container.style.background = "black";

            playerH = video_container.offsetHeight;
            clientH = document.body.clientHeight;

            obj.setBoxMinHeight(swipe);


            window.onresize = function(event){
                obj.setBoxMinHeight(swipe);
                height_block.style.height = video_container.offsetHeight + "px";
                // let tmp = swipe.slides[swipe.realIndex].querySelector(".swipe-box");
                // height_block.style.height = video_container.offsetHeight + "px";
                // clientH = document.body.clientHeight;
                // playerH = player.element.clientHeight;
                // console.log("clientH" + clientH);
                // console.log("playerH" + playerH);
                // console.log(clientH - playerH - 70);
                // tmp.style.minHeight = clientH - playerH - 70 + "px";
            };
        },
        setClickableColor : (o) => {
            o.style.borderColor = "#5d5d5d";
            o.style.color = "#5d5d5d";
        },
        setDisableColor : (o) => {
            o.style.borderColor = "#989898";
            o.style.color = "#989898";
        },
        setProgressBar : (o) => {
            progress_bar.style.width = o +"px";
        },
        setBoxMinHeight : (e) => {
            // let obj = e.querySelector(".swipe-box");
            // obj.style.minHeight = clientH - playerH - 70 + "px";
            playerH = video_container.offsetHeight;
            clientH = document.body.clientHeight;
            for(let i = 0 ; i < tc_info.length ; i++){
                console.log(i + "입니다.");
                let obj = swipe.slides[i].querySelector(".swipe-box");
                obj.style.minHeight = clientH - playerH - 70 + "px";
            }
        }

    };

    function playerListener(){
        console.log("listen...");
        player.getCurrentTime().then(function(seconds) {
            if(seconds >= tc_end){
                if(part_loop_flag){
                    if(seconds >= tc_info[swipe.realIndex].tc_out){
                        player.setCurrentTime(tc_info[swipe.realIndex].tc_in);
                    }
                    return;
                }
                player.setCurrentTime(tc_start);
                swipe.slideTo(0);
            }

            if(part_loop_flag){
                if(seconds >= tc_info[swipe.realIndex].tc_out){
                    player.setCurrentTime(tc_info[swipe.realIndex].tc_in);
                }
                return;
            }

            for (let i = 0; i < tc_info.length; i++) {
                if (seconds >= tc_info[i].tc_in && seconds < tc_info[i].tc_out) {
                    now_tc_in = tc_info[i].tc_in;
                    now_tc_out = tc_info[i].tc_out;
                    // swipe.slideTo(i, 100, false);
                    if(false === userSlide){
                        swipe.slideTo(i, 100, false);
                    }else{
                        // userSlide = true;
                    }
                    return;
                }
            }
        });
    }

    function progressListener(){
        player.getCurrentTime().then(function(seconds) {
            progress_bar.style.width = ((seconds - tc_start) * offset) + "px";
        });
    }

    return obj;
})();