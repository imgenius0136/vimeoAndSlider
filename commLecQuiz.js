let commLecQuiz = (function (seconds){

    let player;
    let player_mask;
    let swipe;

    let loading_bar;
    let video_container, video_div, progress_bar;
    let height_block;

    let tc_info = [];
    let tc_start;
    let tc_end;
    let video_tc;
    let offset;
    let player_width;

    let part_loop_flag = false;

    let now_tc_in;
    let now_tc_out;
    let time_reset = false;

    let userSlide = false;
    let json_data;
    let quiz_answer = [];
    let quiz_shuffle = [];

    let clientH;
    let playerH;

    let answer_count = 0;
    let answer_count2 = [];

    let audio_answer;
    let audio_wrong;

    let interval, progress_interval;

    let now_index;

    let isPlayerReady = false;



    var obj = {
        init : function (data) {
            json_data = data;
            console.log(json_data);


            let hei_auto = document.querySelector(".hei_auto");
            audio_answer = hei_auto.querySelector("#audio_answer");
            audio_wrong = hei_auto.querySelector("#audio_wrong");
            progress_bar = document.querySelector(".progress_now");
            console.log(audio_answer);
            console.log(audio_wrong);

            //tc_parsing
            for(let i = 0 ; i < json_data.length ; i++){
                let data_tmp = {};
                let tmp_tc_in = JSON.parse(JSON.stringify(json_data[i].tc_in));
                let tmp_tc_out = JSON.parse(JSON.stringify(json_data[i].tc_out));
                data_tmp.tc_in = tmp_tc_in;
                data_tmp.tc_out = tmp_tc_out;
                tc_info[i] = data_tmp;
            }

            //정답표
            for(let i = 0 ; i < json_data.length ; i++){
                let quiz_tmp = json_data[i].quiz;
                let quiz_arr = quiz_tmp.split("/");
                console.log("quiz_arr" + i);
                quiz_answer[i] = quiz_arr;
            }

            console.log(quiz_answer.length + "입니다아아아");

            //정답 셔플
            for(let i = 0 ; i < quiz_answer.length ; i++){
                let tmp = JSON.parse(JSON.stringify( quiz_answer[i] ));
                quiz_shuffle[i] = obj.shuffleArray(tmp);
            }

            video_container = document.querySelector(".is-fixed-top");
            height_block = document.querySelector(".hei_auto");

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
            swipe = new Swiper(".swiper-container-comm", {
                effect: "slide",
                spaceBetween: 20,
                on: {
                    init: function() {
                        now_index = 0;
                        player.setCurrentTime(tc_info[this.realIndex].tc_in);
                        player.pause();
                            console.log("스와이프 init");
                        for(let i = 0 ; i < this.slides.length ; i++){
                            answer_count2[i] = 0;
                            console.log("스와이프 " + i);
                            let tmp = this.slides[i].querySelector(".div_in_swipe-box");
                            let again_box = this.slides[i].querySelector(".again_box");
                            let slider =  this.slides[i];
                            // slider.onclick = () => {
                            //     if(isPlayerReady){
                            //         player.getPaused().then(function(paused) {
                            //             if(paused){
                            //                 //정지상태
                            //                 player.play();
                            //                 player_mask.style.display = "none";
                            //             }else{
                            //                 //재생중
                            //                 player.pause();
                            //                 player_mask.style.display = "block";
                            //             }
                            //         });
                            //     }
                            // };
                            again_box.style.display = "none";
                            again_box.onclick = (ev) => {
                                obj.shuffleExample(this.slides[i], i);
                                obj.answerUpdateUI(3, this.slides[i]);
                                again_box.style.display = "none";
                            };
                            let div1 = tmp.querySelector(".quiz_korean_explain2");
                            let div2 = tmp.querySelector(".quiz_rnd_div");
                            let div3 = tmp.querySelector(".quiz_answer_div");
                            let span_explain = document.createElement("span");
                            span_explain.innerText = json_data[i].korean;
                            span_explain.className = "korean_txt";
                            div1.appendChild(span_explain);
                            let tmp_quiz_answer = quiz_answer[i];
                            let div_tmp_parent = document.createElement("div");
                            div_tmp_parent.className = "div_tmp_parent";
                            for(let x = 0 ; x < tmp_quiz_answer.length ; x++){
                                let div_tmp = document.createElement("div");
                                div_tmp.innerText = tmp_quiz_answer[x];
                                div_tmp.className = "answer_div";
                                //div_tmp.style.color = "transparent";
                                div_tmp_parent.append(div_tmp);
                            }

                            div3.appendChild(div_tmp_parent);

                            let tmp_quiz_shuffle = quiz_shuffle[i];
                            for(let x = 0 ; x < tmp_quiz_shuffle.length ; x++){
                                let div_tmp = document.createElement("div");
                                div_tmp.className = "box";
                                div_tmp.innerText = tmp_quiz_shuffle[x];
                                div_tmp.clickable = true;
                                div2.appendChild(div_tmp);
                                div_tmp.onclick = (ev) => {
                                    // console.log(answer_count +"입니다아아아아" + tmp_quiz_shuffle.length);
                                    let count = answer_count2[i];
                                    let answer = quiz_answer[i];
                                    let shuffle = ev.target.innerText;
                                    let div_tmp_parent = div3.querySelector(".div_tmp_parent");
                                    let div_tmp_parent_nodes = div_tmp_parent.childNodes[answer_count2[i]];
                                    console.log(answer_count2[i] + "," + answer[answer_count2[i]]);
                                    if(answer[count].toString() === shuffle.toString()){
                                        console.log(answer[answer_count2[i]] + "====" + shuffle);
                                        answer_count2[i]++;
                                        audio_answer.play();
                                        // div2.removeChild(div_tmp);
                                        div_tmp.style.color = "transparent";
                                        div_tmp.style.boxShadow = "none";
                                        obj.answerUpdateUI(1 , div_tmp_parent_nodes, answer_count2[i]);
                                        if(answer_count2[i] === tmp_quiz_shuffle.length){
                                            answer_count2[i] = 0;
                                            again_box.style.display = "inline-block";
                                            obj.videoPlaying(tc_info, i);
                                            console.log("!!!!!!!");
                                        }else{
                                            console.log("????");
                                        }
                                    }else{
                                        audio_wrong.play();
                                        obj.answerUpdateUI(2 , null);
                                    }
                                };
                            }



                            // for(let k = 0 ; k < quiz_answer.length ; k++){
                            //     let tmp = quiz_answer[k];
                            //     // for(let u = 0 ; u < tmp.length ; u++){
                            //     //     let div_tmp = document.createElement("div");
                            //     //     div_tmp.innerHTML = tmp[u];
                            //     //     div3.appendChild(div_tmp);
                            //     // }
                            // }
                        }
                    },
                    slideChange: function() {
                        userSlide = true;
                        let tmp = tc_info[this.realIndex].tc_in;
                        player.setCurrentTime(tmp);
                        player.pause();
                    },
                    sliderMove : function () {
                        console.log("움직인다아아아" + swipe.realIndex);
                    }

                }
            });

            player.ready().then( () => {
                console.log("준비완료");
                isPlayerReady = true;
                player.setCurrentTime(tc_info[swipe.realIndex].tc_in);
                // player.play();
                // tc_start = tc_info[0].tc_in;
                // tc_end = tc_info[0].tc_out;
            });
            player.on("play", (data) => {
                console.log("재생");
                player_mask.style.display = "none";
                // if(!userSlide){
                //     player.setCurrentTime(tc_info[swipe.realIndex].tc_in);
                // }
                if(interval === null || interval === undefined){
                    interval = window.setInterval(playerListener, 500);
                }

            });
            player.on("pause", (data) => {
                player_mask.style.display = "block";
                console.log("정지");
                if(interval !== null || true){
                    window.clearInterval(interval);
                    interval = null;
                }

            });
            player.on("ended", (data) => {
                console.log("끝남");
                if(interval !== null || true){
                    window.clearInterval(interval);
                    interval = null;
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
            });
            this.responseFunc();
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
            };
        },
        setBoxMinHeight : () => {
            playerH = video_container.offsetHeight;
            clientH = document.body.clientHeight;
            for(let i = 0 ; i < 3 ; i++){
                console.log(i + "입니다.");
                let obj = swipe.slides[i].querySelector(".swipe-box");
                obj.style.minHeight = clientH - playerH - 70 + "px";
            }
        },
        shuffleArray : (data) => {
            let j, x, i;
            for (i = data.length; i; i -= 1) {
                j = Math.floor(Math.random() * i);
                x = data[i - 1];
                data[i - 1] = data[j];
                data[j] = x;
            };
            return data;
        },
        answerUpdateUI : (r , e, c) => {
            if(r === 1){
                //todo 소리재생 정답
                e.style.color = "black";
                e.style.minWidth = "fit-content";
            }
            if(r === 2){
                //todo 소리재생 오답
            }
            if(r === 3){
                //todo 다시풀기
                c = 0;
                let t_obj = e.querySelector(".div_tmp_parent");
                let len = t_obj.childElementCount;
                for(let y = 0 ; y < len ; y ++){
                    t_obj.childNodes[y].style.color = "transparent";
                    t_obj.childNodes[y].style.minWidth = "22%";
                }

            }
        },
        shuffleExample : (s, x) => {
            answer_count2[x] = 0;
            let quiz_rnd_div = s.querySelector(".quiz_rnd_div");
            let quiz_answer_div = s.querySelector(".quiz_answer_div");
            // let compare_answer = quiz_answer[i];
            while ( quiz_rnd_div.hasChildNodes() ) { quiz_rnd_div.removeChild( quiz_rnd_div.firstChild ); console.log("삭제중");}

            // console.log(compare_answer + "컴페어어어");

            for(let i = 0 ; i < quiz_answer.length ; i++){
                console.log(quiz_answer[i] + "FKRHRHRHRH");
                let tmp = JSON.parse(JSON.stringify( quiz_answer[i] ));
                quiz_shuffle[i] = obj.shuffleArray(tmp);
            }

            let shuffle_arr = quiz_shuffle[x].toString().split(",");
            let len = shuffle_arr.length;
            for(let i = 0 ; i < len ; i ++){
                let div_word = document.createElement("div");
                div_word.className = "box";
                div_word.innerText = shuffle_arr[i];
                div_word.clickable = true;
                quiz_rnd_div.appendChild(div_word);
                div_word.onclick = (ev) => {
                    // console.log(answer_count +"입니다아아아아");
                    // if(answer_count + 1 === len){
                    //     again_box.style.display = "inline-block";
                    // }
                    let answer = quiz_answer[x];
                    let shuffle = ev.target.innerText;
                    let div_tmp_parent = s.querySelector(".div_tmp_parent");
                    let div_tmp_parent_nodes = div_tmp_parent.childNodes[answer_count2[x]];
                    if(answer[answer_count2[x]].toString() === shuffle.toString()){
                        audio_answer.play();
                        answer_count2[x]++;
                        console.log(answer[answer_count2[x]] + "====" + shuffle);
                        // quiz_rnd_div.removeChild(div_word);
                        div_word.style.color = "transparent";
                        div_word.style.boxShadow = "none";
                        obj.answerUpdateUI(1 , div_tmp_parent_nodes);
                        if(answer_count2[x] === len){
                            answer_count2[x] = 0;
                            s.querySelector(".again_box").style.display = "inline-block";
                            obj.videoPlaying(tc_info, x);
                            console.log("!!!!!!!");
                        }else{
                            console.log("????");
                        }
                        //div_tmp_parent_nodes.style.color = "black";
                    }else{
                        audio_wrong.play();
                        obj.answerUpdateUI(2 , null);
                    }

                }


            }
        },
        videoPlaying : (tc, x) => {
            player.play();
        }

    };

    function playerListener(){
        console.log("listen...");
        player.getCurrentTime().then(function(seconds) {
            if (seconds >= tc_info[swipe.realIndex].tc_out) {
                player.setCurrentTime(tc_info[swipe.realIndex].tc_in);
                player.pause();
            }
        });
    }

    function progressListener(){
        player.getCurrentTime().then(function(seconds) {
            // progress_bar.style.width = ((seconds - tc_start) * offset) + "px";
        });
    }

    return obj;
})();