import React, { useState } from 'react';
import axios from 'axios';

export default function UploadFile() {
    const [files, setFiles] = useState([]);
    const [result, setResult] = useState(false);

    const handleFileChange = (e) => { setFiles(e.target.files) };

    const uploadTheFile = async () => {
        const formData = new FormData();
        for (let file of files) {
            formData.append('files', file);
        } try {
            await axios.post('/api/upload', formData, {
                'headers': {
                    'content-type': 'multipart/form-data',
                }
            });
            alert("files uploaded successfully");
            setResult(!result);
        } catch (error) {
            console.error('Error uploading the file');
            alert("failed to upload the files");
        }
    }

    return (
        <>
            <label >select the folder having the forms</label>
            <br />
            {/* to choose the directory which have html/aspx files */}
            <input type="file" directory="" webkitdirectory="" multiple onChange={handleFileChange} />
            <br />
            <br />
            <button type='submit' onClick={uploadTheFile}>File upload</button>
        </>
    )
}
