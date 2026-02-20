-- Migration number: 0001 	 2025-07-24T14:30:38.465Z
DROP TABLE IF EXISTS TeamMatchEntry;

CREATE TABLE IF NOT EXISTS TeamMatchEntry (
  eventKey text NOT NULL,
  matchLevel text CHECK (
    matchLevel IN ('None', 'Practice', 'Qualification', 'Playoff')
  ) NOT NULL,
  matchNumber integer NOT NULL,
  teamNumber integer NOT NULL,
  alliance text CHECK (alliance IN ('Red', 'Blue')) NOT NULL,
  robotNumber integer CHECK (robotNumber IN (1, 2, 3)) NOT NULL,
  deviceTeamNumber integer NOT NULL,
  deviceId text NOT NULL,
  scoutTeamNumber integer NOT NULL,
  scoutName text NOT NULL,
  flag text NOT NULL,
  
  noShow boolean NOT NULL,
  comments TEXT,
  startZone TEXT,
  autoFuelHubScoring BOOLEAN,
  autoFuelHubScoringLocation TEXT,
  autoFuelPassed BOOLEAN,
  autoClimbPosition TEXT,
  autoClimbAttempted BOOLEAN,
  autoClimbLevel INTEGER,
  autoFuelScored INTEGER,
  teleFuelScored INTEGER,
  teleCycles INTEGER,
  teleFuelScoredFromHub BOOLEAN,
  teleFuelScoredFromTower BOOLEAN,
  teleFuelScoredFromDepot BOOLEAN,
  teleFuelScoredFromOutpost BOOLEAN,
  teleFuelScoredFromTrench BOOLEAN,
  teleFuelScoredFromBump BOOLEAN,
  teleFuelScoredFromOther BOOLEAN,
  teleInactiveDefenseRoleEffectiveness INTEGER,
  teleInactiveIntakingRoleEffectiveness INTEGER,
  teleInactiveFeedingRoleEffectiveness INTEGER,
  teleInactiveFuelPassed INTEGER,
  endClimbAttempted BOOLEAN,
  robotGotStuck BOOLEAN,
  robotTraverseTrench BOOLEAN,
  robotTraverseBump BOOLEAN,
  died BOOLEAN,
  dataConfidence INTEGER,
  PRIMARY KEY (
    eventKey,
    matchLevel,
    matchNumber,
    alliance,
    robotNumber,
    deviceTeamNumber,
    deviceId
  )
);


DROP TABLE IF EXISTS Users;

CREATE TABLE IF NOT EXISTS Users (
  username text UNIQUE PRIMARY KEY NOT NULL,
  permLevel text CHECK (
    permLevel IN ('none', 'demo', 'team', 'datamanage', 'admin')
  ) DEFAULT 'team',
  teamNumber integer NOT NULL,
  hashedPassword text NOT NULL
);

DROP TABLE IF EXISTS Matches;

DROP TABLE IF EXISTS Events;

CREATE TABLE IF NOT EXISTS Events (
  eventKey text PRIMARY KEY NOT NULL,
  eventName text NOT NULL
);

CREATE TABLE IF NOT EXISTS Matches (
  eventKey text NOT NULL,
  matchLevel text CHECK (
    matchLevel IN ('None', 'Practice', 'Qualification', 'Playoff')
  ) NOT NULL,
  matchNumber integer NOT NULL,
  red1 integer NOT NULL,
  red2 integer NOT NULL,
  red3 integer NOT NULL,
  blue1 integer NOT NULL,
  blue2 integer NOT NULL,
  blue3 integer NOT NULL,
  PRIMARY KEY (eventKey, matchLevel, matchNumber),
  FOREIGN KEY (eventKey) REFERENCES Events (eventKey)
);
