$(document).ready(function () {
    var $sectionTop = 0;
    var headerHeight;
    var windowHeight = 0

    //배너 섹션 처리

    var bannerTop, bannerBoxHeight;  //휠을 동작시킬 요소의 전체 높이
    var $vertical = 0;//한번 휠을 할때마다 움직일 값
    var bannerPosition = 0;
    var $lastHeight; //휠을 동작시킬 요소의 마지막 위치를 착아서 휠을 다시 스크롤로 변경
    var timeOut, $bannerContainer, windowHeight, wheelStart;
    // /////////////// 초기값 설정 /////////////////
    function init() {
        windowHeight = $(window).height();
        headerHeight = $("header").height();
        console.log("window창의 높이 : " + windowHeight)
        console.log("header 높이 : " + headerHeight)

        $("section").css({
            height: windowHeight - (headerHeight)
        })

        //banner 초기화 마직막 위치를 찾기위한....
        bannerTop = $("#banner-detail").offset().top;
        console.log("배너의 탑의 위치: " + bannerTop);
        $bannerContainer = $(".banner-detail-container").height();
        bannerBoxHeight = $(".box-wrap").height();
        $vertical = 150; //휠을 사용해서 요소가 움직일 값 판단해서 값 적용\
        $lastHeight = bannerBoxHeight - $bannerContainer;
        //실제 내용의 전체 높이-내용을 감싸는 요소의 높이를 뺌

        console.log("bannerBox : " + bannerBoxHeight)
        console.log("$vertical : " + $vertical)
        console.log("마지막 위치 : " + $lastHeight)
        console.log("banner-detail-container : " + $(".banner-detail-container").height())

    }
    init();
    // ////////////// 네비 버튼 //////////////////
    var $navBool = true;
    $(".navBt").click(function () {
        if ($navBool) {
            $(this).addClass("bt-background")
            $(".nav-list").addClass("nav-position")
            $navBool = false;
        } else {
            $(".nav-list").removeClass("nav-position")
            $(this).removeClass("bt-background")
            $navBool = true;
        }
    })

    // ///////////////해시 네비게이션 //////////////
    var $position = 0;
    $(".nav-list a").each(function (index) {
        $(this).click(function () {
            console.log("$(this.hash).prev().height() : " + $(this.hash).prev().height())
            if ($position <= index) {

                console.log("다음요소, 현재요소")
                $hash = $(this.hash).offset().top;

            } else {
                console.log("이전요소")
                if (index <= 0) {
                    $hash = 0
                } else {
                    var count = $position - index
                    $hash = $(this.hash).offset().top - ($(this.hash).prev().height() * count) - headerHeight
                }
            }
            $("html,body").stop().animate({
                scrollTop: $hash
            }, 1000)
            $position = index
            $active($position)
            $navBool = true;
        })
    });

    function $active(activePosition) {
        $(".nav-list a").removeClass("clickActive")
        $(".nav-list a").eq(activePosition).addClass("clickActive")
        $(".nav-list").removeClass("nav-position")
    }


    $(window).resize(function () {
        init();
    })

    var $aniIndex = 0;
    function $animation() {
        $(".section").eq($aniIndex - 1).find(".about-container").removeClass("aboutActive")
        $(".section").eq($aniIndex).find(".about-container").addClass("aboutActive")

        $(".section").eq($aniIndex - 1).find(".headlast").removeClass("aboutActive")
        $(".section").eq($aniIndex).find(".headlast").addClass("aboutActive")

        $(".section").eq($aniIndex - 1).find(".web-box").removeClass("webActive")
        $(".section").eq($aniIndex + 1).find(".web-box").removeClass("webActive")
        $(".section").eq($aniIndex).find(".web-box").addClass("webActive")

        // $(".section").eq($aniIndex-1).find("b-d-box").removeClass("boxActive")
        // $(".section").eq($aniIndex).find("b-d-box").addClass("boxActive")
        $(".section").eq($aniIndex - 1).find(".banner-detail-container").removeClass("bannerActive")
        $(".section").eq($aniIndex + 1).find(".banner-detail-container").removeClass("bannerActive")
        $(".section").eq($aniIndex).find(".banner-detail-container").addClass("bannerActive")

        $(".section").eq($aniIndex - 1).find(".icon-circle").removeClass("circleActive")
        $(".section").eq($aniIndex + 1).find(".icon-circle").removeClass("circleActive")
        $(".section").eq($aniIndex).find(".icon-circle").addClass("circleActive")
        // if($aniIndex+1==5){
        //     $(".circle").circleProgress({
        //         animation:false
        //     })
        // }
    }
    $animation();


    $sectionTop = 0;
    $(".section").each(function (index) {
        // console.log("섹션의 수 : "+index)
        $(window).scroll(function () {
            var $scrollTop = $(window).scrollTop()
            $sectionTop = $(".section").eq(index).offset().top;
            // console.log("스크롤 탑 : " + $scrollTop);
            // console.log("섹션의 위치 : " + $sectionTop);
            if ($scrollTop + $(window).height() / 3 >= $sectionTop) {
                $aniIndex = index;
                $animation();
                $position = index;
                $active($position);
                $circle();

            } else {
                $aniIndex = index - 1;
            }

        })
    })

    function boxWheel() {
        $(".box-wrap").on("DDMMouseScroll mousewheel", function (e) {
            console.log("box-wrap에서 휠동작")
            clearTimeout(timeOut);
            timeOut = setTimeout(function () {
                if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
                    console.log("올림")
                    if (bannerPosition > 0) {
                        bannerPosition = bannerPosition - $vertical
                    } else {
                        $(".box-wrap").off()
                        //on 을 끄겠단 뜻
                        wheelStart = bannerPosition;
                    }

                } else {
                    console.log("내림")
                    if (bannerPosition < $lastHeight) {
                        bannerPosition = bannerPosition + $vertical;
                    } else {
                        $(".box-wrap").off()
                        //on 을 끄겠단 뜻 더 자연습럽게 작동하기위함
                        //마지막 위치보다 bannerPosition값이 크면 중지
                        wheelStart = bannerPosition;
                    }
                }
                $(".box-wrap").stop().animate({
                    top: -bannerPosition //-150씩 움직이게 하기
                }, 1000)
                //150만큼 움직이겠다는 뜻 부드럽게 움직이려면 밑의 숫자 800정도로 조정
                //.box-wrap의 포지션이 absolute인것 생각하기
            }, 100)
            return false;
            //return false을 쓰는 이유 확인하기
        })


    }
    boxWheel();


    $(window).scroll(function () {
        if (wheelStart <= 0 || wheelStart >= $lastHeight) {
            //boxWheel()함수 호출
            boxWheel();
        }
    })


    function $circle() {
        $('.photoshop.circle').circleProgress({
            value: 0.35,
            fill: { gradient: ['#ff1e41', '#ff5f43'] }
        }).on('circle-animation-progress', function (event, progress) {

            $(this).find('strong').html(Math.round(35 * progress) + '<i>%↓가격인하</i>');
        });
        $('.ill.circle').circleProgress({
            value: 0.55,
            fill: { gradient: ['#cccc00', '#ff6600'] }
        }).on('circle-animation-progress', function (event, progress) {
            $(this).find('strong').html(Math.round(55 * progress) + '<i>%↓가격인하</i>');
        });
        $('.figma.circle').circleProgress({
            value: 0.25,
        }).on('circle-animation-progress', function (event, progress) {
            $(this).find('strong').html(Math.round(25 * progress) + '<i>%↓가격인하</i>');
        });
        $('.html.circle').circleProgress({
            value: 0.4,
            fill: { gradient: ['violet', '#4ac5f8'] }
        }).on('circle-animation-progress', function (event, progress) {
            $(this).find('strong').html(Math.round(40 * progress) + '<i>%↓가격인하</i>');
        });
        $('.css.circle').circleProgress({
            value: 45,
            fill: { gradient: ['#ff1e41', '#ff5f43'] }
        }).on('circle-animation-progress', function (event, progress) {
            $(this).find('strong').html(Math.round(45 * progress) + '<i>%↓가격인하</i>');
        });
        $('.java.circle').circleProgress({
            value: 0.4,
            fill: { gradient: ['violet', '#4ac5f8'] }
        }).on('circle-animation-progress', function (event, progress) {
            $(this).find('strong').html(Math.round(40 * progress) + '<i>%↓가격인하</i>');
        });
    }
    $circle();

    $(".notice button").click(function () {
        $(".d-headlast").show();
    })
    $(".close").click(function () {
        $(".d-headlast").hide();
    })

})






