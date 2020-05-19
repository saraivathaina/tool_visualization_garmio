function make_grid(footprint,LayerAdd_Cells,Colors_Signal_dict){
    var Signal=footprint.responseJSON['Matrix']        

    var latitude_Start=footprint.responseJSON['NwPoint']['Latitude']
    var longitude_Start=footprint.responseJSON['NwPoint']['Longitude']


    var LatDelta=footprint.responseJSON['LatDelta']
    var LonDelta=footprint.responseJSON['LonDelta']

    var maxBin_Lng=footprint.responseJSON['Col']
    var maxBin_Lat=footprint.responseJSON['Row']       

    //Make Columns

    function make_columns(latitude_Start,longitude_Start,LatDelta,LonDelta){   
        var features_Col=[]
        var nextLng=longitude_Start+LonDelta       
        
        features_Col.push(L.latLng([latitude_Start,longitude_Start]))  
        features_Col.push(L.latLng([latitude_Start,nextLng]))           

        for(i=2;i<maxBin_Lng; i++){
            var nextLng=nextLng+LonDelta            
            var pointCol = L.latLng([latitude_Start,nextLng])
            features_Col.push(pointCol)
        }        
        
        
        return features_Col
    }         
    var features_Row = [];
    //maxBin_Lat
    for(let i = 0; i < 100; ++i){            
        features_Row[features_Row.length] = make_columns(latitude_Start+i*LatDelta,longitude_Start,LatDelta,LonDelta);        
    }


    //Colors_Signal_dict[feature.properties.pci] || '#D0D0D0'
    function setStyle_Rectangle(signal) {
        return {            
        fillColor: Colors_Signal_dict[signal] || 'none',
        color:Colors_Signal_dict[signal] || 'none',            
        weight: 0,           
        opacity: 1,
        fillOpacity: 0.8
        }
        }

        
    //console.log(features_Row[0][0])
    for(var i=0; i<features_Row.length;i++){
                //console.log(features_Col[i])
            for(var j=0;j<maxBin_Lng;j++)    {
                Center_bin=features_Row[i][j]                    
                var corner1= L.latLng([Center_bin.lat-LatDelta/2,Center_bin.lng+LonDelta/2])                
                var corner2= L.latLng([Center_bin.lat+LatDelta/2,Center_bin.lng-LonDelta/2])                       
                var corners = L.latLngBounds(corner1, corner2)
                var mymarker=L.rectangle(corners, setStyle_Rectangle(Math.abs(Math.round(Signal[i][j]))))
                var mypopup=L.popup().setContent("point n.: "+i +',' + j +" latlng: "+Center_bin + "Signal: " + Math.round(Signal[i][j]))
                mymarker.addTo(LayerAdd_Cells)                    
                mymarker.bindPopup(mypopup)
            }
        }
}