// vm.addNewRow = function(){
//     var newOvDiscount = $('form.newOvDiscount');
//      alert('ok');
// 	if(newOvDiscount.length){
		
// 		var template_row = $("<tr />").append(newOvDiscount.find("table.newDiscounts tbody tr:last").html());
		
// 		var newDiscnt_conf = {
// 				counter: eval($("table.newDiscounts tbody tr:last td:first span.counter").html())+1,
// 				table  : "table.newDiscounts",
// 				AddBtn : ".addNewRow",
// 				rowHTML: template_row,
// 				delFunc: function(e){
// 							$(e.target).parent().parent().remove();
// 						}
// 		};
			
		
// 		(function (){
// 			var o = newDiscnt_conf;
// 			o.tableObj = $(o.table);
// 			o.rowHTML = o.rowHTML ? o.rowHTML : "";
// 			o.delFunc = o.delFunc;
			
// 			// //init(s) and events
// 			// o.tableObj.find('.fa-times').click(o.delFunc);
// 			//   //Date Pickers
			  
// 			// $('.input-append.date').datepicker({
// 			// 	autoclose: true,
// 			// 	todayHighlight: true
// 			// });


// 			// $(o.AddBtn).on('click', function(){
// 			// 	o.tableObj.find('tbody').append("<tr>"+$(o.rowHTML).find("td:first .counter").html(o.counter++).end().html() +"<tr/>");
// 			// 	o.tableObj.find('.fa-times').click(o.delFunc);
				
// 			// 	//re-init(s) and events
// 			// 	//Date Pickers
// 			// 	$('.input-append.date').datepicker({
// 			// 		autoclose: true,
// 			// 		todayHighlight: true
// 			// 	});

// 			// });
						
// 		})(newDiscnt_conf);
		
// 	}
// }


// var data = [
//     {
//         "UserID": "0",
//         "UserNo": "0",
//         "UserTypeID": null,
//         "UserTitleID": null,
//         "UserFirstName": "Mia",
//         "UserMiddleName": null,
//         "UserLastName": "Aman",
//         "UserFullName": "Mia Aman",
//         "EmailID": null,
//         "SkypeID": null,
//         "FacebookID": null,
//         "WhatsApp": null,
//         "Viber": null,
//         "LinkedIN": null,
//         "ParAddress": null,
//         "ParThana": null,
//         "ParPostCode": null,
//         "ParCountryID": null,
//         "ParStateID": null,
//         "ParCityID": null,
//         "PreAddress": null,
//         "PreThana": null,
//         "PrePostCode": null,
//         "PreCountryID": null,
//         "PreStateID": null,
//         "PreCityID": null,
//         "ReligionID": null,
//         "MobileNo": null,
//         "PhoneNo": null,
//         "UniqueIdentity": null,
//         "BloodGroupID": null,
//         "Height": null,
//         "DOB": null,
//         "PassportNO": null,
//         "ImageUrl": null,
//         "SignatureUrl": null,
//         "FingerUrl": null,
//         "NID": null,
//         "OfficeID": null,
//         "GenderID": null,
//         "IsActive": null,
//         "StatusID": null,
//         "InstituteID": 1
//     },
//     {
//         "UserID": "11",
//         "UserNo": "11",
//         "UserTypeID": null,
//         "UserTitleID": null,
//         "UserFirstName": "Md.",
//         "UserMiddleName": null,
//         "UserLastName": "Robin",
//         "UserFullName": "Md Robin",
//         "EmailID": null,
//         "SkypeID": null,
//         "FacebookID": null,
//         "WhatsApp": null,
//         "Viber": null,
//         "LinkedIN": null,
//         "ParAddress": null,
//         "ParThana": null,
//         "ParPostCode": null,
//         "ParCountryID": null,
//         "ParStateID": null,
//         "ParCityID": null,
//         "PreAddress": null,
//         "PreThana": null,
//         "PrePostCode": null,
//         "PreCountryID": null,
//         "PreStateID": null,
//         "PreCityID": null,
//         "ReligionID": null,
//         "MobileNo": null,
//         "PhoneNo": null,
//         "UniqueIdentity": null,
//         "BloodGroupID": null,
//         "Height": null,
//         "DOB": null,
//         "PassportNO": null,
//         "ImageUrl": null,
//         "SignatureUrl": null,
//         "FingerUrl": null,
//         "NID": null,
//         "OfficeID": null,
//         "GenderID": null,
//         "IsActive": null,
//         "StatusID": null,
//         "InstituteID": 1
//     }
// ]

// var data1 = [
//     {
//         "UserID": "0",
//         "UserNo": "0",
//         "UserTypeID": null,
//         "UserTitleID": null,
//         "UserFirstName": "Mia",
//         "UserMiddleName": null,
        
//     },
//     {
//         "UserID": "11",
//         "UserNo": "11",
//         "UserTypeID": null,
//         "UserTitleID": null,
//         "UserFirstName": "Md.",
//     }
// ]

// data.push({operator :data1});

// function abc(data){
//     for(var i=0;i<data.length;i++){
      
//        var demo = data[i].operator;
//     //     console.log(demo)
//     //    if(demo !== 'undefined'){
            
//     //    } 
//     for(var x=0;x<demo.length;x++){
//                 console.log(demo[x]);
//             }
//     }
// }

// abc(data);

// var PreAddress = [
//   [
//     {
//       "presentAddressJSON": "",
//       "address": "Dhaka",
//       "thana": "Avaynagar",
//       "postCode": "007",
//       "country": {
//         "selected": {
//           "CountryID": 1,
//           "CountryName": "Bangladesh",
//           "CountryShortName": "Ban"
//         }
//       },
//       "state": {
//         "selected": {
//           "StateID": 1,
//           "StateName": "Dhaka",
//           "StateShortName": "DK",
//           "Country": "Bangladesh"
//         }
//       },
//       "city": {
//         "selected": {
//           "CityID": 1,
//           "CityName": "Comilla",
//           "CityShortName": "COM",
//           "State": "Dhaka"
//         }
//       }
//     }
//   ],
//   [
//     {
//       "presentAddressJSON": "",
//       "address": "Dhaka",
//       "thana": "Nikunjo",
//       "postCode": "007",
//       "country": {
//         "selected": {
//           "CountryID": 1,
//           "CountryName": "Bangladesh",
//           "CountryShortName": "Ban"
//         }
//       },
//       "state": {
//         "selected": {
//           "StateID": 1,
//           "StateName": "Dhaka",
//           "StateShortName": "DK",
//           "Country": "Bangladesh"
//         }
//       },
//       "city": {
//         "selected": {
//           "CityID": 1,
//           "CityName": "Comilla",
//           "CityShortName": "COM",
//           "State": "Dhaka"
//         }
//       }
//     }
//   ],
//   [
//     {
//       "presentAddressJSON": "",
//       "address": "Dhaka",
//       "thana": "Nikunjo",
//       "postCode": "007",
//       "country": {
//         "selected": {
//           "CountryID": 1,
//           "CountryName": "Bangladesh",
//           "CountryShortName": "Ban"
//         }
//       },
//       "state": {
//         "selected": {
//           "StateID": 1,
//           "StateName": "Dhaka",
//           "StateShortName": "DK",
//           "Country": "Bangladesh"
//         }
//       },
//       "city": {
//         "selected": {
//           "CityID": 1,
//           "CityName": "Comilla",
//           "CityShortName": "COM",
//           "State": "Dhaka"
//         }
//       }
//     }
//   ]
// ];

// var margerd = [].concat.apply([], PreAddress);

// var address,thana,postCode,country,state,city,result; 

// function returnIndex(data){

//     result = [
//       {
//         "address" : [],
//         "thana":[],
//         "postCode":[],
//         "state":[],
//         "country":[],
//         "city":[]
//       }
//     ]
    
//     address = [];
//     thana = [];
//     postCode = [];
//     country = [];
//     state = [];
//     city = [];

//     for(i=0;i<data.length;i++){
//         result[0].address.push(data[i].address);
//         result[0].thana.push(data[i].thana);
//         result[0].postCode.push(data[i].postCode);
//         result[0].state.push(data[i].state.selected.StateID);
//         result[0].country.push(data[i].country.selected.CountryID);
//         result[0].city.push(data[i].city.selected.CityID);
//     }
// }

// returnIndex(margerd);
// console.log(margerd);


// var demo = [
//   { 
//     presentAddressJSON: '',
//     address: 'a',
//     thana: 'a',
//     postCode: 'a',
//     countyID: 1,
//     StateID: 1,
//     CityID: 1 
//   },
//   { 
//     presentAddressJSON: '',
//     address: 'b',
//     thana: 'b',
//     postCode: 'b',
//     countyID: 1,
//     StateID: 1,
//     CityID: 1 
//   }
// ];


// var masterUser = [  
//   {  
//      "UserID":11,
//      "UserNo":"11",
//      "UserTypeID":3,
//      "UserFirstName":"Md.",
//      "UserLastName":"Robin",
//      "UserFullName":"Md Robin",
//      "IsActive":true,
//      "NickName":"Robin",
//      "DOB":"2017-16-11",
//      "GenderID":"1",
//      "RelagionID":"1",
//      "Blood":"1",
//      "InstituteID":1,
//      "UserTypeName":"ass",
//      "ParCountryName":"",
//      "PreCountryName":"",
//      "ParStateName":"",
//      "PreStateName":"",
//      "ParCityName":"",
//      "PreCityName":"",
//      "ReligionName":"",
//      "InstituteName":"OnAir Pre School",
//      "EducationInfo":[  
//         {  
//            "Description":"good",
//            "GPA":"4.12",
//            "GradeID":3,
//            "BoardID":1,
//            "Session":"1",
//            "YearPass":2016,
//            "EducationDuration":4.00,
//            "Institute":"onload"
//         }
//      ],
//      "AddressInfo":[  
//         {  
//            "UserAddressID":0,
//            "AddressTypeID":1,
//            "Address":"Jessore",
//            "CityID":1,
//            "StateID":1,
//            "AddressType":"Parmanent"
//         }
//      ],
//      "FamilyInfo":[  
//         {  
//            "FamilyID":1,
//            "RelationID":3,
//            "Relation":"Mother",
//            "IsLocalGuardian":true,
//            "GuardianID":129,
//            "GurdianName":"Kabir Molla"
//         }
//      ]
//   }
// ]
