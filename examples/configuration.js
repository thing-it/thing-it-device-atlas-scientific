module.exports = {
    label: "Pond",
    id: "pond",
    autoDiscoveryDeviceTypes: [],
    devices: [{
        label: "pH Meter Tilapia I",
        id: "pHMeter1",
        plugin: "atlas-scientific/pHMeter",
        configuration: {},
        logLevel: "debug",
        actors: [],
        sensors: []
    }, {
        label: "pH Meter Tilapia II",
        id: "pHMeter2",
        plugin: "atlas-scientific/pHMeter",
        configuration: {},
        logLevel: "debug",
        actors: [],
        sensors: []
    }, {
        label: "pH Meter Koi I",
        id: "pHMeter3",
        plugin: "atlas-scientific/pHMeter",
        configuration: {},
        logLevel: "debug",
        actors: [],
        sensors: []
    }],
    groups: [],
    services: [],
    eventProcessors: [],
    data: []
};
