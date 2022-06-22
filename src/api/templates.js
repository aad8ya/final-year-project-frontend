import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  getDownloadURL,
  uploadBytes,
  deleteObject,
  ref,
} from "firebase/storage";
import {
  Client,
  PrivateKey,
  AccountId,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  FileAppendTransaction,
  FileContentsQuery,
} from "@hashgraph/sdk";
import { getNewImage } from "../store/templates/elements";

export const createTemplate = async (info) => {
  const { uid, name, description } = info;
  const template = {
    name,
    description,
    uid,
    createdAt: new Date().getTime(),
    exportCertificatesAs: "png",
    canvas: {
      ratio: {
        x: 1,
        y: 1,
      },
      baseImageHeight: "default",
      baseImageWidth: "default",
      items: [
        {
          ...getNewImage(),
          draggable: false,
          type: "base-image",
          name: "Base template image",
          alt: "Example image",
          storageRef: "default_template_images/base.png",
        },
        {
          type: "text",
          value: "Example text field",
          x: 25,
          y: 25,
          fill: "#fff",
          attr: {
            fontSize: 200,
            fontFamily: "Poppins",
          },
          isConstant: false,
        },
      ],
    },
  };
  const db = getFirestore();
  const result = await addDoc(collection(db, "templates"), template);
  return result;
};

export const getTemplates = async (uid) => {
  const db = getFirestore();
  const result = await getDocs(
    collection(db, "templates"),
    where("uid", "==", uid)
  );
  console.log(result);
  let res = [];
  result.forEach((template) => {
    console.log(template.data().uid, "     ", uid);
    if (template.data().uid === uid) {
      let temp = {
        id: template.id,
        data: template.data(),
      };
      res.push(temp);
    }
  });
  return res;
};

export const editTemplateItems = async (id, items) => {
  console.log(id, items);
  const db = getFirestore();
  const docRef = doc(db, "templates", id);
  const docSnap = await getDoc(docRef);
  items.map((item) => {
    if (item.type === "image" || item.type === "base-image") {
      if (item.src !== "default") {
        item.src = "image";
      }
    }
    if (item.type === "text") {
      item.attr.fontSize = parseInt(item.attr.fontSize) || 25;
    }
  });
  console.log(docSnap.data());
  let template = {
    ...docSnap.data(),
    canvas: {
      ...docSnap.data().canvas,
      items: items,
    },
  };

  const result = await setDoc(doc(db, "templates", id.toString()), template);
  return result;
};

export const uploadImage = async (image, refs) => {
  //upload image to firebase storage
  const storage = getStorage();
  const imageRef = ref(storage, refs);
  const result = await uploadBytes(imageRef, image);
  console.log("Uploaded");
  return result;
};

export const getURL = async (refs) => {
  const storage = getStorage();
  const imageRef = ref(storage, refs);
  const result = await getDownloadURL(imageRef);
  return result;
};

export const deleteTemplate = async (id) => {
  await deleteDoc(doc(getFirestore(), "templates", id));
};

export const addImg = async () => {
  let url = await getDownloadURL(
    ref(getStorage(), "default_template_images/image.jpg")
  );
  return new Promise((resolve, reject) => {
    let im = new window.Image();
    im.crossOrigin = "anonymous";
    im.src = url;
    im.height = im.height;
    im.width = im.width;
    im.onload = () => {
      const img = {
        isConstant: false,
        id: getNewImage().id,
        name: "new image",
        type: "image",
        src: im,
        draggable: true,
        x: 100,
        y: 100,
        width: im.width,
        height: im.height,
        storageRef: "default_template_images/image.jpg",
      };
      resolve(img);
    };
  });
};

export const getCertificates = async (uid) => {
  const db = getFirestore();
  const result = await getDocs(
    collection(db, "certificates"),
    where("uid", "==", uid)
  );
  let res = [];
  result.forEach((cert) => {
    if (cert.data().uid === uid) {
      let temp = {
        id: cert.id,
        data: cert.data(),
      };
      res.push(temp);
    }
  });
  console.log(res);
  return res;
};

export const getMyCertificates = async (email) => {
  const db = getFirestore();
  const result = await getDocs(
    collection(db, "certificates"),
    where("receieverEmail", "==", email)
  );
  let res = [];
  result.forEach((cert) => {
    if (cert.data().receiverEmail === email) {
      let temp = {
        id: cert.id,
        data: cert.data(),
      };
      res.push(temp);
    }
  });
  console.log(res);
  return res;
};

export const toggleCertificateSharing = async (certificateID, state) => {
  const db = getFirestore();
  const docRef = await doc(db, "certificates", certificateID);
  const result = await updateDoc(docRef, { isShareable: state });
  console.log(result);
  return result;
};

export const requestChangeInCertificate = async (
  certificateID,
  issuerID,
  changes
) => {
  const db = getFirestore();
  const result = await addDoc(collection(db, "changes_requested"), {
    certificate_id: certificateID,
    issuer_uid: issuerID,
    new_name: changes.name,
    new_email: changes.email,
    waiting_for_approval: true,
  });
};

export const viewRequestedChanges = async (uid) => {
  const db = getFirestore();
  const result = await getDocs(
    collection(db, "changes_requested"),
    where("issuer_uid", "==", uid)
  );
  let res = [];
  result.forEach((x) => {
    if (x.data().waiting_for_approval === true) {
      res.push({ id: x.id, data: x.data() });
    }
  });
  return res;
};

export const getOneCertificate = async (id) => {
  const db = getFirestore();
  const result = await getDocs(
    collection(db, "certificates"),
    where("id", "==", id)
  );
  let res = [];
  result.forEach((cert) => {
    if (cert.id === id) {
      let temp = {
        id: cert.id,
        data: cert.data(),
      };
      res.push(temp);
    }
  });
  return res;
};

export const approveRequest = async (
  certId,
  requestId,
  isApproved,
  changes = {}
) => {
  const db = getFirestore();
  const docRef = await doc(db, "changes_requested", requestId);
  const result = updateDoc(docRef, {
    waiting_for_approval: false,
    is_approved: isApproved,
  });

  if (isApproved) {
    const docRef2 = await doc(db, "certificates", certId);
    const result2 = updateDoc(docRef2, {
      receiverName: changes.newName,
      receiverEmail: changes.newEmail,
    });
  }
  return result;
};

export const getHederaFile = async (id) => {
  const HederaClient = Client.forTestnet();
  HederaClient.setOperator(process.env.OPERATOR_ID, process.env.OPERATOR_KEY);

  const query = new FileContentsQuery().setFileId(id);
  const contents = await query.execute(HederaClient);
  return contents;
};
