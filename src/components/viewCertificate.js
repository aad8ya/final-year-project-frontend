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

function ViewCertificate() {
  const { id } = useParams();
  const { store } = React.useContext(Context);
  const [certificates, setCertificates] = useState([]);
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const [certificateMetaData, setCertificateMetaData] = useState(null);
  useEffect(() => {
    console.log(id);
    api
      .getCertificates(store.user.uid)
      .then((res) => {
        setCertificates(res);
      })
      .then((x) => {
        setCurrentCertificateFunc(id);
      });
  }, []);

  useEffect(() => {
    setCertificateMetaData(certificates.find((x) => x.data.name == id));
    console.log(certificates);
  }, [certificates]);

  const setCurrentCertificateFunc = async (cert) => {
    const db = getFirestore();
    let imgRef = ref(getStorage(), `/certificates/${cert}`);
    getDownloadURL(imgRef).then((url) => {
      setCurrentCertificate({ cert, url });
    });
    certificates.length > 0 &&
      setCertificateMetaData(certificates.find((x) => x.data.name == cert));
  };

  return (
    <div style={{ margin: 30, width: "100%", height: "80%", display: "flex" }}>
      {currentCertificate &&
        certificateMetaData &&
        (certificateMetaData.data.isShareable ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              margin: "auto",
              fontFamily: "monospace",
              fontSize: 16,
            }}
          >
            <img
              height={window.innerHeight * 0.7}
              src={currentCertificate.url}
              alt="certificate"
              style={{ margin: "auto" }}
            />
            <div style={{ margin: "5px auto" }}>
              <span style={{ fontWeight: "bold" }}>Hedera File ID:</span>
              {certificateMetaData.data.hederaFileId}
            </div>
            <div style={{ margin: "5px auto" }}>
              <span style={{ fontWeight: "bold" }}>Recepient Name:</span>
              {certificateMetaData.data.receiverName}
            </div>
            <div style={{ margin: "5px auto" }}>
              <span style={{ fontWeight: "bold" }}>Recepient Email:</span>
              {certificateMetaData.data.receiverEmail}
            </div>
            <div style={{ margin: "5px auto" }}>
              <span style={{ fontWeight: "bold" }}>College:</span>
              {certificateMetaData.data.college}
            </div>
            <div style={{ margin: "5px auto" }}>
              <span style={{ fontWeight: "bold" }}>Batch:</span>
              {certificateMetaData.data.batch}
            </div>
            <div style={{ margin: "5px auto" }}>
              <span style={{ fontWeight: "bold" }}>Degree:</span>
              {certificateMetaData.data.degree}
            </div>
            <div style={{ margin: "5px auto" }}>
              <span style={{ fontWeight: "bold" }}>Department:</span>
              {certificateMetaData.data.department}
            </div>
            <div style={{ margin: "5px auto" }}>
              <span style={{ fontWeight: "bold" }}>Roll No:</span>
              {certificateMetaData.data.rollNo}
            </div>
          </div>
        ) : (
          <div
            style={{
              fontFamily: "monospace",
              margin: "60px auto",
              fontSize: 20,
              color: "gray",
            }}
          >
            Certificate has been prevented from sharing by receiver.
          </div>
        ))}
    </div>
  );
}

export default ViewCertificate;
