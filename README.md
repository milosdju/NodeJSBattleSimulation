## Project
### Description
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

### How to run simulation
In root file, `app.js`, you can find example how to: 
1. create Units (Soldiers and Vehicles), 
2. put them in Squad, 
3. put Squads in Army and 
4. start the battle.

For creating all units, check Units constructors down bellow in **Development** section.

**Battle resolution:** Name of army that has won is output in console.

### Development
Simulation is basic node.js app, which has `app.js` as starting point. 

API's, for units are following: (if you want default value for some constructor argument, just pass `null`):
* Soldier:
..* constructor: Soldier(health = 100, recharge = 100, experience = 0)
* Vehicle:
..* constructor: Vehicle(health = 100, recharge = 1000)
* Squad:
..* constructor: Squad(strategy)
..* adding Unit to Squad: addUnit(unit)
* Army:
..* constructor: Army(name)
..* adding Squad to Army: addSquad(squad)
... Every army need to have name in order to be marked in battle
* Battle:
..* constructor: Battle()
..* adding Army to Battle: addArmy(army)
..* starting Battle: start()

### Configuration of simulation
Simulation can be configured on many parameters, all are listed in `battle-config.properties`.
In order to handle those configurations in code, `BattleConfig` class, i.e. prototype is used.


