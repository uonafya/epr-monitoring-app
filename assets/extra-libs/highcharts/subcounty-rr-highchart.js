function fetchScRR(scurl, myou){
    $('.rrates.loader-sp').removeClass('hidden');
    $('.rrstate').addClass('hidden');
    $('.loader-sp').removeClass('hidden');
    $('#sc_rrchart').addClass('hidden');
    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: scurl,
        success: function (data) {
            $('.rrates.loader-sp').addClass('hidden');
            $('.rrstate').addClass('hidden');
            var scjson = data;
            
            countiesdata=scjson.rows;

            var thecounties = [];
            var therate = [];
            $.each(countiesdata, function (index, acounty) {
                thecounties.push(data.metaData.items[acounty[2]].name);
                therate.push(parseFloat(acounty[3]));
            });

            console.log('kenyaa1', myou)

            if (myou == 'HfVjCurKxh2'){
                $('#sc_rrchart').addClass('hidden');

            }else
            {
                $('#sc_rrchart').removeClass('hidden');
            }

            $('#sub_rrchart').empty();
            $('#sub_rrchart #thesubchart').remove();
            $('#sub_rrchart').append('<div id="thesubchart" style="min-width: 290px; max-width: 100vw; height: 500px; margin: 0 auto;"></div>');
            // Highcharts
            // Highcharts.chart('thesubchart', {
            //     data: {
            //         table: 'datatable'
            //     },
            //     chart: {
            //         type: 'bar'
            //     },
            //     title: {
            //         text: 'Latest reporting rate by Sub-County (MCF)'
            //     },
            //     yAxis: {
            //         allowDecimals: false,
            //         title: {
            //             text: 'Units'
            //         }
            //     },
            //     tooltip: {
            //         formatter: function () {
            //             return '<b>' + this.series.name + '</b><br/>' +
            //                 this.point.y + ' ' + this.point.name.toLowerCase();
            //         }
            //     }
            // });


            
            Highcharts.chart('thesubchart', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Latest Reporting Rate by Sub-County (MCF) for '
                },
                subtitle: {
                    text: data.metaData.items[data.metaData.dimensions.pe[0]].name
                },
                exporting: {
                    enabled: false
                },
                xAxis: {
                    categories: thecounties,
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    min: 0,
                    max: 100,
                    title: {
                        text: 'Reporting Rate (%)',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: ' millions'
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Sub-County RR',
                    data: therate
                }]
            });
            // end Highcharts
            // $('.rrates.loader-sp').addClass('hidden');
            // $('#sc_rrchart').removeClass('hidden');
        },
        error: function (request, status, error) {
            $('.rrates.loader-sp').addClass('hidden');
            $('#sc_rrchart').addClass('hidden');
            $('.rrates.loader-sp').addClass('hidden');
            $('.rrstate').removeClass('hidden');
            console.log('Subcounty-RRates: error fetching json. :- '+error);
            $('#sc_rrchart').html('<div class ="alert alert-danger"><strong>Graph Error</strong><br/>Failed to load this graph. Please <a href="#" class="btn btn-xs btn-primary btn-rounded" onclick="window.location.reload(true)">refresh</a> this page to retry</div>');
            $('.rrstate').html('<div class ="alert alert-danger"><strong>Graph Error</strong><br/>Failed to load this graph. Please <a href="#" class="btn btn-xs btn-primary btn-rounded" onclick="window.location.reload(true)">refresh</a> this page to retry</div>');
        }
    });
}


function filterItems(array,query) {
    return array.filter(function(el) {
        return el.indexOf(query) > -1;
    })
}