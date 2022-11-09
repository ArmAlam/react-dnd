import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import Component from "./Component";
import { COLUMN } from "./constants";
import DropZone from "./DropZone";

const style = {};
const Column = ({ data, components, handleDrop, path, innerRef }) => {
    const ref = useRef(null);
    const [{ isDragging }, drag] = useDrag(
        () => ({
            item: {
                id: data.id,
                children: data.children,
                path
            },
            type: COLUMN,
            collect: (monitor) => ({
                isDragging: monitor.isDragging()
            })
        }), []
    );

    const opacity = isDragging ? 0 : 1;
    drag(ref);

    const renderComponent = (component, currentPath) => {
        return (
            <Component
                key={component.id}
                data={component}
                components={components}
                path={currentPath}
            />
        );
    };

    return (
        <div id={`col-${path}`} ref={innerRef} className="columnContainer">
            <div
                ref={ref}
                style={{ ...style, opacity }}
                className="base draggable column"
            >
                {data.id}
                {data.children.map((component, index) => {
                    const currentPath = `${path}-${index}`;

                    return (
                        <React.Fragment key={component.id}>
                            <DropZone
                                data={{
                                    path: currentPath,
                                    childrenCount: data.children.length
                                }}
                                onDrop={handleDrop}
                            />
                            {renderComponent(component, currentPath)}
                        </React.Fragment>
                    );
                })}
                <DropZone
                    data={{
                        path: `${path}-${data.children.length}`,
                        childrenCount: data.children.length
                    }}
                    onDrop={handleDrop}
                    isLast
                />
            </div>
        </div>
    );
};
export default Column;
