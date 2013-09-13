(function () {
    var DEFAULT_REGISTER = '0';

    Vimulator.Registers = function () {
        this.clear();
    };

    Vimulator.Registers.prototype.clear = function () {
        this.values = {};
    };

    Vimulator.Registers.prototype.set = function (value, register) {
        this.values[this._register(register)] = value;
    };

    Vimulator.Registers.prototype.append = function (value, register) {
        var key = this._register(register);
        this.values[key] = this.values[key] || '';
        this.values[key] += value;
    };

    Vimulator.Registers.prototype.get = function (register) {
        return this.values[this._register(register)];
    };

    Vimulator.Registers.prototype.use = function (register, callback) {
        this.defaultRegister = register;
        callback();
        delete this.defaultRegister;
    };

    Vimulator.Registers.prototype._register = function (register) {
        return register || this.defaultRegister || DEFAULT_REGISTER;
    };
}());
