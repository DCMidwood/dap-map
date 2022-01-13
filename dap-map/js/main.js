require([
    "esri/config",
    "esri/Map", 
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/GeoJSONLayer", 
    "esri/widgets/Legend",
    "esri/widgets/Expand"  ,
    "esri/widgets/LayerList",
    "esri/widgets/FeatureTable",    
    "esri/layers/WMSLayer"
], function(
    esriConfig,
    Map,
    MapView,
    FeatureLayer,
    GeoJSONLayer,
    Legend,
    Expand,
    LayerList,
    FeatureTable,
    WMSLayer
) { 

    // Set API Key
    esriConfig.apiKey = "AAPK07debd14a9ae4f03a01da38f19b27fedM5k4aLdVhDJxdnNKa3--HjeN9XwqQIScajcYBxn2F8naSMjGFGmpyWrvqhkedhgD";

    
    const sssi_url = "https://services.arcgis.com/JJzESW51TqeY9uat/ArcGIS/rest/services/SSSI_England/FeatureServer/0";
    
    const template = {
        title: "Track Details",
        lastEditInfoEnabled: false,
        content: "TrackId {track_id} <br> Track Type {track_type}"
    }

    const sssi_template = {
        title: "{SSSI_NAME}",
        lastEditInfoEnabled: false,
        content: [
          {
            type: "fields",
            fieldInfos: [
            {
              fieldName: "SSSI_AREA ",
              label: "SSSI_AREA "
            },
            {
              fieldName: "Status",
              label: "STATUS"
            }]
        }
        ]
    }


    const sssi_Layer = new FeatureLayer({
        title: "SSSI",
        url: sssi_url,
        copyright: "Natural England",
        popupTemplate: sssi_template
    });


    // Symbol for type c tracks
    const typeCSym = {
        type: "simple-line", // autocasts as new SimpleLineSymbol()
        color: "#30ffea",
        width: "3px",
        style: "solid"
    };
      
    // Symbol for other track types
    const otherSym = {
        type: "simple-line", // autocasts as new SimpleLineSymbol()
        color: "grey",
        width: "2px",
        style: "solid"
              };


    const civTrackRenderer = {
        type: "unique-value", // autocasts as new UniqueValueRenderer()
        legendOptions: {
          title: "Track type"
        },
        defaultSymbol: otherSym,
        defaultLabel: "Other Track Type Highway",
        field: "track_type",
        uniqueValueInfos: [
          {
            value: "C = Unsealed Minor Access Road", // code for interstates/freeways
            symbol: typeCSym,
            label: "C = Unsealed Minor Access Road"
          },
        ]
    }
    
    const gjson_url =  "data/civ_tracks.geojson";
    const design_geojsonLayer = new GeoJSONLayer({
        url: gjson_url,
        popupTemplate: template,
        renderer: civTrackRenderer
        }
      );


    const openStreet_layer = new WMSLayer({
      url: "https://ows.terrestris.de/osm/service",
      sublayers: [
        {
          name: "OSM-WMS"
        }
      ]
    });



      const map = new Map({
        //basemap: "gray-vector"
        //basemap: "arcgis-topographic", // Basemap layer
        basemap: "satellite",
        layers: [openStreet_layer, sssi_Layer, design_geojsonLayer]
    }); 

    

    view = new MapView({
        container: "viewDiv",
        map: map,
        extent: {
            xmin: -2.65, 
            ymin: 54.2,
            xmax: -2.7,
            ymax: 54.25,
           spatialReference: 4326
        }
        //center: [-117.506, 33.66559],
        //zoom: 12
    });

    // Adding a legend and expand widget
    const legend = new Legend({
        view: view,
        container: "legendDiv",
        layerInfos: [
            {
              layer: sssi_Layer,
              title: "SSSI"
            },
            {
              layer: design_geojsonLayer,
              title: "Design Layout"
            }
          ]
    });


    let layerList = new LayerList({
        view: view
      });
    
    const expand = new Expand({
        view: view,
        content: legend,
        expanded: true
    });

    view.ui.add(expand, "top-right");


    // Adds widget below other elements in the top left corner of the view
    view.ui.add(layerList, {
        position: "top-left"
      });

});