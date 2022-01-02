import { useContext, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { templateActions } from '../../store'
import Context from '../../store/context'

const ItemTypes = {
    CARD: 'card'
}
const style = {
    border: '1px solid gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontWeight: 'bold'
}
export const Card = ({ id, index, moveCard, item }) => {

    const { store, dispatch } = useContext(Context)
    const ref = useRef(null)
    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.CARD,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            // Determine mouse position
            const clientOffset = monitor.getClientOffset()
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }
            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex)
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: () => {
            return { id, index }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const setActiveItem = item => {
        dispatch(templateActions.setActiveItem(item))
    }

    const opacity = isDragging ? 0 : 1
    drag(drop(ref))
    return (
        <div ref={ref}
            style={{ ...style, opacity, border: `2px solid ${store.templates.currentTemplate.canvas.activeItem.id === item.id ? '#e95' : 'grey'}` }}
            data-handler-id={handlerId}
            onClick={() => setActiveItem(item)}>
            {item.value || item.name}
        </div>
    )
}
