PRAGMA foreign_keys = ON;

DROP TABLE familien;
CREATE table familien(	
			id INTEGER PRIMARY KEY AUTOINCREMENT, 
			name TEXT);

DROP TABLE kontaktpersonen;
CREATE table kontaktpersonen(	
				id INTEGER PRIMARY KEY AUTOINCREMENT, 
				name TEXT, 
				vorname TEXT, 
				email TEXT,
				istStandardEmailKontakt INTEGER,
				mobilNr TEXT, 
				festnetzNr TEXT, 
				sonstNr TEXT,
				anschrift TEXT,
				kommentar TEXT, 
				familienId INTEGER REFERENCES familien(id) ON DELETE CASCADE);

DROP table kinder;
CREATE table kinder(		
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT,
				vorname TEXT,
				geburtsdatum TEXT,
				familienId INTEGER REFERENCES familien(id) ON DELETE CASCADE);

DROP table schlagwoerter;
CREATE table schlagwoerter(	
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				bezeichnung TEXT UNIQUE,
				kommentar TEXT);
				
DROP table kinderschlagwoerter;
CREATE table kinderschlagwoerter(	
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				kinderId INTEGER REFERENCES kinder(id) ON DELETE CASCADE,
				schlagwoerterId INTEGER REFERENCES schlagwoerter(id) ON DELETE CASCADE);

INSERT INTO schlagwoerter(id, bezeichnung) VALUES
	(1, 'Gruppe blau'),
	(2, 'Gruppe grün'),
	(3, 'Gruppe rot'),
	(4, 'Stunden 35'),
	(5, 'Stunden 45'),
	(6, 'Waldkind'),
	(7, 'Schwimmkind'),
	(8, 'Vorschulkind'),
	(9, 'Turngruppe U2'),
	(10, 'Turngruppe 2-3'),
	(11, 'Turngruppe 3-4'),
	(12, 'Turngruppe 4-5'),
	(13, 'Turngruppe 5-6');

INSERT INTO familien(id, name) VALUES 
	(1,'Auerbach');
INSERT INTO kontaktpersonen(id, name, vorname, kommentar, familienId) VALUES 
	(1, 'Auerbach', 'Arndt', 'Vater', 1),
	(2, 'Auerbach', 'Amalie', 'Mutter', 1);
INSERT INTO kinder(id, name, vorname, familienId) VALUES 
	(1, 'Auerbach', 'Arno junior', 1),
	(2, 'Auerbach', 'Amy', 1);
INSERT INTO kinderschlagwoerter(kinderId, schlagwoerterId) VALUES
	(1,1),
	(1,2),
	(2,1),
	(2,3);

INSERT INTO familien(id, name) VALUES 
	(2,'Becker');
INSERT INTO kontaktpersonen(id, name, vorname, kommentar, familienId) VALUES 
	(3, 'Becker', 'Bert', 'Vater', 2),
	(4, 'Becker', 'Brunhilde', 'Mutter', 2);
INSERT INTO kinder(id, name, vorname, familienId) VALUES 
	(3, 'Becker', 'Boris junior', 2),
	(4, 'Becker', 'Beate', 2);
INSERT INTO kinderschlagwoerter(kinderId, schlagwoerterId) VALUES
	(3,1),
	(3,2);
