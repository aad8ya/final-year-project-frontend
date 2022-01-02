import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import '../App.css'
import * as api from '../api/templates'
import Context from '../store/context.js';
import { env } from '../config.js'
function Certificate() {
    const { store } = React.useContext(Context)
    const [currentCertificate, setCurrentCertificate] = useState(null)
    const [certificates, setCertificates] = useState([])
    const [templates, setTemplates] = useState([])
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [fields, setfields] = useState({})
    const [selectedTemplateId, setSelectedTemplateId] = useState(null)
    const [receiverName, setReceiverName] = useState(null)
    const [email, setEmail] = useState(null)
    useEffect(() => {
        api.getCertificates(store.user.uid).then(res => {
            console.log(res.data)
            setCertificates(res)
        })

    }, [])
    const getTemplates = () => {
        api.getTemplates(store.user.uid).then(res => {
            setTemplates(res)
        })
    }
    const setCurrentCertificateFunc = cert => {
        let imgRef = ref(getStorage(), `${store.user.uid}/certificates/${cert.data.name}`)
        getDownloadURL(imgRef).then(url => {
            setCurrentCertificate({ cert, url })
        })
    }
    const setSelectedTemplateFunc = id => {
        let url = `${env.url}/template/fields/${id}`
        console.log(url)
        axios.get(url).then(res => {
            setSelectedTemplate(res.data)
        })
    }
    const createCertificate = (e) => {
        e.preventDefault()
        console.log(selectedTemplateId)
        let req = {
            uid: store.user.uid,
            templateId: selectedTemplateId,
            receiverName,
            receiverEmail: email,
            fields: fields
        }
        let urls = `${env.url}/certificate/one`
        console.log(urls)
        axios.post(urls, req)
            .then(res => {
                console.log(res)
            }).catch(err => {
                console.log("Error:", err)
            })
    }
    return (
        <div>
            <h3>
                Certificates:
                {
                    certificates.map(cert => {
                        return <div key={cert.id}>
                            <button onClick={() => {
                                setCurrentCertificateFunc(cert)
                            }}>{cert.data.receiverName}</button>
                        </div>
                    })
                }
                {
                    currentCertificate &&
                    <div>
                        <img height={window.innerHeight * 0.7} src={currentCertificate.url} alt="certificate" />
                    </div>
                }
            </h3>
            <button onClick={getTemplates}>Create certificate from template</button>
            {templates &&
                <div>
                    {templates.map(template => {
                        return (
                            <div key={template.id}>
                                <h4>{template.data.name}</h4>
                                <button onClick={() => {
                                    setSelectedTemplateId(template.id)
                                    setSelectedTemplateFunc(template.id)
                                }}>Create certificate from {template.data.name}</button>
                            </div>
                        )
                    }
                    )}
                </div>
            }
            {
                selectedTemplate &&
                <div>
                    <form >
                        <label>Name of receiver</label>
                        <input type="text" placeholder="Name"
                            onChange={(e) => {
                                setReceiverName(e.target.value)
                            }}
                        />
                        <label>Email of receiver</label>
                        <input type="text" placeholder="Email"
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                        />
                        {
                            selectedTemplate.map(field => {
                                return (
                                    <div key={field}>
                                        <label>{field}</label>
                                        <input
                                            type="text"
                                            placeholder={field}
                                            onChange={(e) => {
                                                setfields({ ...fields, [field]: e.target.value })
                                            }}
                                        />
                                    </div>
                                )
                            })
                        }
                        <button onClick={(e) => createCertificate(e)}>Create certificate</button>
                    </form>
                </div>
            }
        </div>
    )
}

export default Certificate
