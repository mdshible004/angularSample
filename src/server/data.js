module.exports = {
	cities: getAllCities(),
	zones: getAllZones(),
	restaurants: getAllRestaurants(),
	areas: getAllAreas(),
	dlvPartners: getAllDlvPartners(),
	paymethods: getAllPayMethods()
};


function getAllCities(){
	return [
		{ id: 1, name: 'city 1', status: true },
		{ id: 2, name: 'city 2', status: true },
		{ id: 3, name: 'city 3', status: true },
		{ id: 4, name: 'city 4', status: true },
		{ id: 5, name: 'city 5', status: true },
		{ id: 6, name: 'Inactive city', status: false }
	];
}
function getAllZones(){
	return [
		{ id: 1, name: 'zones 1', status: true },
		{ id: 2, name: 'zones 2', status: true },
		{ id: 3, name: 'zones 3', status: true },
		{ id: 4, name: 'zones 4', status: true },
		{ id: 5, name: 'zones 5', status: true }
	];
}

function getAllAreas(){
	return [
		{ id: 1, name: 'areas 1', status: true },
		{ id: 2, name: 'areas 2', status: true },
		{ id: 3, name: 'areas 3', status: true },
		{ id: 4, name: 'areas 4', status: true },
		{ id: 5, name: 'areas 5', status: true }
	];
}

function getAllRestaurants(){
	return [
		{ id: 1, name: 'restaurant 1', status: true },
		{ id: 2, name: 'restaurant 2', status: true },
		{ id: 3, name: 'restaurant 3', status: true },
		{ id: 4, name: 'restaurant 4', status: true },
		{ id: 5, name: 'restaurant 5', status: true },
		{ id: 6, name: 'Inactive restaurant', status: false }
	];
}

function getAllRestaurants(){
	return [
		{ id: 1, name: 'restaurant 1', status: true },
		{ id: 2, name: 'restaurant 2', status: true },
		{ id: 3, name: 'restaurant 3', status: true },
		{ id: 4, name: 'restaurant 4', status: true },
		{ id: 5, name: 'restaurant 5', status: true },
		{ id: 6, name: 'Inactive restaurant', status: false }
	];
}

function getAllDlvPartners(){
	return [
		{ id: 1, name: 'Delex', status: true },
		{ id: 2, name: 'Aramex', status: true }
	];
}

function getAllPayMethods(){

	return [
		{ id: 1, paymentType: 'Cash On Delivery', chargeType: 'percentage', paymentCharge: 4 },
		{ id: 2, paymentType: 'SSL', chargeType: 'amount', paymentCharge: 30 },
		{ id: 3, paymentType: 'bKash', chargeType:	'percentage', paymentCharge: 2 },
		{ id: 4, paymentType: 'HungryCard', chargeType:	'percentage', paymentCharge: 0}
	];
}
