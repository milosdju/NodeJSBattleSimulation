import Battle from './simulation/battle';
import Unit from './entity/units/unit';
import Soldier from './entity/units/soldier';
import Vehicle from './entity/units/vehicle';
import Squad from './entity/squad/squad';
import Army from './entity/army/army';
import AttackStrategy from './entity/squad/attack-strategy';

/* BATTLE */
var b = new Battle();
b.loadArmiesFromConfig();

b.start();