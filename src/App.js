import React, {useState, useEffect} from 'react';
import axios from 'axios';

import './App.css';
import Axios from 'axios';

const submitData = async (uploadUrl, policyFields,
    file,
    onError,
    onSuccess,
    onProgress
) => {
    const fd = new FormData();
    // // fd.append('key', key);
    // fd.append('acl', 'private');
    fd.append('Content-Type', file.type);
    fd.append('Key', file.name);
    fd.append('file', file, file.name);

    Object.keys(policyFields).forEach(x => {
        fd.append(x, policyFields[x]);
    })

    axios.post(uploadUrl, fd, {
        onUploadProgress: ({loaded, total}) => onProgress((loaded / total) * 100 | 0),
    }).then(resp => {
        console.log(resp);
        if (resp.ok === false) {
            onError(`${resp.type} / ${resp.status}:${resp.statusText}`);
        } else {
            onSuccess();
        }
    }).catch(error => {
        onError(error.toString());
    })
};

export default () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [progress, setProgress] = useState(0);


    const [uploadPolicy, setUploadPolicy] = useState("");
    const [uploadUrl, setUploadUrl] = useState("");
    const [policyFields, setPolicyFields] = useState({});

    const [file, setFile] = useState(null);


    const handleSubmit = (event) => {
        submitData(uploadUrl, policyFields, file,
            setError,
            onUploadSuccess,
            setProgress);
        event.preventDefault();
    };

    const onUploadSuccess = () => {
        setError(false);
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            setFile(null);
            setUploadPolicy("");
            setUploadUrl("");
            setPolicyFields({});
            setProgress(0);
        }, 5 * 1000);
    };

    useEffect(() => {
        if (uploadPolicy) {
            try {
                const {url, fields} = JSON.parse(uploadPolicy);
                setPolicyFields(fields);
                setUploadUrl(url);
                setError("");

            } catch (er) {
                setError("Policy is misformed");
                return;
            }
        }
    }, [uploadPolicy]);

    return (
        <div className="App">
            <header className="App-header">
                <img src='https://emoji.slack-edge.com/T03SYV2JX/hardworkhat/21ac403c40e107d3.png' className="App-logo" alt="logo" />
                <br />
                <br />
                <form onSubmit={handleSubmit}>
                    {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
                    {success && (<div className="alert alert-success" role="alert">Uploaded</div>)}
                    {(progress > 0) && (<div className="form-group">
                        <div className="progress">
                            <div className="progress-bar bg-info" role="progressbar" style={{width: `${progress}%`}} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>)}
                    <div className="form-group">
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="8"
                            value={uploadPolicy}
                            onChange={event => setUploadPolicy(event.target.value)}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <input className="form-control" type="text" placeholder="Upload Url" disabled
                            value={uploadUrl}
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <input className="form-control" type="text" placeholder="Bucket" disabled
                                value={(policyFields || {})['bucket']}
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <input className="form-control" type="text" placeholder="X-Amz-Algorithm" disabled
                                value={(policyFields || {})['X-Amz-Algorithm']}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <input className="form-control" type="text" placeholder="X-Amz-Credential" readOnly disabled
                                value={(policyFields || {})['X-Amz-Credential']} />
                        </div>
                        <div className="form-group col-md-6">
                            <input className="form-control" type="text" placeholder="X-Amz-Date" readOnly disabled
                                value={(policyFields || {})['X-Amz-Date']} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <input className="form-control" type="text" placeholder="Policy" readOnly disabled
                                value={(policyFields || {})['Policy']} />
                        </div>
                        <div className="form-group col-md-6">
                            <input className="form-control" type="text" placeholder="X-Amz-Signature" readOnly disabled
                                value={(policyFields || {})['X-Amz-Signature']} />
                        </div>
                    </div>
                    <div className="form-group">
                        <input type="file" className="form-control-file"
                            onChange={event => setFile(event.target.files[0])}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={[uploadUrl, file].includes(null)}>Upload</button>
                </form>
            </header>
        </div >
    )
};