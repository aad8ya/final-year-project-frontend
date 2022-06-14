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
  const [existingCertificate, setExistingCertificate] = useState(null);

  const labelStyles = {
    marginRight: 10,
    fontFamily: "monospace",
    fontSize: 16,
  };

  useEffect(() => {
    api.viewRequestedChanges(store.user.id).then((res) => {
      setCertificates(res);
    });
  }, []);

  const setCurrentCertificateFunc = async (cert) => {
    api.getOneCertificate(cert.data.certificate_id).then((res) => {
      setExistingCertificate(
        res.find((x) => x.id === cert.data.certificate_id)
      );
      setCurrentCertificate(cert);
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
          {currentCertificate && (
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 14,
                margin: "20px auto",
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontWeight: "bold", fontSize: 20 }}>
                  New Data
                </span>
                <div style={{ marginTop: 10, marginBottom: 5 }}>
                  New Name: {currentCertificate.data.new_name}
                </div>
                <div style={{ marginBottom: 5 }}>
                  New Email: {currentCertificate.data.new_email}
                </div>
              </div>
              {existingCertificate && (
                <div>
                  <span style={{ fontWeight: "bold", fontSize: 20 }}>
                    Existing Data
                  </span>
                  <div
                    style={{
                      marginTop: 10,
                      marginBottom: 5,
                      fontWeight: "bold",
                    }}
                  >
                    Name:{existingCertificate.data.receiverName}
                  </div>
                  <div style={{ marginBottom: 5, fontWeight: "bold" }}>
                    Email:{existingCertificate.data.receiverEmail}
                  </div>
                  <div style={{ marginBottom: 5 }}>
                    Hedera FilleId: {existingCertificate.data.hederaFileId}
                  </div>
                  <div style={{ marginBottom: 5 }}>
                    College:{existingCertificate.data.college}
                  </div>
                  <div style={{ marginBottom: 5 }}>
                    Batch:{existingCertificate.data.batch}
                  </div>
                  <div style={{ marginBottom: 5 }}>
                    Degree:{existingCertificate.data.degree}
                  </div>
                  <div style={{ marginBottom: 5 }}>
                    Department:{existingCertificate.data.department}
                  </div>
                  <div style={{ marginBottom: 5 }}>
                    Roll No:{existingCertificate.data.rollNo}
                  </div>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  margintTop: 30,
                }}
              >
                <div
                  className="button button1"
                  style={{
                    margin: "auto 5px",
                    border: "1px solid #BED7E1",
                  }}
                  onClick={() => {
                    api.approveRequest(
                      existingCertificate.id,
                      currentCertificate.id,
                      false
                    );
                  }}
                >
                  Reject
                </div>
                <div
                  className="button button1"
                  style={{
                    margin: "auto 5px",
                    border: "1px solid #BED7E1",
                  }}
                  onClick={() => {
                    api.approveRequest(
                      existingCertificate.id,
                      currentCertificate.id,
                      true,
                      {
                        newName: currentCertificate.data.new_name,
                        newEmail: currentCertificate.data.new_email,
                      }
                    );
                  }}
                >
                  Approve
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestedChanges;
