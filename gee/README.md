# Google Earth Engine Processing

This folder contains the Google Earth Engine scripts used to process Landsat 8 satellite imagery for the Delhi Urban Heat Island Analysis project.

## Dataset

- **Satellite:** Landsat 8
- **Collection:** Landsat 8 Collection 2 Level-2 Tier 1
- **Study area:** Delhi, India
- **Study period:** April–June 2025
- **Scene-level cloud cover filter:** Less than 20%
- **Coordinate Reference System:** EPSG:4326

## Scripts

| Script | Description |
|---|---|
| `landsat_processing.js` | Landsat imagery processing and NDBI calculation |
| `ndvi_lst_processing.js` | NDVI and Land Surface Temperature calculation |

## Processing Methodology

### 1. Data Acquisition
Landsat 8 Collection 2 Level-2 imagery was filtered using the Delhi administrative boundary, study period and scene-level cloud cover threshold.

### 2. NDVI Calculation
The Normalized Difference Vegetation Index was calculated using the red and near-infrared surface reflectance bands:

NDVI = (NIR − Red) / (NIR + Red)

### 3. NDBI Calculation
The Normalized Difference Built-up Index was calculated using the shortwave-infrared and near-infrared surface reflectance bands:

NDBI = (SWIR − NIR) / (SWIR + NIR)

### 4. Land Surface Temperature
Land Surface Temperature was derived from Landsat thermal band ST_B10 using the Collection 2 Level-2 scaling factor. The resulting temperature was converted from Kelvin to degrees Celsius.

LST (°C) = (ST_B10 × 0.00341802 + 149) − 273.15

### 5. Composite Generation and Export
Median composites were generated for the study period and clipped to the Delhi administrative boundary.

The NDVI, NDBI and LST rasters were exported using a common coordinate reference system and coordinate transform to facilitate spatial alignment and subsequent analysis in Python.

## Subsequent Analysis

The exported raster datasets were processed in Python using Rasterio, NumPy and Pandas for raster alignment, pixel-level data integration, statistical analysis and visualisation.
