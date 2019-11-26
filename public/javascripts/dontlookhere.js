let running = false;
let clicks = 0;
let runTimes = 0;
let timeout;

const $menu_image = $(".menu-img");
const $menu_title = $(".menu-title");
const $body = $("body");

const colors = ["red", "purple", "yellow", "green"];
const animations = ["flash", "pulse", "swing", "jello"];

$menu_image.on('click', function () {
    if (running) return;
    if (timeout) clearTimeout(timeout);
    if (runTimes >= 5) {
        $menu_image.attr("src", "/images/sourcebot/sad_faded.png?v1");
        $body.removeClass("purple").addClass("red");
        animateCSS(".menu-img", ["shake", "infinite"]);
        $(".menu-button").each(function () {
            animateCSS(
                $(this).removeClass("bounceInUp"),
                [animations[Math.round(Math.random() * (animations.length - 1))], "infinite"]
            )
        });
        setInterval(() => {
            $menu_title.text(randWord($menu_title.text()));
            $(".menu-button").each(function () {
                $(this).text(randWord($(this).text()));
            });
            $(".copyright").text(randWord($(".copyright").text()));
            $body.removeClass(colors.join(" ")).addClass(colors[Math.round(Math.random() * (colors.length - 1))])
        }, 150);
        running = true;
        return;
    }
    if (clicks > 2) {
        $menu_image.attr("src", "/images/sourcebot/sad_faded.png?v1");
        $body.removeClass("purple").addClass("red");
        $menu_title.text("THAT HURTS" + "!".repeat(runTimes));

        animateCSS(".menu-img", ["shake"], function () {
            $body.removeClass("red").addClass("purple");
            $menu_image.attr("src", "/images/sourcebot/purple_faded.png?v1");
            $menu_title.text("Sourcebot");
            runTimes++;
            running = false;
        });
        running = true;
        clicks = 0;
    } else {
        clicks++;
        timeout = setTimeout(() => {
            clicks = 0;
            timeout = null;
        }, 1500);
    }
});

function randWord(word) {
    let randW = "";
    let words = word.split("");
    for (let i = 0; i < word.length; i++) {
        const randNum = Math.round(Math.random() * (words.length - 1));
        randW += words[randNum];
        words.splice(randNum, 1);
    }
    return randW;
}