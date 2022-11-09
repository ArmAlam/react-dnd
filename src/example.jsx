import React, { useCallback, useState, useEffect } from "react";

import DropZone from "./DropZone";
import {
  handleMoveSidebarComponentIntoParent,
  handleMoveToDifferentParent,
  handleMoveWithinParent,
  handleRemoveItemFromLayout,
} from "./helpers";
import initialData from "./initial-data";
import Row from "./Row";
import SideBarItem from "./SideBarItem";
import TrashDropZone from "./TrashDropZone";

import shortid from "shortid";
import {
  COLUMN,
  COMPONENT,
  ROW,
  SIDEBAR_ITEM,
  SIDEBAR_ITEMS,
} from "./constants";

const Container = () => {
  const initialLayout = initialData.layout;
  const initialComponents = initialData.components;
  const [layout, setLayout] = useState(initialLayout);
  const [components, setComponents] = useState(initialComponents);

  const handleDropToTrashBin = useCallback(
    (dropZone, item) => {
      const splitItemPath = item.path.split("-");
      setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
    },
    [layout]
  );

  const handleDrop = useCallback(
    (dropZone, item) => {
      console.log({dropZone, item});
      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      const newItem = { id: item.id, type: item.type };
      if (item.type === COLUMN) {
        console.log("column", item.children);
        newItem.children = item.children;
      }

      // sidebar into
      if (item.type === SIDEBAR_ITEM) {
        let newComponent;
        let newItem;
        // 1. Move sidebar item into page
        if (item.component.type === ROW || item.component.type === COLUMN) {
          newItem = { id: item.id, type: item.component.type };
        } else {
          newComponent = {
            id: shortid.generate(),
            ...item.component,
          };
          newItem = {
            id: newComponent.id,
            type: COMPONENT,
          };
          setComponents({
            ...components,
            [newComponent.id]: newComponent,
          });
        }

        setLayout(
          handleMoveSidebarComponentIntoParent(
            layout,
            splitDropZonePath,
            newItem
          )
        );
        return;
      }

      // move down here since sidebar items don't have path
      const splitItemPath = item.path.split("-");
      const pathToItem = splitItemPath.slice(0, -1).join("-");

      // 2. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          setLayout(
            handleMoveWithinParent(layout, splitDropZonePath, splitItemPath)
          );
          return;
        }

        // 2.b. OR move different parent
        // TODO FIX columns. item includes children
        setLayout(
          handleMoveToDifferentParent(
            layout,
            splitDropZonePath,
            splitItemPath,
            newItem
          )
        );
        return;
      }

      // 3. Move + Create
      setLayout(
        handleMoveToDifferentParent(
          layout,
          splitDropZonePath,
          splitItemPath,
          newItem
        )
      );
    },
    [layout, components]
  );



  

  useEffect(() => {
    document.addEventListener("click", () => {
      const modal = document.querySelector("#modal");
      if (
        modal &&
        modal.classList &&
        typeof modal.classList.remove == "function"
      ) {
        modal.classList.remove("active");
      }
    });

    return () => {
      return document.removeEventListener('click')
    }
  }, [])


  const renderRow = (row, currentPath) => {
    return (
      <Row
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        components={components}
        path={currentPath}
      />
    );
  };
  

  // don't use index for key when mapping over items
  // causes this issue - https://github.com/react-dnd/react-dnd/issues/342
  return (
    <div className="body">
      <div className="sideBar">
        {Object.values(SIDEBAR_ITEMS).map((sideBarItem) => {
          return <SideBarItem key={sideBarItem.id} data={sideBarItem} />
        })}
      </div>
      <div className="pageContainer">
        <div className="page">
          {layout.map((row, index) => {
            const currentPath = `${index}`;

            return (
              <React.Fragment key={row.id}>
                <DropZone
                  data={{
                    path: currentPath,
                    childrenCount: layout.length,
                  }}
                  onDrop={handleDrop}
                  path={currentPath}
                />
                {renderRow(row, currentPath)}
              </React.Fragment>
            );
          })}
          <DropZone
            data={{
              path: `${layout.length}`,
              childrenCount: layout.length,
            }}
            onDrop={handleDrop}
            isLast
          />
        </div>

        <TrashDropZone
          data={{
            layout,
          }}
          onDrop={handleDropToTrashBin}
        />
        <h3 style={{ margin: "20px", marginBottom: 0 }}>Full Object Data:</h3>
        <textarea
          onChange={(e) => console.log(e)}
          style={{ margin: "20px" }}
          rows={24}
          value={JSON.stringify(layout, undefined, 4)}
        />

        {<div id="modal" />}
      </div>
    </div>
  );
};
export default Container;
