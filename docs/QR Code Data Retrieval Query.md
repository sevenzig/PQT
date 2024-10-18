-- Assuming the QR code encodes a URL like:
-- /quality-report/{manufacturer_name}/{product_name}/{lot_number}

-- Main query to retrieve all necessary data
WITH lot_info AS (
    SELECT l.id AS lot_id, m.name AS manufacturer_name, p.name AS product_name, l.lot_number
    FROM lots l
    JOIN products p ON l.product_id = p.id
    JOIN manufacturers m ON p.manufacturer_id = m.id
    WHERE m.name = :manufacturer_name
      AND p.name = :product_name
      AND l.lot_number = :lot_number
)
SELECT 
    li.manufacturer_name,
    li.product_name,
    li.lot_number,
    'purity' AS result_type,
    pr.test_date,
    pr.description,
    pr.specification,
    pr.result,
    pr.pass_fail
FROM lot_info li
LEFT JOIN purity_results pr ON li.lot_id = pr.lot_id

UNION ALL

SELECT 
    li.manufacturer_name,
    li.product_name,
    li.lot_number,
    'potency' AS result_type,
    por.test_date,
    por.strain AS description,
    por.specification::text,
    por.result::text,
    CASE WHEN por.result >= por.specification THEN 'Pass' ELSE 'Fail' END AS pass_fail
FROM lot_info li
LEFT JOIN potency_results por ON li.lot_id = por.lot_id

UNION ALL

SELECT 
    li.manufacturer_name,
    li.product_name,
    li.lot_number,
    'activity' AS result_type,
    ar.test_date,
    ar.time_point AS description,
    'N/A' AS specification,
    'pH: ' || ar.ph::text || ', Lactic Acid: ' || ar.lactic_acid_percentage::text || '%' AS result,
    'N/A' AS pass_fail
FROM lot_info li
LEFT JOIN activity_results ar ON li.lot_id = ar.lot_id

ORDER BY result_type, test_date, description;