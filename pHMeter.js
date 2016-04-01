module.exports = {
    metadata: {
        family: 'pHMeter',
        plugin: 'pHMeter',
        label: 'Atlas Scientific pH Meter',
        manufacturer: 'Atlas Scientific',
        discoverable: false,
        tangible: true,
        additionalSoftware: [],
        actorTypes: [],
        sensorTypes: [],
        state: [{
            id: "pHValue",
            label: "pH Value",
            type: {
                id: "decimal"
            }
        }],
        services: [],
        configuration: []
    },
    create: function () {
        return new pHMeter();
    },
    discovery: function () {
        return null;
    }
};

var q = require('q');
var _ = require('lodash');

/**
 *
 * @constructor
 */
function pHMeter() {
    /**
     *
     */

    var PH_ADDR = 0x63,
        PH_CMD_INFO = 0x49,
        READ_DELAY = 1000,
        READ_LENGTH = 32,
        PH_CMD_READ = 0x52;


    pHMeter.prototype.start = function () {
        var deferred = q.defer();

        this.state = {pHValue: 6.0};

        if (this.isSimulated()) {
            this.interval = setInterval(function () {
                this.state.pHValue = 5 + 0.1 * new Date().getTime() % 2;

                this.publishStateChange();
            }.bind(this), 20000);

            deferred.resolve();
        } else {
            if (!this.i2c) {
                this.i2c = require('i2c-bus');
            }

            var i2c1 = this.i2c.openSync(1);

            console.log(this.state.pHValue);

            var PH_OUTPUT = new Buffer(READ_LENGTH);

            i2c1.sendByteSync(PH_ADDR, PH_CMD_READ);

            setTimeout(function () {
                i2c1.i2cReadSync(PH_ADDR, READ_LENGTH, PH_OUTPUT);
                
                this.state.pHValue = String.fromCharCode.apply(String, PH_OUTPUT);

                this.publishStateChange();
                
                console.log(this.state.pHValue);
            }.bind(this), READ_DELAY);


            deferred.resolve();
        }

        return deferred.promise;
    };

    /**
     *
     */
    pHMeter.prototype.stop = function () {
        var deferred = q.defer();

        if (this.isSimulated()) {
            if (this.interval) {
                clearInterval(this.interval);
            }
        } else {
            /**
             **
             */
        }

        deferred.resolve();

        return deferred.promise;
    };

    /**
     *
     */
    pHMeter.prototype.getState = function () {
        return this.state;
    };

    /**
     *
     */
    pHMeter.prototype.setState = function () {
    };
}

