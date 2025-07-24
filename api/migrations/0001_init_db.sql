-- Migration number: 0001 	 2025-07-24T14:30:38.465Z

DROP TABLE IF EXISTS TeamMatchEntry;
DROP TABLE IF EXISTS HumanPlayerEntry;

CREATE TABLE IF NOT EXISTS TeamMatchEntry(
  eventKey text NOT NULL,
  matchLevel text CHECK(matchLevel IN ('None', 'Practice', 'Qualification', 'Playoff')) NOT NULL,
  matchNumber integer NOT NULL,
  teamNumber integer NOT NULL,
  alliance text CHECK(alliance IN ('Red', 'Blue')) NOT NULL,
  robotNumber integer CHECK(robotNumber IN (1, 2, 3)) NOT NULL,
  deviceTeamNumber integer NOT NULL,
  deviceId text NOT NULL,
  scoutTeamNumber integer NOT NULL,
  scoutName text NOT NULL,
  flag text NOT NULL,

  tbaAutoLine boolean,
  tbaEndgamePark boolean,
  tbaEndgameShallow boolean,
  tbaEndgameDeep boolean,

  noShow boolean NOT NULL,
  startingLocationA boolean,
  startingLocationB boolean,
  startingLocationC boolean,
  died boolean,
  playedDefense boolean,
  goodAtCoralL1 boolean,
  goodAtCoralL2 boolean,
  goodAtCoralL3 boolean,
  goodAtCoralL4 boolean,
  goodAtAlgaeNet boolean,
  goodAtAlgaeProcessor boolean,
  goodAtClimb boolean,
  goodAtDefense boolean,
  goodAtWorkingWithAlliance boolean,
  goodAtDriving boolean,
  goodAtAuto boolean,
  removedAlgaeFromReef boolean,
  comments text,

  autoCrossedRSL boolean,
  autoCoralABL1 integer,
  autoCoralAL2 boolean, autoCoralAL3 boolean, autoCoralAL4 boolean,
  autoCoralBL2 boolean, autoCoralBL3 boolean, autoCoralBL4 boolean,
  autoCoralCDL1 integer,
  autoCoralCL2 boolean, autoCoralCL3 boolean, autoCoralCL4 boolean,
  autoCoralDL2 boolean, autoCoralDL3 boolean, autoCoralDL4 boolean,
  autoCoralEFL1 integer,
  autoCoralEL2 boolean, autoCoralEL3 boolean, autoCoralEL4 boolean,
  autoCoralFL2 boolean, autoCoralFL3 boolean, autoCoralFL4 boolean,
  autoCoralGHL1 integer,
  autoCoralGL2 boolean, autoCoralGL3 boolean, autoCoralGL4 boolean,
  autoCoralHL2 boolean, autoCoralHL3 boolean, autoCoralHL4 boolean,
  autoCoralIJL1 integer,
  autoCoralIL2 boolean, autoCoralIL3 boolean, autoCoralIL4 boolean,
  autoCoralJL2 boolean, autoCoralJL3 boolean, autoCoralJL4 boolean,
  autoCoralKLL1 integer,
  autoCoralKL2 boolean, autoCoralKL3 boolean, autoCoralKL4 boolean,
  autoCoralLL2 boolean, autoCoralLL3 boolean, autoCoralLL4 boolean,
  autoProcessor integer,
  autoNet integer,

  teleopL1 integer,
  teleopL2 integer,
  teleopL3 integer,
  teleopL4 integer,
  teleopProcessor integer,
  teleopNet integer,
  teleopPark boolean,
  teleopAttemptedShallow boolean,
  teleopAttemptedDeep boolean,
  teleopSuccessfulShallow boolean,
  teleopSuccessfulDeep boolean,

  dataConfidence integer CHECK(dataConfidence IN ('low', 'neutral', 'high')),

  PRIMARY KEY (eventKey, matchLevel, matchNumber, alliance, robotNumber, deviceTeamNumber, deviceId)
);

CREATE TABLE IF NOT EXISTS HumanPlayerEntry(
  eventKey text NOT NULL,
  matchLevel text CHECK(matchLevel IN ('None', 'Practice', 'Qualification', 'Playoff')) NOT NULL,
  matchNumber integer NOT NULL,
  teamNumber integer,
  alliance text CHECK(alliance IN ('Red', 'Blue')) NOT NULL,
  robotNumber integer CHECK(robotNumber IN (4)) NOT NULL,
  deviceTeamNumber integer NOT NULL,
  deviceId text NOT NULL,
  scoutTeamNumber integer NOT NULL,
  scoutName text NOT NULL,
  flag text NOT NULL,

  tbaMaxAlgaeAttempts integer,

  humanAttemptedNet integer,
  humanSuccessfulNet integer,
  comments text,

  PRIMARY KEY (eventKey, matchLevel, matchNumber, alliance, robotNumber, deviceTeamNumber, deviceId)
);


DROP TABLE IF EXISTS Users;

CREATE TABLE IF NOT EXISTS Users(
  username text UNIQUE PRIMARY KEY NOT NULL,
  permLevel text CHECK(permLevel IN ('none', 'demo', 'team', 'datamanage', 'admin')) DEFAULT 'team',
  teamNumber integer NOT NULL,
  hashedPassword text NOT NULL
);


DROP TABLE IF EXISTS Matches;
DROP TABLE IF EXISTS Events;

CREATE TABLE IF NOT EXISTS Events(
  eventKey text PRIMARY KEY NOT NULL,
  eventName text NOT NULL
);

CREATE TABLE IF NOT EXISTS Matches(
  eventKey text NOT NULL,
  matchLevel text CHECK(matchLevel IN ('None', 'Practice', 'Qualification', 'Playoff')) NOT NULL,
  matchNumber integer NOT NULL,
  red1 integer NOT NULL,
  red2 integer NOT NULL,
  red3 integer NOT NULL,
  blue1 integer NOT NULL,
  blue2 integer NOT NULL,
  blue3 integer NOT NULL,
  PRIMARY KEY (eventKey, matchLevel, matchNumber),
  FOREIGN KEY(eventKey) REFERENCES Events(eventKey)
);
