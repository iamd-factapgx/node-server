exports.Publication = function () {
    this._id            = null;
    this.title          = null;
    this.abstrct        = null;
    this.year           = null;


    this.valid      = function () {
        return  this._id            != null && this._id % 1             == 0        &&
                this.title          != null && typeof this.title        == 'string' && this.title   !== ''  &&
                this.abstrct        != null && typeof this.abstrct      == 'string' && this.abstrct !== ''  &&
                this.year           != null && this.year % 1            == 0        && this.year > 1900;
    };
};