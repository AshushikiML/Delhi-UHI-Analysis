
// 1. Define Area of Interest (ROI) 
// (Make sure to draw a geometry polygon on the map or import a shapefile)
var roi = geometry; 

// 2. Load Landsat 8 Collection 2 Level 2 Tier 1
var dataset = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterBounds(roi)
  .filterDate('2025-01-01', '2025-12-31') // Adjust dates as needed
  .filter(ee.Filter.lt('CLOUD_COVER', 10));

// 3. Scaling function for Collection 2 Level 2
function applyScaleFactors(image) {
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBands = image.select('ST_B10').multiply(0.00341802).add(149.0); // Kelvin
  return image.addBands(opticalBands, null, true)
              .addBands(thermalBands, null, true);
}

// 4. Process the image (Scale, Composite, and Clip)
var scaledCollection = dataset.map(applyScaleFactors);
var finalImage = scaledCollection.median().clip(roi);

// 5. Select bands to export (SR_B2 to SR_B4 are Blue, Green, Red)
var bandsToExport = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'];
var outputImage = finalImage.select(bandsToExport);

// 6. Visualize True Color (RGB: B4, B3, B2)
var visParams = {
  bands: ['SR_B4', 'SR_B3', 'SR_B2'],
  min: 0.0,
  max: 0.3,
};
Map.centerObject(roi, 10);
Map.addLayer(outputImage, visParams, 'Landsat 8 C2 L2 True Color');

// 7. Export to Google Drive
Export.image.toDrive({
  image: outputImage,
  description: 'Landsat8_C2_L2_Export',
  folder: 'GEE_Landsat',
  fileNamePrefix: 'landsat8_c2_l2',
  region: roi,
  scale: 30, // 30-meter resolution
  crs: 'EPSG:4326',
  maxPixels: 1e13
});

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
