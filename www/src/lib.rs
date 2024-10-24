use wasm_bindgen::prelude::*;
use web_sys::{Document, Element, window};
use deadpool_postgres::{Config, Pool, Runtime};
use tokio_postgres::NoTls;
use std::sync::Arc;
use dotenv::dotenv;
use std::env;

// Logging helper
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

// Data structures
#[derive(serde::Serialize, serde::Deserialize)]
struct PurityData {
    description: String,
    specification: String,
    result: String,
    pass_fail: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct PotencyData {
    strain: String,
    specification: f64,
    result: f64,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct ActivityData {
    time: String,
    ph: f64,
    lactic_acid: f64,
}

// Database connection pool
struct DbPool(Arc<Pool>);

impl DbPool {
    fn new() -> Result<Self, Box<dyn std::error::Error>> {
        dotenv().ok();
        
        let mut cfg = Config::new();
        cfg.host = env::var("POSTGRES_HOST").ok();
        cfg.port = env::var("POSTGRES_PORT")
            .ok()
            .and_then(|p| p.parse().ok());
        cfg.dbname = env::var("POSTGRES_DB").ok();
        cfg.user = env::var("POSTGRES_USER").ok();
        cfg.password = env::var("POSTGRES_PASSWORD").ok();
        
        let pool = cfg.create_pool(Some(Runtime::Tokio1), NoTls)?;
        Ok(DbPool(Arc::new(pool)))
    }
}

// Database functions
async fn fetch_purity_data(lot_id: i32, pool: &Pool) -> Result<Vec<PurityData>, tokio_postgres::Error> {
    let client = pool.get().await?;
    
    let rows = client.query(
        "SELECT description, specification, result, pass_fail 
         FROM purity_results 
         WHERE lot_id = $1 
         ORDER BY test_date DESC",
        &[&lot_id],
    ).await?;

    let results = rows.iter().map(|row| PurityData {
        description: row.get("description"),
        specification: row.get("specification"),
        result: row.get("result"),
        pass_fail: row.get("pass_fail"),
    }).collect();

    Ok(results)
}

async fn fetch_potency_data(lot_id: i32, pool: &Pool) -> Result<Vec<PotencyData>, tokio_postgres::Error> {
    let client = pool.get().await?;
    
    let rows = client.query(
        "SELECT strain, specification, result 
         FROM potency_results 
         WHERE lot_id = $1 
         ORDER BY test_date DESC",
        &[&lot_id],
    ).await?;

    let results = rows.iter().map(|row| PotencyData {
        strain: row.get("strain"),
        specification: row.get("specification"),
        result: row.get("result"),
    }).collect();

    Ok(results)
}

async fn fetch_activity_data(lot_id: i32, pool: &Pool) -> Result<Vec<ActivityData>, tokio_postgres::Error> {
    let client = pool.get().await?;
    
    let rows = client.query(
        "SELECT time_point as time, ph, lactic_acid_percentage as lactic_acid
         FROM activity_results 
         WHERE lot_id = $1 
         ORDER BY time_point",
        &[&lot_id],
    ).await?;

    let results = rows.iter().map(|row| ActivityData {
        time: row.get("time"),
        ph: row.get("ph"),
        lactic_acid: row.get("lactic_acid"),
    }).collect();

    Ok(results)
}

async fn fetch_lot_info(lot_number: &str, pool: &Pool) -> Result<Option<i32>, tokio_postgres::Error> {
    let client = pool.get().await?;
    
    let row = client.query_opt(
        "SELECT l.id 
         FROM lots l
         JOIN products p ON l.product_id = p.id
         WHERE l.lot_number = $1",
        &[&lot_number],
    ).await?;

    Ok(row.map(|r| r.get("id")))
}

#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    console_log!("WASM module initialized");
    Ok(())
}

#[wasm_bindgen]
pub fn initialize_dashboard() -> Result<(), JsValue> {
    let window = window().unwrap();
    let document = window.document().unwrap();
    console_log!("Dashboard initialized");
    Ok(())
}

#[wasm_bindgen]
pub async fn load_lot_data(lot_number: String) -> Result<(), JsValue> {
    console_log!("Loading data for lot {}", lot_number);
    
    let pool = DbPool::new()
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    
    let lot_id = fetch_lot_info(&lot_number, &pool.0)
        .await
        .map_err(|e| JsValue::from_str(&e.to_string()))?
        .ok_or_else(|| JsValue::from_str("Lot not found"))?;
    
    // Fetch all data
    let purity_data = fetch_purity_data(lot_id, &pool.0)
        .await
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    
    let potency_data = fetch_potency_data(lot_id, &pool.0)
        .await
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    
    let activity_data = fetch_activity_data(lot_id, &pool.0)
        .await
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    
    // Update the displays
    update_purity_data(serde_json::to_string(&purity_data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?)?;
        
    update_potency_data(serde_json::to_string(&potency_data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?)?;
        
    update_activity_data(serde_json::to_string(&activity_data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?)?;
    
    Ok(())
}

#[wasm_bindgen]
pub fn update_purity_data(data: String) -> Result<(), JsValue> {
    console_log!("Processing purity data update...");
    let _purity_data: Vec<PurityData> = serde_json::from_str(&data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    Ok(())
}

#[wasm_bindgen]
pub fn update_potency_data(data: String) -> Result<(), JsValue> {
    console_log!("Processing potency data update...");
    let potency_data: Vec<PotencyData> = serde_json::from_str(&data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    
    let window = window().unwrap();
    let document = window.document().unwrap();
    
    // Find or create chart container
    let content_div = document.get_element_by_id("potency-content")
        .ok_or_else(|| JsValue::from_str("Could not find potency-content element"))?;
    
    // Clear existing content
    content_div.set_inner_html("");
    
    // Create SVG chart
    let svg = create_svg_element(&document, "svg")?;
    svg.set_attribute("viewBox", "0 0 600 400")?;
    svg.set_attribute("class", "w-full h-full")?;
    
    // Find max values for scaling
    let max_value = potency_data.iter()
        .map(|d| f64::max(d.result, d.specification))
        .fold(0.0, f64::max);
    
    // Create axes
    let axes = create_svg_element(&document, "g")?;
    
    // X axis
    let x_axis = create_svg_element(&document, "line")?;
    x_axis.set_attribute("x1", "50")?;
    x_axis.set_attribute("y1", "350")?;
    x_axis.set_attribute("x2", "550")?;
    x_axis.set_attribute("y2", "350")?;
    x_axis.set_attribute("stroke", "#000")?;
    x_axis.set_attribute("stroke-width", "2")?;
    axes.append_child(&x_axis)?;
    
    // Y axis
    let y_axis = create_svg_element(&document, "line")?;
    y_axis.set_attribute("x1", "50")?;
    y_axis.set_attribute("y1", "50")?;
    y_axis.set_attribute("x2", "50")?;
    y_axis.set_attribute("y2", "350")?;
    y_axis.set_attribute("stroke", "#000")?;
    y_axis.set_attribute("stroke-width", "2")?;
    axes.append_child(&y_axis)?;
    
    svg.append_child(&axes)?;
    
    // Create bars
    let bar_width = 400.0 / (potency_data.len() * 3) as f64;
    let spacing = bar_width / 2.0;
    
    for (i, data) in potency_data.iter().enumerate() {
        let x = 75.0 + (i as f64 * (bar_width * 3.0));
        
        // Result bar
        let result_height = (data.result / max_value) * 300.0;
        let result_bar = create_svg_element(&document, "rect")?;
        result_bar.set_attribute("x", &x.to_string())?;
        result_bar.set_attribute("y", &(350.0 - result_height).to_string())?;
        result_bar.set_attribute("width", &bar_width.to_string())?;
        result_bar.set_attribute("height", &result_height.to_string())?;
        result_bar.set_attribute("fill", "#2563eb")?;
        
        // Specification bar
        let spec_height = (data.specification / max_value) * 300.0;
        let spec_bar = create_svg_element(&document, "rect")?;
        spec_bar.set_attribute("x", &(x + bar_width + spacing).to_string())?;
        spec_bar.set_attribute("y", &(350.0 - spec_height).to_string())?;
        spec_bar.set_attribute("width", &bar_width.to_string())?;
        spec_bar.set_attribute("height", &spec_height.to_string())?;
        spec_bar.set_attribute("fill", "#9333ea")?;
        
        // Label
        let label = create_svg_element(&document, "text")?;
        label.set_attribute("x", &(x + bar_width).to_string())?;
        label.set_attribute("y", "370")?;
        label.set_attribute("text-anchor", "middle")?;
        label.set_attribute("class", "text-sm fill-gray-600")?;
        label.set_text_content(Some(&data.strain));
        
        svg.append_child(&result_bar)?;
        svg.append_child(&spec_bar)?;
        svg.append_child(&label)?;
    }
    
    // Add legend
    let legend = create_svg_element(&document, "g")?;
    legend.set_attribute("transform", "translate(450, 30)")?;
    
    // Result legend
    let result_rect = create_svg_element(&document, "rect")?;
    result_rect.set_attribute("x", "0")?;
    result_rect.set_attribute("y", "0")?;
    result_rect.set_attribute("width", "20")?;
    result_rect.set_attribute("height", "10")?;
    result_rect.set_attribute("fill", "#2563eb")?;
    legend.append_child(&result_rect)?;
    
    let result_text = create_svg_element(&document, "text")?;
    result_text.set_attribute("x", "25")?;
    result_text.set_attribute("y", "9")?;
    result_text.set_attribute("class", "text-sm fill-gray-600")?;
    result_text.set_text_content(Some("Result"));
    legend.append_child(&result_text)?;
    
    // Specification legend
    let spec_rect = create_svg_element(&document, "rect")?;
    spec_rect.set_attribute("x", "0")?;
    spec_rect.set_attribute("y", "20")?;
    spec_rect.set_attribute("width", "20")?;
    spec_rect.set_attribute("height", "10")?;
    spec_rect.set_attribute("fill", "#9333ea")?;
    legend.append_child(&spec_rect)?;
    
    let spec_text = create_svg_element(&document, "text")?;
    spec_text.set_attribute("x", "25")?;
    spec_text.set_attribute("y", "29")?;
    spec_text.set_attribute("class", "text-sm fill-gray-600")?;
    spec_text.set_text_content(Some("Specification"));
    legend.append_child(&spec_text)?;
    
    svg.append_child(&legend)?;
    
    // Add to content div
    content_div.append_child(&svg)?;
    
    Ok(())
}

#[wasm_bindgen]
pub fn update_activity_data(data: String) -> Result<(), JsValue> {
    console_log!("Processing activity data update...");
    let _activity_data: Vec<ActivityData> = serde_json::from_str(&data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    Ok(())
}

fn create_svg_element(document: &Document, name: &str) -> Result<Element, JsValue> {
    document.create_element_ns(Some("http://www.w3.org/2000/svg"), name)
}