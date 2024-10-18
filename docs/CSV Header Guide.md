# CSV Header Guide

To ensure your CSV files are processed correctly, please use the following headers for each data type:

## Purity Data CSV

Your CSV should have the following columns:

```
Description,Specification,Result,Method,Pass Fail,Evaluation
```

Example:
```
Description,Specification,Result,Method,Pass Fail,Evaluation
Coliforms,<100 CFU/GM,<100 CFU/GM,AOAC 991.14,Pass,Microbial
E. Coli,Negative/10GM,Negative/10GM,AOAC 991.14,Pass,Microbial
```

## Potency Data CSV

Your CSV should have the following columns:

```
Probiotic Strain Designation,Specification,Result
```

Example:
```
Probiotic Strain Designation,Specification,Result
Lactobacillus acidophilus (LA-1),10,15
Bifidobacterium lactis (BL-04),10,12
```

## Activity Data CSV

Your CSV should have the following columns:

```
Time,pH,% Lactic Acid
```

Example:
```
Time,pH,% Lactic Acid
0h,6.7,0.03
4h,5.5,0.25
6h,4.7,0.4
```

Important Notes:
1. Ensure that the column names match exactly, including capitalization and spaces.
2. Remove any extra header rows or metadata from the top of the CSV file.
3. Make sure all required columns are present, even if some cells are empty.
4. Use a comma (,) as the delimiter in your CSV files.
5. If your data contains commas, enclose the entire field in double quotes.

By following these guidelines, you'll ensure that your CSV files are compatible with the data processing pipeline.