<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'Slim/Slim.php';

class DbObject {
	public $id;
}

class Familie extends DbObject {
	public $id;
	public $name;
	public $kinder = array();
	public $kontaktpersonen = array();
	
	public function initFromDb($db, $id, $extend = array(), $fields = array()){
		$stmt = $db->prepare('SELECT * FROM familien WHERE id=:id;');
		$stmt->bindValue(':id', $id);
		$result = $stmt->execute();
		if($row = $result->fetchArray()){
			$this->name = $row['name'];
			//TODO: Methode des Vaters aufrufen statt id selbst zu setzern
			$this->id = $row['id'];
		}

		//Zugehörige Kontaktpersonen bestimmen
		$stmt = $db->prepare('SELECT id FROM kontaktpersonen WHERE familienId=:id;');
		$stmt->bindValue(':id', $id);
		$result = $stmt->execute();
		while($row = $result->fetchArray()){
			if (in_array('kontaktpersonen', $extend)){
				$kontaktperson = new Kontaktperson();
				$kontaktperson->initFromDb($db, $row['id']);
			}
			else {
				$kontaktperson = new DbObject();
				$kontaktperson->id = $row['id'];
			}
			$this->kontaktpersonen[] = $kontaktperson;
		}
		
		//Zugehörige Kinder bestimmen
		$stmt = $db->prepare('SELECT id FROM kinder WHERE familienId=:id;');
		$stmt->bindValue(':id', $id);
		$result = $stmt->execute();
		while($row = $result->fetchArray()){
			if (in_array('kinder', $extend)){
				$kind = new Kind();
				$kind->initFromDb($db, $row['id']);
			}
			else {
				$kind = new DbObject();
				$kind->id = $row['id'];
			}
			$this->kinder[] = $kind;
		}

	}
}

class Kontaktdaten {
	public $id;
	public $typ;
	public $daten;

	public function initFromDb($db, $id, $extend = array(), $fields = array()){
		$stmt = $db->prepare('SELECT * FROM kontaktdaten JOIN kontaktdatentypen ON kontaktdaten.kontaktdatentypenId = kontaktdatentypen.id WHERE kontaktdaten.id=:id;');
		$stmt->bindValue(':id', $id);
		$result = $stmt->execute();
		if($row = $result->fetchArray()){
			$this->typ = $row['bezeichnung'];
			$this->daten = $row['daten'];
			//TODO: Methode des Vaters aufrufen statt id selbst zu setzern
			$this->id = $row['id'];
		}
	}
}

class Kind {
	public $id;
	public $name;
	public $vorname;
	public $gruppe;
	public $schlagwoerter = array();

	public function initFromDb($db, $id, $extend = array(), $fields = array()){
		$stmt = $db->prepare('SELECT * FROM kinder WHERE id=:id;');
		$stmt->bindValue(':id', $id);
		$result = $stmt->execute();
		if($row = $result->fetchArray()){
			$this->name = $row['name'];
			$this->vorname = $row['vorname'];
			//TODO: Methode des Vaters aufrufen statt id selbst zu setzern
			$this->id = $row['id'];
		}
	}
}

class Schlagwort {
	public $id;
	public $bezeichnung;
	public $kommentar;
}

class Gruppe {
	public $id;
	public $name;
}

class Kontaktperson {
	public $id;
	public $name;
	public $vorname;
	public $kommentar;
	public $kontaktdaten = array();

	public function initFromDb($db, $id, $extend = array(), $fields = array()){
		$stmt = $db->prepare('SELECT * FROM kontaktpersonen WHERE id=:id;');
		$stmt->bindValue(':id', $id);
		$result = $stmt->execute();
		if($row = $result->fetchArray()){
			$this->name = $row['name'];
			$this->vorname = $row['vorname'];
			$this->kommentar = $row['kommentar'];
			//TODO: Methode des Vaters aufrufen statt id selbst zu setzern
			$this->id = $row['id'];
		}

		$stmt = $db->prepare('SELECT id FROM kontaktdaten WHERE kontaktpersonenId=:id;');
		$stmt->bindValue(':id', $id);
		$result = $stmt->execute();
		while($row = $result->fetchArray()){
			$kontaktdatum = new Kontaktdaten();
			$kontaktdatum->initFromDb($db, $row['id']);
			$this->kontaktdaten[] = $kontaktdatum;
		}
	}
}


\Slim\Slim::registerAutoloader();

$familien = array();	

$app = new \Slim\Slim();
$db = new SQLite3('kindergarten.db');
/*
REST API Befehle:
extend=FELDNAME,... Gibt Detaildaten auch für die angegebenen Felder zurück
fields=FELDNAME,... Gibt nur die in fields angegebenen Felder eines Datensatzes zurück
*/

//Gibt alle Familen zurück
$app->get('/familien', function() use ($db) {
	$stmt = $db->prepare('SELECT id FROM familien;');
	$result = $stmt->execute();
	$familien = array();
	while($row = $result->fetchArray()){
		$familie = new Familie();
		$familie->initFromDb($db, $row['id'], array('kontaktpersonen', 'kinder'));
				
		$familien[] = $familie;
	}	
	echo json_encode($familien);
});

//Gibt die Familie mit der ID :id zurück
$app->get('/familien/:id', function($id) use ($db){
	$familie = new Familie();
	$familie->initFromDb($db, $id, array('kontaktpersonen', 'kinder'));	
	echo json_encode($familie);
});

//Gibt die Kontaktpersonen er Familie mit der ID :id zurück
$app->get('/familien/:id/kontaktpersonen', function($id) use ($db){
	$familie = new Familie();
	$familie->initFromDb($db, $id, array('kontaktpersonen'));	
	echo json_encode($familie->kontaktpersonen);
});

//Gibt die Kinder der Familie mit der ID :id zurück
$app->get('/familien/:id/kinder', function($id) use ($db){
	$familie = new Familie();
	$familie->initFromDb($db, $id, array('kinder'));	
	echo json_encode($familie->kinder);
});

//Aktualisiert die Daten der Familie mit der ID :id
$app->put('/familien/:id', function($id) use ($familien){
	echo json_encode($familien);
});

//Erzeugt eine neue Familie
$app->post('/familien', function($id) use ($familien){
	echo json_encode($familien);
});

//Löscht die Familie mit der ID :id zurück
$app->delete('/familien/:id', function($id) use ($familien){
	echo json_encode($familien);
});

//Gibt alle Kinder zurück
$app->get('/kinder', function() use ($familien){
	echo json_encode($familien);
});

//Gibt alle Kinder zurück
$app->get('/kinder/:id', function($id) use($db){
	$kind = new Kind();
	$kind->initFromDb($db, $id);	
	echo json_encode($kind);
});

//Gibt alle Kontaktpersonen zurück
$app->get('/kontaktpersonen', function() use ($familien){
	echo json_encode($familien);
});

//Gibt alle Schlagwörter zurück
$app->get('/schlagwoerter', function() use ($familien){
	echo json_encode($familien);
});

//Gibt alle Gruppen zurück
$app->get('/gruppen', function() use ($familien){
	echo json_encode($familien);
});


$app->run();
?>