DROP TABLE familien;
CREATE table familien(	id INTEGER PRIMARY KEY AUTOINCREMENT, 
			name TEXT);


DROP TABLE kontaktpersonen;
CREATE table kontaktpersonen(	id INTEGER PRIMARY KEY AUTOINCREMENT, 
				name TEXT, 
				vorname TEXT, 
				email TEXT, 
				mobilNr TEXT, 
				festnetzNr TEXT, 
				kommentar TEXT, 
				familienId INTEGER,
				FOREIGN KEY (familienId) REFERENCES familien(id));

DROP table kontaktdaten;
CREATE table kontaktdaten(	id INTEGER PRIMARY KEY AUTOINCREMENT,
				daten TEXT,
				kontaktdatentypenId INTEGER,
				kontaktpersonenId INTEGER,
				FOREIGN KEY (kontaktdatentypenId) REFERENCES kontaktdatentypen(id),
				FOREIGN KEY (kontaktpersonenId) REFERENCES kontaktpersonen(id));

DROP table kontaktdatentypen;
CREATE table kontaktdatentypen(	id INTEGER PRIMARY KEY AUTOINCREMENT,
				bezeichnung TEXT);

DROP table kinder;
CREATE table kinder(		id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT,
				vorname TEXT,
				familienId INTEGER,
				FOREIGN KEY (familienId) REFERENCES familien(id));

INSERT INTO kontaktdatentypen(id, bezeichnung) VALUES
	(1, 'E-Mail'),(2, 'Festnetz'),(3, 'Handy');

INSERT INTO familien(id, name) VALUES 
	(1,'auerbach');
INSERT INTO kontaktpersonen(id, name, vorname, kommentar, familienId) VALUES 
	(1, 'auerbach', 'arndt', 'Vater', 1),
	(2, 'auerbach', 'amalie', 'Mutter', 1);
INSERT INTO kontaktdaten(daten, kontaktdatentypenId, kontaktpersonenId) VALUES
	('arndt@auerbach.de', 1, 1),
	('0177-123456', 2, 1),
	('02233-543221', 3, 1),
	('amalie@auerbach.de', 1, 2),
	('0177-amalie', 2, 2),
	('02233-amalie', 3, 2);
INSERT INTO kinder(id, name, vorname, familienId) VALUES 
	(1, 'auerbach', 'arno junior', 1),
	(2, 'auerbach', 'amy', 1);

INSERT INTO familien(id, name) VALUES 
	(2,'becker');
INSERT INTO kontaktpersonen(id, name, vorname, kommentar, familienId) VALUES 
	(3, 'becker', 'bert', 'Vater', 2),
	(4, 'becker', 'brunhilde', 'Mutter', 2);
INSERT INTO kontaktdaten(daten, kontaktdatentypenId, kontaktpersonenId) VALUES
	('bert@becker.de', 1, 3),
	('0177-bert', 2, 3),
	('02233-bert', 3, 3),
	('bruni@becker.de', 1, 4),
	('0177-bruni', 2, 4),
	('02233-bruni', 3, 4);
INSERT INTO kinder(id, name, vorname, familienId) VALUES 
	(3, 'becker', 'boris junior', 2),
	(4, 'becker', 'beate', 2);
