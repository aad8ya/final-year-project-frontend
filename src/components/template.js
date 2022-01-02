import React, { useEffect, useState, useContext } from 'react'
import '../App.css'
import Context from '../store/context.js'
import * as api from '../api/templates'
import { templateActions, setLoading as setAppLoading } from '../store'
import CanvasContainer from './builder/canvasContainer'
import imageSrc from '../images/image.jpg'
import sign from '../images/sign.jpg'
import { loadFonts } from './builder/fontLoader'
import getCurrentTemplate from './getCurrentTemplate'
function Template() {
    const { store, dispatch } = useContext(Context)
    const [loading, setloading] = useState({
        fonts: false,
        templates: true,
        currentTemplate: false
    })
    useEffect(() => {
        if (loading.fonts || loading.templates || loading.currentTemplate)
            dispatch(setAppLoading(true))
        else
            dispatch(setAppLoading(false))
        console.log("Loadingxrw:", loading)
    }, [loading])

    const user = store.user
    useEffect(() => {
        getUploadedTemplates()
            .then(() => setloading({ ...loading, templates: false }))
        loadFonts('popularity').then(fonts => {
            fonts = fonts.slice(0, 100)
            for (let i in fonts) {
                let apiUrl = [];
                apiUrl.push('https://fonts.googleapis.com/css?family=');
                apiUrl.push(fonts[i].family.replace(/ /g, '+'));
                var url = apiUrl.join('');
                let style = document.createElement('link');
                style.href = url;
                style.rel = 'stylesheet';
                //console.log("Styleee:", style)
                document.head.appendChild(style);
            }
            dispatch(templateActions.setFonts(fonts))
            setloading({ ...loading, fonts: false })
        })
            .catch(err => {
                setloading({ ...loading, fonts: false })
                console.log(err)
            })
            .finally(() => setloading({ ...loading, fonts: false }))
    }, [])

    const upload = () => {

    }

    const createTemplate = async () => {
        const info = {
            uid: user.uid,
            name: 'New Template' + Math.floor(Math.random() * 100),
            description: 'New Template test',
        }
        const res = await api.createTemplate(info)
        console.log(res)
        window.location.reload()
    }

    const getUploadedTemplates = () => {
        setloading({ ...loading, templates: true })
        return new Promise((resolve, reject) => {
            console.log("UID in templates", store.user.uid)
            api.getTemplates(store.user.uid)
                .then(res => {
                    dispatch(templateActions.setUserTemplates(res))
                    console.log("Get templates():", res)
                    setloading({ ...loading, templates: false })
                    resolve()
                })
        })
    }

    const setCurrentTemplate = srcTemplate => {
        dispatch(templateActions.setCurrentTemplate({ id: null, canvas: { items: [], rev: [] } }))
        setloading({ ...loading, currentTemplate: true })
        let { id, data } = srcTemplate
        getCurrentTemplate(data.canvas.items).then(res => {
            for (let i in res) {
                let imgItem = res[i]
                data.canvas.items.map(item => {
                    if (item.id === imgItem.id)
                        return imgItem
                    else
                        return item
                })
            }
            let template = {
                id,
                ...data,
                canvas: {
                    ...data.canvas,
                    items: data.canvas.items,
                    activeItem: data.canvas.items[0]
                },
            }
            dispatch(templateActions.setCurrentTemplate(template))
            console.log(store.templates)
            setloading({ ...loading, currentTemplate: false })
        })


    }

    return (
        <>{store.app.isLoading ? <h1 className="loading">Loading...</h1> :
            <>
                <button onClick={createTemplate}>Create Template</button>
                {
                    store.templates.userTemplates.map((template, i) => {
                        return (
                            <h1 key={i}>
                                <div onClick={() => setCurrentTemplate(template)}>{template.data.name}</div>
                            </h1>
                        )
                    })
                }
                {
                    store.templates.currentTemplate.id ?
                        <CanvasContainer />
                        :
                        <div>No Template Selected</div>
                }
            </>
        }
        </>
    )
}

export default Template
