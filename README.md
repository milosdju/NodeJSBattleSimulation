# Project                

## Description
Battle simulation with conflicting Armies. Every Army will be divided in Squads, among which fighting is taking place. 
Every Squad is contained of two types of units:   
1. Soldier    
2. Vehicle    

These units has following characteristics:   
1. Health    
2. Recharge (time)   
3. Experience (Soldier only)   
4. Operators (Vehicle only)    
   
Every squad attack enemy one following next strategies:   
1. random    
2. strongest   
3. weakest   
   
## How to run simulation
Main runner for simulation is root file `main.js`. In order to run simulation enter the command in the console:

``` npm start ```

Battle setup is made in file `config/default.json`. Basic structure how to add armies, squads and military units you can find there. 

>*For more info how to create all units, check **Configuration** section*

**Battle resolution:** Name of army that has won is output in console.   

## Development  

### Project dependencies
#### Non-dev dependencies:
* **config** - loading armies into battle
* **properties-reader** - default-constraint configuration
* **winston** - logging purposes

#### Dev dependencies:
* **babel-cli** - used to run babel compiler
* **babel-preset-es2015** - used to compile code from ES6 syntax
* **rimraf** - used to delete unnecessary files and folders
* **babel-plugin-root-import** - used to avoid `../../../..` while importing "far" modules

### Build & run 
Simulation is basic node.js app, which has `main.js` as starting point. It's written using ES6 syntax, but because there is still no support for ES6 on the Google V8 engine, `Babel` compiler must be used. It will compile all written code in the project and put compiled vanila JavaScript code into `/dist` folder. 

Version of Babel used is configured in `package.json` file as `dev dependency` and  ES version is configured in `.babelrc file`.

Both **build** and **start** commands are covered in `package.json` file, so build and start processes are triggered simply by:
```
npm start
npm build
``` 

> *Note that build process will delete every time /dist folder so there is no need to delete it manually. Also start process will trigger build process so it's enough to run npm start.*

### Configuration
**modules:** config (external), properties-reader (external)

There is two types of simulation configuration in project:
* Setup of **default constraints**
* **Battlefield** setup

#### Battle default constraints
**File:** `/config/battle-config.properties`   
**Description:** Configuration data has no "depth" so it can be stored in key-value (properties) file. 

**Properties** are self-explanatory and all of them can be found in config file.

**Handler:** `battle-config.js`, that must be imported in every module in order to use default constraints. In that configuration module also can be found `BattleConfigProperty` enumeration that can be used for retrieving all configuration properties.

#### Armies configuration
**File:** `/config/default.json`

**Description:** Configuration is used to setup battle with armies, its squads and military units. 

**Data structure** with **mandatory fields**: 
```
{
    armies: [
        {
            name: string*,
            squads: [
                {
                    name: string*,
                    strategy: strongest|weakest|random**,
                    units: [
                        {
                            type: soldier|vehicle
                        }
                    ]
                }
            ]
        }
    ]
}
```
##### Notes:
* Army and Squad names must be UNIQUE   
* Strategy values are defined in *battle-config.properties*

**Non-mandatory** fields related to Units characteristics:
```
{
    ...
    units: [
        type: ...
        quantity: number,
        health: number,
        recharge: number,
        experience: number,
        operators: number
    ]
}
```
##### Notes: 

All of these non-mandatory fields has own default value (*that can also be found in battle-config.properties*) so they don't have to be passed. Following fields will setup:
* quantity - number of 'those-like' Units
* health - unit health (for both types)
* recharge - unit recharge time (for both types)
* experience - unit experience (applies only to `soldier type`)
* operators - number of operators in vehicle (applies only to `vehicle type`)

### Logging
**module:** winston (external)

#### Description
Custom Logger is setup using external module that output logs to the Console. In order to be more user friendly and "battle oriented", **logging levels** are also customized (*ordered from the most severed*):
* won - <span style="color:green">green</span>
* destroyed - <span style="color:red">red</span>
* damaged - <span style="color:yellow">yellow</span>
* info - <span style="color:grey">grey</span>
* debug - <span style="color:grey">grey</span>

Lowest logger level is setup in `/logger/logger.js` file.

