function fetchMosbycombox(url) {
    // console.log("TRIGGERED: fetchMosbycombox(url) == "+url);
    
    $('.loader-sp.t_four').removeClass('hidden');
    $('.col-md-12.t_four').addClass('hidden');
    $('#mosbycombox').addClass('hidden');
    $('.t_four_state').addClass('hidden');
    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: url,                    
        success: function (data) {
            
        //create the org units array
        var orgunits = [];
        var dxids = [];
        var mosVals = new Array();		
		                    
        //apply the labeling to the data
        var theperiod = data.metaData.dimensions.pe[0];
        var theorgunit = data.metaData.dimensions.ou[0];

        //console.log('richard',theorgunit)
				
		//min max plot lines
		var minval = 9;
        var maxval = 18; 
        var yaxismax = 24;
        var yaxismin = 0;

		if(theorgunit!='HfVjCurKxh2')
		{
			var minval = 3;
            var maxval = 6;
            var yaxismax = 10;
            var yaxismin = 0;

		}
        
        var curorg = data.metaData.items[theorgunit].name;
        var curpe = data.metaData.items[theperiod].name;
        
        $("h4.titlelabel").html(curorg+' - '+curpe);
        
        var tableData = '';
        							
        $.each(data.metaData.dimensions.dx, function (key, entry) 
        {	
			var rowFound = 0;
            $.each(data.rows, function (rkey, rentry) 
            {		
                var dxcode = rentry[0];
                if(dxcode==entry)
                {
					rowFound = 1;
                    mosVals.push(parseFloat(rentry[3]));
                }									
            })
			//if not found set the value to zero
			if(rowFound==0)
			{
				mosVals.push(0);
			}
        })	

        Highcharts.chart('mosbycombox', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'MOS By Commodity'
            },
            subtitle: {
                text: 'Source: HIS Kenya'
            },
            exporting: {
                enabled: true
            },
            xAxis: {						
                categories: ['AL6', 'AL12', 'AL18', 'AL24', 'AL all', 'AS inj','SP tabs', 'RDTs'],
                title: {
                    text: 'Commodity'
                }
            },
            yAxis: {
                min: yaxismin,
                max: yaxismax,
                title: {
                    text: 'Months of Stock',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                },
                plotLines: [{
                    color: '#FF0000',
                    width: 2,
                    value: minval,
                    label: {
                        text: 'Min',
                        align: 'right'
                    }
                },
                {
                    color: '#00FF00',
                    width: 2,
                    value: maxval,
                    label: {
                        text: 'Max',
                        align: 'right'
                    }
                }]
            },
            tooltip: {
                valueSuffix: ' MOS'
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'MOS',
                data: mosVals
            }]
        });
        $('.t_four.loader-sp').addClass('hidden');
        $('#mosbycombox').removeClass('hidden');
        $('.col-md-12.t_four').removeClass('hidden');
        $('.t_four_state').addClass('hidden');
    },
    error: function (request, status, error) {
            $('.t_four_state').removeClass('hidden');
            $('.col-md-12.t_four').addClass('hidden');
            $('#mosbycombox').addClass('hidden');
            $('.loader-sp.t_four').addClass('hidden');
            console.log('MainDash: error fetching json. :- '+error);
            $('.t_four_state').html('<div class ="alert alert-danger"><strong>'+request.responseJSON.httpStatusCode+': '+request.responseJSON.message+'</strong><br/>Failed to load this data. Please <a href="#" class="btn btn-xs btn-primary btn-rounded" onclick="window.location.reload(true)">refresh</a> this page to retry</div>');
        }
    });
}

function fetchPercHealthFA(urlfa,itemnames,countyid,periodid){
    // console.log("TRIGGERED: fetchPercHealthFA(urlfa,itemnames) == "+urlfa+" && itemnames: "+itemnames);
    $('.loader-sp.t_one').removeClass('hidden');
    $('.t_one_state').removeClass('hidden');
    $('.percent_healthfa').addClass('hidden');
    $('.malaria_commodity_table.t_one').addClass('hidden');
    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: urlfa,                    
        success: function (data) {
        var orgunits = data.metaData.dimensions.ou;
        //console.log(orgunits.length);
        
        //added
        //get the total expected to report
        var totalorgs = getExpectedUnits(countyid,periodid);
                        
                        
        //var tableData = '<table>';
        var tableData = '';
        
        //console.log(data.rows);
        //loop through the org units
                    var countname = 0;
        $.each(data.metaData.dimensions.dx, function (key, entry) 
        {		
            //define the variables to hold the counter
            var overstock = 0;
            var stockok = 0;
            var understock = 0;
			var stockout = 0;
            
            //define the table
            tableData += '<tr>';
            tableData += '<td>'+itemnames[countname]+'</td>';							
            //console.log(data.metaData.items[entry].name);
            
            //for each dimension get the value
            $.each(data.rows, function (rkey, rentry) 
            {	
                var dxid = rentry[0];
                var mosval = parseFloat(rentry[2]);
                
                if(dxid==entry)
                {
                    //console.log(mosval);
                    if(mosval>6)
                    {
                        overstock++;
                    }
                    if(mosval>=3 && mosval<=6)
                    {
                        stockok++;
                    }
                    if(mosval>0 && mosval<3)
                    {
                        understock++;
                    }
					if(mosval<=0)
                    {
                        stockout++;
                    }
                }					
            })
                            countname++;
            
            
			nomos = totalorgs-(overstock+stockok+understock+stockout);
                            
            var overpercent = (overstock/totalorgs)*100;
            var okpercent = (stockok/totalorgs)*100;
            var underpercent = (understock/totalorgs)*100;
			var stockoutpercent = (stockout/totalorgs)*100;
			var nomospercent = (nomos/totalorgs)*100;
            
            tableData += '<td class="text-right" bgcolor="#ffeb9c">'+overstock+' ('+formatNumber(overpercent.toFixed(0))+'%)</td>';
            tableData += '<td class="text-right" bgcolor="#7bd48d">'+stockok+' ('+formatNumber(okpercent.toFixed(0))+'%)</td>';
            tableData += '<td class="text-right" bgcolor="#ffc7ce">'+understock+' ('+formatNumber(underpercent.toFixed(0))+'%)</td>';
			tableData += '<td class="text-right" bgcolor="#ff0000" style="color: #fff;">'+stockout+' ('+formatNumber(stockoutpercent.toFixed(0))+'%)</td>';
			tableData += '<td class="text-right">'+nomos+' ('+formatNumber(nomospercent.toFixed(0))+'%)</td>';
			tableData += '<td class="text-right">'+formatNumber(totalorgs)+'</td>';	
            tableData += '</tr>';	
        })

        //tableData += '<table>';	
        //console.log(tableData)			
        $("table.percent_healthfa").DataTable().destroy();	
        $("table.percent_healthfa tbody").empty();	
        $("table.percent_healthfa tbody").append(tableData);	
        $("table.percent_healthfa").DataTable({
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'
            ],
			order: []
        });	
        //$('#zero_config').DataTable();
        $('.t_one.loader-sp').addClass('hidden');
        $('.t_one_state').addClass('hidden');
        $('.malaria_commodity_table.t_one').removeClass('hidden');
        $('.percent_healthfa').removeClass('hidden');

            //to enable downloading the report table
            // downloadable('percent_healthfa');

    },
    error: function (request, status, error) {
            $('.loader-sp.t_one').addClass('hidden');
            $('.t_one').addClass('hidden');
            $('.t_one_state').removeClass('hidden');
            $('.percent_healthfa').addClass('hidden');
            $('malaria_commodity_table.t_one').addClass('hidden');
            console.log('MainDash: error fetching json. Request:- '+JSON.stringify(request));
            $('.t_one_state').html('<div class ="alert alert-danger"><strong>'+request.responseJSON.httpStatusCode+': '+request.responseJSON.message+'</strong><br/>Failed to load this data. Please <a href="#" class="btn btn-xs btn-primary btn-rounded" onclick="window.location.reload(true)">refresh</a> this page to retry</div>');
        }
    });
}

function fetchNumberHealthFA(urlfa,itemnames,countyid,periodid){
    // console.log("TRIGGERED: fetchNumberHealthFA(urlfa,itemnames) == "+urlfa+" && itemnames: "+itemnames);
    $('.t_two.loader-sp').removeClass('hidden');
    $('.t_two_state').addClass('hidden');
    $('.number_healthfa').addClass('hidden');
    $('.malaria_commodity_table.t_two').addClass('hidden');
    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: urlfa,                    
        success: function (data) {
            
        var orgunits = data.metaData.dimensions.ou;
        //console.log(orgunits.length);
        var totalfa = orgunits.length;
        //added
        //get the total expected to report
        var totalorgs = getExpectedUnits(countyid,periodid);
                        
        //var tableData = '<table>';
        var tableData = '';
        
        //console.log(data.rows);
        //loop through the org units
                    var countname = 0;
        $.each(data.metaData.dimensions.dx, function (key, entry) 
        {		
            //define the variables to hold the counter
            var overstock = 0;
            var stockok = 0;
            var understock = 0;
            var stockout = 0;
            var nomos = 0;				
            
            //define the table
            tableData += '<tr>';
            tableData += '<td>'+itemnames[countname]+'</td>';							
            //console.log(data.metaData.items[entry].name);
            
            //for each dimension get the value
            $.each(data.rows, function (rkey, rentry) 
            {	
                var dxid = rentry[0];
                var mosval = parseFloat(rentry[2]);
                
                if(dxid==entry)
                {
                    //console.log(mosval);
                    if(mosval>6)
                    {
                        overstock++;
                    }
                    if(mosval>=3 && mosval<=6)
                    {
                        stockok++;
                    }
                    if(mosval>0 && mosval<3)
                    {
                        understock++;
                    }
                    if(mosval<=0)
                    {
                        stockout++;
                    }						
                }					
            })	
            countname++;
            nomos = totalorgs-(overstock+stockok+understock+stockout);
            
            tableData += '<td class="text-right" bgcolor="#ffeb9c">'+formatNumber(overstock)+'</td>';
            tableData += '<td class="text-right" bgcolor="#7bd48d">'+formatNumber(stockok)+'</td>';
            tableData += '<td class="text-right" bgcolor="#ffc7ce">'+formatNumber(understock)+'</td>';
            tableData += '<td class="text-right" style="color: #ffffff;" bgcolor="#ff0000">'+formatNumber(stockout)+'</td>';	
            tableData += '<td class="text-right">'+formatNumber(nomos)+'</td>';	
            tableData += '<td class="text-right">'+formatNumber(totalorgs)+'</td>';					
            
            tableData += '</tr>';	
        })

        //tableData += '<table>';	
        //console.log(tableData)			
        $("table.number_healthfa").DataTable().destroy();	
        $("table.number_healthfa tbody").empty();	
        $("table.number_healthfa tbody").append(tableData);	
        $("table.number_healthfa").DataTable({
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'
            ],
        });	
        //$('#zero_config').DataTable();
        $('.t_two.loader-sp').addClass('hidden');
        $('.number_healthfa').removeClass('hidden');
        $('.malaria_commodity_table.t_two').removeClass('hidden');
        $('.t_two_state').addClass('hidden');

        // downloadable('number_healthfa');
    },
    error: function (request, status, error) {
            $('.loader-sp.t_two').addClass('hidden');
            $('.t_two_state').removeClass('hidden');
            $('.number_healthfa').addClass('hidden');
            $('.loader-sp.t_two').addClass('hidden');
            console.log('MainDash: error fetching json. :- '+error);
            $('.t_two_state').html('<div class ="alert alert-danger"><strong>'+request.responseJSON.httpStatusCode+': '+request.responseJSON.message+'</strong><br/>Failed to load this data. Please <a href="#" class="btn btn-xs btn-primary btn-rounded" onclick="window.location.reload(true)">refresh</a> this page to retry</div>');
        }
    });
}

function fetchAdjSOH(urlcon,alnames,countyid,periodid) {
    //console.log("TRIGGERED: fetchAdjSOH(urlcon) == "+urlcon);
    $('.t_three.loader-sp').removeClass('hidden');
    $('.malaria_commodity_table.t_three').addClass('hidden');
    $('.adjc_soh_mos').addClass('hidden');
    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: urlcon,
        success: function (data) {
            var tableData = '';
            var phycount = '';
            var adjc = '';
            var mos = '';
            var countercon = 0;
            var lizt = '';
            var thedx = data.metaData.dimensions.dx;
             
            var phy_count_arr = thedx.slice(8, 16);
            var phy_count_arr_vals = [];
            $.each(phy_count_arr, function (inx2, onePhy) { 
                var onePhy_val = getValue(data.rows, onePhy);
                if(onePhy_val == undefined || onePhy_val == null || onePhy_val == ''){
                    phy_count_arr_vals.push(0);
                }else{
                    phy_count_arr_vals.push(onePhy_val);
                }
            });
            // console.log('phy: '+phy_count_arr_vals);

            var adj_cons_arr = thedx.slice(16, 24);
            var adj_cons_arr_vals = [];
            $.each(adj_cons_arr, function (inx, oneAdj) { 
                var oneAdj_val = getValue(data.rows, oneAdj);
                if(oneAdj_val == undefined || oneAdj_val == null || oneAdj_val == ''){
                     adj_cons_arr_vals.push(0);
                }else{
                    adj_cons_arr_vals.push(oneAdj_val);
                }
            });
            // console.log('adj: '+adj_cons_arr_vals);
            
            var mos_arr = thedx.slice(0, 8);
            var mos_arr_vals = [];
            $.each(mos_arr, function (inx0, oneMOS) { 
                var oneMOS_val = getValue(data.rows, oneMOS);
                if(oneMOS_val == undefined || oneMOS_val == null || oneMOS_val == ''){
                    mos_arr_vals.push(0);
                }else{
                    mos_arr_vals.push(oneMOS_val);
                }
            });
            // console.log('mos: '+mos_arr_vals);
            
            
            
            $.each(adj_cons_arr, function (key, entry) {
                // console.log(key+')  DX: id='+entry+' & name='+data.metaData.items[entry].name);
                tableData += '<tr>';
                // tableData += '<td><small>'+data.metaData.items[entry].name+'</small></td>';
                tableData += '<td>'+alnames[countercon]+'</td>';

                //get the consumption value
                // adjc = getConsumption(data.rows,entry);
                adjc = adj_cons_arr_vals[key];
                

                // phycount = parseFloat(sohval[countercon]);
                phycount = phy_count_arr_vals[key]

                // mos = parseFloat(phycount/adjc);
                mos = mos_arr_vals[key];

                //set the bg color for the MOS
                var bgcolor = '#ffffff';
                var fcolor = '#222222';

                if(mos<=0)
                    bgcolor = '#ff0000';
                    fcolor = '#ffffff';
                if (mos > 0 && mos< 3)
                    bgcolor = '#ffc7ce';
                    var fcolor = '#222222';
                if (mos >= 3 && mos<= 6)
                    bgcolor = '#7bd48d';
                    var fcolor = '#222222';
                if(mos>6)
                    bgcolor = '#ffeb9c';
                    var fcolor = '#222222';

				//Remove the SOH and Adjc values for AL All
				if(countercon==4)
				{
					tableData += '<td class="text-right"></td>';
					tableData += '<td class="text-right"></td>';
				}
				else
				{
					tableData += '<td class="text-right">'+formatNumber(adjc.toFixed(0))+'</td>';
					tableData += '<td class="text-right">'+formatNumber(phycount.toFixed(0))+'</td>';
				}		
								
                tableData += '<td class="text-right" style="color: '+fcolor+' !important;" bgcolor="'+bgcolor+'">'+formatNumber(mos.toFixed(1))+'</td>';                            					

                tableData += '</tr>';
                
                //increment the counter
                countercon++;
            })

            
            //tableData += '<table>';	
            //console.log(tableData)			
            $("table.adjc_soh_mos").DataTable().destroy();
            $("table.adjc_soh_mos tbody").empty();	
            $("table.adjc_soh_mos tbody").append(tableData);	
            $("table.adjc_soh_mos").DataTable({
                dom: 'Brtip',
                "ordering": false,
                "paging": false,
                buttons: [
                    'copy', 'csv', 'excel', 'pdf', 'print'
                ],
            });	
            //$('#zero_config').DataTable();
            $('.t_three.loader-sp').addClass('hidden');
            $('.t_three_state ').addClass('hidden');
            $('.malaria_commodity_table.t_three').removeClass('hidden');
            $('table.adjc_soh_mos').removeClass('hidden');

            //to enable downloading the report table
            // downloadable('adjc_soh_mos');
        },
        error: function (request, status, error) {
                $('.loader-sp.t_three').addClass('hidden');
                $('.adjc_soh_mos').addClass('hidden');
                $('.t_three_state').removeClass('hidden');
                $('.loader-sp.t_three').addClass('hidden');
                console.log('MainDash: error fetching json. :- '+error);
                $('.t_three_state').html('<div class ="alert alert-danger"><strong>'+request.responseJSON.httpStatusCode+': '+request.responseJSON.message+'</strong><br/>Failed to load this data. Please <a href="#" class="btn btn-xs btn-primary btn-rounded" onclick="window.location.reload(true)">refresh</a> this page to retry</div>');
            }
        });
}


//additional
//function to get SOH value from loop
function getSOH(rows, entry) {
var mysoh = 0;
$.each(rows, function (rkey, rentry) {
		if (entry == rentry[0]) {
				mysoh = rentry[3];
		}
})
		return parseFloat(mysoh);
}

//get the adjusted consumption value
//function to get value from loop
function getConsumption(rows, entry) {
    var conval = 0;
    $.each(rows, function (rkey, rentry) {
        if (entry == rentry[0]) {
            conval = rentry[3];
        }
    })
    return parseFloat(conval);
}

function getValue(arrayy, searchTerm) {
    var the_val = 0;
    $.each(arrayy, function (indx, arrayItem) {
        if (searchTerm == arrayItem[0]) {
            the_val = parseFloat(arrayItem[3]);
        }
    });
    return parseFloat(the_val);
}


function filterItems(array,query) {
    return array.filter(function(el) {
        return el.indexOf(query) > -1;
    })
}

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