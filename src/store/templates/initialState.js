import { getNewImage, getNewText, baseImage } from './elements'
const text = getNewText()
const image = getNewImage()
image['storageRef'] = 'default_template_images/image.jpg'
export const initialState = {
    userTemplates: [],
    currentTemplate: {
        id: null,
        canvas: {
            isBaseImageLoaded: false,
            otherImagesLoaded: false,
            ratio: "default",
            imageRef: {
                baseImage: null,
                otherImages: []
            },
            stageRef: null,
            items: [baseImage, text],
            activeItem: text,
        }
    },
    fonts: [],
}
