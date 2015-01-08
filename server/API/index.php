<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

class DbObject {
	public $id;
	
	//Prüft, ob die als Array übergebenen Eigenschaftsbezeichnungen auch Eigenschaften des Objekts sind
	public function hasRequiredProperties($obj){
		foreach($this->requiredDataFields as $prop){
			if (!property_exists($obj, $prop)){
				return false;
			}
		}
		return true;
	}
	
	public function setRequiredProperties($obj){
		foreach($this->requiredDataFields as $field){
			$this->$field = $obj->$field;
		}
	}
	
	//Prüft, ob alle Eigenschaften des Objekts $obj auch Eigenschaften von uns selbst sind
	public function hasValidProperties($obj){
		foreach(((array)$obj) as $prop => $val)
		{
			if (!property_exists($this, $prop)){
				return false;
			}
		}
		return true;
	}
	
	//Setzt alle in $obj enthakltenen Eigenschaften im lokalen Objekt
	public function setProperties($obj){
		foreach(((array)$obj) as $prop => $val)
		{
			$this->$prop = $obj->$prop;
		}
	}
}

class Familie extends DbObject {
	public $id;
	public $name;
	public $kinder = array();
	public $kontaktpersonen = array();
	
	//Beschreibt die Datenfelder, die beim Anlegen einer neuen Familie angegeben sein müssen
	protected $requiredDataFields = array("name");
	
	public function read($db, $id, $extend = array(), $fields = array()){
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
				$kontaktperson->read($db, $row['id']);
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

	public function create($db){
		$stmt = $db->prepare('INSERT INTO familien(name) VALUES(:name); SELECT last_insert_rowid() FROM familien;');
		$stmt->bindValue(':name', $this->name);
		$result = $stmt->execute();
		if(!$result){
			return false;
		}
		$this->id = $db->lastInsertRowID();
		
		return true;
	}
	
	public function update($db){
		$stmt = $db->prepare('UPDATE familien SET name=:name WHERE id=:id;');
		$stmt->bindValue(':id', $this->id);
		$stmt->bindValue(':name', $this->name);
		$result = $stmt->execute();
		if(!$result){
			return false;
		}
		else{
			return true;
		}
	}
	
	public function delete($db){
		$stmt = $db->prepare('DELETE FROM familien WHERE id=:id;');
		$stmt->bindValue(':id', $this->id);
		$result = $stmt->execute();
		if(!$result){
			return false;
		}
		else{
			return true;
		}
	}
}

class Kind extends DbObject {
	public $id;
	public $name;
	public $vorname;
	public $geburtsdatum;
	public $schlagwoerter = array();
	public $emailkontakte = array();
	
	//Beschreibt die Datenfelder, die beim Anlegen einer neuen Kinds angegeben sein müssen
	protected $requiredDataFields = array("name", "vorname", "schlagwoerter", "geburtsdatum");

	public function initFromDb($db, $id, $extend = array(), $fields = array()){
		$stmt = $db->prepare('SELECT * FROM kinder WHERE id=:id;');
		$stmt->bindValue(':id', $id);
		$result = $stmt->execute();
		if($row = $result->fetchArray()){
			$this->name = $row['name'];
			$this->vorname = $row['vorname'];
			$this->geburtsdatum = $row['geburtsdatum'];
			//TODO: Methode des Vaters aufrufen statt id selbst zu setzern
			$this->id = $row['id'];
		}
		//Schlagwörter zu Kind auslesen
		$stmt = $db->prepare('SELECT schlagwoerter.bezeichnung FROM kinderschlagwoerter JOIN schlagwoerter ON kinderschlagwoerter.schlagwoerterId = schlagwoerter.id WHERE kinderschlagwoerter.kinderId=:id;');
		$stmt->bindValue(':id', $this->id);
		$result = $stmt->execute();
		$this->schlagwoerter = array();
		while($row = $result->fetchArray()){
			$this->schlagwoerter[] = $row['bezeichnung'];
		}
		//Mailkontakte zu Kind auslesen
		$stmt = $db->prepare('SELECT kontaktpersonen.vorname, kontaktpersonen.name, kontaktpersonen.email FROM kontaktpersonen 
								JOIN familien ON familien.id = kontaktpersonen.familienId
								JOIN kinder ON kinder.familienId = familien.id
								WHERE kinder.id=:id AND kontaktpersonen.istStandardEmailKontakt;');
		$stmt->bindValue(':id', $this->id);
		$result = $stmt->execute();
		$this->emailkontakte = array();
		while($row = $result->fetchArray()){
			$this->emailkontakte[] = $row['vorname']." ".$row['name']." <".$row['email'].">";
		}
	}
	
	public function create($db, $familienId){
		$stmt = $db->prepare('INSERT INTO kinder(name, vorname, geburtsdatum, familienId) VALUES(:name, :vorname, :geburtsdatum, :familienId); SELECT last_insert_rowid() FROM kinder;');
		$stmt->bindValue(':familienId', $familienId);
		$stmt->bindValue(':name', $this->name);
		$stmt->bindValue(':vorname', $this->vorname);
		$stmt->bindValue(':geburtsdatum', $this->geburtsdatum);
		$result = $stmt->execute();
		if(!$result){
			return false;
		}
		$this->id = $db->lastInsertRowID();
		
		//Schlagwörterverbindungen anlegen
		$stmt = $db->prepare('INSERT INTO kinderschlagwoerter(kinderId, schlagwoerterId) VALUES(:kinderId, (SELECT id FROM schlagwoerter WHERE bezeichnung=:schlagwoerterBezeichnung));');
		$stmt->bindValue(':kinderId', $this->id);
		foreach($this->schlagwoerter as $schlagwort){
			$stmt->bindValue(':schlagwoerterBezeichnung', $schlagwort);
			$stmt->execute();
		}
		
		return true;
	}
	
	public function update($db){
		$stmt = $db->prepare('UPDATE kinder SET name=:name, vorname=:vorname, geburtsdatum=:geburtsdatum WHERE id=:id;');
		$stmt->bindValue(':id', $this->id);
		$stmt->bindValue(':name', $this->name);
		$stmt->bindValue(':vorname', $this->vorname);
		$stmt->bindValue(':geburtsdatum', $this->geburtsdatum);
		$result = $stmt->execute();
		if(!$result){
			return false;
		}
		else{
			return true;
		}
	}
	
	public function delete($db){
		$stmt = $db->prepare('DELETE FROM kinder WHERE id=:id;');
		$stmt->bindValue(':id', $this->id);
		$result = $stmt->execute();
		if(!$result){
			return false;
		}
		else{
			return true;
		}
	}
}

class Schlagwort extends DbObject {
	public $id;
	public $bezeichnung;
	public $kommentar;
	
	public function read($db, $id, $extend = array(), $fields = array()){
		$stmt = $db->prepare('SELECT * FROM schlagwoerter WHERE id=:id;');
		$stmt->bindValue(':id', $id);
		$result = $stmt->execute();
		if($row = $result->fetchArray()){
			$this->bezeichnung = $row['bezeichnung'];
			$this->kommentar = $row['kommentar'];
			$this->id = $row['id'];
		}
	}
}

class Kontaktperson extends DbObject {
	public $id;
	public $name;
	public $vorname;
	public $kommentar;
	public $email;
	public $istStandardEmailKontakt;
	public $mobilNr;
	public $festnetzNr;
	public $sonstNr;
	public $familienId;
	
	//Beschreibt die Datenfelder, die beim Anlegen einer neuen Kontaktperson angegeben sein müssen
	protected $requiredDataFields= array("name", "vorname", "kommentar", "email", "istStandardEmailKontakt", "mobilNr", "festnetzNr", "sonstNr");

	public function read($db, $id, $extend = array(), $fields = array()){
		$stmt = $db->prepare('SELECT * FROM kontaktpersonen WHERE id=:id;');
		$stmt->bindValue(':id', $id);
		$result = $stmt->execute();
		if($row = $result->fetchArray()){
			$this->name 					= $row['name'];
			$this->vorname 					= $row['vorname'];
			$this->kommentar 				= $row['kommentar'];
			$this->email 					= $row['email'];
			$this->istStandardEmailKontakt 	= ($row['istStandardEmailKontakt']!=0);
			$this->mobilNr	 				= $row['mobilNr'];
			$this->festnetzNr 				= $row['festnetzNr'];
			$this->sonstNr 					= $row['sonstNr'];
			$this->familienId 				= $row['familienId'];
			
			//TODO: Methode des Vaters aufrufen statt id selbst zu setzern
			$this->id = $row['id'];
			return true;
		}
		else{
			return false;
		}
	}
	
	public function create($db, $familienId){
		$stmt = $db->prepare('INSERT INTO kontaktpersonen(name, vorname, familienId, kommentar, email, istStandardEmailKontakt, mobilNr, festnetzNr, sonstNr) VALUES(:name, :vorname, :familienId, :kommentar, :email, :istStandardEmailKontakt, :mobilNr, :festnetzNr, :sonstNr); SELECT last_insert_rowid() FROM kontaktpersonen;');
		$stmt->bindValue(':familienId', $familienId);
		$stmt->bindValue(':name', $this->name);
		$stmt->bindValue(':vorname', $this->vorname);
		$stmt->bindValue(':kommentar', $this->kommentar);
		$stmt->bindValue(':email', $this->email);
		$stmt->bindValue(':istStandardEmailKontakt', $this->istStandardEmailKontakt?1:0);
		$stmt->bindValue(':mobilNr', $this->mobilNr);
		$stmt->bindValue(':festnetzNr', $this->festnetzNr);
		$stmt->bindValue(':sonstNr', $this->sonstNr);
		$result = $stmt->execute();
		if(!$result){
			return false;
		}
		$this->id = $db->lastInsertRowID();
		
		return true;
	}
	
	public function update($db){
		$stmt = $db->prepare('UPDATE kontaktpersonen SET name=:name, vorname=:vorname, kommentar=:kommentar, email=:email, istStandardEmailKontakt=:istStandardEmailKontakt, mobilNr=:mobilNr, festnetzNr=:festnetzNr, sonstNr=:sonstNr WHERE id=:id;');
		$stmt->bindValue(':id', $this->id);
		$stmt->bindValue(':name', $this->name);
		$stmt->bindValue(':vorname', $this->vorname);
		$stmt->bindValue(':kommentar', $this->kommentar);
		$stmt->bindValue(':email', $this->email);
		$stmt->bindValue(':istStandardEmailKontakt', $this->istStandardEmailKontakt?1:0);
		$stmt->bindValue(':mobilNr', $this->mobilNr);
		$stmt->bindValue(':festnetzNr', $this->festnetzNr);
		$stmt->bindValue(':sonstNr', $this->sonstNr);
		$result = $stmt->execute();
		if(!$result){
			return false;
		}
		else{
			return true;
		}
	}
	
	public function delete($db){
		$stmt = $db->prepare('DELETE FROM kontaktpersonen WHERE id=:id;');
		$stmt->bindValue(':id', $this->id);
		$result = $stmt->execute();
		if(!$result){
			return false;
		}
		else{
			return true;
		}
	}
}

class HttpBasicAuth extends \Slim\Middleware {
    /**
     * @var string
     */
    protected $realm;
    /**
     * @var string
     */
    protected $username;
    /**
     * @var string
     */
    protected $password;
    /**
     * Constructor
     *
     * @param   string  $username   The HTTP Authentication username
     * @param   string  $password   The HTTP Authentication password
     * @param   string  $realm      The HTTP Authentication realm
     */
    public function __construct($username, $password, $realm = 'Protected Area')
    {
        $this->username = $username;
        $this->password = $password;
        $this->realm = $realm;
    }
    /**
     * Call
     *
     * This method will check the HTTP request headers for previous authentication. If
     * the request has already authenticated, the next middleware is called. Otherwise,
     * a 401 Authentication Required response is returned to the client.
     */
    public function call()
    {
        $req = $this->app->request();
        $res = $this->app->response();
        $authUser = $req->headers('PHP_AUTH_USER');
        $authPass = $req->headers('PHP_AUTH_PW');
        if ($authUser && $authPass && $authUser === $this->username && $authPass === $this->password) {
            $this->next->call();
        } else {
            $res->status(401);
            $res->header('WWW-Authenticate', sprintf('Basic realm="%s"', $this->realm));
        }
    }
}

$familien = array();	

$app = new \Slim\Slim();
$app->add(new HttpBasicAuth('theUsername', 'thePassword'));
$db = new SQLite3('kindergarten.db');
//Foreign Keys aktivieren
$db->query("PRAGMA foreign_keys = ON;");
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
		$familie->read($db, $row['id'], array('kontaktpersonen', 'kinder'));
				
		$familien[] = $familie;
	}	
	echo json_encode($familien);
});

//Erzeugt eine neue Familie
$app->post('/familien', function() use ($db, $app){
	$familie = new Familie();
	$familieData = json_decode($app->request->getBody());
	
	if(!$familie->hasRequiredProperties($familieData)){
		$app->halt(400);
	}
	
	$familie->setProperties($familieData);
	
	if($familie->create($db)){
		$familie->read($db, $familie->id);
		echo(json_encode($familie));
		$app->response->setStatus(201);
		$app->response->headers->set('Location', $app->request->getUrl().$app->request->getRootUri().'/familien/'.$familie->id);
	}
	else{
		$app->halt(400);
	}
});

//Gibt die Familie mit der ID :id zurück
$app->get('/familien/:id', function($id) use ($db){
	$familie = new Familie();
	$familie->read($db, $id, array('kontaktpersonen', 'kinder'));	
	echo json_encode($familie);
});

//Aktualisiert die Daten der Familie mit der ID :id
$app->put('/familien/:id', function($id) use ($db, $app){
	$familie = new Familie();
	$familie->read($db, $id);
	
	$familieData = json_decode($app->request->getBody());
	
	//Prüfen, ob alle gesetzten Eigenschaften auch Eigenschaft eines Kontakts ist
	if (!$familie->hasValidProperties($familieData)){
		$app->halt(400);
	}
	
	$familie->setProperties($familieData);

	if($familie->update($db)){
		$app->response->headers->set('Content-Type', 'application/json');
		$familie->read($db, $id);
		echo json_encode($familie);
		$app->response->setStatus(200);
	}
	else{
		$app->response->setStatus(400);
	}
});

//Löscht die Familie mit der ID :id zurück
$app->delete('/familien/:id', function($id) use ($db, $app){
	$familie = new Familie();
	$familie->read($db, $id);	
	if($familie->delete($db)){
		$app->response->setStatus(204);
	}
	else{
		$app->response->setStatus(404);
	}
});

//Gibt die Kontaktpersonen er Familie mit der ID :id zurück
$app->get('/familien/:id/kontaktpersonen', function($id) use ($db){
	$familie = new Familie();
	$familie->read($db, $id, array('kontaktpersonen'));	
	echo json_encode($familie->kontaktpersonen);
});

//Erzeugt eine neue Kontaktperson in der Familie
$app->post('/familien/:familienId/kontaktpersonen', function($familienId) use ($db, $app){
	$kontaktperson = new Kontaktperson();
	$kontaktData = json_decode($app->request->getBody());
	
	
	if(!$kontaktperson->hasRequiredProperties($kontaktData)){
		$app->halt(400);
	}
	
	$kontaktperson->setProperties($kontaktData);
	
	if($kontaktperson->create($db, $familienId)){
		$kontaktperson->read($db, $kontaktperson->id);
		echo(json_encode($kontaktperson));
		$app->response->setStatus(201);
		$app->response->headers->set('Location', $app->request->getUrl().$app->request->getRootUri().'/familien/'.$familienId.'/kontaktpersonen/'.$kontaktperson->id);
	}
	else{
		$app->halt(400);
	}
});

//Gibt die Kontaktperson er Familie mit der ID :id zurück
$app->get('/familien/:familienId/kontaktpersonen/:id', function($familienId, $id) use ($db, $app){
	$kontaktperson = new Kontaktperson();
	if (!$kontaktperson->read($db, $id)){
		$app->halt(404);
	}
	$app->response->headers->set('Content-Type', 'application/json');
	echo json_encode($kontaktperson);
});

//Aktualisiert eine bestehende Kontaktperon in der Familie
$app->put('/familien/:familienId/kontaktpersonen/:id', function($familienId, $id) use ($db, $app){
	$kontaktperson = new Kontaktperson();
	$kontaktperson->read($db, $id);
	
	$kontaktData = json_decode($app->request->getBody());
	
	//Prüfen, ob alle gesetzten Eigenschaften auch Eigenschaft eines Kontakts ist
	if (!$kontaktperson->hasValidProperties($kontaktData)){
		$app->halt(400);
	}
	
	$kontaktperson->setProperties($kontaktData);

	if($kontaktperson->update($db)){
		$app->response->headers->set('Content-Type', 'application/json');
		$kontaktperson->read($db, $id);
		echo json_encode($kontaktperson);
		$app->response->setStatus(200);
	}
	else{
		$app->response->setStatus(400);
	}
});

$app->delete('/familien/:familienId/kontaktpersonen/:id', function($familienId, $id) use($db, $app){
	$kontaktperson = new Kontaktperson();
	$kontaktperson->read($db, $id);	
	if($kontaktperson->delete($db)){
		$app->response->setStatus(204);
	}
	else{
		$app->response->setStatus(404);
	}
});

//Gibt die Kinder der Familie mit der ID :id zurück
$app->get('/familien/:id/kinder', function($id) use ($db){
	$familie = new Familie();
	$familie->read($db, $id, array('kinder'));	
	echo json_encode($familie->kinder);
});

//Erzeugt ein neues Kind in der Familie
$app->post('/familien/:id/kinder', function($id) use ($db, $app){
	$kind = new Kind();
	$kindData = json_decode($app->request->getBody());
	
	if(!$kind->hasRequiredProperties($kindData)){
		$app->halt(400);
	}
	
	$kind->setRequiredProperties($kindData);
	
	if($kind->create($db, $id)){
		$kind->initFromDb($db, $kind->id);
		echo(json_encode($kind));
		$app->response->setStatus(201);
		$app->response->headers->set('Location', $app->request->getUrl().$app->request->getRootUri().'/familien/'.$id.'/kinder/'.$kind->id);
	}
	else{
		$app->response->setStatus(401);
	}
});

//Aktualisiert ein bestehendes Kind in der Familie
$app->put('/familien/:familienId/kinder/:id', function($familienId, $id) use ($db, $app){
	$kind = new Kind();
	$kind->initFromDb($db, $id);
	
	$kindData = json_decode($app->request->getBody());
	
	//Prüfen, ob alle gesetzten Eigenschaften auch Eigenschaft eines Kontakts ist
	if (!$kind->hasValidProperties($kindData)){
		$app->halt(400);
	}
	
	$kind->setProperties($kindData);

	if($kind->update($db)){
		$app->response->headers->set('Content-Type', 'application/json');
		echo json_encode($kind);
		$app->response->setStatus(200);
	}
	else{
		$app->response->setStatus(400);
	}
});

$app->get('/familien/:familienId/kinder/:id', function($familienId, $id) use($db,$app){
	$kind = new Kind();
	$kind->initFromDb($db, $id);
	$app->response->headers->set('Content-Type', 'application/json');
	echo json_encode($kind);
});

$app->delete('/familien/:familienId/kinder/:id', function($familienId, $id) use($db, $app){
	$kind = new Kind();
	$kind->initFromDb($db, $id, array());	
	if($kind->delete($db)){
		$app->response->setStatus(204);
	}
	else{
		$app->response->setStatus(404);
	}
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
$app->get('/schlagwoerter', function() use ($db, $app){
	$stmt = $db->prepare('SELECT id FROM schlagwoerter;');
	$result = $stmt->execute();
	$schlagwoerter = array();
	while($row = $result->fetchArray()){
		$schlagwort = new Schlagwort();
		$schlagwort->read($db, $row['id']);
				
		$schlagwoerter[] = $schlagwort;
	}
	$app->response->headers->set('Content-Type', 'application/json');
	echo json_encode($schlagwoerter);
});

//Gibt alle Kinder zu einem Schlagwort zurück
$app->get('/schlagwoerter/:id/kinder', function($id) use ($db, $app){
	$stmt = $db->prepare('SELECT kinder.id FROM kinderschlagwoerter JOIN kinder ON kinder.id = kinderschlagwoerter.kinderId WHERE kinderschlagwoerter.schlagwoerterId=:id;');
	$stmt->bindValue(':id', $id);
	$result = $stmt->execute();
	$kinder = array();
	while($row = $result->fetchArray()){
		$kind = new Kind();
		$kind->initFromDb($db, $row['id']);
		$kinder[] = $kind;
	}
	$app->response->headers->set('Content-Type', 'application/json');
	echo json_encode($kinder);
});

$app->run();
?>