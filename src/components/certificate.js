import React, { useEffect, useState } from "react";
import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../App.css";
import * as api from "../api/templates";
import Context from "../store/context.js";
import { env } from "../config.js";
function Certificate() {
  const { store } = React.useContext(Context);
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [fields, setfields] = useState({});
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [receiverName, setReceiverName] = useState(null);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [email, setEmail] = useState(null);

  const labelStyles = {
    marginRight: 10,
    fontFamily: "monospace",
    fontSize: 16,
  };

  const createCertificate = (e) => {
    e.preventDefault();
    console.log(selectedTemplateId);
    let req = {
      uid: store.user.uid,
      templateId: selectedTemplateId,
      receiverName,
      receiverEmail: email,
      fields: fields,
      isShareable: true,
    };
    let urls = `${env.url}/certificate/one`;
    console.log(urls);
    axios
      .post(urls, req)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  useEffect(() => {
    api.getCertificates(store.user.uid).then((res) => {
      console.log("certificates");
      console.log(res.data);
      setCertificates(res);
    });
  }, []);

  const resetSelectedCertificateData = () => {
    setSelectedTemplate(null);
    setfields({});
    setSelectedTemplateId(null);
    setReceiverName(null);
    setEmail(null);
    setSelectedTemplateName("");
  };

  const getTemplates = () => {
    api.getTemplates(store.user.uid).then((res) => {
      setTemplates(res);
    });
    resetSelectedCertificateData();
    setCurrentCertificate(null);
  };

  const setCurrentCertificateFunc = (cert) => {
    let imgRef = ref(getStorage(), `/certificates/${cert.data.name}`);
    getDownloadURL(imgRef).then((url) => {
      setCurrentCertificate({ cert, url });
    });
    setTemplates([]);
    resetSelectedCertificateData();
  };

  const setSelectedTemplateFunc = (id) => {
    let url = `${env.url}/template/fields/${id}`;
    console.log(url);
    axios.get(url).then((res) => {
      setSelectedTemplate(res.data);
    });
  };

  return (
    <div style={{ width: "100%", height: "90%", display: "flex" }}>
      <div
        style={{
          width: "20%",
          borderRight: "2px solid #BED7E1",
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="button button1"
          onClick={getTemplates}
          style={{ border: "2px solid #BED7E1", margin: "5px 10px" }}
        >
          Create certificate from template
        </div>
        <span
          style={{
            marginLeft: 10,
            fontFamily: "monospace",
            fontSize: 18,
            fontWeight: "bold",
            color: "gray",
          }}
        >
          Issued Certificates:
        </span>
        {certificates.map((cert) => {
          return (
            <div
              className="button button1"
              key={cert.id}
              style={{
                width: 200,
                margin: "4px auto",
                marginLeft: 10,
              }}
              onClick={() => {
                setCurrentCertificateFunc(cert);
              }}
            >
              {cert.data.receiverName}
            </div>
          );
        })}
      </div>
      <div style={{ width: "80%", display: "flex" }}>
        <div style={{ margin: 30 }}>
          {currentCertificate && (
            <div style={{ margin: "auto" }}>
              <img
                height={window.innerHeight * 0.7}
                src={currentCertificate.url}
                alt="certificate"
              />
              <div
                style={{
                  fontFamily: "monospace",
                  textDecoration: "underline",
                  color: "blue",
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `localhost:3000/view_certificate/${currentCertificate.cert.data.name}`
                  );
                  alert("Copied link to clipboard");
                }}
              >{`localhost:3000/view_certificate/${currentCertificate.cert.data.name}`}</div>
            </div>
          )}
          <div>
            {templates.length > 0 && (
              <>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 28,
                    fontWeight: "bold",
                  }}
                >
                  Templates:
                </span>
                {templates.map((template) => {
                  return (
                    <div
                      key={template.id}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        height: 70,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 20,
                          fontFamily: "monospace",
                          color: "gray",
                          margin: "auto 10px",
                        }}
                      >
                        {template.data.name}
                      </div>
                      <div
                        className="button button1"
                        style={{
                          margin: "auto 10px",
                          border: "1px solid #BED7E1",
                        }}
                        onClick={() => {
                          setSelectedTemplateName(template.data.name);
                          setSelectedTemplateId(template.id);
                          setSelectedTemplateFunc(template.id);
                          setTemplates([]);
                        }}
                      >
                        Create certificate
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            {selectedTemplate && (
              <div>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 28,
                    fontWeight: "bold",
                  }}
                >
                  {selectedTemplateName}
                </span>
                <form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: 15,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginBottom: 10,
                    }}
                  >
                    <label style={labelStyles}>Name of receiver</label>
                    <input
                      type="text"
                      placeholder="Name"
                      onChange={(e) => {
                        setReceiverName(e.target.value);
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginBottom: 10,
                    }}
                  >
                    <label style={labelStyles}>Email of receiver</label>
                    <input
                      type="text"
                      placeholder="Email"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                  {selectedTemplate.map((field) => {
                    return (
                      <div key={field} style={{ marginBottom: 10 }}>
                        <label
                          style={{
                            marginRight: 10,
                            fontFamily: "monospace",
                            fontSize: 16,
                          }}
                        >
                          {field}
                        </label>
                        <input
                          type="text"
                          placeholder={field}
                          onChange={(e) => {
                            setfields({ ...fields, [field]: e.target.value });
                          }}
                        />
                      </div>
                    );
                  })}
                  <div
                    className="button button1"
                    style={{
                      border: "2px solid #BED7E1",
                      width: 200,
                      marginLeft: "auto",
                    }}
                    onClick={(e) => createCertificate(e)}
                  >
                    Create certificate
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certificate;
