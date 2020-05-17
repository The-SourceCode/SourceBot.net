class InfiniteScroll {
    /**
     * @param {string} [opt.type]
     * @param {object} [opt.element]
     * @param {number} [opt.limit]
     * @param {number} [opt.amount]
     * @param {function} [opt.format]
     * @param {function} [opt.onFinishAdding]
     */
    constructor(opt) {
        if (!opt.type || typeof opt.type !== 'string') throw "Type must be a String";
        this._type = opt.type;
        if (!opt.element || typeof opt.element !== 'object') throw "Element must be a JQuery Object";
        this._elem = opt.element;
        if (!opt.limit || typeof opt.limit !== 'number') throw "Limit must be a Number";
        this._limit = opt.limit;
        if (opt.format && typeof opt.format !== 'function') throw "Format must be a Function";
        this._format = opt.format || (data => data);
        if (opt.onFinishAdding && typeof opt.onFinishAdding !== 'function') throw "OnFinishAdding must be a Function";
        this._onFinishAdding = opt.onFinishAdding || (() => {
        });
        this._a = false;
        this._b = false;
        this._more = true;
        this._page = 0;
        this._query = 'q=more_data';
        this.items = 0;

        const onScroll = () => {
            if (this._a) return;
            if ($(window).scrollTop() + window.innerHeight >= document.body.scrollHeight - 50) {
                this.display().catch(console.error);
            }
        };

        $(document.body).on('touchmove', onScroll);
        $(window).on('scroll', onScroll);
    }

    async display() {
        this._a = true;

        if (this._b) return Promise.reject({append: false, err: 'Too many requests'});
        if (!this._more) return Promise.reject({append: false, err: 'No more data to send'});
        this._b = true;

        $.post(`/${this._type}?${this._query}`, {limit: this._limit, skip: this._page * this._limit})
            .done(response => {
                if (!Array.isArray(response.data)) {
                    this._elem.append(String(this._format(response.data)));
                    this.items++;
                } else {
                    for (let i = 0; i < response.data.length; i++) {
                        this.items += i;
                        this._elem.append(String(this._format(response.data[i], this.items)));
                    }
                }
                this._more = response.more;
                this._page++;
                this._onFinishAdding(response.data);
                this._b = false;
            })
            .fail(() => this._elem.append("<i class='text-danger'>There was an error while loading this page.</i>"))
            .always(() => {
                this._a = false;
                this._b = false;
            });
    }

    async reset(query) {
        this._a = false;
        this._more = true;
        this._page = 0;
        this._elem.html(null);
        this._query = query || "q=more_data";
        this.display().catch(e => {
            if (e.append) this._elem.append("<i class='text-danger'>There was an error while loading this page.</i>");
            console.error(e)
        })
    }
}