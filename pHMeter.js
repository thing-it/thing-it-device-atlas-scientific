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
        }, {
            id: "calibrationHigh",
            label: "Calibration High",
            type: {
                id: "decimal"
            }
        }, {
            id: "calibrationMiddle",
            label: "Calibration Middle",
            type: {
                id: "decimal"
            }
        }, {
            id: "calibrationLow",
            label: "Calibration Low",
            type: {
                id: "decimal"
            }
        }],
        services: [{
            id: "calibrateHigh", label: "Calibrate High", parameters: [{
                id: "value", label: "Value", type: {id: "decimal"}
            }]
        },
            {
                id: "calibrateMiddle", label: "Calibrate Middle", parameters: [{
                id: "value", label: "Value", type: {id: "decimal"}
            }]
            },
            {
                id: "calibrateLow", label: "Calibrate Low", parameters: [{
                id: "value", label: "Value", type: {id: "decimal"}
            }]
            }, {
                id: "setI2CAddress", label: "Set I2C Address", parameters: [{
                    id: "address", label: "Address", type: {id: "string"}
                }]
            }, {
                id: "calibrateClear", label: "Calibrate Clear"
            }],

        configuration: [{
            id: "i2CAddress", label: "I2C Address", type: {id: "string"}
        }]
    },
    create: function () {
        return new pHMeter();
    },
    discovery: function () {
        return new pHMeterDiscovery();
    }
};

var q = require('q');
var _ = require('lodash');

function pHMeterDiscovery() {
    pHMeterDiscovery.prototype.start = function () {

        if (!this.node.isSimulated()) {
            // TODO For now, need to be able to switch for Discovery or inherit from Device
            this.logLevel = "debug";
            this.discoveryInterval = setInterval(this.scanForProbe.bind(this), 30000);
        } else {
            if (!this.i2c) {
                this.i2c = require('i2c-bus');
            }

            var i2c1 = this.i2c.openSync(1);

            //this.interval = setInterval(function () {// must have?

            for (var ATLAS_DEVICE_ADDR = 0x01; i <= 0x7F; i++) {
                console.log("ATLAS_DEVICE_ADDR: " + ATLAS_DEVICE_ADDR);
                i2c1.sendByteSync(ATLAS_DEVICE_ADDR_ADDR, 0x49); //SEND ATLAS INFO REQUEST

                setTimeout(function () {
                    var PH_OUTPUT_INFO = new Buffer(9);
                    i2c1.i2cReadSync(ATLAS_DEVICE_ADDR, 9, PH_OUTPUT_INFO);

                    //var tmp = PH_OUTPUT_INFO.toString("ascii").indexOf("PH");

                    if (PH_OUTPUT_INFO.toString("ascii").indexOf("PH") > -1) {
                        console.log("PH Sensor found at: " + ATLAS_DEVICE_ADDR);
                        //TODO Something like "publishStateChange() or push to actors list..

                    } else {
                        console.log("Nothing found at:  " + ATLAS_DEVICE_ADDR);
                    }

                    //this.state.pHValue = PH_OUTPUT_INFO.toString("ascii");
                    this.publishStateChange();
                }.bind(this), 300); //300ms delay

            }

            //}.bind(this), 20000);
            deferred.resolve();
        }


    };

    pHMeterDiscovery.prototype.stop = function () {
        if (discoveryInterval !== undefined && discoveryInterval) {
            clearInterval(discoveryInterval);
        }
    };

    pHMeterDiscovery.prototype.scanForProbe = function () {
    };
}

/**
 *
 * @constructor
 */
function pHMeter() {
    var PH_STD_ADDR = 0x63, //TODO Implement Dynamic ADDR
//        READ_DELAY = 1000,
        READ_LENGTH = 32,
        PH_CMD_READ = 0x52;
//        PH_QUERY_CALIBRATION = new Buffer('cal,');


    pHMeter.prototype.start = function () {
        var deferred = q.defer();

        this.state = {pHValue: 6.0, calibrationHigh: 7.0, calibrationMiddle: 6.0, calibrationLow: 5.0};

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

            // Read PH Value
            this.interval = setInterval(function () {
                i2c1.sendByteSync(PH_STD_ADDR, PH_CMD_READ);

                setTimeout(function () {
                    var PH_OUTPUT = new Buffer(READ_LENGTH);
                    i2c1.i2cReadSync(PH_STD_ADDR, READ_LENGTH, PH_OUTPUT);

                    this.state.pHValue = PH_OUTPUT.toString("ascii");
                    this.publishStateChange();

                    this.logDebug('Atlas-scientific-PhMeter READ Value: ' + this.state.pHValue);

                }.bind(this), 1000);
            }.bind(this), 20000);

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

    /**
     *
     */
    pHMeter.prototype.calibrateHigh = function (parameters) {
        if (this.isSimulated()) {
            this.state.calibrationHigh = parameters.value;
        } else {
            var PH_CALIBRATION_SEND = new Buffer('CAL,HIGH,' + parameters);
            i2c1.i2cWriteSync(PH_STD_ADDR, 14, PH_CALIBRATION_SEND);
            setTimeout(function () {
                var PH_OUTPUT = new Buffer(1);
                i2c1.i2cReadSync(PH_STD_ADDR, 1, PH_OUTPUT);
                if (PH_OUTPUT[0] == 1) {
                    this.logDebug('Atlas-scientific-PhMeter HIGH calibration SUCCESSFUL with Value: ' + parameters);

                } else {
                    this.logDebug('Atlas-scientific-PhMeter HIGH calibration FAILED with Value: ' + parameters);

                }

            }.bind(this), 1600);

        }
    };


    /**
     *
     */
    pHMeter.prototype.calibrateMiddle = function (parameters) {
        if (this.isSimulated()) {
            this.state.calibrationMiddle = parameters.value;
        } else {
            var PH_CALIBRATION_SEND = new Buffer('CAL,MID,' + parameters);
            i2c1.i2cWriteSync(PH_STD_ADDR, 12, PH_CALIBRATION_SEND);
            setTimeout(function () {
                var PH_OUTPUT = new Buffer(1);
                i2c1.i2cReadSync(PH_STD_ADDR, 1, PH_OUTPUT);
                if (PH_OUTPUT[0] == 1) {
                    this.logDebug('Atlas-scientific-PhMeter MID calibration SUCCESSFUL with Value: ' + parameters);

                } else {
                    this.logDebug('Atlas-scientific-PhMeter MID calibration FAILED with Value: ' + parameters);

                }

            }.bind(this), 1600);
        }
    };


    /**
     *
     */
    pHMeter.prototype.calibrateLow = function (parameters) {
        if (this.isSimulated()) {
            this.state.calibrationLow = parameters.value;
        } else {
            var PH_CALIBRATION_SEND = new Buffer('CAL,LOW,' + parameters);
            i2c1.i2cWriteSync(PH_STD_ADDR, 12, PH_CALIBRATION_SEND);
            setTimeout(function () {
                var PH_OUTPUT = new Buffer(1);
                i2c1.i2cReadSync(PH_STD_ADDR, 1, PH_OUTPUT);
                if (PH_OUTPUT[0] == 1) {
                    this.logDebug('Atlas-scientific-PhMeter LOW calibration SUCCESSFUL with Value: ' + parameters);

                } else {
                    this.logDebug('Atlas-scientific-PhMeter LOW calibration FAILED with Value: ' + parameters);

                }

            }.bind(this), 1600);
        }
    };


    /**
     *
     */
    pHMeter.prototype.calibrateClear = function () {
        if (this.isSimulated()) {
        } else {
            var PH_CALIBRATION_SEND = new Buffer('CAL,CLEAR');
            i2c1.i2cWriteSync(PH_STD_ADDR, 9, PH_CALIBRATION_SEND);
            setTimeout(function () {
                var PH_OUTPUT = new Buffer(1);
                i2c1.i2cReadSync(PH_STD_ADDR, 1, PH_OUTPUT);
                if (PH_OUTPUT[0] == 1) {
                    this.logDebug('Atlas-scientific-PhMeter CLEAR calibration SUCCESSFUL');

                } else {
                    this.logDebug('Atlas-scientific-PhMeter CLEAR calibration FAILED');

                }

            }.bind(this), 1600);
        }
    };

    /**
     *
     */
    pHMeter.prototype.setI2CAddress = function (parameters) {
        if (this.isSimulated()) {
        } else {
            // TODO
        }
    };
}

