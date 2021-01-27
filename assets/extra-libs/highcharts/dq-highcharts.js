            //-------------------1--------------------------
            // Highcharts
            function pieOne(thename,subtitle,compliant_facility_count,non_compliant_facility_count,compliant_facilities_codes,non_compliant_facilities_codes){
                Highcharts.chart('pc1', {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    exporting: {
                        buttons: {
                            contextButton: {
                                menuItems: ['downloadPNG', 'downloadSVG', 'separator', 'label'],
                                symbol: null,
                                text: "Export"
                            }
                        }
                    },
                    title: {
                        text: thename
                    },
                    subtitle: {
                        text: subtitle
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            
                            allowPointSelect: true,
                            colors: ['#7bd48d','#ffc7ce'],
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true
                            },
                            showInLegend: true
                        }
                    },
                    series: [{
                        name: 'Percentage',
                        colorByPoint: true,
                        valueDecimals: 2,
                        data: [{
                            name: `Opening SOH = Closing SOH previous month  (${compliant_facilities_codes.length}, ${Highcharts.numberFormat((compliant_facility_count/(compliant_facility_count+non_compliant_facility_count)*100),0)}%)`,
                            y: compliant_facility_count     
                        }, {
                            name: `Opening SOH ≠ Closing SOH previous month  (${non_compliant_facilities_codes.length}, ${Highcharts.numberFormat((non_compliant_facility_count/(compliant_facility_count+non_compliant_facility_count)*100),0)}%)`,
                            y: non_compliant_facility_count
                        }]
                    }]
                });
            };
            //-------------------end 1--------------------------


            //-------------------3--------------------------
            function pieThree(title,subtitle,disc,nodisc,disc_facilities_codes,nodisc_facilities_codes){
                Highcharts.chart('pc3', {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: subtitle
                    },
                    subtitle: {
                        text: title
                    },
                    exporting: {
                        buttons: {
                            contextButton: {
                                menuItems: ['downloadPNG', 'downloadSVG', 'separator', 'label'],
                                symbol: null,
                                text: "Export"
                            }
                        }
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            colors: ['#ffc7ce', '#7bd48d'],
                            dataLabels: {
                                enabled: true
                            },
                            showInLegend: true
                        }
                    },
                    legend: {
                        align: 'center'
                    },
                    series: [{
                        name: 'Consistency',
                        colorByPoint: true,
                        valueDecimals: 2,
                        data: [{
                            name: `Discrepancy (${disc_facilities_codes.length}, ${Highcharts.numberFormat((disc/(disc+nodisc)*100),0)}%)`,
                            y: disc,
                            sliced: true,
                            selected: true
                        }, {
                            name: `No discrepancy (${nodisc_facilities_codes.length}, ${Highcharts.numberFormat((nodisc/(disc+nodisc)*100),0)}%)`,
                            y: nodisc
                        }]
                    }]
                });
            };
            //-------------------end 3--------------------------


            //-------------------column--------------------------
            function columnOne(per_arr,pop_title,totadj_title,totdisp_title,pop_arr,totadj_arr,totdisp_arr){
                Highcharts.chart('dq-column', {
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'Comparison of # patients vs. doses dispensed'
                    },
                    subtitle: {
                        text: null
                    },
                    exporting: {
                        buttons: {
                            contextButton: {
                                menuItems: ['downloadPNG', 'downloadSVG', 'separator', 'label']
                            }
                        }
                    },
                    xAxis: {
                        categories: per_arr,
                        title: {
                            text: 'Period'
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            // text: 'Population',
                            text: 'Number (#)',
                            align: 'middle'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    tooltip: {
                        // valueSuffix: ' millions'
                        valueSuffix: ' '
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    legend: {
                        borderWidth: 1,
                        // backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        // name: pop_title,
                        name: '# Patients',
                        data: pop_arr,
                        color: '#9bbb59'
                    }, {
                        // name: totdisp_title,
                        name: '# Doses dispensed',
                        data: totdisp_arr,
                        color: '#c0504d'
                    }, {
                        // name: totadj_title,
                        name: '# Adj. doses',
                        data: totadj_arr,
                        color: '#4f81bd'
                    }]
                });
            };
            //-------------------end column--------------------------

            function lineOne(wbdataset){
                var perd = wbdataset[0];
                var reported = wbdataset[1];
                var didNotReport = wbdataset[2];
                Highcharts.chart('wbdata', {

                    title: {
                        text: 'Reporting health facilities that had weight band data in DHIS'
                    },
            
                    subtitle: {
                        text: ''
                    },
            
                    yAxis: {
                        title: {
                            text: 'Facilities'
                        }
                    },
                    xAxis:{
                      title: {
                        text: 'period'
                      },
                      categories: perd
                    },
                    exporting: {
                        buttons: {
                            contextButton: {
                                menuItems: ['downloadPNG', 'downloadSVG', 'separator', 'label']
                            }
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle'
                    },
            
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        },
                        series: {
                            label: {
                                connectorAllowed: false
                            }
                        }
                    },
                    series: [{
                        name: 'Yes',
                        data: reported,
                        color: '#7bd48d'
                    }, {
                        name: 'No',
                        data: didNotReport,
                        color: '#ff0000'
                    }],
            
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    layout: 'horizontal',
                                    align: 'center',
                                    verticalAlign: 'bottom'
                                }
                            }
                        }]
                    }
            
                });
            
            };
            // end Highcharts
        
