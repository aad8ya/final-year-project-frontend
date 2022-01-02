import { getNewImage, getNewText } from "./elements"
import * as types from "./types"
import { getStorage, getDownloadURL, uploadBytes, deleteObject, ref } from "firebase/storage";

export const createTextItem = type => {
    return {
        type: types.CREATE_ITEM,
        payload: getNewText()
    }
}
export const editCanvas = items => {
    return {
        type: types.EDIT_CANVAS,
        payload: items,
        info: "description",
    }
}
export const setActiveItem = item => {
    return {
        type: types.SET_ACTIVE_ITEM,
        payload: item,
        info: "description"
    }
}
export const setStageRef = stage => {
    return {
        type: types.SET_STAGE_REF,
        payload: stage,
        info: "description"
    }
}
export const editWholeCanvas = items => {
    return {
        type: types.EDIT_WHOLE_CANVAS,
        payload: items,
        info: "description"
    }
}


export const setUserTemplates = templates => {
    return {
        type: types.SET_USER_TEMPLATES,
        payload: templates,
        info: "description"
    }
}
export const setUserTemplatesLoading = loading => {
    return {
        type: types.SET_USER_TEMPLATES_LOADING,
        payload: loading,
        info: "description"
    }
}
export const setCurrentTemplate = template => {
    return {
        type: types.SET_CURRENT_TEMPLATE,
        payload: template,
        info: "description"
    }
}

export const addFont = font => {
    return {
        type: types.ADD_FONT,
        payload: font,
        info: "description"
    }
}
export const setFonts = fonts => {
    return {
        type: types.SET_FONTS,
        payload: fonts,
        info: "description"
    }
}
export const createImageItem = img => {
    return {
        type: types.CREATE_ITEM,
        payload: img
    }
}
