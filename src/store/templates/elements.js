

export const getNewText = (type) => {
    let text = {
        id: makeid(),
        isConstant: false,
        type: "text",
        name: "text",
        value: "Example text field",
        color: "#fff",
        x: 10,
        y: 10,
        attr: {
            fontSize: 75,
        }
    }
    return text
}

export const getNewImage = () => {
    let image = {
        isConstant: false,
        id: makeid(),
        type: "image",
        name: "image",
        src: "default",
        x: 10,
        y: 10,
        height: 100,
        width: 100,
        scale: 1,
        draggable: true,
    }
    return image
}

export const baseImage = {
    id: 'baseImage',
    type: "base-image",
    name: "Base template image",
    src: "default",
}


const makeid = () => {
    let length = 12
    let result = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength))
    }
    return result
}