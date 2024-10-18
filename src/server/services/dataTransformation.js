// src/server/services/dataTransformation.js
// version 1.01

function transformPurityData(data, lotId) {
    return data.map(item => ({
      lot_id: lotId,
      test_date: new Date().toISOString().split('T')[0], // Current date
      description: item.Description,
      specification: item.Specification,
      result: item.Result,
      method: item.Method,
      pass_fail: item['Pass Fail'],
      evaluation: item.Evaluation
    }));
  }
  
  function transformPotencyData(data, lotId) {
    return data.map(item => ({
      lot_id: lotId,
      test_date: new Date().toISOString().split('T')[0], // Current date
      strain: item['Probiotic Strain Designation'],
      specification: parseFloat(item.Specification),
      result: parseFloat(item.Result)
    }));
  }
  
  function transformActivityData(data, lotId) {
    return data.map(item => ({
      lot_id: lotId,
      test_date: new Date().toISOString().split('T')[0], // Current date
      time_point: item.Time,
      ph: parseFloat(item.pH),
      lactic_acid_percentage: parseFloat(item['% Lactic Acid'])
    }));
  }
  
  module.exports = { transformPurityData, transformPotencyData, transformActivityData };