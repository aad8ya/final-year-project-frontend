import React, { useEffect, useContext, useRef, useState } from 'react'
import { Stage, Layer, Image, Text, Group, Rect } from 'react-konva';
import Context from '../../store/context';
import { templateActions } from '../../store'
import DynamicImage from './resizeable';

function Canvas() {

    const { store, dispatch } = useContext(Context)
    const stageRef = useRef(null)
    const textRef = useRef(null)
    const items = store.templates.currentTemplate.canvas.items
    const activeItem = store.templates.currentTemplate.canvas.activeItem
    const width = items.find(item => item.type === 'base-image')['original-width']
    const height = items.find(item => item.type === 'base-image')['original-height']
    const ratio = width / height
    const drag = (e, id) => {
        let items_ = [...items]
        let x = e.target._lastPos.x
        let y = e.target._lastPos.y
        x = e.target.x()
        y = e.target.y()
        items_.map(item => {
            if (item.id === id) {
                item.x = x
                item.y = y
            }
            return item
        })
        dispatch(templateActions.editCanvas(items))
    }

    const setActiveItem = item => {
        dispatch(templateActions.setActiveItem({ id: 'none' }))
        dispatch(templateActions.setActiveItem(item))
        console.log(items)

    }

    function downloadURI() {
        if (stageRef) {
            let uri = stageRef.current.toDataURL({
                pixelRatio: 1,
            })
            let name = "ex.png"
            let link = document.createElement('a');
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            link = null
        } else {
            alert("Please create a stageRef first")
        }
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "cemter",
            alignItems: "center",
            padding: "3px"
        }}>
            <button onClick={downloadURI}>Download</button>
            <div style={{ border: "4px solid red" }}>
                <Stage
                    ref={stageRef}
                    width={window.innerHeight * 0.8 * ratio}
                    height={window.innerHeight * 0.8}
                    scaleX={window.innerHeight * 0.8 * ratio / width}
                    scaleY={window.innerHeight * 0.8 / height}

                >
                    <Layer>
                        {items.map((item, i) => {
                            switch (item.type) {
                                case 'base-image':
                                    return <Image
                                        key={i}
                                        image={item.src}
                                        onClick={() => setActiveItem(item)}
                                        x={0}
                                        y={0}
                                        width={width}
                                        height={height}
                                        src={item.src}
                                    />
                                case 'image':
                                    return <DynamicImage
                                        x={item.x}
                                        y={item.y}
                                        src={item.src}
                                        item={item}
                                        key={i}
                                        image={item.src}
                                        shapeProps={item}
                                        draggable
                                        isSelected={item.id === activeItem.id}
                                        onClick={() => setActiveItem(item)}
                                        onChange={newAttrs => {
                                            let p = items
                                            p[i] = { ...p[i], ...newAttrs, width: newAttrs.width, height: newAttrs.height }
                                            dispatch(templateActions.editCanvas(p));
                                            console.log(p[i])
                                        }}
                                        onDragEnd={e => drag(e, item.id)}
                                        onDragMove={e => {
                                            e.target.y(Math.max(e.target.y(), 0))
                                            e.target.x(Math.max(e.target.x(), 0))
                                        }}
                                    />

                                case 'text':
                                    return <Group
                                        x={item.x}
                                        y={item.y}
                                        draggable
                                        onDragEnd={e => drag(e, item.id)}
                                        onDragMove={e => {
                                            e.target.y(Math.max(e.target.y(), 0))
                                            e.target.x(Math.max(e.target.x(), 0))
                                        }}
                                        onClick={() => setActiveItem(item)}
                                        key={i}
                                        ref={textRef}
                                    >
                                        <Text
                                            fill={item.color || item.fill}
                                            text={item.value}
                                            {...item.attr}
                                            textDecoration={item.id === activeItem.id ? 'underline' : ''}
                                        >
                                        </Text>
                                        {item.id === activeItem.id ?
                                            <Rect

                                            /> : null}
                                    </Group>
                                default:
                                    return null

                            }
                        })
                        }
                    </Layer>
                </Stage >
            </div>
        </div>
    )
}

export default Canvas
