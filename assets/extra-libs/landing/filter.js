function filterMain(countyid, subcountyid, periodid) {

        if (countyid == null) {
                // countyid = 'HfVjCurKxh2';
                countyid = myOU();
        }

        if (subcountyid != null) {
                countyid = subcountyid;
        }

        if (periodid != null) {
                periodid = periodid;
        } else {
                periodid = 'LAST_MONTH';
        }

        //load the mos by commodity
        // var url = 'https://testhis.uonbi.ac.ke/api/29/analytics.json?dimension=dx:zLR3PBVPgN5;bJILAolJsSJ;jtGNoWcdNcx;p2aNqT2HVyr;Y4O2r9a9QRQ;DUnK0MqACvs;goYRWZ7kJAA;R4VD8EvRxyN&dimension=ou:' + countyid + '&filter=pe:' + periodid + '&displayProperty=NAME&outputIdScheme=UID';
        var url = 'https://hiskenya.org/api/26/analytics.json?dimension=pe:'+periodid+'&dimension=dx:HfGVoCZAwtd;nK8sqMAeQHY;ZcngDQJKiEg;wOKbEd8Dbi3;lHPLS1G5CUc;SSARcWY2Ge1;AX1co0SXobM;UUNwkYQhYgX&dimension=ou:'+countyid+'&displayProperty=NAME&outputIdScheme=UID';
        fetchMosbycombox(url);



        //% of health facilities
        // var urlfa = 'https://testhis.uonbi.ac.ke/api/29/analytics.json?dimension=dx:zLR3PBVPgN5;bJILAolJsSJ;jtGNoWcdNcx;p2aNqT2HVyr;DUnK0MqACvs;goYRWZ7kJAA;R4VD8EvRxyN&dimension=ou:' + countyid + ';LEVEL-5&filter=pe:' + periodid + '&displayProperty=NAME&outputIdScheme=UID';
        var urlfa = 'https://hiskenya.org/api/26/analytics.json?dimension=dx:HfGVoCZAwtd;nK8sqMAeQHY;ZcngDQJKiEg;wOKbEd8Dbi3;SSARcWY2Ge1;AX1co0SXobM;UUNwkYQhYgX&dimension=ou:'+countyid+';LEVEL-5&filter=pe:'+periodid+'&displayProperty=NAME&outputIdScheme=UID';

        //define the name holder
        var itemnames = ["AL6", "AL12", "AL18", "AL24", "AS inj", "SP tabs", "RDTs"];

        //parse the data for mos percentage
        fetchPercHealthFA(urlfa,itemnames,countyid,periodid);

        //parse adjusted consumption and physical count
        //parse the data for mos number
        //fetchNumberHealthFA(urlfa,itemnames,countyid,periodid); //commented out after removing the dashboard table right bottom


        //adjc FA
        // var urlcon = 'https://testhis.uonbi.ac.ke/api/29/analytics.json?dimension=dx:Wg31yLDAehm;CK20eip3oTe;BiwM8SUgpJ1;KLoeF6isJCz;jwofVi31cHY;nvJsVaN8FOB;f5mBCkj0aSu;Vw7Yg5sKLkW&dimension=ou:' + countyid + '&filter=pe:' + periodid + '&displayProperty=NAME&outputIdScheme=UID';
        var urlcon = 'https://hiskenya.org/api/26/analytics.json?dimension=pe:'+periodid+'&dimension=dx:HfGVoCZAwtd;nK8sqMAeQHY;ZcngDQJKiEg;wOKbEd8Dbi3;lHPLS1G5CUc;SSARcWY2Ge1;AX1co0SXobM;UUNwkYQhYgX;BnGDrFwyQp9.rPAsF4cpNxm;c0MB4RmVjxk.rPAsF4cpNxm;qnZmg5tNSMy.rPAsF4cpNxm;gVp1KSFI69G.rPAsF4cpNxm;Mmy9MoUdbhZ;iOARK31NdLp.rPAsF4cpNxm;imheYfA1Kiw.rPAsF4cpNxm;cPlWFYbBacW.rPAsF4cpNxm;jfUzb86mBSP.miM6uIJ2cWx;HwvUHnslwbh.miM6uIJ2cWx;OLYLVMDHEj8.miM6uIJ2cWx;UJeKVZzAnfS.miM6uIJ2cWx;fiVSJyM5cDs;naztfZrbMtd.miM6uIJ2cWx;EtG9ozt2joA.miM6uIJ2cWx;Umi8ZsiqBHw.miM6uIJ2cWx&dimension=ou:'+countyid+'&displayProperty=NAME&outputIdScheme=UID';

        //physical count/SOH    
        // var urlphy = 'https://testhis.uonbi.ac.ke/api/29/analytics.json?dimension=dx:BnGDrFwyQp9.rPAsF4cpNxm;c0MB4RmVjxk.rPAsF4cpNxm;qnZmg5tNSMy.rPAsF4cpNxm;gVp1KSFI69G.rPAsF4cpNxm;MUxtqmB3VL6;iOARK31NdLp.rPAsF4cpNxm;imheYfA1Kiw.rPAsF4cpNxm;cPlWFYbBacW.rPAsF4cpNxm&dimension=ou:' + countyid + '&filter=pe:' + periodid + '&displayProperty=NAME&outputIdScheme=UID';
        var urlphy = 'https://hiskenya.org/api/26/analytics.json?dimension=dx:BnGDrFwyQp9.rPAsF4cpNxm;c0MB4RmVjxk.rPAsF4cpNxm;qnZmg5tNSMy.rPAsF4cpNxm;gVp1KSFI69G.rPAsF4cpNxm;Mmy9MoUdbhZ;iOARK31NdLp.rPAsF4cpNxm;imheYfA1Kiw.rPAsF4cpNxm;eFqDcjgvt39.ZxUQw1ay1cw&dimension=pe:'+periodid+'&filter=ou:'+countyid+'&displayProperty=NAME&outputIdScheme=UID';

        //get the physical count into an array
        var sohval = [];

        var alnames = ["AL6", "AL12", "AL18", "AL24", "AL all", "AS inj", "SP tabs", "RDTs"];

        $.getJSON(urlphy, function (data) {
                var counter = 0;
                $.each(data.metaData.dimensions.dx, function (key, entry) {
                        //console.log(entry);              
                        var valsoh = getSOH(data.rows, entry);
                        sohval.push(valsoh);
                        //increment the counter
                        counter++;
                })
        });

        //delay for a few seconds 3 seconds
        // sleep(3000);
        fetchAdjSOH(urlcon,alnames,countyid,periodid);
		
}


		