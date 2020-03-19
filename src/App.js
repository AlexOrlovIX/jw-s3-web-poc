import React, {useState, useEffect} from 'react';
import './App.css';

const submitData = async (uploadUrl, {
    AWSAccessKeyId,
    Signature,
}, file, onError) => {
    const fd = new FormData();
    // fd.append('key', key);
    // fd.append('acl', 'private');
    fd.append('Content-Type', file.type);
    fd.append('AWSAccessKeyId', AWSAccessKeyId);
    fd.append('signature', Signature);
    fd.append('file', file, file.name);

    try {
        const resp = await fetch(uploadUrl, {
            body: fd,
            method: 'PUT',
            headers: {
                "Content-Type": "video/mp4"
            }
        });
        if (!resp.ok) {
            throw new Error(`${resp.type} / ${resp.status}:${resp.statusText}`);
        }
    } catch (error) {
        onError(error.toString());
    }
};


export default () => {
    const [error, setError] = useState("");

    const [uploadUrl, setUploadUrl] = useState("");
    const [file, setFile] = useState(null);
    const [AWSAccessKeyId, setAWS] = useState("");
    const [Signature, setSignature] = useState("");
    const [Expires, setExpires] = useState("");

    useEffect(() => {
        if (uploadUrl) {
            try {
                let params = new URLSearchParams((new URL(uploadUrl)).search);
                setAWS(params.get("AWSAccessKeyId"));
                setSignature(params.get("Signature"));
                setExpires(params.get("Expires"));
            } catch {
                setError("Wrong URL");
                return;
            }

        }
    }, [uploadUrl]);

    const handleSubmit = (event) => {
        submitData(uploadUrl, {AWSAccessKeyId, Signature}, file, setError);
        event.preventDefault();
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src='https://emoji.slack-edge.com/T03SYV2JX/hardworkhat/21ac403c40e107d3.png' className="App-logo" alt="logo" />
                <br />
                <br />
                <form onSubmit={handleSubmit}>
                    {error && (<div className="alert alert-danger" role="alert">
                        {error}
                    </div>)}
                    <div className="form-group">
                        <input type="text" className="form-control" aria-describedby="emailHelp" placeholder="Upload File URL"
                            value={uploadUrl}
                            onChange={event => setUploadUrl(event.target.value)}
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <input className="form-control" type="text" placeholder="AWSAccessKeyId" readOnly disabled
                                value={AWSAccessKeyId}
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <input className="form-control" type="text" placeholder="Signature" readOnly disabled
                                value={Signature} />
                        </div>
                        <div className="form-group col-md-6">
                            <input className="form-control" type="text" placeholder="Expires" readOnly disabled
                                value={Expires && (new Date(Expires * 1000))} />
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
