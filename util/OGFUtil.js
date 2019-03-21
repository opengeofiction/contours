function OGFUtil(){

var ogf = {
    config: {
        API_URL:        'https://opengeofiction.net/',
        TILES_URL:      'https://tile.opengeofiction.net',
        TILESERVER_URL: 'https://tile.opengeofiction.net',
        WIKI_URL:       '//wiki.opengeofiction.net/',
        NOMINATIM_URL:  'http://nominatim.opengeofiction.net:8080/',
        ROUTING_URL:    'http://route.opengeofiction.net:5000/',
        TERRITORY_URL:  '//tile.opengeofiction.net/wiki/index.php/OGF:Territory_administration?action=raw',
        OVERPASS_URL:   '//osm3s.opengeofiction.net/api/interpreter',
    },
    icons: { red: null, yellow: null, green: null, blue: null },
    linkText: {
        ogfCopy:     '&copy; <a href="//opengeofiction.net">OpenGeofiction</a> contributors',
        osmCopy:     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        cc_by_sa:    '(<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        cc_by_nc_sa: '(<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-NC-SA</a>)',
    },
};
ogf.baseMapsAvailable = {
    Standard: {
        ogf_shortcut: 'C',
        tileUrl: ogf.config.TILES_URL +'/osmcarto/{z}/{x}/{y}.png',
        maxZoom: 19,
        attribution: ogf.linkText.ogfCopy + ' ' + ogf.linkText.cc_by_nc_sa,
    },
    TopoMap: {
        ogf_shortcut: 'T',
        tileUrl: ogf.config.TILES_URL +'/topomap/{z}/{x}/{y}.png',
        maxZoom: 17,
        attribution: 'map data: ' + ogf.linkText.ogfCopy + ' ' + ogf.linkText.cc_by_nc_sa +
            ' | map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> ' + ogf.linkText.cc_by_sa,
    },
    Histor: {
        ogf_shortcut: 'H',
        tileUrl: ogf.config.TILES_URL +'/tiles-histor/{z}/{x}/{y}.png',
        maxZoom: 18,
        attribution: 'map data: ' + ogf.linkText.ogfCopy + ' ' + ogf.linkText.cc_by_nc_sa +
            ' | map style: &copy; <a href="//opengeofiction.net/user/histor">histor</a> - <a href="//wiki.opengeofiction.net/wiki/index.php/OGF:Histor-style">more info</a>',
    },
    Roantra: {
        ogf_shortcut: 'R',
        tileUrl: ogf.config.TILES_URL +'/planet/Roantra/{z}/{x}/{y}.png',
        maxZoom: 14,
        attribution: 'Copyright &copy; Thilo Stapff 2014',
    },
    OpenStreetMap: {
        ogf_shortcut: 'OSM',
        tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 19,
        attribution: ogf.linkText.osmCopy,
    },
    OpenTopoMap: {
        ogf_shortcut: 'OTM',
        tileUrl: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        maxZoom: 17,
        attribution: 'map data: ' + ogf.linkText.osmCopy + ', <a href="http://viewfinderpanoramas.org/">SRTM</a>' +
            ' | map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> ' + ogf.linkText.cc_by_sa,
    },
    None: {
        ogf_shortcut: 'N',
        tileUrl: '',
        maxZoom: 100,
    },
};


if( L ){
    for( var color in ogf.icons ){
        ogf.icons[color] = L.icon( {iconUrl: ogf.config.TILES_URL + 'util/marker-'+ color +'.png', iconAnchor: [12,41]} );
    }

    L.Control.InfoBox = L.Control.extend( {
        options: {
            position: 'bottomleft'
        },
//      initialize: function( options ){
//          // constructor
//      },
        onAdd: function( map ){
            var div = this.mainDiv = L.DomUtil.create( 'div', 'infobox-container' );
            div.style.backgroundColor = '#FFFFFF';
            div.style.padding = '5px 10px 5px 10px';
            div.innerHTML = this.options.text;
            return div;
        },
        onRemove: function( map ){
            // when removed
        },
        setContent: function( text ){
            this.mainDiv.innerHTML = text;
        },
    } );

    L.control.infoBox = function( id, options ){
        return new L.Control.InfoBox( id, options );
    }

    L.Control.FullScreen = L.Control.extend( {
        options: {
            position: 'topleft'
        },
        onAdd: function( map ){
            var self = this;
            var div = L.DomUtil.create( 'div', 'fullscreen-control leaflet-bar leaflet-control leaflet-control-custom' );
            div.style.backgroundColor = '#FFFFFF';
            div.style.width  = '30px';
            div.style.height = '30px';
            div.style.backgroundImage = 'url(' + self.options.iconUrl + ')';
            div.style.backgroundRepeat = 'no-repeat';
            div.style.backgroundPosition = 'center';
            div.addEventListener( 'click', function(evt){
                var mapElem = map.getContainer();
                var isInFullScreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
                if( ! isInFullScreen ){
                    if (mapElem.requestFullscreen) {
                        mapElem.requestFullscreen();
                    }else if( mapElem.mozRequestFullScreen ){
                        mapElem.mozRequestFullScreen();
                    }else if( mapElem.webkitRequestFullScreen) {
                        mapElem.webkitRequestFullScreen();
                    }else if( mapElem.msRequestFullscreen ){
                        mapElem.msRequestFullscreen();
                    }
                }else{
                    if( document.exitFullscreen ){
                        document.exitFullscreen();
                    }else if( document.mozCancelFullScreen ){
                        document.mozCancelFullScreen();
                    }else if( document.webkitExitFullscreen ){
                        document.webkitExitFullscreen();
                    }else if( document.msExitFullscreen ){
                        document.msExitFullscreen();
                    }
                }
            } );
//          div.innerHTML = this.options.text;
            return div;
        },
        iconUrl: '/util/if_fullscreen_326650.svg',
    } );

    L.control.fullScreen = function( id, options ){
        return new L.Control.FullScreen( id, options );
    }
}



//--------------------------------------------------------------------------------------------------


ogf.map = function( leafletMap, options ){
    var self = {
        _map:    leafletMap,
        _ogf:    true,
        _layers: {},
        _overlayData: {},
    };
//	if( leafletMap.attributionControl )  leafletMap.attributionControl.setPrefix( '' );

    var overlaysAvailable = {
        'Coastline Errors': './CoastlineErrors.js',
        'Territories':      './Territories.js',
    };
    var baseMapsEnabled = options.layers   || [ 'Standard', 'TopoMap', 'Histor' ];
    var overlaysEnabled = options.overlays || [];

    if( ! Array.isArray(baseMapsEnabled) )  baseMapsEnabled = baseMapsEnabled.split(/,/);
    if( ! Array.isArray(overlaysEnabled) )  overlaysEnabled = overlaysEnabled.split(/,/);

    var baseMapActive = options.layer || baseMapsEnabled[0];
    var baseMaps = {}, overlayMaps = (overlaysEnabled.length > 0)? {} : null, hOverlaysActive = {}, i, keyB, keyO;

    for( i = 0; i < baseMapsEnabled.length; ++i ){
        keyB = baseMapsEnabled[i];
        if( keyB.match(/^\+/) ){
            keyB = keyB.replace(/^\+/,'');
            baseMapActive = keyB;
        }
        var layerOpt = ogf.baseMapsAvailable[keyB];
        baseMaps[keyB] = self._layers[layerOpt.ogf_shortcut] = L.tileLayer( layerOpt.tileUrl, layerOpt );
    }

    for( i = 0; i < overlaysEnabled.length; ++i ){
        keyO = overlaysEnabled[i];
        if( keyO.match(/^\+/) ){
            keyO = keyO.replace(/^\+/,'');
            hOverlaysActive[keyO] = true;
        }
        overlayMaps[keyO] = L.layerGroup();
    }

    var overlayDefinitions = {};
    if( options.overlaydef ){
//      console.log( "options.overlaydef <" + options.overlaydef + ">" );  // _DEBUG_
        overlayDefinitions = (typeof options.overlaydef === 'string')? JSON.parse(options.overlaydef) : options.overlaydef;
//      console.log( "overlayDefinitions = " + JSON.stringify(overlayDefinitions,null,"  ") );  // _DEBUG_
    }

    var hControls = {};
    var onOverlayAdd = function( name, layer ){
        if( overlayDefinitions[name] ){
            if( overlayDefinitions[name]['function'] ){
                var func = ogf[overlayDefinitions[name]['function']];
                func( layer, overlayDefinitions[name].param );
            }else{
                var hObjects = {};
                ogf.loadOverlay( hObjects, 0, overlayDefinitions[name], function(hObjects){
                    hControls[name] = ogf.drawLayerObjects( hObjects, layer, self._map );
                    self._overlayData[name] = hObjects;
                } );
            }
        }
    };

    self._map.on( 'overlayadd', function(ev){
        onOverlayAdd( ev.name, ev.layer );
    } );
    self._map.on( 'overlayremove', function(ev){
        var name = ev.name, layer = ev.layer;
        layer.clearLayers();
        if( hControls[name] ){
            for( var i = 0; i < hControls[name].length; ++i ){
                hControls[name][i].remove();
            }
        }
    } );

    self._layerControl = L.control.layers( baseMaps, overlayMaps ).addTo( self._map );
    baseMaps[baseMapActive].addTo( self._map );

    for( keyO in hOverlaysActive ){
        overlayMaps[keyO].addTo( self._map );
//      onOverlayAdd( keyO, overlayMaps[keyO] );
    }

    return self;
};

ogf.addAttributionText = function( text ){
    for( var layer in ogf.baseMapsAvailable ){
        ogf.baseMapsAvailable[layer].attribution += text;
    }
}

ogf.clear = function( self ){
    if( self._layerControl )  self._map.removeControl( self._layerControl );
    self._map.eachLayer(function (layer) {
        self._map.removeLayer(layer);
    });
    self._map.off( 'overlayadd' );
    self._map.off( 'overlayremove' );
}

ogf.getApplyStruct = function( info, cb ){
//	console.log( "info = " + JSON.stringify(info,null,"  ") );  // _DEBUG_
	if( info.url ){
        ogf.runRequest( 'GET', info.url, '', function(data){
            var struct;
            try{
                struct = JSON.parse( data );
            }catch( err ){
                console.log( 'ERROR ' + info.url + ' ' + err.toString() );
                return;
            }
            cb( struct );
        } );
	}else{
        cb( info.apply );
	}
}

ogf.loadOverlay = function( hObjects, idx, loadInfo, cb ){
    var info = loadInfo[idx];

    ogf.getApplyStruct( info, function(struct){
        if( Array.isArray(struct) && info.key ){
            struct = ogf.mapArray( struct, info.key );
        }
        if( info.pick ){
            for( var k1 in struct ){
                var val = struct[k1][info.pick];
                struct[k1] = val;
            }
        }
        if( info.wrap ){
            for( var k1 in struct ){
                var elem = {};
                elem[info.wrap] = struct[k1];
                struct[k1] = elem;
            }
        }
        if( idx === 0 ){
            for( var k2 in struct ){
                hObjects[k2] = struct[k2];
            }
        }else{
            ogf.applyMap( hObjects, struct, info );
        }
        if( info.filter ){
            hObjects = ogf.valueFilter( hObjects, info.filter );
        }
        if( idx+1 < loadInfo.length ){
            ogf.loadOverlay( hObjects, idx+1, loadInfo, cb );
        }else{
            cb( hObjects );
        }
    } );
};

ogf.valueFilter = function( struct, filter ){
    var structNew = {};
    var func;
    if( typeof filter === 'string' ){
        func = function( obj ){
            return (filter in obj);
        };
    }else if( typeof filter === 'function' ){
        func = filter;
    }else{
        func = function( obj ){
            for( var key in filter ){
                if( Array.isArray(filter[key]) && Array.isArray(obj[key]) ){
                    var n = filter[key].length;
                    for( var i = 0; i < n; ++i ){
                        if( obj[key].indexOf(filter[key][i]) < 0 )  return false;
                    }
                }else{ 
                    if( obj[key] !== filter[key] )  return false;
                }
            }
            return true;
        };
    }
    for( var key in struct ){
        var val = struct[key];
        if( func(val) )  structNew[key] = val;
    }
    return structNew;
}

ogf.mapArray = function( array, key ){
    var struct = {};
    for( var i = 0; i < array.length; ++i ){
        var item = array[i];
        struct[item[key]] = item;
    }
    return struct;
};

ogf.applyMap = function( hObjects, hMap, info ){
	var key, keyA, keyS, obj;
	if( info.apply && ! info.select ){
        for( key in hObjects ){
            obj = hObjects[key];
            for( keyA in info.apply ){
                obj[keyA] = info.apply[keyA];
            }
        }
        return;
	}

    var select = info.select || '';
    if( ! Array.isArray(select) )  select = [ select ];

    for( var i = 0; i < select.length; ++i ){
        var sel = select[i];
        for( key in hObjects ){
            obj = hObjects[key];
            var mapKey = sel ? obj[sel] : key;
            if( ! Array.isArray(mapKey) )  mapKey = [ mapKey ];
            if( info.substr ){
                mapKey = mapKey.map( function(x){ return String.prototype.substr.apply(x,info.substr); } );
            }
            for( var j = 0; j < mapKey.length; ++j ){
                var mapObj = hMap[mapKey[j]];
                if( mapObj ){
                    for( keyS in mapObj ){
                        if( ! obj[keyS] )  obj[keyS] = mapObj[keyS];
                    }
                }
            }
        }
    }
//  console.log( "hObjects = " + JSON.stringify(hObjects,function(k,v){ return (k === 'polygon')? null : v; },"  ") );  // _DEBUG_
};

ogf.drawLayerObjects = function( objects, layer, map ){
//	console.log( "objects = " + JSON.stringify(objects,null,"  ") );  // _DEBUG_
    var controls = [];
    if( Array.isArray(objects) ){
        for( var i = 0; i < objects.length; ++i ){
            ogf.drawLayerObject( objects[i], i, layer, map, controls );
        }
    }else{
        for( var key in objects ){
            ogf.drawLayerObject( objects[key], key, layer, map, controls );
        }
    }
    return controls;
};

ogf.drawLayerObject = function( obj, key, layer, map, controls ){
//	console.log( "obj = " + JSON.stringify(obj,null,"  ") );  // _DEBUG_
    var popupOptions = {maxWidth: 600};
    var text = obj.text ? ogf.evalObjectText( obj, obj.text, key ) : null;
    var mapObj;

    if( obj.polygon ){
        var coordList = obj.polygon;
        var options = {
            color:       obj.color       || '#111111',
            fillColor:   obj.fillColor   || '#999999',
            weight:      ('weight' in obj)      ? obj.weight      : 1,
            fillOpacity: ('fillOpacity' in obj) ? obj.fillOpacity : .5,
        };
        if( obj.fillPattern ){
            options.fillPattern = ogf.getFillPattern( obj.fillPattern, map );
        }
//      L.polygon( coordList, options ).addTo( layer ).bindPopup( text, popupOptions );
        mapObj = L.polygon( coordList, options ).addTo( layer );
    }else if( obj.polyline ){
        var coordList = obj.polyline;
        var options = {
            color:  obj.color || '#111111',
            weight: ('weight' in obj) ? obj.weight : 1,
        };
//      L.polyline( coordList, options ).addTo( layer ).bindPopup( text, popupOptions );
        mapObj = L.polyline( coordList, options ).addTo( layer );
    }else if( obj.icon ){
        var options = {};
        if( ogf.icons[obj.icon] ){
            options.icon = ogf.icons[obj.icon];
        }else{
			var iconOpt = {iconUrl: ogf.config.TILES_URL +'data/icons/'+ obj.icon};
			if( obj.iconAnchor )  iconOpt.iconAnchor = obj.iconAnchor;
            options.icon = L.icon( iconOpt );
        }
//      L.marker( [obj.lat,obj.lon], options ).addTo( layer ).bindPopup( text, popupOptions );
        mapObj = L.marker( [obj.lat,obj.lon], options ).addTo( layer );
    }else if( obj.divIcon ){
        var divIconOpt = {className: 'div-icon-875469085', html: obj.divIcon};  // className necessary to get default styles
        if( obj.iconAnchor )  divIconOpt.iconAnchor = obj.iconAnchor;
        var divIcon = L.divIcon( divIconOpt );
        var marker = L.marker( [obj.lat,obj.lon], {icon: divIcon} ).addTo( layer );
        if( obj.style ){
            var objStyle = obj.style;
            var elemStyle = marker.getElement().style;
            for( var key in objStyle ){
                 elemStyle[key] = objStyle[key];
            }
        }
    }else if( obj.control && obj.control === 'InfoBox' ){
        var infoBox = L.control.infoBox( {text: text} );
        infoBox.addTo( map );
        controls.push( infoBox );
    }

    if( mapObj && text ){
        mapObj.bindPopup( text, popupOptions );
    }
    if( mapObj && obj['function'] ){
        obj['function']( obj, mapObj );
    }

//	delete obj.polygon; if( obj.icon )  console.log( "obj = " + JSON.stringify(obj,null,"  ") );  // _DEBUG_
};

ogf.addFullscreenControl = function( self, options ){
    var fsc = L.control.fullScreen( options );
    fsc.addTo( self._map );
}


ogf.fillPatterns = {};
ogf.getFillPattern = function( fillPattern, map ){
    var key = JSON.stringify( fillPattern );
    if( ! ogf.fillPatterns[key] ){
        var fp = ogf.fillPatterns[key] = new L.StripePattern( fillPattern );
        fp.addTo( map );
    }
    return ogf.fillPatterns[key];
}


ogf.evalObjectText = function( obj, template, key ){
    if( ! template )  return "";
    if( Array.isArray(template) ){
        template = template.join('');
    }
    var text = template.replace( /%([#\w]+)%/g, function(x,x1){
		var val = (x1 === '#')? key : obj[x1];
        if( val ){
            if( Array.isArray(val) ){
                var str = '';
                for( var i = 0; i < val.length; ++i ){
//					str += obj['text.'+val[i]];
                    str += ogf.evalObjectText( obj, obj['text.'+val[i]], key );
                }
                val = str;
            }
        }else{
            val = ogf.config[x1];
        }
        return val || '';
    } ); 	
    text = text.replace( /(<hr>)+/g, '<hr>' );
    text = text.replace( /<hr>$/, '' );

    return text;
};



ogf.parseUrlParam = function( str ){
    if( ! str )  str = document.URL;
    var hParam = {};
    var regex = /[?&](\w+)=([^?&]*)/g;
    var match;
    while( (match = regex.exec(str)) != null ){
        var val = decodeURIComponent( match[2] );
        hParam[match[1]] = val;
    }
    return hParam;
};

ogf.parseLocation = function( str ){
    var dsc = str.split('/');
    var hInfo = {};
    if( dsc[0].match(/^[A-Z]/) ){
        hInfo.layer = dsc.shift();
    }
    hInfo.zoom = parseFloat(dsc[0]);
    hInfo.lat  = parseFloat(dsc[1]);
    hInfo.lon  = parseFloat(dsc[2]);  // lat, lon
    return hInfo;
};

ogf.getUrlLocation = function( map, map2, opt ){
    var hOut = {};
    var zoom   = map.getZoom();
    var center = map.getCenter();
    var layer  = ogf.getBaseLayer( map );
    var query  = 'map=' + layer + '/' + zoom + '/' + center.lat.toFixed(5) + '/' + center.lng.toFixed(5);

    if( map2 ){
        var center2 = map2.getCenter();
        var layer2  = ogf.getBaseLayer( map2 );
        query += '&map2=' + layer2 + '/x/' + center2.lat.toFixed(5) + '/' + center2.lng.toFixed(5);
    }

//  query += '&layer=' + '';
    if( opt && opt.fields ){
        for( var i = 0; i < opt.fields.length; ++i ){
            var field = opt.fields[i];
//          console.log( "field <" + field + ">" );  // _DEBUG_
            var elem = document.getElementById( field );
//          console.log( "elem <" + elem + ">" );  // _DEBUG_
            query += '&' + field + '=' + encodeURIComponent(elem.value);
        }
    }
    for( var key in hOut ){
        query += key + '='
    }

    return query;
}

ogf.setUrlLocation = function( map, url, opt ){
    if( ! url )  url = document.URL;
    if( ! opt )  opt = {};

	var map2, ogfMap, ogfMap2;
    if( Array.isArray(map) ){
        map2 = map[1];
        map  = map[0];
    }
    if( map._ogf ){
        ogfMap = map;
        map    = map._map;
    }
    if( map2 && map2._ogf ){
        ogfMap2 = map2;
        map2    = map2._map;
    }

    var hParam = ogf.parseUrlParam( url );
//  console.log( "hParam = " + JSON.stringify(hParam,null,"  ") );  // _DEBUG_
    if( map && hParam.map ){
        var lc = ogf.parseLocation( hParam.map );
        if( opt.method === 'MapboxGL' ){
            map.setZoom( lc.zoom );
            map.setCenter( [lc.lon,lc.lat] );
        }else{
            map.setView( [lc.lat,lc.lon], lc.zoom );
            if( ogfMap && lc.layer )  ogf.setBaseLayer( ogfMap, lc.layer );
        }
    }
    if( map2 && hParam.map2 ){
        var lc2 = ogf.parseLocation( hParam.map2 );
//      console.log( "lc2 = " + JSON.stringify(lc2,null,"  ") );  // _DEBUG_
//      map2.panTo( [lc2.lat,lc2.lon] );
        map2.setView( [lc2.lat,lc2.lon], 16 );  // fixed "infinite number of tiles" problems, actual zoom value doesn't matter here
        if( ogfMap2 && lc2.layer )  ogf.setBaseLayer( ogfMap2, lc2.layer );
    }
    if( opt.layers ){
        var layer = hParam.layer || 'Standard';
        opt.layers[layer].addTo( map );
    }

    if( opt.fields ){
        for( var i = 0; i < opt.fields.length; ++i ){
            var field = opt.fields[i];
            var elem = document.getElementById( field );
            if( field in hParam )  elem.value = hParam[field]
        } 
    }

//    var moveEnd = function(){
//        var hOut = {};
//        var zoom   = map.getZoom();
//        var center = map.getCenter();
//        var layer  = ogf.getBaseLayer( map );
//        var query  = 'map=' + layer + '/' + zoom + '/' + center.lat.toFixed(5) + '/' + center.lng.toFixed(5);
//
//        if( map2 ){
//            var center2 = map2.getCenter();
//            var layer2  = ogf.getBaseLayer( map2 );
//            query += '&map2=' + layer2 + '/x/' + center2.lat.toFixed(5) + '/' + center2.lng.toFixed(5);
//        }
//
////		query += '&layer=' + '';
//        if( opt.fields ){
//            for( var i = 0; i < opt.fields.length; ++i ){
//                var field = opt.fields[i];
//                console.log( "field <" + field + ">" );  // _DEBUG_
//                var elem = document.getElementById( field );
////              console.log( "elem <" + elem + ">" );  // _DEBUG_
//                query += '&' + field + '=' + encodeURIComponent(elem.value);
//            }
//        }
//        for( var key in hOut ){
//            query += key + '='
//        }
//
//        var newUrl = document.URL.replace( /\.html.*/, '.html?' + query );
////      console.log( "newUrl <" + newUrl + ">" );  // _DEBUG_
//        window.history.pushState( '', '', newUrl );
//    };

    var moveEnd = function(){
        var query = ogf.getUrlLocation( map, map2, opt );
        var newUrl = document.URL.replace( /\.html.*/, '.html?' + query );
//      console.log( "newUrl <" + newUrl + ">" );  // _DEBUG_
        window.history.pushState( '', '', newUrl );
    };
    setTimeout( function(){  // workaround for "set map center and zoom first" error
        map.on( 'moveend', moveEnd );
        if( map2 )  map2.on( 'moveend', moveEnd );
    }, 100 );

    return hParam;
};

ogf.getBaseLayer = function( map ){
//  var ct = 0; console.log( '--- getCurrentbaseLayer ---' );
    var layerShortcut;
    map.eachLayer( function(layer){
//      console.log( '' + (++ct) + ': ' + layer.options.ogf_shortcut );
        if( layer.options.ogf_shortcut )  layerShortcut = layer.options.ogf_shortcut;
    });
    return layerShortcut;
};

ogf.setBaseLayer = function( ogfMap, layerShortcut ){
//  console.log( '--- setCurrentbaseLayer --- ' + layerShortcut );
    var map = ogfMap._map;
    map.eachLayer( function(layer){
        if( layer.options.ogf_shortcut && layerShortcut !== layer.options.ogf_shortcut ){
            map.removeLayer( layer );
        }
    });
//  console.log( "ogfMap._layers = " + JSON.stringify(Object.keys(ogfMap._layers),null,"  ") );  // _DEBUG_
    ogfMap._layers[layerShortcut].addTo( map );
};

ogf.normalizedBbox = function( map, opt ){
    if( ! opt )   opt = {};
    var b = map.getBounds();
//  console.log( "b = " + JSON.stringify(b,null,"  ") );  // _DEBUG_

    var bbox = '', x0 = b.getWest(), x1 = b.getEast(), y0 = b.getSouth(), y1 = b.getNorth();
//	x0 = fmod( fmod(x0,360) + 540, 360 ) - 180;  // normalize x0 to interval [-180,180]
//	x1 = fmod( fmod(x1,360) + 540, 360 ) - 180;  // fmod must be applied twice to handle negative values correctly
    if( x1 - x0 < 360 ){
	    x0 = fmod(x0+180,360) - 180;  // normalize x0,x1 to interval [-180,180]
	    x1 = fmod(x1+180,360) - 180;
    }else{
        x0 = -180;
        x1 =  180;
	}

    if( x1 - x0 < 360 ){
        if( x1 < x0 ){
            bbox = [ {w: x0, e: 180, s: y0, n: y1}, {w: -180, e: x1, s: y0, n: y1} ];
        }else{
            bbox = [ {w: x0, e: x1, s: y0, n: y1} ];
        }
        if( opt.fmt === 'overpass' ){
//          bbox = '(' + y0 + ',' + x0 + ',' + y1 + ',' + x1 + ')';
//          list[i] = '(' + b.s + ',' + b.w + ',' + b.n + ',' + b.e + ')';
            bbox = bbox.map( function(b){ return '(' + b.s + ',' + b.w + ',' + b.n + ',' + b.e + ')'; } );
        }else if( opt.fmt === 'api' ){
//          bbox = '(' + y0 + ',' + x0 + ',' + y1 + ',' + x1 + ')';
//          bbox[i] = '' + b.w + ',' + b.s + ',' + b.e + ',' + b.n;
            bbox = bbox.map( function(b){ return '' + b.w + ',' + b.s + ',' + b.e + ',' + b.n; } );
        }
    }
//  console.log( "bbox = " + JSON.stringify(bbox,null,"  ") );  // _DEBUG_
    return bbox;
}

function fmod( x, m ){
    return (x - (Math.floor(x / m) * m));
}

//for( var x = -1000; x < 1000; x += 10 ){
//  var xx = fmod( x, 360 );
//  console.log( '' + x + ': ' + xx );
//}



ogf.runRequest = function( method, url, data, cb ){
    try{
        var req = new XMLHttpRequest();
        req.open( method, url, true );
        req.onreadystatechange = function(){
            if( req.readyState == 4 ){
                if( req.status == 200 ){
                    cb( req.responseText );
                }else{
                    alert( 'ERROR:\n' + req.statusText );
                }
            }
        };
        if( data ){
            req.send( data );
        }else{
            req.send();
        }

    }catch( e ){
        alert( e.toString() );
    }
};


ogf.overpassSearch = function( queryStr, opt, cb ){
    if( ! opt )  opt = {};
    var bbox = [''];
    if( opt.bboxMap ){
        bbox = OGF.normalizedBbox( opt.bboxMap, {fmt: 'overpass'} );
    }
    var types = opt.types || ['node', 'way', 'relation'];

	queryStr = queryStr.replace(/"/g,'');
    var queryKey = 'name', filter = queryStr;
    var mtc = queryStr.match( /^([:\w]+)=(.*)/ );
    if( mtc ){
        queryKey = mtc[1];
        filter   = mtc[2];
    }
    console.log( "queryKey <" + queryKey + ">  filter <" + filter + ">" );  // _DEBUG_

    var ovpQuery = '(\n';
    for( var i = 0; i < bbox.length; ++i ){
//      ovpQuery += 'node["'     + queryKey + '"~"' + filter + '",i]' + bbox[i] + ';\n';
//      ovpQuery += 'way["'      + queryKey + '"~"' + filter + '",i]' + bbox[i] + ';\n';
//      ovpQuery += 'relation["' + queryKey + '"~"' + filter + '",i]' + bbox[i] + ';\n';
        for( var j = 0; j < types.length; ++j ){
            ovpQuery += types[i] + '["' + queryKey + '"~"' + filter + '",i]' + bbox[i] + ';\n';
        }
    }
    ovpQuery += ');';
    console.log( "ovpQuery <" + ovpQuery + ">" );  // _DEBUG_

    OGF.getOverpassData( ovpQuery, opt, function(ctx){
//      console.log( "ctx = " + JSON.stringify(ctx,null,"  ") );  // _DEBUG_
        cb( ctx );
    } );
};

ogf.getOverpassData = function( query, opt, cb ){
    if( typeof opt === 'function' ){
        cb = opt;
        opt = {};
    }
//  var url = '//osm3s.opengeofiction.net/api/interpreter';
    query = "[out:json];\n" + query;
//  query += (opt.meta)? "out meta;" : "out;";
    query += (opt.max)? ("\nout " + opt.max + ";") : "\nout;";
    console.log( "query <" + query + ">" );  // _DEBUG_
    ogf.runRequest( 'POST', ogf.config.OVERPASS_URL, query, function(data){
        var struct = JSON.parse( data );
//		console.log( "struct = " + JSON.stringify(struct,null,"  ") );  // _DEBUG_
        cb( struct );
    } );
};

ogf.typeMap = function( struct ){
    var hObj = {};
    ['node','way','relation'].forEach( function(type){
//      hObj[type] = _.keyBy( _.filter( struct.elements, function(x){
//          return x.type === type; 
//      } ), 'id' );
        hObj[type] = ogf.keyBy( struct.elements.filter( function(x){
            return x.type === type; 
        } ), 'id' );
    } );
    return hObj;
}

ogf.keyBy = function( array, key ){
    var hObj = {};
    array.forEach( function(x){ if(x){ hObj[x[key]] = x; } } );
    return hObj;
}

ogf.values = function( obj ){
    return Object.keys(obj).map( function(x){ return obj[x]; } );
}


ogf.getRelationData = function( relId, cb ){
    var query;
    relId = '' + relId;
    var wayId;
    if( relId.match(/^\d+$/) ){
        query = '( relation(' + relId + '); >;);';
    }else if( relId.match(/^[wW]\d+$/) ){
        wayId = parseInt( relId.substr(1) );
        query = '( way(' + wayId + '); >;);';
    }else if( relId.match(/^\d+:/) ){
        var info = relId.split(':');
        var level = info[0];
        var name  = info[1];
        var type  = (info[2] && info[2] === 'L')? 'land_area' : 'boundary';
        query = '( relation["name"="' + name + '"]["admin_level"="' + level + '"]["' + type +'"="administrative"]; >; );';
    }else{
        cb( null );
    }
    console.log( "query <" + query + ">" );  // _DEBUG_
    ogf.getOverpassData( query, function(struct){
        struct = ogf.typeMap( struct );
        cb( struct );
    } );
};



//--------------------------------------------------------------------------------------------------

ogf.boundaryRelation = function( layer, relId ){
    var rlat = 90, rlon = 360;
    var worldPolygon    = [ [-rlat,-rlon], [-rlat,rlon], [rlat,rlon], [rlat,-rlon] ];
    var areaPolygon;

    var query = 'relation(' + relId + '); (._;>>;);';
    console.log( "query <" + query + ">" );  // _DEBUG_

    ogf.getOverpassData( query, function(ctx){
        ctx = ogf.typeMap( ctx );
//      console.log( "ctx = " + JSON.stringify(ctx,null,"  ") );  // _DEBUG_

        var closedWays = ogf.buildWaySequence( ctx, relId, null, {role: 'outer', copy: true} );
//      console.log( "closedWays = " + JSON.stringify(closedWays,null,"  ") );  // _DEBUG_
        closedWays = closedWays.map( function(way){
//          console.log( "way.nodes = " + JSON.stringify(way.nodes,null,"  ") );  // _DEBUG_
            var polygon = ogf.wayPoints( way, ctx );
            return polygon;
        } );

        var innerWays = ogf.buildWaySequence( ctx, relId, null, {role: 'inner', copy: true} );
        innerWays = innerWays.map( function(way){
//          console.log( "way.nodes = " + JSON.stringify(way.nodes,null,"  ") );  // _DEBUG_
            var polygon = ogf.wayPoints( way, ctx );
            return polygon;
        } );
        Array.prototype.push.apply( closedWays, innerWays );

        var areaSize, areaSizeSqm;
        closedWays.unshift( worldPolygon );
//      areaPolygon = L.polygon( closedWays, {weight: 1.5} ).addTo( map );
        areaPolygon = L.polygon( closedWays, {weight: 1, color: '#000000', fillColor: '#000000', fillOpacity: 0.25} ).addTo( layer );
    } );
}

//--- begin publicTransport ---------------------------------------------------------------------------------------


ogf.publicTransport = function( layer, routeIds ){
    console.log( "routeIds = " + JSON.stringify(routeIds,null,"  ") );  // _DEBUG_
    var hInfo = {layer: layer};
    loadRouteData( routeIds, function(ctx){
        routeIds.forEach( function(relId){
            var rel = ctx.relation[relId];
            drawRouteMasterLines( rel, ctx, hInfo );
        } );
        routeIds.forEach( function(relId){
            var rel = ctx.relation[relId];
            drawRouteMasterStations( rel, ctx, hInfo );
        } );
    } );
}

function drawRouteMasterLines( rel, ctx, hInfo ){
    var routes   = rel.members.filter( function(x){ return x.type === 'relation' && (x.role === '' || x.role === 'route'); } );
    hInfo.color  = rel.tags.colour || '#000000';
    if (routes.length > 0){
        routes.forEach( function(mR){
            drawRoute( ctx.relation[mR.ref], ctx, hInfo );
        } );
    } else {
        drawRoute( rel, ctx, hInfo );
    }
}

function drawRouteMasterStations( rel, ctx, hInfo ){
    var routes   = rel.members.filter( function(x){ return x.type === 'relation' && (x.role === '' || x.role === 'route'); } );
    hInfo.color  = rel.tags.colour || '#000000';
    if (routes.length > 0){
        routes.forEach( function(mR){
            drawStations( ctx.relation[mR.ref], ctx, hInfo );
        } );
    } else {
        drawStations( rel, ctx, hInfo );
    }
}

function drawRoute( rel, ctx, hInfo ){
    var closedWays = ogf.buildWaySequence( ctx, rel.id, null, {role: '^.*$', copy: true} );
    closedWays.forEach( function(way){
//      console.log( "way = " + JSON.stringify(way,null,"  ") );  // _DEBUG_
        var line = ogf.wayPoints( way, ctx );
        var popupText = objText(rel);
        var color = hInfo.color || '#000000';
        L.polyline( line, {color: color, weight: 5} ).addTo( hInfo.layer ).bindPopup( popupText );
    } );
}

function drawStations( rel, ctx, hInfo) {
    var stations = rel.members.filter( function(x){ return x.type === 'node'     && (x.role === 'station' || x.role === 'stop' || x.role === 'forward:stop' || x.role === 'backward:stop'); } );
    var color = hInfo.color || '#000000';
    stations.forEach( function(mS){
        var node = ctx.node[mS.ref];
        var popupText = objText(node, rel);
        //var popupText = objTextStation(node, rel);
        L.circleMarker( [node.lat, node.lon], {radius: 5, color: color, weight: 2, fillColor: '#FFFFFF', fillOpacity: 1} ).addTo( hInfo.layer ).bindPopup( popupText );
    } );	
}

function loadRouteData( routeIds, cb ){
    query = routeIds.map( function(x){ return 'relation('+x+')'; } ).join(';');
    query = '(' + query + '); (._;>>;);';
//  console.log( "query <" + query + ">" );  // _DEBUG_
    ogf.getOverpassData( query, function(ctx){
        ctx = ogf.typeMap( ctx );
//      console.log( "ctx = " + JSON.stringify(ctx,null,"  ") );  // _DEBUG_
        cb( ctx );
    } );
}

function objText( obj ){
    var typeText = obj.type.substr(0,1).toUpperCase() + obj.type.substr(1); 
    var objText = '<b>' + obj.tags.name + '</b>';
    objText += '<br>' + typeText + ' <a href="' + ogf.config.API_URL + obj.type + '/' + obj.id + '">' + obj.id + '</a>';
    return objText;
}


//--- end publicTransport -----------------------------------------------------------------------------------------------

ogf.wayPoints = function( way, ctx ){
	if( !(typeof way === 'object') )  way = ctx.way[way];
	var hNodes = ctx.node;
    var points = way.nodes.map( function(nodeId){
        var node = hNodes[nodeId];
        return {lat: node.lat, lng: node.lon};
    } );
    return points;
};

ogf.wayGeometry = function( points, latLonKeys ){
    var kLon = latLonKeys ? latLonKeys[0] : 'lng';
    var kLat = latLonKeys ? latLonKeys[1] : 'lat';
    var minLon = 180, maxLon = -180, minLat = 90, maxLat = -90, iMinLat = -1, iMaxLat = -1, iMinLon = -1, iMaxLon = -1;
    points.forEach( function(node,i){
        if( node[kLon] < minLon ){  minLon = node[kLon]; iMinLon = i; }
        if( node[kLon] > maxLon ){  maxLon = node[kLon]; iMaxLon = i; }
        if( node[kLat] < minLat ){  minLat = node[kLat]; iMinLat = i; }
        if( node[kLat] > maxLat ){  maxLat = node[kLat]; iMaxLat = i; }
    } );
    var lp = points.length - 1;
    var hInfo = {
        bbox: [ minLon, minLat, maxLon, maxLat ],
    };
    var iX = (iMinLon > 0 && iMinLon < lp)? iMinLon :
             (iMaxLon > 0 && iMaxLon < lp)? iMaxLon :
             (iMinLat > 0 && iMinLat < lp)? iMinLat :
             (iMaxLat > 0 && iMaxLat < lp)? iMaxLat : -1;
    if( iX >= 0 ){
        hInfo.orientation = (points[iX-1][kLon] - points[iX][kLon])*(points[iX+1][kLat] - points[iX][kLat]) - (points[iX-1][kLat] - points[iX][kLat])*(points[iX+1][kLon] - points[iX][kLon]);
    }
    return hInfo;
};

ogf.rectUnion = function( rA, rB ){
    if( ! rA )  return rB;
    if( ! rB )  return rA;
    var rNew = [ Math.min(rA[0],rB[0]), Math.min(rA[1],rB[1]), Math.max(rA[2],rB[2]), Math.max(rA[3],rB[3]) ];
    return rNew;
};

ogf.buildWaySequence = function( ctx, rel, hWays, hOpt ){
    if( ! hOpt )  hOpt = {};
    var repeatFlag = hWays ? true : false;
//  console.log( '--- buildWaySequence --- repeatFlag=' + repeatFlag + ' opt=(' + JSON.stringify(hOpt) +')' );  // _DEBUG_

    if( typeof rel === 'string' )  rel = parseInt( rel );
    if( typeof rel === 'number' ){
        rel = ctx.relation[rel];
//      console.log( "rel = " + JSON.stringify(rel,null,"  ") );  // _DEBUG_
    }

    if( ! hWays ){
        var ways;
        if( rel ){
            var rxRole = new RegExp(hOpt.role) || /$/;
            ways = rel.members.filter( function(x){
                return (x.type === 'way' && x.role.match(rxRole));
            } );
            ways = ways.map( function(x){ return ctx.way[x.ref]; } );
            ways = ways.map( function(x){ return x; } );   // grep {defined} to allow handling incomplete relations
        }else{
            ways = ctx.way;
        }
        if( hOpt.copy ){
//          ways = ways.map( function(x){ return _.cloneDeep(x); } );
            ways = ways.map( function(x){ return JSON.parse(JSON.stringify(x)); } );
            ways = ways.filter( function(x){ return x; } );
        }
        hWays = ogf.keyBy( ways, 'id' );
//      console.log( "hWays <" + Object.keys(hWays).length + ">" );  // _DEBUG_
//      console.log( "hWays = " + JSON.stringify(hWays,null,"  ") );  // _DEBUG_
    }

    var ptStart = {}, ptEnd = {};
    var relOrder = hOpt.relOrder || null;

//  _.forEach( hWays, function(way,wayId){
    for( var wayId in hWays ){
        var way = hWays[wayId];
        if( way.nodes.length < 2 ){
            console.log( 'ERROR: Way consisting of single node: ' + way.id );
            return;
        }

        var idStart = way.nodes[0], idEnd = way.nodes[way.nodes.length-1];
        if( hOpt.relOrder )  relOrder[way.id] = [ way.id ];

        if( idStart === idEnd ){
            ptStart[idStart] = way;
        }else{
            if( (ptStart[idStart] || ptEnd[idEnd]) && ! hOpt.wayDirection ){
                var way2 = ptStart[idStart] || ptEnd[idEnd];
//              way2.nodes = _.reverse( way2.nodes );
                way2.nodes.reverse();
                if( hOpt.relOrder ){
//                  relOrder[way2.id] = _.reverse( relOrder[way2.id] );
                    relOrder[way2.id].reverse();
//                  my @relWays = reverse @{$relOrder{$id}};
//                  $relOrder{$relWays[0]} = delete $relOrder{$id};
                }
                var idS = way2.nodes[0], idE = way2.nodes[way2.nodes.length-1];
                delete ptStart[idE];
                delete ptEnd[idS];
                ptStart[idS] = ptEnd[idE] = way2;
            }
            if( ptEnd[idStart] ){
                way.nodes.shift();
                Array.prototype.push.apply( ptEnd[idStart].nodes, way.nodes );
                if( hOpt.relOrder ){
                    Array.prototype.push.apply( relOrder[ptEnd[idStart].id], relOrder[way.id] );
                    delete relOrder[way.id];
                }
                delete hWays[way.id];
                if( ! hOpt.copy )  delete ctx.way[way.id];
                way = ptEnd[idStart];
                delete ptEnd[idStart];
            }
            if( way.nodes[0] != way.nodes[way.nodes.length-1] ){
                if( ptStart[idEnd] ){
                    way.nodes.pop();
                    Array.prototype.push.apply( way.nodes, ptStart[idEnd].nodes );
                    if( hOpt.relOrder ){
                        Array.prototype.push.apply( relOrder[way.id], relOrder[ptStart[idEnd].id] );
                        delete relOrder[ptStart[idEnd].id];
                    }
                    delete hWays[ptStart[idEnd].id];
                    if( ! hOpt.copy )  delete ctx.way[ptStart[idEnd].id];
                    delete ptStart[idEnd];
                }
                ptStart[way.nodes[0]] = ptEnd[way.nodes[way.nodes.length-1]] = way;
            }
        }
    }

    if( hOpt.relOrder )  hOpt.relOrder = relOrder;
    if( ! repeatFlag )  ogf.buildWaySequence( ctx, rel || null, hWays, hOpt );

//  return hOpt.relOrder ? _.sortBy( _.values(relOrder), function(x){ return x.length; } ) : _.values(hWays);
    return hOpt.relOrder ? ogf.values(relOrder).sort( function(a,b){ return a.length - b.length; } ) : ogf.values(hWays);
};



ogf.geoArea = function( ctx, obj, bbox, pr ){
    if( ! pr ){
        var xMin = bbox[0], yMin = bbox[1], xMax = bbox[2], yMax = bbox[3];
        var lon0 = (xMax + xMin)/2;
//      pr = proj4('+proj=eck4 +lon_0=' + lon0 + ' +x_0=0 +y_0=0');
//      pr = proj4('+proj=sinu +lon_0=' + lon0 +' +x_0=0 +y_0=0');
//      pr = proj4('+proj=cea +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +datum=WGS84 +ellps=WGS84 +units=m +no_defs');
        pr = proj4('+proj=cea +lon_0=0 +lat_ts=0 +x_0=0 +y_0=0 +datum=WGS84 +ellps=WGS84 +units=m +no_defs');
//      pr = proj4('+proj=aea +lat_1=36 +lat_2=-36 +lat_0=0 +lon_0=' + lon0 + ' +x_0=0 +y_0=0 +datum=WGS84 +ellps=WGS84');
    }

//  console.log( "obj = " + JSON.stringify(obj,null,"  ") );  // _DEBUG_
    if( typeof obj === 'number' ){
        obj = ctx.relation[obj];
    }

    if( obj.type === 'way' ){
        var way = obj;
        var iMax = way.nodes.length - 1;
//		if( way.nodes[0] != way.nodes[iMax] ){
//			console.log( 'ERROR geoArea: way is not closed (' + way.id + ')' );
//			console.log( 'end point: ' + way.nodes[iMax] );
//			throw 'error at node ' + way.nodes[iMax];
//		}
        if( way.nodes[0] != way.nodes[iMax] ){
            way.nodes.push( way.nodes[0] );
            ++iMax;
        }
        var geoArea = 0;
        for( var i = 0; i < iMax; ++i ){
            var nodeA = ctx.node[way.nodes[i]], nodeB = ctx.node[way.nodes[i+1]];
//          console.log( "nodeA = " + JSON.stringify(nodeA,null,"  ") );  // _DEBUG_
//          console.log( "nodeB = " + JSON.stringify(nodeB,null,"  ") );  // _DEBUG_
            var ptA = pr.forward( [nodeA.lon,nodeA.lat] );
            var ptB = pr.forward( [nodeB.lon,nodeB.lat] );
//          console.log( "ptA = " + JSON.stringify(ptA,null,"  ") );  // _DEBUG_
//          console.log( "ptB = " + JSON.stringify(ptB,null,"  ") );  // _DEBUG_
            var ap = (ptA[0] * ptB[1] - ptA[1] * ptB[0]);
//          console.log( "ap <" + ap + ">" );  // _DEBUG_
            geoArea += ap;
//          console.log( "geoArea <" + geoArea + ">" );  // _DEBUG_
        }
        return Math.abs(geoArea) / 2000000;
    }else if( obj.type === 'relation' ){
        var rel = obj;
        var aRelOuter = ogf.buildWaySequence( ctx, obj, null, {role: 'outer'} );
        if( aRelOuter.length === 0 ){
            throw "no member way with role=outer\n";
        }
        var aRelInner = ogf.buildWaySequence( ctx, obj, null, {role: 'inner'} );
        var area = 0;
        aRelOuter.forEach( function(x){ area += ogf.geoArea(ctx,x,bbox); } );
        aRelInner.forEach( function(x){ area -= ogf.geoArea(ctx,x,bbox); } );
        return area;
    }else{
        throw 'ERROR geoArea: Unsupported object type: ' + obj.type;
        return 0;
    }
}


//--------------------------------------------------------------------------------------------------

ogf.simplifyPolyline = function( map, polyLine, tolerance ){
    var points = ogf.polylineLatlng2point( map, polyLine );
//  console.log( "A points = " + JSON.stringify(points,null,"  ") );  // _DEBUG_
//  points = _.map( points, function(x){ return L.LineUtil.simplify(x,tolerance); } );
    if( Array.isArray(points[0]) ){
        points = points.map( function(x){ return L.LineUtil.simplify(x,tolerance); } );
        points = points.filter( function(x){ return x.length > 3; } );
    }else{
        points = L.LineUtil.simplify( points, tolerance );
    }
//  console.log( "B points = " + JSON.stringify(points,null,"  ") );  // _DEBUG_
    polyLine = ogf.polylinePoint2latlng( map, points );
    return polyLine;
}

ogf.polylineLatlng2point = function( map, ll ){
    var pt = [];
    for( var i = 0; i < ll.length; ++i ){
        if( Array.isArray(ll[i]) ){
            pt[i] = ll[i].map( function(x){ return map.latLngToLayerPoint(x); } );
        }else{
            pt[i] = map.latLngToLayerPoint( ll[i] );
        }
    }
    return pt;
}

ogf.polylinePoint2latlng = function( map, pt ){
    var ll = [];
    for( var i = 0; i < pt.length; ++i ){
        if( Array.isArray(pt[i]) ){
            ll[i] = pt[i].map( function(x){ return map.layerPointToLatLng(x); } );
        }else{
            ll[i] = map.latLngToLayerPoint( pt[i] );
        }
    }
    return ll;
}



//--------------------------------------------------------------------------------------------------



//var R = 6372798.2;      // earth radius, average
var R = 6378137;          // earth radius, equator
var C = R * 2 * Math.PI;  // earth circumference


ogf.zoom2mpp = function( zoom, lat ){
    var y = lat * Math.PI / 180;
    var mpp = C * Math.cos(y) / (256 * Math.pow(2,zoom));
    return mpp;
}

ogf.mpp2zoom = function( mpp, lat ){
    var y = lat * Math.PI / 180;
    var zoom = Math.log( (C * Math.cos(y)) / (mpp * 256) ) / Math.LN2;
    return zoom;
}

ogf.zoom2scale = function( zoom, lat, pxpt ){
    var y = lat * Math.PI / 180;
    var mpp = C * Math.cos(y) / (256 * Math.pow(2,zoom));
    var scale  = Math.floor( mpp * 1000 / pxpt + .5 );
    return scale;
}

ogf.scale2zoom = function( scale, lat, pxpt ){
    var mpp = scale / 1000 * pxpt;
    var y = lat * Math.PI / 180;
    var zoom = Math.log( (C * Math.cos(y)) / (mpp * 256) ) / Math.LN2;
    return zoom;
}


return ogf;

}


