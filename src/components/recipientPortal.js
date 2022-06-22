import React, { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import "../App.css";
import * as api from "../api/templates";
import { useParams } from "react-router-dom";
import Context from "../store/context.js";
import {
  getFirestore,
  getDocs,
  collection,
  where,
  Timestamp,
} from "firebase/firestore";

function RecipientPortal() {
  const { store } = React.useContext(Context);
  const [certificates, setCertificates] = useState([]);
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const [requestChanges, setRequestChanges] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [fields, setfields] = useState({});
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [newReceiverName, setNewReceiverName] = useState(null);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [newEmail, setNewEmail] = useState(null);

  const labelStyles = {
    marginRight: 10,
    fontFamily: "monospace",
    fontSize: 16,
  };

  const resetRequestChanges = () => {
    setRequestChanges(null);
    setNewEmail(null);
    setNewReceiverName(null);
  };

  useEffect(() => {
    api.getMyCertificates(store.user.email).then((res) => {
      setCertificates(res);
    });
  }, []);

  const setCurrentCertificateFunc = async (cert) => {
    let imgRef = ref(getStorage(), `/certificates/${cert.data.name}`);
    getDownloadURL(imgRef).then((url) => {
      setCurrentCertificate({ cert, url });
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
                resetRequestChanges();
                setCurrentCertificateFunc(cert);
              }}
            >
              {cert.data.receiverName}
            </div>
          );
        })}
      </div>
      <div style={{ width: "80%", display: "flex", overFlowY: "scroll" }}>
        <div
          style={{
            margin: "10px 30px",
            display: "flex",
            width: "100%",
            height: "100%",
            flexDirection: "column",
          }}
        >
          {currentCertificate &&
            (requestChanges ? (
              <div style={{ margin: "30px auto" }}>
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
                    <label style={labelStyles}>Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      defaultValue={newReceiverName}
                      onChange={(e) => {
                        setNewReceiverName(e.target.value);
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
                    <label style={labelStyles}>Email</label>
                    <input
                      type="text"
                      placeholder="Email"
                      defaultValue={newEmail}
                      onChange={(e) => {
                        setNewEmail(e.target.value);
                      }}
                    />
                  </div>
                  <div
                    className="button button1"
                    style={{
                      border: "2px solid #BED7E1",
                      width: 100,
                      marginLeft: "auto",
                    }}
                    onClick={(e) => {
                      api.requestChangeInCertificate(
                        currentCertificate.cert.id,
                        currentCertificate.cert.data.uid,
                        { name: newReceiverName, email: newEmail }
                      );
                    }}
                  >
                    Request
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div
                  style={{
                    marginLeft: "auto",
                    marginTop: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "monospace",
                      textDecoration: "underline",
                      color: "blue",
                      cursor: "pointer",
                      margin: "auto 0",
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `localhost:3000/view_certificate/${currentCertificate.cert.data.name}`
                      );
                      alert("Copied link to clipboard");
                    }}
                  >
                    {`localhost:3000/view_certificate/${currentCertificate.cert.data.name}`}
                  </div>
                  <div>
                    <div
                      className="button button1"
                      style={{
                        margin: "auto 5px",
                        border: "1px solid #BED7E1",
                      }}
                      onClick={async () => {
                        await api.toggleCertificateSharing(
                          currentCertificate.cert.id,
                          !currentCertificate.cert.data.isShareable
                        );
                        window.location.reload();
                      }}
                    >
                      {currentCertificate.cert.data.isShareable
                        ? "Stop sharing"
                        : "Resume Sharing"}
                    </div>
                    <div
                      className="button button1"
                      style={{
                        margin: "auto 5px",
                        border: "1px solid #BED7E1",
                      }}
                      onClick={() => {
                        setNewEmail(currentCertificate.cert.data.receiverEmail);
                        setNewReceiverName(
                          currentCertificate.cert.data.receiverName
                        );
                        setRequestChanges(true);
                      }}
                    >
                      Request Changes
                    </div>
                  </div>
                </div>
                <div style={{ margin: "20px auto" }}>
                  <img
                    height={window.innerHeight * 0.7}
                    src={currentCertificate.url}
                    alt="certificate"
                  />
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 14,
                    margin: "auto",
                  }}
                >
                  <div style={{ marginBottom: 5 }}>
                    Hedera FilleId: {currentCertificate.cert.data.hederaFileId}
                  </div>
                  <div style={{ marginBottom: 5 }}>
                    Name:{currentCertificate.cert.data.receiverName}
                  </div>
                  <div style={{ marginBottom: 5 }}>
                    Email:{currentCertificate.cert.data.receiverEmail}
                  </div>
                  <div style={{ marginBottom: 5 }}>
                    College:{currentCertificate.cert.data.college}
                  </div>
                  <div style={{ marginBottom: 5 }}>
                    Batch:{currentCertificate.cert.data.batch}
                  </div>
                  <div style={{ marginBottom: 5 }}>
                    Degree:{currentCertificate.cert.data.degree}
                  </div>
                  <div style={{ marginBottom: 5 }}>
                    Department:{currentCertificate.cert.data.department}
                  </div>
                  <div style={{ marginBottom: 5 }}>
                    Roll No:{currentCertificate.cert.data.rollNo}
                  </div>
                </div>
              </>
            ))}
        </div>
      </div>
    </div>
  );
}

export default RecipientPortal;
