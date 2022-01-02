import { getFirestore, collection, addDoc, getDoc, getDocs, query, where, setDoc, doc, deleteDoc } from "firebase/firestore";
import { getStorage, getDownloadURL, uploadBytes, deleteObject, ref } from "firebase/storage";
import { getNewImage } from "../store/templates/elements";


export const createTemplate = async (info) => {
    const { uid, name, description } = info
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
        }
    }
    const db = getFirestore()
    const result = await addDoc(collection(db, 'templates'), template)
    return result
}

export const getTemplates = async (uid) => {
    const db = getFirestore()
    const result = await getDocs(collection(db, 'templates'), where('uid', '==', uid))
    console.log(result)
    let res = []
    result.forEach(template => {
        console.log(template.data().uid, "     ", uid)
        if (template.data().uid === uid) {
            let temp = {
                id: template.id,
                data: template.data()
            }
            res.push(temp)
        }
    })
    return res
}

export const editTemplateItems = async (id, items) => {
    console.log(id, items)
    const db = getFirestore()
    const docRef = doc(db, "templates", id)
    const docSnap = await getDoc(docRef)
    items.map(item => {
        if (item.type === "image" || item.type === "base-image") {
            if (item.src !== "default") {
                item.src = "image"
            }
        }
        if (item.type === "text") {
            item.attr.fontSize = parseInt(item.attr.fontSize) || 25
        }
    })
    console.log(docSnap.data())
    let template = {
        ...docSnap.data(),
        canvas: {
            ...docSnap.data().canvas,
            items: items,
        }
    }

    const result = await setDoc(doc(db, 'templates', id.toString()), template)
    return result
}

export const uploadImage = async (image, refs) => {
    //upload image to firebase storage
    const storage = getStorage()
    const imageRef = ref(storage, refs)
    const result = await uploadBytes(imageRef, image)
    console.log("Uploaded")
    return result
}

export const getURL = async (refs) => {
    const storage = getStorage()
    const imageRef = ref(storage, refs)
    const result = await getDownloadURL(imageRef)
    return result
}

export const deleteTemplate = async id => {
    await deleteDoc(doc(getFirestore(), "templates", id))
}

export const addImg = async () => {
    let url = await getDownloadURL(ref(getStorage(), 'default_template_images/image.jpg'))
    return new Promise((resolve, reject) => {
        let im = new window.Image()
        im.crossOrigin = 'anonymous'
        im.src = url
        im.height = im.height
        im.width = im.width
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
            }
            resolve(img)
        }
    })

}

export const getCertificates = async (uid) => {
    const db = getFirestore()
    const result = await getDocs(collection(db, 'certificates'), where('uid', '==', uid))
    let res = []
    result.forEach(cert => {
        if (cert.data().uid === uid) {
            let temp = {
                id: cert.id,
                data: cert.data()
            }
            res.push(temp)
        }
    })
    console.log(res)
    return res
}