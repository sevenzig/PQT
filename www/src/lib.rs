use wasm_bindgen::prelude::*;
use web_sys::{Document, Element, window};

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
    method: String,
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

#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    console_log!("WASM module initialized");
    Ok(())
}

#[wasm_bindgen]
pub fn initialize_dashboard() -> Result<(), JsValue> {
    let window = window().unwrap();
    let document = window.document().unwrap();
    console_log!("Creating dashboard structure...");
    
    let container = document.create_element("div")?;
    container.set_class_name("flex h-screen bg-gray-100");
    
    // Create and append left navigation
    let left_nav = create_left_nav(&document)?;
    container.append_child(&left_nav)?;
    
    // Create and append summary panel
    let summary_panel = create_summary_panel(&document)?;
    container.append_child(&summary_panel)?;
    
    // Create and append main content
    let main_content = create_main_content(&document)?;
    container.append_child(&main_content)?;
    
    // Append the container to body
    document.body()
        .unwrap()
        .append_child(&container)?;
    
    console_log!("Dashboard structure created successfully");
    Ok(())
}

fn create_left_nav(document: &Document) -> Result<Element, JsValue> {
    let nav = document.create_element("div")?;
    nav.set_class_name("w-16 bg-blue-600 text-white h-screen flex flex-col items-center py-4");
    
    // Add logo
    let logo = document.create_element("img")?;
    logo.set_attribute("src", "/api/placeholder/40/40")?;
    logo.set_class_name("rounded-lg mb-8");
    nav.append_child(&logo)?;
    
    // Add navigation buttons with Unicode icons
    let icons = ["⊞", "📊", "🏢", "📦", "📄"];
    for icon in icons.iter() {
        let button = document.create_element("button")?;
        button.set_class_name("p-3 mb-4 hover:bg-blue-700 rounded-full text-xl");
        button.set_text_content(Some(icon));
        nav.append_child(&button)?;
    }
    
    Ok(nav)
}

fn create_summary_panel(document: &Document) -> Result<Element, JsValue> {
    let panel = document.create_element("div")?;
    panel.set_class_name("w-72 bg-white border-r border-gray-200 h-screen overflow-auto");
    
    let content = document.create_element("div")?;
    content.set_class_name("p-6");
    
    // Add header image
    let header_img = document.create_element("img")?;
    header_img.set_attribute("src", "/api/placeholder/240/60")?;
    header_img.set_class_name("rounded-lg mb-6");
    content.append_child(&header_img)?;
    
    // Add title
    let title = document.create_element("h2")?;
    title.set_class_name("text-xl font-semibold mb-6 text-gray-800");
    title.set_text_content(Some("Lot Summary"));
    content.append_child(&title)?;
    
    panel.append_child(&content)?;
    Ok(panel)
}

fn create_main_content(document: &Document) -> Result<Element, JsValue> {
    let content = document.create_element("div")?;
    content.set_class_name("flex-1 flex");
    
    let inner = document.create_element("div")?;
    inner.set_class_name("flex-1 overflow-auto p-6");
    
    // Add header
    let header = document.create_element("h1")?;
    header.set_class_name("text-2xl font-semibold mb-6");
    header.set_text_content(Some("Quality Report"));
    inner.append_child(&header)?;
    
    content.append_child(&inner)?;
    Ok(content)
}

// Data update functions
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
    let _potency_data: Vec<PotencyData> = serde_json::from_str(&data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    Ok(())
}

#[wasm_bindgen]
pub fn update_activity_data(data: String) -> Result<(), JsValue> {
    console_log!("Processing activity data update...");
    let _activity_data: Vec<ActivityData> = serde_json::from_str(&data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    Ok(())
}