

// ============================================================
// DELHI URBAN HEAT ISLAND ANALYSIS
// NDVI AND LAND SURFACE TEMPERATURE (LST)
// Landsat 8 Collection 2 Level-2
// Study Period: April-June 2025
// ============================================================


// 1. DEFINE DELHI ADMINISTRATIVE BOUNDARY

var districts = ee.FeatureCollection(
  'FAO/GAUL/2015/level2'
);

var delhi = districts.filter(
  ee.Filter.eq('ADM1_NAME', 'Delhi')
);

Map.centerObject(delhi, 10);

Map.addLayer(delhi, {}, 'Delhi Boundary');


// 2. LOAD LANDSAT 8 COLLECTION 2 LEVEL-2 DATA

var landsat = ee.ImageCollection(
  'LANDSAT/LC08/C02/T1_L2'
)
.filterBounds(delhi)
.filterDate('2025-04-01', '2025-06-30')
.filter(ee.Filter.lt('CLOUD_COVER', 20));

print('Landsat image count:', landsat.size());


// 3. APPLY SCALING FACTORS TO OPTICAL BANDS

function scaleOpticalBands(image) {

  var optical = image
    .select(['SR_B4', 'SR_B5'])
    .multiply(0.0000275)
    .add(-0.2);

  return image.addBands(optical, null, true);
}


// 4. CALCULATE NDVI

function calculateNDVI(image) {

  var scaled = scaleOpticalBands(image);

  var red = scaled.select('SR_B4');
  var nir = scaled.select('SR_B5');

  var ndvi = nir.subtract(red)
    .divide(nir.add(red))
    .rename('NDVI');

  return ndvi.copyProperties(
    image,
    image.propertyNames()
  );
}


// 5. CREATE NDVI MEDIAN COMPOSITE

var ndviCollection = landsat.map(calculateNDVI);

var ndviComposite = ndviCollection
  .median()
  .clip(delhi);

print('NDVI Composite:', ndviComposite);


// 6. DISPLAY NDVI MAP

Map.addLayer(
  ndviComposite,
  {
    min: -0.2,
    max: 0.8,
    palette: ['brown', 'yellow', 'lightgreen', 'darkgreen']
  },
  'Delhi NDVI'
);


// 7. DEFINE REFERENCE EXPORT GRID
// Same grid used in the NDBI export

var referenceRegion = ee.Geometry.Rectangle(
  [
    76.83290625074268,
    28.40823271346734,
    77.33793910347468,
    28.884699140164333
  ],
  'EPSG:4326',
  false
);

var referenceTransform = [
  0.00026949458523585647,
  0,
  76.83290625074268,
  0,
  -0.00026949458523585647,
  28.884699140164333
];


// 8. EXPORT NDVI

Export.image.toDrive({

  image: ndviComposite,

  description: 'Delhi_NDVI_April_June_2025',

  folder: 'Delhi_UHI_Project',

  fileNamePrefix: 'Delhi_NDVI_April_June_2025',

  region: referenceRegion,

  crs: 'EPSG:4326',

  crsTransform: referenceTransform,

  maxPixels: 1e13

});


// ============================================================
// 9. CALCULATE LAND SURFACE TEMPERATURE (LST)
// ============================================================

function calculateLST(image) {

  // Landsat 8 Surface Temperature Band
  // Apply Collection 2 Level-2 scaling factor

  var thermal = image
    .select('ST_B10')
    .multiply(0.00341802)
    .add(149.0);

  // Convert Kelvin to Celsius

  var lst = thermal
    .subtract(273.15)
    .rename('LST');

  return lst.copyProperties(
    image,
    image.propertyNames()
  );
}


// 10. CREATE LST MEDIAN COMPOSITE

var lstCollection = landsat.map(calculateLST);

var lstComposite = lstCollection
  .median()
  .clip(delhi);

print('LST Composite (Celsius):', lstComposite);


// 11. DISPLAY LST MAP

Map.addLayer(
  lstComposite,
  {
    min: 25,
    max: 50,
    palette: [
      'blue',
      'cyan',
      'yellow',
      'orange',
      'red'
    ]
  },
  'Delhi Land Surface Temperature (Celsius)'
);


// 12. EXPORT LST

Export.image.toDrive({

  image: lstComposite,

  description: 'Delhi_LST_April_June_2025',

  folder: 'Delhi_UHI_Project',

  fileNamePrefix: 'Delhi_LST_April_June_2025',

  region: referenceRegion,

  crs: 'EPSG:4326',

  crsTransform: referenceTransform,

  maxPixels: 1e13

});


// ============================================================
// END OF SCRIPT
// ============================================================


// 1. ORIGINAL DELHI ADMINISTRATIVE BOUNDARY

var districts = ee.FeatureCollection(
  'FAO/GAUL/2015/level2'
);

var delhi = districts.filter(
  ee.Filter.eq('ADM1_NAME', 'Delhi')
);

Map.centerObject(delhi, 10);

Map.addLayer(delhi, {}, 'Delhi Boundary');


// 2. LOAD THE SAME LANDSAT DATA

var landsat = ee.ImageCollection(
  'LANDSAT/LC08/C02/T1_L2'
)
.filterBounds(delhi)
.filterDate('2025-04-01', '2025-06-30')
.filter(ee.Filter.lt('CLOUD_COVER', 20));

print('Landsat image count:', landsat.size());


// 3. CALCULATE NDBI

function calculateNDBI(image) {

  var reflectance = image
    .select(['SR_B6', 'SR_B5'])
    .multiply(0.0000275)
    .add(-0.2);

  var swir = reflectance.select('SR_B6');
  var nir = reflectance.select('SR_B5');

  var ndbi = swir.subtract(nir)
    .divide(swir.add(nir))
    .rename('NDBI');

  return ndbi.copyProperties(
    image,
    image.propertyNames()
  );
}


// 4. CREATE MEDIAN COMPOSITE

var ndbiCollection = landsat.map(calculateNDBI);

var ndbiComposite = ndbiCollection
  .median()
  .clip(delhi);

print('NDBI Composite:', ndbiComposite);


// 5. DISPLAY MAP

Map.addLayer(
  ndbiComposite,
  {
    min: -0.5,
    max: 0.5,
    palette: ['blue', 'white', 'red']
  },
  'Delhi NDBI'
);


// 6. RECREATE THE EXACT EXISTING RASTER GRID

var referenceRegion = ee.Geometry.Rectangle(
  [
    76.83290625074268,
    28.40823271346734,
    77.33793910347468,
    28.884699140164333
  ],
  'EPSG:4326',
  false
);


// 7. EXPORT NDBI

Export.image.toDrive({
  image: ndbiComposite,

  description: 'Delhi_NDBI_April_June_2025',

  folder: 'Delhi_UHI_Project',

  fileNamePrefix: 'Delhi_NDBI_April_June_2025',

  region: referenceRegion,

  crs: 'EPSG:4326',

  crsTransform: [
    0.00026949458523585647,
    0,
    76.83290625074268,
    0,
    -0.00026949458523585647,
    28.884699140164333
  ],

  maxPixels: 1e13
});
