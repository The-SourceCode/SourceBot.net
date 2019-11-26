let dark_theme = getCookie('theme') === 'dark';
let infiniteScroll;

// Credits: https://stackoverflow.com/a/2686098
function abbrNum(number, decPlaces) {
    decPlaces = Math.pow(10, decPlaces);

    let abbrev = ["k", "m", "b", "t"];

    for (let i = abbrev.length - 1; i >= 0; i--) {
        let size = Math.pow(10, (i + 1) * 3);

        if (size <= number) {
            number = Math.round(number * decPlaces / size) / decPlaces;

            if ((number === 1000) && (i < abbrev.length - 1)) {
                number = 1;
                i++;
            }

            number += abbrev[i];
            break;
        }
    }

    return number;
}

function currentPage(page) {
    $(".nav-item").removeClass('active');
    $(`[data-page='${page}']`).addClass('active');
}

function escape(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function placement(num) {
    if (!num) return "";
    switch (parseInt(num)) {
        case 1:
            return ' <i class="fas fa-trophy" style="color: #ffac33"></i>';
        case 2:
            return ' <i class="fas fa-trophy" style="color: #ccd6dd"></i>';
        case 3:
            return ' <i class="fas fa-trophy" style="color: #ff8a3b"></i>';
        default:
            return "";
    }
}

function theme(targetColor) {
    if (!targetColor) return;

    dark_theme = targetColor === 'dark';
    $('#toggle-theme').bootstrapToggle(dark_theme ? "on" : "off");
    $('#theme').attr('href', `/stylesheets/themes/${targetColor}.css?v1`);
    $(`.navbar-${!dark_theme ? 'dark' : 'light'}`)
        .removeClass(`navbar-${!dark_theme ? 'dark' : 'light'}`)
        .addClass(`navbar-${targetColor}`);
    document.cookie = `theme=${targetColor}; path=/;`;
}

function loadData(page, onFinish) {
    switch (page) {
        case "incidents":
            infiniteScroll = new InfiniteScroll({
                type: 'incidents',
                element: $('.data-container'),
                limit: 21,
                format: data => '<div class="col-md-6 mt-3 mb-3"><div class="shadow card text-theme-text-1 bg-theme-color-1 animated fadeInUp  h-100"><div class="card-body">' +
                    `<h5 class="card-title">${data.TYPE}</h5>` +
                    '<p class="card-text">' +
                    `<strong>User ID:</strong> ${data.TARGET_ID}<br>` +
                    `<strong>Staff ID:</strong> ${data.STAFF_ID}<br>` +
                    `<strong>Reason:</strong> ${data.REASON}` +
                    '</p></div><div class="card-footer">' +
                    `<small class="text-muted float-left">${data.DATE_TIME}</small>` +
                    `<small class="text-muted float-right">Case #${data.CASE_ID}</small>` +
                    '</div></div></div>',
                onFinishAdding: onFinish
            });
            infiniteScroll.display().catch(console.error);
            break;
        case "leaderboard":
            infiniteScroll = new InfiniteScroll({
                type: 'leaderboard',
                element: $('.data-container'),
                limit: 15,
                format: data => {
                    data.script = data.bio ? data.bio.includes("<script>") : false;

                    const content = getBadge(data.badges) + (data.bio || "<i>No bio...</i>");
                    return `<a href="/user/${data.id}" class="shadow card text-theme-text-1 bg-theme-color-1 animated fadeInUp mt-1 mb-1" ` +
                        `data-html="${!data.script}" title="${data.name}" data-content='${content}' data-toggle="popover">` +
                        `<div class="card-body row text-justify">` +
                        `<div class="col-2 d-inline-block text-truncate">#${data.rank}</div>` +
                        `<div class="col-5 d-inline-block text-truncate">${data.name + placement(data.rank)}</div>` +
                        `<div class="col-2 d-inline-block text-truncate">${data.level}</div>` +
                        `<div class="col-3 d-inline-block text-truncate">${abbrNum(data.coins, 2)}</div>` +
                        '</div></a>';
                },
                onFinishAdding: function () {
                    let timeout;
                    $('[data-toggle="popover"]').popover({trigger: "manual", html: true, placement: 'auto'})
                        .on("mouseenter", function () {
                            if (timeout) {
                                $('[data-toggle="popover"]').popover("hide");
                                clearTimeout(timeout);
                            }
                            const curr = $(this);
                            timeout = setTimeout(() => {
                                curr.popover("show");
                                $(".popover").on("mouseleave", function () {
                                    curr.popover('hide');
                                });
                            }, 1000);
                        })
                        .on("mouseleave", function () {
                            if (!$(".popover:hover").length) {
                                setTimeout(() => {
                                    $(this).popover("hide");
                                }, 1000);
                            }
                        });

                    onFinish();
                }
            });
            infiniteScroll.display().catch(console.error);
            break;
    }
}

$(document).ready(function () {
    $('[data-toggle="dropdown-toggle"]').on('click', function (e) {
        $(this).next().toggle();
    });

    $('.dropdown-menu.keep-open').on('click', function (e) {
        e.stopPropagation();
    });

    settings();
    enableTabs(1);
    $('[title]').tooltip({
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
    });
    $('#toggle-theme').bootstrapToggle(dark_theme ? "on" : "off");
    dynamicColor();

});

function dynamicColor() {
    $('.dynamic-color').each(function () {
        const $current = $(this);
        const parts = $current.css("background-color").match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!parts) return;
        const o = Math.round(((parseInt(parts[1]) * 299) +
            (parseInt(parts[2]) * 587) +
            (parseInt(parts[3]) * 114)) / 1000);
        $current.css('color', (o > 125) ? 'black' : 'white');
    });
}

function settings() {
    const $theme = $('[data-setting="theme"]');

    $('#toggle-theme').bootstrapToggle({
        on: '<i class="fas fa-moon"></i>',
        off: '<i class="fas fa-sun"></i>',
        onstyle: "dark",
        offstyle: "light",
        size: "xs"
    });

    $theme.click(function () {
        theme(dark_theme ? "light" : 'dark');
    })
}

function search() {
    const $search_form = $('#search_form');
    $search_form.submit(function (e) {
        e.preventDefault();
        if (infiniteScroll) {
            infiniteScroll.reset(`q=search&search=${$(this).find('input').val()}`).catch(console.error)
        }
    })
}

function getBadge(badges) {
    function badgeColor(name) {
        if (name.startsWith('December')) {
            return "blue";
        } else if (name.startsWith('October')) {
            return "orange"
        } else if (name.startsWith('Admin')) {
            return "role_admin"
        } else if (name.startsWith('Mod')) {
            return "role_mod"
        } else if (name.startsWith('Developer')) {
            return "role_developer"
        } else return "outline-theme-text-1";
    }

    let html = "";
    if (badges && badges.length > 0) {
        for (let i = 0; i < badges.length; i++) {
            html += `<span class="badge p-1 badge-${badgeColor(badges[i])}" style="font-size: 14px;">${badges[i]}</span> `;
        }
        html += "<br>";
    }
    return html;
}

function getCookie(name) {
    name += "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function enableTabs(currentTab) {
    let current_tab = 1;
    let locked = false;

    $('.tab-btn').removeClass('btn-theme-color-main').addClass('btn-theme-color-secondary');
    $(`[data-toggle-tab="${currentTab}"]`).removeClass('btn-theme-color-secondary').addClass('btn-theme-color-main');
    $(`.tab`).hide();
    $(`[data-tab="${currentTab}"]`).show();

    $('.tab-btn').click(function (e) {
        e.preventDefault();
        if (locked) return;
        const $tab_btn = $(this);
        const tab_page = parseInt($tab_btn.data('toggle-tab'));

        if (tab_page === current_tab) return;

        $('.tab-btn').removeClass('btn-theme-color-main').addClass('btn-theme-color-secondary');
        $tab_btn.removeClass('btn-theme-color-secondary').addClass('btn-theme-color-main');

        const $current_tab = $(`[data-tab="${current_tab}"]`);

        animateCSS(
            `[data-tab="${current_tab}"]`,
            [current_tab < tab_page ? 'fadeOutLeft' : 'fadeOutRightBig', 'faster'],
            function () {
                $current_tab.hide();
                locked = false;
            }
        );
        animateCSS(
            `[data-tab="${tab_page}"]`,
            [current_tab < tab_page ? 'fadeInRight' : 'fadeInLeftBig', 'faster'],
            function () {
                current_tab = tab_page;
            }
        );

        $(`[data-tab="${tab_page}"]`).show();
        locked = true;
    });

}

function animateCSS(element, animations, callback) {
    let node;
    if (typeof element !== "string") node = element[0];
    else node = document.querySelector(element);
    node.classList.add('animated');
    animations.forEach(animationName => node.classList.add(animationName));

    function handleAnimationEnd() {
        node.classList.remove('animated');
        animations.forEach(animationName => node.classList.remove(animationName));
        node.removeEventListener('animationend', handleAnimationEnd);

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}