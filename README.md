# thing-it-device-atlas-scientific

[![NPM](https://nodei.co/npm/thing-it-device-atlas-scientific.png)](https://nodei.co/npm/thing-it-device-atlas-scientific/)
[![NPM](https://nodei.co/npm-dl/thing-it-device-atlas-scientific.png)](https://nodei.co/npm/thing-it-device-atlas-scientific/)

[thing-it-node] Device Plugin for [Atlas Scientific](http://atlas-scientific.com/) metering products (e.g. pH meter).

This allows you to 

* monitor pH or flow metering,
* define complex scenes, storyboards and timer controlled execution 

by means of [thing-it-node](https://github.com/marcgille/thing-it-node) and [thing-it.com](http://www.thing-it.com), e.g. to set up
Aquaponics solution.


## Installation

### Hardware Setup

Connect your [Atlas Scientific](http://atlas-scientific.com/) metering product to the GPIOs of your Single-Board Computer
e.g. the pH probe to your Raspberry Pi Zero as follows

<p align="center"><a href="./documentation/images/hardware-setup.jpg"><img src="./documentation/images/hardware-setup.jpg" width="70%" height="70%"></a></p>

or for details like in the wireframe below

<p align="center"><a href="./documentation/images/wireframe.png"><img src="./documentation/images/wireframe.png" width="70%" height="70%"></a></p>

note that the I2C data wires need a 10k pullup resistor.

[Atlas Scientific](http://atlas-scientific.com/) has plenty of documentation for the setup of the different probes.

### Installation of NodeJS and [thing-it-node]

First, install [nodejs](https://nodejs.org/en/download/) on your computer (e.g. your PC or your Raspberry Pi).

Then install **[thing-it-node]** via

```
npm install -g thing-it-node
```
 
### Initialization and Start of [thing-it-node] 

The **[thing-it-device-atlas-scientific]** Plugin is installed with **[thing-it-node]**, hence there is no need to install it separately.

The Plugin supports Autodiscovery for connected I2C devices, hence you only have to create a directory in which you intend to run the configuration, e.g.
 
```
mkdir ~/atlas-scientific-test
cd ~/atlas-scientific-test
```

and invoke

```
tin init
```

and then start **[thing-it-node]** via

```
tin run
```

Note, that at this point Autodiscovery would only discover distinct products such as pHMeter or temperature sensor. It will not be able to distinguish between two
pHMeters.

If you don't want to use Autodiscovery, you may use configurations like the [sample configuration]("./examples.configuration").

## Mobile UI

Install the **thing-it Mobile App** from the Apple Appstore or Google Play and set it up to connect to **[thing-it-node]** 
locally as described [here](https://thing-it.com/thing-it/#/documentationPanel/mobileClient/connectionModes) or just connect your browser under 
[http://localhost:3001](http://localhost:3001) to check how the Mobile UI would look like.

The following screenshot shows the Node Page of the [sample configuration]("./examples.configuration"), which just defines 3 pH Meters:

<p align="center"><a href="./documentation/images/mobile-ui.png"><img src="./documentation/images/mobile-ui.png" width="70%" height="70%"></a></p>

(with the above values for fish ponds, you probably regret not to have defined a **[thing-it-node]** event processor to send alerts, activate the pump 
or the like ...) 

You can also run the calibration sequence from the **thing-it Mobile App**:

<p align="center"><a href="./documentation/images/calibration.png"><img src="./documentation/images/calibration.png" width="70%" height="70%"></a></p>

Open the Device Page, click **Calibrate High**, enter the actual pH value (after waiting a few seconds for the value to stabilize) and then repeat 
the procedure for **Calibrate Middle** and **Calibrate Low**.

## Where to go from here ...

Obviously, you may set up more complex configuration, e.g. an aquaponics solution with

* water temperature sensors,
* water level sensors,
* switches for pumps, feeders, shades and fans, 
* cameras to watch the fish ponds remotely etc.

Or, you want to distribute a set of sensors and correlate their historical data with wheather data and other things on [thing-it.com](https://www.thing-it.com).

You may also be interested in

* Configuring additional [Devices](https://www.thing-it.com/thing-it/#/documentationPanel/mobileClient/deviceConfiguration), 
[Groups](https://www.thing-it.com/thing-it/#/documentationPanel/mobileClient/groupConfiguration), 
[Services](https://www.thing-it.com/thing-it/#/documentationPanel/mobileClient/serviceConfiguration), 
[Event Processing](https://www.thing-it.com/thing-it/#/documentationPanel/mobileClient/eventConfiguration), 
[Storyboards](https://www.thing-it.com/thing-it/#/documentationPanel/mobileClient/storyboardConfiguration) and 
[Jobs](https://www.thing-it.com/thing-it/#/documentationPanel/mobileClient/jobConfiguration) via your **[thing-it] Mobile App**.
* Use [thing-it.com](https://www.thing-it.com) to safely connect your Node Box from everywhere, manage complex configurations, store and analyze historical data 
and offer your configurations to others on the **[thing-it] Mesh Market**.
* Explore other Device Plugins like [Texas Instruments Sensor Tag](https://www.npmjs.com/package/thing-it-device-ti-sensortag), [Plugwise Smart Switches](https://www.npmjs.com/package/thing-it-device-plugwise) and many more. For a full set of 
Device Plugins search for **thing-it-device** on [npm](https://www.npmjs.com/). 
* Or [write your own Plugins](https://github.com/marcgille/thing-it-node/wiki/Plugin-Development-Concepts).
