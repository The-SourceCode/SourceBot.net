class InfiniteScroll {
    constructor(elem, amount) {
        this._elem = elem;
        this._amount = parseInt(amount);
        this._showing = 0;
        this._enabled = true;
        this._data = [];
        this._timeout = false;

        $(document).on('scroll', () => {
            if (window.scrollY > 200) $('.go-top').slideDown();
            else $('.go-top').slideUp();
            if (this.enabled) {
                const maxY = document.documentElement.scrollHeight - document.documentElement.clientHeight - 20;
                if (window.scrollY >= maxY) this.display();
            }
        });
    }

    display() {
        if (this._showing >= this._data.length || this._timeout) return;
        const loading = $('.lds-ellipsis');
        loading.show();
        this._elem.append(this._data.slice(this._showing, this._showing + this._amount));
        this._showing = this._showing + this._amount;
        loading.hide();
        this._timeout = false;
    }

    restart() {
        this._showing = 0;
    }

    set data(data) {
        this._data = data;
    }

    set enabled(b) {
        this._enabled = b;
    }

    get enabled() {
        return this._enabled;
    }

    set amount(n) {
        this._amount = parseInt(n);
    }
}