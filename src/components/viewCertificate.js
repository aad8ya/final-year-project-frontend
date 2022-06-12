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
    let imgRef = ref(getStorage(), `${store.user.uid}/certificates/${cert}`);
    getDownloadURL(imgRef).then((url) => {
      setCurrentCertificate({ cert, url });
    });
    certificates.length > 0 &&
      setCertificateMetaData(certificates.find((x) => x.data.name == cert));
  };

  return (
    <div>
      {currentCertificate && certificateMetaData && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <img
            height={window.innerHeight * 0.9}
            src={currentCertificate.url}
            alt="certificate"
            style={{ margin: "auto" }}
          />
          <div style={{ margin: "10px auto" }}>
            Recepient Name:{certificateMetaData.data.receiverName}
          </div>
          <div style={{ margin: "10px auto" }}>
            Recepient Email:{certificateMetaData.data.receiverEmail}
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewCertificate;
