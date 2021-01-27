$(function() {
    "use strict";

    $(".preloader").fadeOut();
    // ============================================================== 
    // Theme options
    // ==============================================================     
    // ============================================================== 
    // sidebar-hover
    // ==============================================================

    $(".left-sidebar").hover(
        function() {
            $(".navbar-header").addClass("expand-logo");
        },
        function() {
            $(".navbar-header").removeClass("expand-logo");
        }
    );
    // this is for close icon when navigation open in mobile view
    $(".nav-toggler").on('click', function() {
        $("#main-wrapper").toggleClass("show-sidebar");
        $(".nav-toggler i").toggleClass("ti-menu");
    });
    $(".nav-lock").on('click', function() {
        $("body").toggleClass("lock-nav");
        $(".nav-lock i").toggleClass("mdi-toggle-switch-off");
        $("body, .page-wrapper").trigger("resize");
    });
    $(".search-box a, .search-box .app-search .srh-btn").on('click', function() {
        $(".app-search").toggle(200);
        $(".app-search input").focus();
    });

    // ============================================================== 
    // Right sidebar options
    // ==============================================================
    $(function() {
        $(".service-panel-toggle").on('click', function() {
            $(".customizer").toggleClass('show-service-panel');

        });
        $('.page-wrapper').on('click', function() {
            $(".customizer").removeClass('show-service-panel');
        });
    });
    // ============================================================== 
    // This is for the floating labels
    // ============================================================== 
    $('.floating-labels .form-control').on('focus blur', function(e) {
        $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
    }).trigger('blur');

    // ============================================================== 
    //tooltip
    // ============================================================== 
    $(function() {
        // $('[data-toggle="tooltip"]').tooltip()
    })
    // ============================================================== 
    //Popover
    // ============================================================== 
    $(function() {
        // $('[data-toggle="popover"]').popover()
    })

    // ============================================================== 
    // Perfact scrollbar
    // ============================================================== 
    // $('.message-center, .customizer-body, .scrollable').perfectScrollbar({
    //     wheelPropagation: !0
    // });

    /*var ps = new PerfectScrollbar('.message-body');
    var ps = new PerfectScrollbar('.notifications');
    var ps = new PerfectScrollbar('.scroll-sidebar');
    var ps = new PerfectScrollbar('.customizer-body');*/

    // ============================================================== 
    // Resize all elements
    // ============================================================== 
    $("body, .page-wrapper").trigger("resize");
    $(".page-wrapper").delay(20).show();
    // ============================================================== 
    // To do list
    // ============================================================== 
    $(".list-task li label").click(function() {
        $(this).toggleClass("task-done");
    });

    //****************************
    /* This is for the mini-sidebar if width is less then 1170*/
    //**************************** 
    var setsidebartype = function() {
        var width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width;
        if (width < 1170) {
            $("#main-wrapper").attr("data-sidebartype", "mini-sidebar");
        } else {
            $("#main-wrapper").attr("data-sidebartype", "full");
        }
    };
    $(window).ready(setsidebartype);
    $(window).on("resize", setsidebartype);
    //****************************
    /* This is for sidebartoggler*/
    //****************************
    $('.sidebartoggler').on("click", function() {
        $("#main-wrapper").toggleClass("mini-sidebar");
        if ($("#main-wrapper").hasClass("mini-sidebar")) {
            $(".sidebartoggler").prop("checked", !0);
            $("#main-wrapper").attr("data-sidebartype", "mini-sidebar");
        } else {
            $(".sidebartoggler").prop("checked", !1);
            $("#main-wrapper").attr("data-sidebartype", "full");
        }
    });
});


//---------------------------custom---------------------------//
var abbr_modal = '<div class="modal fade" id="abb_mdl"><div class="modal-dialog modal-lg" style="min-height: 450px; overflow-y: auto; max-height: 90vh; " ><div class="modal-content"><div class="modal-header pull-left"><h4 class="modal-title pull-left">Abbreviations</h4></div><div class="modal-body"><table class="table table-condensed table-bordered table-striped slimtable text-left" id="abbrev"><thead><tr><th>Abbreviation</th><th>Meaning</th></tr></thead><tbody><tr><td>AL (6,12,18,24)</td><td>Artemether-Lumefantrine tabs</td></tr><tr><td>AI</td><td>Artesunate Injection</td></tr><tr><td>SP</td><td>Sulphadoxine Pyrimethamine</td></tr><tr><td>RDT</td><td>Rapid Diagnostic Tests</td></tr><tr><td>PMI</td><td>President\'s Malaria Initiative</td></tr><tr><td>HCD</td><td>Health Commodities Dashboard</td></tr><tr><td>USAID</td><td>United States Agency for International Development</td></tr><tr><td>SS</td><td>Stock Status</td></tr><tr><td>RR</td><td>Reporting Rate</td></tr><tr><td>SCP</td><td>Supply Chain Performance</td></tr><tr><td>KEMSA</td><td>Kenya Medical Supplies Authority</td></tr><tr><td>NMCP</td><td>National Malaria Control Program</td></tr><tr><td>ACTs</td><td>Artemether-Lumefantrine Tabs</td></tr><tr><td>SOH</td><td>Stock on Hand</td></tr><tr><td>AS</td><td>Artesunate Injection</td></tr><tr><td>DQ</td><td>Data Quality</td></tr></tbody></table></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>';
$('footer.footer').prepend(abbr_modal);
$('.navbar-nav.float-right').prepend('<li class="nav-item search-box" style="margin-right: 14px;"><a class="btn btn-default bn-xs" data-toggle="modal" href="#abb_mdl">Abbreviations</a></li>');

$(document).ready(function () {
    $('.table#abbrev').DataTable({
        // searching: false,
        // info: false
    });
});



//get my ou
function getMyOU() {
    var myou = null;
    $.getJSON("https://hiskenya.org/api/me.json?paging=false", function (data, textStatus, jqXHR) {
        // $.getJSON("https://json.link/oXqJ2CQ4c1.json", function (data, textStatus, jqXHR) {
        var my_ous = data.organisationUnits;
        var my_dv_ous = data.dataViewOrganisationUnits;
        var my_ou_0 = my_ous[0].id;
        myou = my_ou_0;
        // return my_ou_0;
    });
    return myou;
};


function addTableExportoptions(tableid) {
    $(tableid).DataTable( {
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    } );
}
//get my ou
console.log("my_ou_0 is: "+getMyOU());

function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function downloadTable(tableid) {
    $('#'+tableid).DataTable( {
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    } );
}

$('#period-dropdown, input[name="period-dropdown"], input[name="period"]').attr('autocomplete', 'off');
$('#county-dropdown option[value='+myOU()+']').attr('selected', 'selected');


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
//---------------------------end custom---------------------------//
