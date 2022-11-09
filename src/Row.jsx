import React, { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import Column from "./Column";
import { ROW } from "./constants";
import DropZone from "./DropZone";

const style = {};
const Row = ({ data, components, handleDrop, path }) => {
    const handler = useRef(null);
    const columnWrapper = useRef(null);
    const columnContainer = useRef(null);
    const ref = useRef(null);
    const [isResizable, setIsResizable] = useState(false);
    const [isShowDropzone, setIsShowDropzone] = useState(true);
    const [targetedColumn, setTargetedColumn] = useState(null);

    const [{ isDragging }, drag] = useDrag(
        () => ({
            item: {
                id: data.id,
                children: data.children,
                path
            },
            type: ROW,
            canDrag: !isResizable,
            collect: (monitor) => ({
                isDragging: monitor.isDragging()
            })
        }), []
    );
    drag(ref);
    const opacity = isDragging ? 0 : 1;

    const renderColumn = (column, currentPath, ref) => {
        return (
            <Column
                innerRef={ref}
                key={column.id}
                data={column}
                components={components}
                handleDrop={handleDrop}
                path={currentPath}
            />
        );
    };
    useEffect(() => {
        if (isResizable) {
            document.addEventListener("mousemove", seizer);
            return () => document.removeEventListener("mousemove", seizer);
        }
    }, [isResizable]);

    const resizingStartHandler = (index) => {
        setTargetedColumn(index - 1);
        setIsResizable(true);
    };

    const seizer = (e) => {
        console.log("moving");
        const targetedColumnEl = document.getElementById(
            `col-${path}-${targetedColumn}`
        );
        // Get offset
        let targetedColumnElOffsetLeft = targetedColumnEl.offsetLeft;

        // Get x-coordinate of pointer relative to columnWrapper
        let pointerRelativeXPos = e.clientX - targetedColumnElOffsetLeft - 30;
        let boxAminWidth = 160;
        console.log(columnContainer.current);
        targetedColumnEl.style.width =
            Math.max(boxAminWidth, pointerRelativeXPos) + "px";

        targetedColumnEl.style.flexGrow = 0;
    };

    const resizingEndHandler = (index) => {
        console.log("stop");
        setIsResizable(false);
    };
    const resizeInterchangeHandler = () => {
        setIsShowDropzone(true);
        setIsResizable(false);
    };

    console.log(isResizable);
    return (
        <div
            ref={ref}
            style={{ ...style, opacity }}
            className="base draggable row"
        >
            {data.id}
            {data.children.length == 0 ? (
                <DropZone
                    data={{
                        path: `${path}-0`,
                        childrenCount: data.children.length
                    }}
                    onDrop={handleDrop}
                />
            ) : (
                <div ref={columnWrapper} className="columns">
                    {data.children.map((column, index) => {
                        const currentPath = `${path}-${index}`;

                        return (
                            <React.Fragment key={column.id}>
                                {isShowDropzone || index == 0 ? (
                                    <DropZone
                                        data={{
                                            path: currentPath,
                                            childrenCount: data.children.length
                                        }}
                                        onDrop={isResizable ? null : handleDrop}
                                        className="horizontalDrag"
                                        onMouseOverHandler={() => {
                                            if (index != 0) {
                                                setIsShowDropzone(false);
                                            }
                                        }}
                                    />
                                ) : (
                                    <div
                                        onMouseDown={() =>
                                            resizingStartHandler(index)
                                        }
                                        onMouseUp={() =>
                                            resizingEndHandler(index)
                                        }
                                        onMouseOut={resizeInterchangeHandler}
                                        ref={handler}
                                        id={`handle-${currentPath}`}
                                        className="handler"
                                    />
                                )}
                                {renderColumn(
                                    column,
                                    currentPath,
                                    columnContainer
                                )}
                            </React.Fragment>
                        );
                    })}
                    <DropZone
                        data={{
                            path: `${path}-${data.children.length}`,
                            childrenCount: data.children.length
                        }}
                        onDrop={handleDrop}
                        className="horizontalDrag"
                        isLast
                    />
                </div>
            )}
        </div>
    );
};
export default Row;
