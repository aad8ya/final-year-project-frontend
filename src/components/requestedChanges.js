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

function RequestedChanges() {
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
    api.viewRequestedChanges(store.user.id).then((res) => {
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
          Changes Requested:
        </span>
        {certificates.length > 0 &&
          certificates.map((cert) => {
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
                {cert.data.certificate_id}
              </div>
            );
          })}
      </div>
      <div style={{ width: "80%", display: "flex" }}>
        <div
          style={{
            margin: "10px 30px",
            display: "flex",
            width: "100%",
            height: "100%",
            flexDirection: "column",
          }}
        >
          Hello
        </div>
      </div>
    </div>
  );
}

export default RequestedChanges;
