var router = require('express').Router();
var four0four = require('./utils/404')();
var data = require('./data');


/* HungryNaki Accounts Module API [-START-] */
router.get('/cities', getAllCities);

router.get('/zones', getAllZones);
router.get('/zones/:id', getZoneById);
router.get('/cities/:cityId/zones', getZoneByCityId);

router.get('/cities/:cityId/zones/:zoneId/areas', getAreaByCityZoneId);

router.get('/areas/:areaId/restaurants', getRestByAreaId);

router.get('/cities/:cityId/delivery-partners', getDlvPartnersByCityId);

router.get('/payment-methods', getAllPaymethods);


router.get('/restaurants', getAllRestaurants);
/* HungryNaki Accounts Module API [-END-] */



router.get('/people', getPeople);
router.get('/person/:id', getPerson);
router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

//////////////
function getPeople(req, res, next) {
    res.status(200).send(data.people);
}

function getPerson(req, res, next) {
    var id = +req.params.id;
    var person = data.people.filter(function(p) {
        return p.id === id;
    })[0];

    if (person) {
        res.status(200).send(person);
    } else {
        four0four.send404(req, res, 'person ' + id + ' not found');
    }
}

function getAllCities(req, res) {
    res.status(200).send(data.cities);
}
function getAllZones(req, res) {
    res.status(200).send(data.zones);
}
function getZoneById(req, res) {
    res.status(200).send(data.zones);
	/*
	var id = +req.params.id;
	var laptopDetail = data.laptops.filter(function(laptop) {
        return laptop.id === laptop;
    })[0];
	
	res.status(200).send(laptopDetail);
	*/
}
function getZoneByCityId(req, res) {
    res.status(200).send(data.zones);
}
function getAreaByCityZoneId(req, res) {
    res.status(200).send(data.areas);
}
function getRestByAreaId(req, res) {
    res.status(200).send(data.restaurants);
}
function getAllRestaurants(req, res) {
    res.status(200).send(data.restaurants);
}
function getDlvPartnersByCityId(req, res) {
    res.status(200).send(data.dlvPartners);
}
function getAllPaymethods(req, res) {
    res.status(200).send(data.paymethods);
}

