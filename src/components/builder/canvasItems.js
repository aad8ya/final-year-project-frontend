import React, { useEffect, useState, useContext } from 'react'
import Context from '../../store/context';
import { templateActions } from '../../store'
import FontPicker from "font-picker-react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Container } from './cardContainer';
import * as api from '../../api/templates';
import { loadFirst100Fonts, loadFonts } from './fontLoader';


function CanvasItems() {
    const { store, dispatch } = useContext(Context)
    const [image, setImageState] = useState()
    const [imageBlob, setImageBlob] = useState()
    const [numberOfFonts, setNumberOfFonts] = useState(25)
    const items = store.templates.currentTemplate.canvas.items
    const activeItem = store.templates.currentTemplate.canvas.activeItem

    const setImage = async src => {
        let im = new window.Image()
        im.src = src
        let oldWidth = im.width
        let newWidth = window.innerHeight / 4
        let ratio = oldWidth / newWidth
        im.width = newWidth
        im.height = im.height / ratio
        const id = makeid()
        const ref = `${store.user.uid}/${store.templates.currentTemplate.id}/${id}_${imageBlob.name}`
        console.log(ref)
        await api.uploadImage(imageBlob, ref)
        let p = [...items]
        p = p.map(item => {
            if (item.id === activeItem.id) {
                item['height'] = im.height
                item['width'] = im.width
                item['src'] = im
                item['storageRef'] = ref
            }
            return item
        })
        dispatch(templateActions.editCanvas(p))
        setImageState(null)
        setImageBlob(null)
    }

    const setBaseImage = async src => {
        let im = new window.Image()
        im.src = src
        const id = makeid()
        const ref = `${store.user.uid}/${store.templates.currentTemplate.id}/${imageBlob.name}_${id}.jpg`
        await api.uploadImage(imageBlob, ref)
        let p = [...items]
        p = p.map(item => {
            if (item.id === activeItem.id) {
                item['height'] = im.height
                item['width'] = im.width
                item['src'] = im
                item['storageRef'] = ref
            }
            return item
        })
        dispatch(templateActions.editCanvas(p))
        setImageState(null)
        setImageBlob(null)
    }

    const addText = () => {
        dispatch(templateActions.createTextItem('text'))

    }

    const addImg = async () => {
        api.addImg().then(res => {
            dispatch(templateActions.createImageItem(res))
        })
    }

    const editActiveItem = (e, val) => {
        switch (val) {
            case 'val':
                {
                    let p = items
                    p.map(item => {
                        if (item.id === activeItem.id) {
                            item.value = e.target.value
                            item.name = e.target.value
                        }
                        return null
                    })
                    dispatch(templateActions.editCanvas(p))

                    break
                }
            case 'img':
                {
                    let p = items
                    p.map(item => {
                        if (item.id === activeItem.id) {
                            item.name = e.target.value
                        }
                        return null
                    })
                    dispatch(templateActions.editCanvas(p))
                    break
                }
            case 'check':
                {
                    let p = items
                    p.map(item => {
                        if (item.id === activeItem.id) {
                            item['isConstant'] = e.target.checked
                        }
                        return null
                    })
                    dispatch(templateActions.editCanvas(p))
                    break;
                }

            default:
                break
        }
    }

    const onChangeImg = file => {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setImageState(reader.result)
        }
        setImageBlob(file)
    }
    // deleteActiveItem function
    const deleteActiveItem = () => {
        let p = [...items]
        let x = p.filter(item => item.id !== activeItem.id)
        dispatch(templateActions.editCanvas(x))
        dispatch(templateActions.setActiveItem({ id: 'none' }))
    }
    const saveCanvas = () => {
        api.editTemplateItems(store.templates.currentTemplate.id, store.templates.currentTemplate.canvas.items).then(() =>
            window.location.reload())
    }
    const deleteTemplate = () => {
        api.deleteTemplate(store.templates.currentTemplate.id).then(() => window.location.reload())
    }

    return (
        <div
            onKeyDown={(e) => {
                if (e.key == 'Delete') {
                    deleteActiveItem()
                }
            }}

            style={{ margin: '8px' }}>

            <h3>Canvas</h3>
            <DndProvider backend={HTML5Backend}>
                <Container />
            </DndProvider>
            <hr />
            <div>Add Item </div>
            <div style={{ marginTop: "5px" }}><button onClick={addText}>Add text</button></div>
            <div style={{ marginTop: "5px" }}><button onClick={addImg} >Add Img</button></div>
            <hr />
            <h4>Edit Item: {activeItem.name}</h4>
            {
                activeItem.type !== 'base-image' ?
                    <div>
                        Is this field constant?
                        <input type='checkbox' defaultChecked={activeItem.isConstant || true} onChange={(e) => editActiveItem(e, 'check')} />
                    </div>
                    : null
            }
            {
                activeItem.type === 'text' ?
                    <div style={{ marginTop: "5px" }}>Name of field
                        <div>
                            <input style={{ padding: "5px" }} defaultValue={activeItem.name}
                                onChange={(e) => editActiveItem(e, 'val')}
                            />
                        </div>
                        <div style={{ marginTop: "9px" }}>Text Color :
                            <input type="color" defaultValue={activeItem.color}
                                onChangeCapture={(e) => {
                                    let p = [...items]
                                    p.map(item => {
                                        if (item.id === activeItem.id) {
                                            item['fill'] = e.target.value
                                            item['color'] = e.target.value
                                        }
                                        return item
                                    })
                                    dispatch(templateActions.editCanvas(p))
                                }}
                            //onChangeCapture
                            />
                        </div>
                        <div style={{ marginTop: "5px" }}>Font Size :
                            <input type="number" defaultValue={activeItem.attr.fontSize || 25}
                                onChange={
                                    (e) => {
                                        let p = [...items]
                                        p.map(item => {
                                            if (item.id === activeItem.id) {
                                                item['attr']['fontSize'] = e.target.value
                                            }
                                            return item
                                        })
                                        dispatch(templateActions.editCanvas(p))
                                    }}
                            />
                        </div>
                        <div style={{ overflow: "hidden" }}>Font Family :
                            <ul style={{ height: "200px", overflow: "auto", paddingRight: "16px" }}>
                                {
                                    store.templates.fonts.slice(0, numberOfFonts).map((font, i) => {
                                        return <li
                                            key={i}
                                            style={{ fontFamily: font.family }}
                                            onChange={(e) => { }}
                                            onClick={() => {
                                                let p = [...items]
                                                p.map(item => {
                                                    if (item.id === activeItem.id) {
                                                        item['attr'] = {
                                                            ...item.attr,
                                                            fontFamily: font.family,
                                                            fileLink: font.files.regular
                                                        }
                                                    }
                                                    return item
                                                })
                                                dispatch(templateActions.editCanvas(p))

                                            }}

                                        >
                                            {font.family}
                                        </li>
                                    })
                                }
                            </ul>
                            <div>
                                <button onClick={() => setNumberOfFonts(prev => prev + 25)}>Load more fonts</button>
                            </div>
                        </div>
                    </div> : null
            }

            {
                activeItem.type === 'base-image' ?
                    <div style={{ border: "2px solid black", padding: "10px", marginTop: "5px", width: "90%" }}>
                        <div>Change Image</div>
                        <input type='file' onChange={(e) => onChangeImg(e.target.files[0])} />
                        {image ? <img height='80' src={image} /> : null}
                        <div>
                            {image ? <button onClick={() => setBaseImage(image)}>Set image</button> : null}
                        </div>
                    </div> : null
            }
            {
                activeItem.type === 'image' ?

                    <div>
                        <div>Image name
                            <input style={{ padding: "5px" }} defaultValue={activeItem.name}
                                onChange={(e) => editActiveItem(e, 'img')}
                            />
                        </div>
                        <div style={{ border: "2px solid blue", padding: "5px", margin: "5px", width: "70%" }}>
                            <input type='file' onChange={(e) => onChangeImg(e.target.files[0])} />
                            {image ? <img height='80' src={image} /> : null}
                            <div>
                                <button onClick={() => setImage(image)}>Set image</button>
                            </div>
                        </div>
                    </div> : null
            } {
                activeItem.type !== 'base-image' ?
                    <div><button onClick={deleteActiveItem}>Delete</button></div> : null
            }
            {
                //deselect activeitem button
                <div><button onClick={() => dispatch(templateActions.setActiveItem({ id: 'none' }))}>Deselect</button></div>
            }

            <button
                onClick={saveCanvas}
            >
                Save Template
            </button>
            <button
                onClick={deleteTemplate}
            >
                Delete Template
            </button>

        </div >
    )
}

export default CanvasItems

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