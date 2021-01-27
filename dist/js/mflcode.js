// fetch mfl codes
console.log("--------Preloaded MFLcode script---------")
var mfl_codes_array = [];
mfl_url = 'https://hiskenya.org/api/organisationUnits.json?fields=id,code&paging=false';
//  mfl_url = 'https://json.link/mGdKac1zJw.json';
getMFLarray(mfl_url);

function getMFLarray(mfl_url) {
	$.getJSON(mfl_url, function (data) 
	{
		mfl_codes_array = data.organisationUnits;
		// console.log('mfl_codes_array: '+mfl_codes_array);
	});
}

//---------- fetch mfl codes
// filter by mfl codes
function getMFLcode(dhis_id) {
if(mfl_codes_array == null){
	getMFLarray(mfl_url);
}
	// var ous = data.organisationUnits;
	var ous = mfl_codes_array;
	var arr_filterd_by_dhis_code = $.grep(ous, function(v) {
		return v.id === dhis_id;
	});
	if(arr_filterd_by_dhis_code.length<1){
		mfl_id = 'Not Available';
		}else{
		mfl_id = arr_filterd_by_dhis_code[0].code;
	}
	return mfl_id;

}
// filter by mfl codes