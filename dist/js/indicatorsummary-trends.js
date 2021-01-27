function getTrends(the_url, ounit) {
    console.log("the_url: "+the_url);
    var subtitle = '';

    $.getJSON("https://hiskenya.org/api/26/organisationUnits/"+ounit+".json?fields=name", function (data2) 
    {
            subtitle = data2.name + " &";
            console.log('subtitle: '+subtitle);
        }
    );
    
    $('.isstate').addClass('hidden');
    $('#period-dropdownTo').attr('disabled', true);
    $('.loader-sp.is-sub').removeClass('hidden');
    $('.indi-trends').addClass('hidden');
    $.ajax({
        type: "GET",
        url: the_url,
        crossDomain: true,
        success: function (data) {
            $('.isstate').addClass('hidden');
            $('.loader-sp.is-sub').addClass('hidden');
            $('.indi-trends').removeClass('hidden');
            

            
            var commo_name = '';
            var thedata = [];
            var the_periods = [];
            var the_ou = data.metaData.items[data.metaData.dimensions.ou[0]].name;
            $.each(data.metaData.dimensions.dx, function (indx, one_dx) {
                commo_name = data.metaData.items[one_dx].name;
                var overstock_arr = {};
                overstock_arr['name'] = 'Overstocked';
                overstock_arr['data'] = [];
                var stockok_arr = {};
                stockok_arr['name'] = 'Stocked according to plan';
                stockok_arr['data'] = [];
                var understock_arr = {};
                understock_arr['name'] = 'Understocked';
                understock_arr['data'] = [];
                var stockout_arr = {};
                stockout_arr['name'] = 'Out of stock';
                stockout_arr['data'] = [];
                if(data.metaData.dimensions.pe.length > 1){
                    subtitle += " Period from: " + data.metaData.items[data.metaData.dimensions.pe[0]].name + " to: " + data.metaData.items[data.metaData.dimensions.pe[data.metaData.dimensions.pe.length - 1]].name;
                }else{
                    subtitle += " Period: " + data.metaData.items[data.metaData.dimensions.pe[0]].name;
                }
                $.each(data.metaData.dimensions.pe, function (indx2, one_pe) {
                    var overstock = 0;
                    var stockok = 0;
                    var understock = 0;
                    var stockout = 0;
                    the_periods.push(data.metaData.items[one_pe].name);

                    var rows_filteredby_period = filterItems(data.rows,one_pe);
                    var rows_filteredby_dx_period = filterItems(rows_filteredby_period,one_dx);
                    

                    $.each(rows_filteredby_dx_period, function (indx3, one_row) {
                        var row_val = one_row[3];
                        if(row_val<=0){
                            stockout++;
                        }
                        if(row_val>6){
                            overstock++;
                        }
                        if(row_val>=3 && row_val<=6){
                            stockok++;
                        }
                        if(row_val>0 && row_val<3){
                            understock++;
                        }
                    });
                    overstock_arr['data'].push(overstock);
                    overstock_arr['color'] = ('#1aa3aa');
                    stockok_arr['data'].push(stockok);
                    stockok_arr['color'] = ('#009900');
                    understock_arr['data'].push(understock);
                    understock_arr['color'] = ('#f4bd3b');
                    stockout_arr['data'].push(stockout);
                    stockout_arr['color'] = ('#ff2222');
                });
                thedata.push(overstock_arr);
                thedata.push(stockok_arr);
                thedata.push(understock_arr);
                thedata.push(stockout_arr);
            });
            
    
            // HighCharts
            Highcharts.chart('indi-trends', {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Commodity: '+commo_name 
                },
                subtitle: {
                    // text: the_ou
                    text: subtitle
                },
                xAxis: {
                    categories: the_periods
                },
                yAxis: {
                    title: {
                        text: 'Number of Facilities'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    },
                    series: {
                        colors: [ '#ffc7ce', '#7bd48d', '#ffeb9c', '#ff0000']
                    }
                },
                series: thedata
            });
            // HighCharts
        },
        error: function (request, status, error) {
            $('.loader-sp.is-sub').addClass('hidden');
            $('.indi-trends').addClass('hidden');
            $('.isstate').addClass('hidden');
            console.log('IS: error fetching json. :- '+error);
            $('.isstate').html('<div class ="alert alert-danger"><strong>'+request.responseJSON.httpStatusCode+': '+request.responseJSON.message+'</strong><br/>Failed to load this data. Please <a href="#" class="btn btn-xs btn-primary btn-rounded" onclick="window.location.reload(true)">refresh</a> this page to retry</div>');
        }
    });
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