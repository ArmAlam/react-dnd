import React, { useRef } from "react";
import { useDrag } from "react-dnd";

import { COMPONENT } from "./constants";

const style = {
    border: "1px dashed black",
    padding: "0.5rem 1rem",
    backgroundColor: "white",
    cursor: "move"
};
const Component = ({ data, components, path, isResizable }) => {
    
    const ref = useRef(null);
    const [{ isDragging }, drag] = useDrag(
        () => ({
            item: {  id: data.id, path },
            canDrag: !isResizable,
            type: COMPONENT,
            collect: (monitor) => ({
                isDragging: monitor.isDragging()
            })
        }), []
    );

    const opacity = isDragging ? 0 : 1;
    drag(ref);

    const component = components[data.id];

    const toggleModal = function () {
        const modal = document.querySelector("#modal");
        modal.classList.toggle("active");
        modal.innerText = component.content;
    };

    return (
        <>
            <div
                ref={ref}
                style={{ ...style, opacity }}
                className="component draggable"
                onClick={toggleModal}
            >
                <div>{data.id}</div>
                <div>{component.content}</div>
            </div>
        </>
    );
};
export default Component;
