const $tiles = $("#tiles");
const $search_bar = $("#search-bar");
const $sort = $("#sort-by");
const $show_amount = $("#show_amount");
let searchQuery = "";

const infiniteScroll = new InfiniteScroll($tiles, $show_amount.val() || 20);

users = users
    .sort((a, b) => b.coins - a.coins)
    .map((user, index) => {
        user.rankCoins = index + 1;
        return user;
    });


function searchBar(text = "") {
    searchQuery = text;
    $tiles.empty();
    const userList = users
        .sort((a, b) => {
            switch ($sort.val()) {
                case "coins":
                    return b.coins - a.coins;
                case "lvl":
                default:
                    return b.xp - a.xp;
            }
        })
        .filter(user => user.name.toLowerCase().includes(text.toLowerCase()))
        .map((user) => {
            let place = "";
            let rank = $sort.val() === "coins" ? user.rankCoins : user.rank;

            let name;
            if (text) name = user.name.replace(new RegExp(text , 'ig'), `<mark>${text}</mark>`);
            else name = user.name.replace(/<[^>]*>/, ``);

            switch (rank) {
                case 1:
                    place = "<img class='places' src='https://discordapp.com/assets/11f93b01fd905a56375d325d415ea670.svg' alt='🥇'>";
                    break;
                case 2:
                    place = "<img class='places' src='https://discordapp.com/assets/e002839eeb2e5d558e4600159df6c24b.svg' alt='🥈'>";
                    break;
                case 3:
                    place = "<img class='places' src='https://discordapp.com/assets/ce2c6afb5fcc844e5643ccc843d8da00.svg' alt='🥉'>";
                    break;
                default:
                    place = "";
                    break;
            }

            return $(`<li class="rank-tiles animated fadeIn"><a href="/user/${user.id}">` +
                `<div class='lb-tile tile'>` +
                `<span class="tile-text rank">#${rank}</span>` +
                `<p class="tile-text user">${name}${place}</p>` +
                `<span class="tile-text lvl">${user.level}</span>` +
                `<span class="tile-text exp">${user.xp}</span>` +
                `<span class="tile-text coins">${user.coins}</span>` +
                `</div></a></li>`).html();
        });
    if (userList.length < 1) return $tiles.text("User not found...");

    infiniteScroll.restart();
    infiniteScroll.data = userList;
    infiniteScroll.display();

    if (text) window.history.pushState({}, "", "/leaderboard?search=" + text);
    else window.history.pushState({}, "", "/leaderboard");
}

$search_bar.on('input paste', function () {
    searchBar($(this).val());
});

$show_amount.on('input paste', function () {
    infiniteScroll.amount = $(this).val();
});

$sort.on('change', function () {
    searchBar(searchQuery);
});

$('.go-top').on('click', function () {
    $('html, body').animate({scrollTop: 0});
});

searchBar(search);