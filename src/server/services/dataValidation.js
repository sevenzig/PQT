// src/server/services/dataValidation.js
// version 1.01

function validatePurityData(data) {
    return data.map(item => {
      const errors = [];
      if (!item.Description) errors.push('Missing Description');
      if (!item.Specification) errors.push('Missing Specification');
      if (!item.Result) errors.push('Missing Result');
      if (!item.Method) errors.push('Missing Method');
      if (!item['Pass Fail']) errors.push('Missing Pass/Fail');
      if (!item.Evaluation) errors.push('Missing Evaluation');
      
      return {
        ...item,
        validationErrors: errors.length > 0 ? errors : null
      };
    });
  }
  
  function validatePotencyData(data) {
    return data.map(item => {
      const errors = [];
      if (!item['Probiotic Strain Designation']) errors.push('Missing Probiotic Strain Designation');
      if (!item.Specification) errors.push('Missing Specification');
      if (!item.Result) errors.push('Missing Result');
      
      return {
        ...item,
        validationErrors: errors.length > 0 ? errors : null
      };
    });
  }
  
  function validateActivityData(data) {
    return data.map(item => {
      const errors = [];
      if (!item.Time) errors.push('Missing Time');
      if (!item.pH) errors.push('Missing pH');
      if (!item['% Lactic Acid']) errors.push('Missing % Lactic Acid');
      
      return {
        ...item,
        validationErrors: errors.length > 0 ? errors : null
      };
    });
  }
  
  module.exports = { validatePurityData, validatePotencyData, validateActivityData };