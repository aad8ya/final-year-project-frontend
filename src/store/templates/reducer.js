import * as types from './types'

const reducer = (state, action) => {
    switch (action.type) {

        case types.SET_CURRENT_TEMPLATE:
            return {
                ...state,
                currentTemplate: action.payload
            }

        case types.SET_USER_TEMPLATES:
            return {
                ...state,
                userTemplates: action.payload
            }

        case types.CREATE_ITEM:
            return {
                ...state,
                currentTemplate: {
                    ...state.currentTemplate,
                    canvas: {
                        ...state.currentTemplate.canvas,
                        items: [...state.currentTemplate.canvas.items, action.payload],
                        activeItem: action.payload,
                    }
                }
            }
        case types.EDIT_CANVAS: {
            return {
                ...state,
                currentTemplate: {
                    ...state.currentTemplate,
                    canvas: {
                        ...state.currentTemplate.canvas,
                        items: action.payload
                    }
                }
            }
        }
        case types.SET_ACTIVE_ITEM:
            return {
                ...state,
                currentTemplate: {
                    ...state.currentTemplate,
                    canvas: {
                        ...state.currentTemplate.canvas,
                        activeItem: action.payload
                    }
                }
            }
        case types.SET_STAGE_REF:
            return {
                ...state,
                currentTemplate: {
                    ...state.currentTemplate,
                    canvas: {
                        ...state.currentTemplate.canvas,
                        stageRef: action.payload
                    }
                }
            }
        case types.EDIT_WHOLE_CANVAS:

            return {
                ...state,
                currentTemplate: {
                    ...state.currentTemplate,
                    canvas: {
                        ...state.currentTemplate.canvas,
                        ...action.payload,
                    }
                }
            }

        case types.SET_FONTS:
            return {
                ...state,
                fonts: action.payload
            }

        case types.ADD_FONT:
            return {
                ...state,
                fonts: [...state.fonts, action.payload]
            }



        default: return state
    }
}

export default reducer