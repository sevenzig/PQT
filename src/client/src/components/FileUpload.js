// src/client/src/components/FileUpload.js
// version 1.01

import React, { useState } from 'react';
import { uploadData } from '../services/api';

const FileUpload = ({ dataType }) => {
  const [file, setFile] = useState(null);
  const [lotId, setLotId] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleLotIdChange = (event) => {
    setLotId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file || !lotId) {
      setMessage('Please select a file and enter a Lot ID');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('lotId', lotId);

      const response = await uploadData(dataType, formData);
      setMessage(response.message);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Upload {dataType} Data</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="file">Select CSV file:</label>
          <input type="file" id="file" onChange={handleFileChange} accept=".csv" />
        </div>
        <div>
          <label htmlFor="lotId">Lot ID:</label>
          <input type="text" id="lotId" value={lotId} onChange={handleLotIdChange} />
        </div>
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;