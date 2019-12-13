let tmp;
let obj;
let txt_ul;
let isAll = false; //사용자가 전체 재생을 눌렀는지 ...
let swiper = new Swiper('.swiper-container-comm',{
    effect: "slide",
    spaceBetween: 20,
    on: {
        init: function() {

            console.log("init !!");
            let second_swipe = this.slides[1];

            //#audio_play_btn
            second_swipe.querySelector();

        }
    }
});
// txt_ul = swiper.slides[1].querySelectorAll('#txt_ul');
// for(let i=1; i<=10; i++){
//     obj = swiper.slides[1].querySelector('#audio_play_btn'+i);
//     obj.onclick = () => {
//         isAll = false;
//         allStop();
//         txt_ul[i-1].focus();
//         swiper.slides[1].querySelector('#audio'+i).play();
//     }
// }
// for(let i=1; i<=10; i++){
//     document.getElementById("audio"+i).onended = () => {
//         if(isAll == true){ //전체재생을 눌렀을 때
//             tmp = swiper.slides[1].querySelector('#audio'+(i+1));
//             if(tmp != null){
//                 txt_ul[i].focus();
//                 tmp.play();
//             }else{
//             }
//         }
//     }
// }
// document.getElementById("allplay").onclick = () => {
//     isAll = true;
//     allStop();
//     txt_ul[0].focus();
//     document.getElementById("audio1").play();
// }
//
// function allStop(){
//     for(let i=1; i<=10; i++){
//         let played_audio = swiper.slides[1].querySelector('#audio'+i);
//         played_audio.pause();
//         played_audio.currentTime = 0;
//     }
// }
// let chinese_button = swiper.slides[1].querySelector(".option_chinese");
// let pinyin_button = swiper.slides[1].querySelector(".option_pinyin");
// let korean_button = swiper.slides[1].querySelector(".option_korean");
// let option_1 = swiper.slides[1].querySelectorAll(".main_title");
// let option_2 = swiper.slides[1].querySelectorAll(".sub_title");
// let option_3 = swiper.slides[1].querySelectorAll(".contents");
// let chinese_button_active_none = chinese_button.className;
// let chinese_button_active = chinese_button.className + " active";
// let pinyin_button_active_none = pinyin_button.className;
// let pinyin_button_active = pinyin_button.className + " active";
// let korean_button_active_none = korean_button.className;
// let korean_button_active = korean_button.className + " active";
// chinese_button.onclick = function (e) {
//     if (chinese_button.className !== chinese_button_active) {
//         chinese_button.className = chinese_button_active;
//         for(let i=0; i<option_1.length; i++){
//             option_1[i].style.display = "none";
//         }
//     }else {
//         chinese_button.className = chinese_button_active_none;
//         for(let i=0; i<option_1.length; i++){
//             option_1[i].style.display = "block";
//         }
//     }
// };
// pinyin_button.onclick = function (e) {
//     if (pinyin_button.className !== pinyin_button_active) {
//         pinyin_button.className = pinyin_button_active;
//         for(let i=0; i<option_2.length; i++){
//             option_2[i].style.display = "none";
//         }
//     } else {
//         pinyin_button.className = pinyin_button_active_none;
//         for(let i=0; i<option_2.length; i++){
//             option_2[i].style.display = "block";
//         }
//     }
// };
// korean_button.onclick = function (e) {
//     if (korean_button.className !== korean_button_active) {
//         korean_button.className = korean_button_active;
//         for(let i=0; i<option_3.length; i++){
//             option_3[i].style.display = "none";
//         }
//     } else {
//         korean_button.className = korean_button_active_none;
//         for(let i=0; i<option_3.length; i++){
//             option_3[i].style.display = "block";
//         }
//     }
// };

