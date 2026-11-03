# Urban Heat Island Analysis of Delhi

### Relationship Between Land Surface Temperature, Vegetation and Urbanization

## Overview

This project investigates the spatial distribution of Land Surface Temperature (LST) across Delhi and examines its relationship with vegetation cover and built-up characteristics using satellite-derived indices.

The analysis uses Landsat 8 Collection 2 Level-2 imagery for April–June 2025. Statistical techniques, including correlation analysis and linear regression, are used to examine the associations between LST, the Normalized Difference Vegetation Index (NDVI), and the Normalized Difference Built-up Index (NDBI).

## Research Objective

To investigate how spatial variations in vegetation and built-up characteristics are associated with land surface temperature across Delhi.

## Data and Tools

**Satellite data:** Landsat 8 Collection 2 Level-2  
**Study area:** Delhi, India  
**Study period:** April–June 2025

**Tools and libraries:**
- Google Earth Engine
- Python
- Google Colab
- NumPy and Pandas
- Matplotlib and Seaborn
- Rasterio
- Scikit-learn / Statsmodels

## Methodology

### 1. Land Surface Temperature (LST)

LST was derived from the Landsat 8 thermal band (ST_B10), applying the appropriate scale factor and converting Kelvin to degrees Celsius.

### 2. Normalized Difference Vegetation Index (NDVI)

NDVI was calculated using scaled near-infrared and red surface reflectance:

NDVI = (NIR − Red) / (NIR + Red)

Higher NDVI values generally indicate greater vegetation density.

### 3. Normalized Difference Built-up Index (NDBI)

NDBI was calculated using scaled shortwave-infrared and near-infrared surface reflectance:

NDBI = (SWIR − NIR) / (SWIR + NIR)

Higher NDBI values generally indicate stronger built-up characteristics.

### 4. Statistical Analysis

Pearson correlation and linear regression were used to examine relationships between LST, NDVI and NDBI. A multiple linear regression model was also fitted using both indices as predictors.

## Key Results

| Parameter | Result |
|---|---:|
| Mean LST | 40.67 °C |
| Mean NDVI | 0.297 |
| Mean NDBI | -0.038 |
| NDVI–LST correlation | -0.463 |
| NDBI–LST correlation | +0.645 |
| Multiple regression R² | 0.427 |

### Interpretation

- NDVI exhibited a moderate negative association with LST, suggesting that areas with greater vegetation cover tended to have lower surface temperatures.
- NDBI showed a positive association with LST, indicating that areas with stronger built-up characteristics tended to have higher surface temperatures.
- NDBI demonstrated a stronger individual correlation with LST than NDVI.
- The multiple regression model using NDVI and NDBI explained approximately 42.7% of the observed variation in LST.

## Spatial Visualisations

The `figures/` directory contains:
- Land Surface Temperature map
- NDVI spatial distribution map
- NDBI spatial distribution map
- Correlation heatmap
- Regression scatterplots
- Quartile analysis plots

## Limitations

- The analysis covers a limited seasonal period (April–June 2025).
- Land Surface Temperature is not equivalent to near-surface air temperature.
- Spatial autocorrelation between neighbouring satellite pixels may affect conventional regression assumptions.
- The analysis identifies statistical associations and does not establish causal relationships.
- A rural reference comparison would be required for a more direct assessment of urban heat island intensity.

## Conclusion

The analysis identifies meaningful spatial associations between land surface temperature, vegetation and built-up characteristics across Delhi. The findings suggest that vegetation and urban surface characteristics are important factors associated with spatial variations in surface heating.


