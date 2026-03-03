-- Migration number: 0002 	 2026-03-02T00:00:00.000Z
DROP TABLE IF EXISTS PitScoutEntry;

CREATE TABLE IF NOT EXISTS PitScoutEntry (
  eventKey text NOT NULL,
  teamNumber integer NOT NULL,
  deviceTeamNumber integer NOT NULL,
  deviceId text NOT NULL,
  scoutTeamNumber integer NOT NULL,
  scoutName text NOT NULL,
  uploadedAt text NOT NULL,

  startingLocation TEXT,

  pitAutoShootHub BOOLEAN,
  pitAutoShootTower BOOLEAN,
  pitAutoShootDepot BOOLEAN,
  pitAutoShootOutpost BOOLEAN,
  pitAutoShootTrenchOutpost BOOLEAN,
  pitAutoShootTrenchDepot BOOLEAN,
  pitAutoShootBumpOutpost BOOLEAN,
  pitAutoShootBumpDepot BOOLEAN,
  pitAutoShootOther BOOLEAN,

  pitPickupFloor BOOLEAN,
  pitPickupOutpost BOOLEAN,
  pitPickupDepot BOOLEAN,
  pitPickupNo BOOLEAN,

  pitFeedZone1 BOOLEAN,
  pitFeedZone2 BOOLEAN,
  pitFeedOutpost BOOLEAN,

  pitTraverseTrench BOOLEAN,
  pitTraverseBump BOOLEAN,

  pitAutoMove BOOLEAN,
  pitAutoScore BOOLEAN,
  pitAutoClimb BOOLEAN,
  pitAutoPickup BOOLEAN,
  pitNumberOfAutos INTEGER,

  pitHopperSize INTEGER,

  pitClimbLocation TEXT,
  pitClimbLevel INTEGER,
  pitClimbTime REAL,

  pitShooterBps REAL,

  pitHumanScore BOOLEAN,
  pitHumanFeed BOOLEAN,
  pitHumanOther BOOLEAN,

  pitTelePrimary TEXT,
  pitTeleScore BOOLEAN,
  pitTeleFeed BOOLEAN,
  pitTeleClimb BOOLEAN,
  pitTeleDefense BOOLEAN,
  pitTelePickupHerd BOOLEAN,

  pitTeleShootHub BOOLEAN,
  pitTeleShootTower BOOLEAN,
  pitTeleShootDepot BOOLEAN,
  pitTeleShootOutpost BOOLEAN,
  pitTeleShootTrenchOutpost BOOLEAN,
  pitTeleShootTrenchDepot BOOLEAN,
  pitTeleShootBumpOutpost BOOLEAN,
  pitTeleShootBumpDepot BOOLEAN,
  pitTeleShootOther BOOLEAN,
  pitTeleShootAny BOOLEAN,

  PRIMARY KEY (eventKey, teamNumber)
);
