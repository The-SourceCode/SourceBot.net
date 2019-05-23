window.onscroll = stick;

const tile = document.getElementById("top-tile");
const sticky = tile.offsetTop;

function stick() {
    if (window.pageYOffset >= sticky) tile.classList.add("sticky");
    else tile.classList.remove("sticky");
}
