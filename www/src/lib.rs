use wasm_bindgen::prelude::*;
use web_sys::{Document, Element, HtmlElement, window};
use serde::{Deserialize, Serialize};

// Data structures
#[derive(Serialize, Deserialize)]
struct PurityData {
    description: String,
    specification: String,
    result: String,
    method: String,
    pass_fail: String,
}

#[derive(Serialize, Deserialize)]
struct PotencyData {
    strain: String,
    specification: f64,
    result: f64,
}

#[derive(Serialize, Deserialize)]
struct ActivityData {
    time: String,
    ph: f64,
    lactic_acid: f64,
}

// Main WASM initialization
#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    let window = window().unwrap();
    let document = window.document().unwrap();
    
    create_dashboard(&document)?;
    Ok(())
}

// Create main dashboard structure
#[wasm_bindgen]
pub fn create_dashboard(document: &Document) -> Result<(), JsValue> {
    // Create root container
    let container = document.create_element("div")?;
    container.set_class_name("flex h-screen bg-gray-100");
    
    // Add left navigation
    container.append_child(&create_left_nav(document)?)?;
    
    // Add summary panel
    container.append_child(&create_summary_panel(document)?)?;
    
    // Add main content
    container.append_child(&create_main_content(document)?)?;
    
    // Append to body
    document.body()
        .unwrap()
        .append_child(&container)?;
    
    Ok(())
}

// Create left navigation
fn create_left_nav(document: &Document) -> Result<Element, JsValue> {
    let nav = document.create_element("div")?;
    nav.set_class_name("w-16 bg-blue-600 text-white h-screen flex flex-col items-center py-4");
    
    // Add logo
    let logo = document.create_element("img")?;
    logo.set_attribute("src", "/api/placeholder/40/40")?;
    logo.set_class_name("rounded-lg mb-8");
    nav.append_child(&logo)?;
    
    // Add navigation buttons
    let icons = vec!["⊞", "📊", "🏢", "📦", "📄"];
    for icon in icons {
        let button = document.create_element("button")?;
        button.set_class_name("p-3 mb-4 hover:bg-blue-700 rounded-full text-xl");
        button.set_text_content(Some(icon));
        nav.append_child(&button)?;
    }
    
    Ok(nav)
}

// Helper function to create sections
fn create_section(document: &Document, title: &str) -> Result<Element, JsValue> {
    let section = document.create_element("div")?;
    section.set_class_name("bg-white rounded-lg shadow-sm mb-6");
    
    let header = document.create_element("div")?;
    header.set_class_name("p-4 border-b border-gray-200");
    
    let title_elem = document.create_element("h2")?;
    title_elem.set_class_name("text-lg font-semibold text-gray-900 font-inter");
    title_elem.set_text_content(Some(title));
    
    header.append_child(&title_elem)?;
    section.append_child(&header)?;
    
    Ok(section)
}

// Create purity table
fn create_purity_table(document: &Document) -> Result<Element, JsValue> {
    let table = document.create_element("table")?;
    table.set_class_name("w-full");
    
    // Create table header
    let thead = document.create_element("thead")?;
    thead.set_class_name("bg-gray-50");
    
    let headers = vec!["Description", "Specification", "Result", "Method", "Status"];
    let tr = document.create_element("tr")?;
    
    for header in headers {
        let th = document.create_element("th")?;
        th.set_class_name("text-left px-6 py-4 text-sm font-medium text-gray-600 font-inter");
        th.set_text_content(Some(header));
        tr.append_child(&th)?;
    }
    
    thead.append_child(&tr)?;
    table.append_child(&thead)?;
    
    Ok(table)
}

// Update table with data
#[wasm_bindgen]
pub fn update_purity_data(data: &JsValue) -> Result<(), JsValue> {
    let purity_data: Vec<PurityData> = serde_json::from_str(
        &data.as_string().unwrap()
    ).unwrap();
    
    let document = window().unwrap().document().unwrap();
    let table = document.get_element_by_id("purityTable").unwrap();
    let tbody = table.query_selector("tbody").unwrap().unwrap();
    
    for row in purity_data {
        let tr = document.create_element("tr")?;
        tr.set_class_name("hover:bg-gray-50");
        
        let cells = vec![
            row.description,
            row.specification,
            row.result,
            row.method,
            if row.pass_fail == "Pass" { "✓".to_string() } else { "".to_string() }
        ];
        
        for cell_text in cells {
            let td = document.create_element("td")?;
            td.set_class_name("px-6 py-4 text-sm text-gray-600 font-inter");
            td.set_text_content(Some(&cell_text));
            tr.append_child(&td)?;
        }
        
        tbody.append_child(&tr)?;
    }
    
    Ok(())
}

// Create charts
#[wasm_bindgen]
pub fn create_potency_chart(data: &JsValue) -> Result<(), JsValue> {
    let potency_data: Vec<PotencyData> = serde_json::from_str(
        &data.as_string().unwrap()
    ).unwrap();
    
    let document = window().unwrap().document().unwrap();
    let container = document.get_element_by_id("potencyChart").unwrap();
    
    for item in potency_data {
        let bar_group = document.create_element("div")?;
        bar_group.set_class_name("flex flex-col items-center");
        
        // Create bars
        let bars = document.create_element("div")?;
        bars.set_class_name("h-40 flex items-end");
        
        // Specification bar
        let spec_bar = document.create_element("div")?;
        spec_bar.set_class_name("w-12 bg-gray-200 mr-1");
        spec_bar.set_attribute("style", &format!("height: {}%", (item.specification/15.0)*100.0))?;
        
        // Result bar
        let result_bar = document.create_element("div")?;
        result_bar.set_class_name("w-12 bg-blue-500");
        result_bar.set_attribute("style", &format!("height: {}%", (item.result/15.0)*100.0))?;
        
        bars.append_child(&spec_bar)?;
        bars.append_child(&result_bar)?;
        bar_group.append_child(&bars)?;
        
        // Label
        let label = document.create_element("div")?;
        label.set_class_name("text-sm text-gray-600 transform -rotate-45 origin-top-left mt-4");
        label.set_text_content(Some(&item.strain));
        bar_group.append_child(&label)?;
        
        container.append_child(&bar_group)?;
    }
    
    Ok(())
}