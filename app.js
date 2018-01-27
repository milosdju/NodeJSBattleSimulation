var Battle = require('./model/battle'),
    Unit = require('./model/unit'),
    Soldier = require('./model/soldier'),
    Vehicle = require('./model/vehicle'),
    Squad = require('./model/squad'),
    Army = require('./model/army');

/* SQUAD 1 */
s1 = new Soldier(null, 250, 0);
s2 = new Soldier(null, 250, 0);
s3 = new Soldier(null, 250, 0);
s4 = new Soldier(null, 250, 0);
s5 = new Soldier(null, 250, 0);

v1 = new Vehicle(null, 1200);
v1.addOperator(s3);
v1.addOperator(s4);
v1.addOperator(s5);

sq1 = new Squad('random');
sq1.addUnit(s1);
sq1.addUnit(s2);
//sq1.addUnit(v1);


/* SQUAD 2 */
s6 = new Soldier(null, 500, 20);
s7 = new Soldier(null, 500, 20);
s8 = new Soldier(null, 500, 20);
s9 = new Soldier(null, 500, 20);
s10 = new Soldier(null, 600, 50);

sq2 = new Squad('random');
sq2.addUnit(s6);
sq2.addUnit(s7);
sq2.addUnit(s8);
sq2.addUnit(s9);
sq2.addUnit(s10);

/* SQUAD 3 */
s11 = new Soldier(null, 200, 50);
s12 = new Soldier(null, 200, 50);
s13 = new Soldier(null, 200, 50);

v2 = new Vehicle(null, 1000);
v2.addOperator(s11);
v2.addOperator(s12);
v2.addOperator(s13);

sq3 = new Squad('random');
sq3.addUnit(v2);

/* ARMY 1 */
a1 = new Army("A1");
a1.addSquad(sq1);
a1.addSquad(sq2);

/* ARMY 2 */
a2 = new Army("A2");
//a2.addSquad(sq2);
a2.addSquad(sq3);

/* BATTLE */
b1 = new Battle();
b1.addArmy(a1);
b1.addArmy(a2);

b1.start();