# Probiotic Quality Tracker API Documentation

## Base URL

All URLs referenced in the documentation have the following base:
```
http://localhost:3000/api
```

## Authentication

All endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Upload Purity Data

Upload a CSV file containing purity test results.

- **URL:** `/admin/upload-purity`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

#### Request Body

| Field | Type | Description |
|-------|------|-------------|
| file  | File | CSV file containing purity data |
| lotId | String | ID of the lot associated with this data |

#### Response

- **Success Response:** HTTP 200
  ```json
  {
    "message": "Data uploaded successfully"
  }
  ```
- **Error Response:** HTTP 400 or 500
  ```json
  {
    "error": "Error message"
  }
  ```

### 2. Upload Potency Data

Upload a CSV file containing potency test results.

- **URL:** `/admin/upload-potency`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

#### Request Body

| Field | Type | Description |
|-------|------|-------------|
| file  | File | CSV file containing potency data |
| lotId | String | ID of the lot associated with this data |

#### Response

- **Success Response:** HTTP 200
  ```json
  {
    "message": "Data uploaded successfully"
  }
  ```
- **Error Response:** HTTP 400 or 500
  ```json
  {
    "error": "Error message"
  }
  ```

### 3. Upload Activity Data

Upload a CSV file containing activity test results.

- **URL:** `/admin/upload-activity`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

#### Request Body

| Field | Type | Description |
|-------|------|-------------|
| file  | File | CSV file containing activity data |
| lotId | String | ID of the lot associated with this data |

#### Response

- **Success Response:** HTTP 200
  ```json
  {
    "message": "Data uploaded successfully"
  }
  ```
- **Error Response:** HTTP 400 or 500
  ```json
  {
    "error": "Error message"
  }
  ```

### 4. Get Quality Report

Retrieve the quality report for a specific product lot.

- **URL:** `/quality-report/:manufacturer/:product/:lot`
- **Method:** `GET`

#### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| manufacturer | String | Name of the manufacturer |
| product | String | Name of the product |
| lot | String | Lot number |

#### Response

- **Success Response:** HTTP 200
  ```json
  {
    "manufacturerName": "Example Manufacturer",
    "productName": "Example Product",
    "lotNumber": "LOT123",
    "purity": [
      {
        "description": "E. Coli",
        "specification": "Negative/10GM",
        "result": "Negative/10GM",
        "pass_fail": "Pass"
      }
      // ... other purity results
    ],
    "potency": [
      {
        "strain": "Lactobacillus acidophilus (LA-1)",
        "specification": 10,
        "result": 15
      }
      // ... other potency results
    ],
    "activity": [
      {
        "time_point": "0h",
        "ph": 6.7,
        "lactic_acid_percentage": 0.03
      }
      // ... other activity results
    ]
  }
  ```
- **Error Response:** HTTP 404 or 500
  ```json
  {
    "error": "Error message"
  }
  ```

### 5. Create New Lot

Create a new lot for a specific product.

- **URL:** `/admin/lots`
- **Method:** `POST`
- **Content-Type:** `application/json`

#### Request Body

```json
{
  "productId": "123",
  "lotNumber": "LOT123",
  "productionDate": "2023-05-15",
  "expirationDate": "2024-05-15"
}
```

#### Response

- **Success Response:** HTTP 201
  ```json
  {
    "id": "456",
    "productId": "123",
    "lotNumber": "LOT123",
    "productionDate": "2023-05-15",
    "expirationDate": "2024-05-15"
  }
  ```
- **Error Response:** HTTP 400 or 500
  ```json
  {
    "error": "Error message"
  }
  ```

## Error Responses

All endpoints may return the following error responses:

- **401 Unauthorized:**
  ```json
  {
    "error": "Authentication required"
  }
  ```

- **403 Forbidden:**
  ```json
  {
    "error": "You do not have permission to perform this action"
  }
  ```

- **500 Internal Server Error:**
  ```json
  {
    "error": "An unexpected error occurred"
  }
  ```

## CSV File Requirements

For detailed information on CSV file structure for data uploads, please refer to the CSV Header Guide in the project documentation.