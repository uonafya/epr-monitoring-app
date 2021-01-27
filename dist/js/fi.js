var arr_valz = [];
var valid_ous_array = [];
var valid_url = 'https://hiskenya.org/api/dataSets.json?fields=id,name,organisationUnits[id,name,code,level]&filter=id:ilike:JPaviRmSsJW&paging=false';
// var valid_url = 'https://json.link/3AHToDxczD.json';
getValidOUs(valid_url);

function getValidOUs(valid_url) {
    $.getJSON(valid_url, function (data){
        valid_ous_array = data.dataSets[0].organisationUnits;
        $.each(valid_ous_array, function (idx, ov_ou) {
            arr_valz.push(valid_ous_array[idx].id);
        })
    });
}

function checkOUs(ouid){
    if(valid_ous_array = null){
        getValidOUs(valid_url);
    }
    // console.log("Klk: "+JSON.stringify(arr_valz));
    if($.inArray(ouid, arr_valz) < 0){
        return false;
    }else{
        return true;
    }
}


//function toprocess the FI url
function fetchFIs(fiurl,orgu,peri)
{
    // console.log('fiurl: '+fiurl);
    $('#fi_table').addClass('hidden');
    $('.fidata').addClass('hidden');
    $('.loader-sp').removeClass('hidden');
    sleep(3000);
            // $.getJSON(fiurl, function (data){
            $.ajax({
                type: 'GET',
                crossDomain: true,
                url: fiurl,                    
                success: function (data) {
					
                    //create the org units array
                    var orgunits = [];
                    var dxids = [];

                    //var tableData = '<table>';
                    var tableData = '';

                    

                    //push only if not in
                    $.each(data.rows, function (rowkey, rowentry) {
                        if(orgunits.indexOf(rowentry[2])>=0) {
                        } else {
                            orgunits.push(rowentry[2]);
                        }
                    })
                    // console.log("orgunits = ", orgunits)

                    var facility_count  = 0;
                    //console.log(orgunits.length);
                    $.each(data.metaData.dimensions.ou, function (key, o_ou) {
                        if(checkOUs(o_ou)){
                            // console.log(`ou ==> $`);
                            facility_count+=1;
                            //define the table
                            tableData += '<tr>';	
                            tableData += '<td>'+data.metaData.items[o_ou].name+'</td>';
                            tableData += '<td>'+getMFLcode(o_ou)+'</td>';
							

                            //get all the dimensions for the given orgunit
                            dxids = [];
                            $.each(data.rows, function (rkey, o_row) {
                                var dxcode = o_row[0];
                                if(dxcode==o_ou) {
                                    dxids.push(o_row[0]);
                                }												
                            })
                            var al6_val = 0
                            var al12_val = 0
                            var al18_val = 0
                            var al24_val = 0
                            var as_val = 0
                            var sp_val = 0
                            var rdt_val = 0
                            let data_filteredby_ou = data.rows.filter( dou=>dou[1]==o_ou )
                            // console.log("data_filteredby_ou = ", data_filteredby_ou)
                            let al6_data = data_filteredby_ou.filter( a6 => a6[0]== data.metaData.dimensions.dx[0])
                            if(al6_data.length > 0){
                                al6_val = al6_data[0][2]
                            }
                            let al12_data = data_filteredby_ou.filter( al12 => al12[0]== data.metaData.dimensions.dx[1])
                            if(al12_data.length > 0){
                                al12_val = al12_data[0][2]
                            }
                            let al18_data = data_filteredby_ou.filter( al18 => al18[0]== data.metaData.dimensions.dx[2])
                            if(al18_data.length > 0){
                                al18_val = al18_data[0][2]
                            }
                            let al24_data = data_filteredby_ou.filter( al24 => al24[0]== data.metaData.dimensions.dx[3])
                            if(al24_data.length > 0){
                                al24_val = al24_data[0][2]
                            }
                            let as_data = data_filteredby_ou.filter( as => as[0] == data.metaData.dimensions.dx[4])
                            if(as_data.length > 0){
                                as_val = as_data[0][2]
                            }
                            let sp_data = data_filteredby_ou.filter( sp => sp[0] == data.metaData.dimensions.dx[5])
                            if(sp_data.length > 0){
                                sp_val = sp_data[0][2]
                            }
                            let rdt_data = data_filteredby_ou.filter( rdt => rdt[0] == data.metaData.dimensions.dx[6])
                            if(rdt_data.length > 0){
                                rdt_val = rdt_data[0][2]
                            }
                            
                            tableData += `
                            <td class="text-right">${al6_val}</td>
                            <td class="text-right">${al12_val}</td>
                            <td class="text-right">${al18_val}</td>
                            <td class="text-right">${al24_val}</td>
                            <td class="text-right">${as_val}</td>
                            <td class="text-right">${sp_val}</td>
                            <td class="text-right">${rdt_val}</td>
                            `			
                            tableData += '</tr>';	
                        }
                    })

                    $('#thetitle').html('Facility Issues <br/> in '+facility_count+' facilities');
                    //tableData += '<table>';	
                    //console.log(tableData)
                    $('#fi_table').removeClass('hidden');
                    $('.fidata').removeClass('hidden');
                    $('.fi_status').addClass('hidden');
                    $('.loader-sp').addClass('hidden');
                    // $('.loader-sp').css('display','none');
                    
                    $('#fi_table').DataTable().destroy();
                    $("table.fibox tbody").empty();
                    $("table.fibox tbody").append(tableData);	
                    //$('#fi_table').DataTable();                                                          
                    $('#fi_table').DataTable({
                        dom: 'Bfrtlip',
                        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
						order: [[6, 'desc']],
                        buttons: [
                            'copy', 'csv', 'excel', 'pdf', 'print', 'pageLength'
                        ],
                        initComplete: function () {
                            $(this.api().column(1).nodes()).css({ "background-color": "white" });
                            $(this.api().column(3).nodes()).css({ "background-color": "white" });
                            $(this.api().column(4).nodes()).css({ "background-color": "white" });
                            $(this.api().column(5).nodes()).css({ "background-color": "white" });
                        }
                    });

                    // title fill
                        var url = 'https://hiskenya.org/api/organisationUnits/'+orgu+'.json?fields=id,name';
                        $.ajax({      
                            dataType: "json",
                            url: url,
                            success: function(datax) {          
                                $("#ttitle").html(datax['name']+' - '+data.metaData.items[data.metaData.dimensions.pe[0]].name);
                            }
                        });    
                    // END title fill
                },

                    
                error: function (request, status, error) {
                    $('.loader-sp').addClass('hidden');
                    // $('#fi_table').addClass('hidden');
                    console.log('FIs: error fetching json. :- '+error);
                    // $('.fidata').addClass('hidden');
                    $('.fi_status').removeClass('hidden');
                    $('.fi_status').html('<div class ="alert alert-danger"><strong>'+request.responseJSON.httpStatusCode+': '+request.responseJSON.message+'</strong><br/>Failed to load this data. Please <a href="#" class="btn btn-xs btn-primary btn-rounded" onclick="window.location.reload(true)">refresh</a> this page to retry</div>');
                }
            });
    }





     // fetch mfl codes

     var mfl_codes_array = [];
     mfl_url = 'https://hiskenya.org/api/organisationUnits.json?fields=id,code&paging=false';
    //  mfl_url = 'https://json.link/Gr6ECImaDf.json';
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
         var mfl_id
         if(arr_filterd_by_dhis_code.length<1){
            mfl_id = 'Not Available';
            }else{
            mfl_id = arr_filterd_by_dhis_code[0].code;
         }
         return mfl_id;
     
 }
 // filter by mfl codes

 
//sleep function
function sleep(milliseconds) 
{
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
				if ((new Date().getTime() - start) > milliseconds) {
						break;
				}
		}
}