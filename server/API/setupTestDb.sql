PRAGMA foreign_keys = ON;

DROP TABLE user;
CREATE table user(	
			username TEXT UNIQUE, 
			password TEXT);


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

DROP table mittagessen;
CREATE table mittagessen(	
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				kinderId INTEGER REFERENCES kinder(id) ON DELETE CASCADE,
				pauschaleFruehstueck REAL,
				kostenMittagessen REAL,
				anzahlMittagessen INTEGER,
				abrechnungsmonat TEXT,
				UNIQUE (kinderId, abrechnungsmonat));

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

