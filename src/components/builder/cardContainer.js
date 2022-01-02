import { useState, useCallback, useContext } from 'react'
import { Card } from './card'
import update from 'immutability-helper'
import Context from '../../store/context'
import { templateActions } from '../../store'
const style = {
    width: '80%',
    margin: "3px",
    display: 'flex',
    flexDirection: 'column-reverse',


}
export const Container = () => {
    {
        const { store, dispatch } = useContext(Context)
        const moveCard = useCallback((dragIndex, hoverIndex) => {
            const dragCard = store.templates.currentTemplate.canvas.items[dragIndex]
            dispatch(templateActions.editCanvas((update(store.templates.currentTemplate.canvas.items, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragCard],
                ],
            }))))
            console.log("DRAG INDEX", store.templates.currentTemplate.canvas.items[dragIndex])
        }, [store.templates.currentTemplate.canvas.items])
        const renderCard = (item, index) => {
            return (
                <Card
                    key={index}
                    index={index}
                    id={item.id}
                    item={item}
                    text={item.name}
                    moveCard={moveCard} />)
        }

        return (<>
            <div style={style}>{store.templates.currentTemplate.canvas.items.map((item, i) => renderCard(item, i))}</div>
        </>)
    }
}
