import { get, isEmpty } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { IoIosCloseCircle } from "react-icons/io";
import { RiMenuAddFill } from "react-icons/ri";
import { UnstyledButton } from "../../components/Button/UnstyledButton";
import DropdownMenu from "../../components/DropdownMenu/DropdownMenu";
import Column from "../../components/Layout/Column";
import Row from "../../components/Layout/Row";
import { GENERIC_MESSAGE_MODAL } from "../../components/ModalContainer/ModalConstants";
import { useModalService } from "../../components/ModalContainer/ModalService";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import regStyles from "../../styles/constants";
import { parseArrayFromCSV } from "../../utils/general";
import { createCheckoutSession, createTaskBatch } from "../../utils/queries";

import styles from "./BatchUploader.css";

const taskTypes = ["Classification"];
const emptyTask = { type: "", labels: [] };
const maxLabels = 8;

const DropdownOptions = ({ onClick, options }) => (
  <Column>
    {options.map((option) => (
      <span key={option} onClick={() => onClick(option)}>
        {option}
      </span>
    ))}
  </Column>
);

const TaskCreation = ({ task, setTaskType, addTaskLabel, removeTaskLabel }) => {
  return (
    <Column style={{ marginTop: 32 }}>
      <span style={{ marginBottom: -8, fontSize: 18 }}>Tasks</span>
      {/** EZ Task Creation */}
      <Row style={{ marginTop: 16 }}>
        <Column>
          <span style={{ marginBottom: 4, fontSize: 10, fontWeight: "bold" }}>
            task type
          </span>
          <DropdownMenu
            dropdownOptionsClassName={styles.dropdownMenuOptions}
            dropdownOptions={
              <DropdownOptions
                options={taskTypes}
                onClick={(filter) => setTaskType(filter)}
              />
            }
          >
            <SearchBar
              placeholder="Task Type"
              value={task.type}
              style={{ width: 250 }}
              iconProps={{ style: { display: "none" } }}
              inputStyles={{
                fontSize: 16,
                caretColor: "transparent",
                cursor: "pointer",
              }}
            />
          </DropdownMenu>
        </Column>
        {task.type === "Classification" && (
          <LabelInput
            labels={task.labels}
            addLabel={(label) => addTaskLabel(label)}
            removeLabel={(ind) => removeTaskLabel(ind)}
          />
        )}
      </Row>
    </Column>
  );
};

const LabelInput = ({ labels = [], addLabel, removeLabel }) => {
  const [inputActive, setInputActive] = useState(true);
  const [newLabel, setNewLabel] = useState("");

  const add = (label) => {
    if (!label || labels.includes(label)) {
      return;
    }

    setInputActive(!inputActive);
    addLabel(label);
    setNewLabel("");
  };

  const remove = (labelI) => {
    setInputActive(!inputActive);
    removeLabel(labelI);
    setNewLabel("");
  };
  return (
    <Column style={{ marginLeft: 8 }}>
      <span style={{ marginBottom: 4, fontSize: 10, fontWeight: "bold" }}>
        label
      </span>
      <Row style={{ flexWrap: "wrap" }}>
        {labels.map((label, i) => {
          return (
            <Row
              key={i}
              style={{ width: "fit-content", minWidth: 50, margin: 8 }}
            >
              <SearchBar
                placeholder=""
                style={{ background: regStyles.base }}
                value={label}
                iconProps={{ style: { display: "none" } }}
                inputStyles={{
                  fontSize: 16,
                  caretColor: "transparent",
                  color: regStyles.white,
                  background: "none",
                }}
                disabled
              />
              <UnstyledButton onClick={() => remove(i)}>
                <IoIosCloseCircle
                  style={{ color: regStyles.dark, marginLeft: 8 }}
                />
              </UnstyledButton>
            </Row>
          );
        })}
        {labels.length < maxLabels && (
          <Row style={{ width: "fit-content", minWidth: 50, margin: 8 }}>
            <SearchBar
              placeholder=""
              value={newLabel}
              onInput={(e) => setNewLabel(e.target.value)}
              onEnter={() => add(newLabel)}
              iconProps={{ style: { display: "none" } }}
              inputStyles={{ fontSize: 16 }}
            />
          </Row>
        )}
      </Row>
    </Column>
  );
};

const BatchUploader = ({}) => {
  const [imageURLs, setImageURLs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(emptyTask);
  const [_, { openModal }] = useModalService();
  const inputRef = useRef();

  // TASK MANIPULATION FNS
  const setTaskType = (type) => setTask((prevTask) => ({ ...prevTask, type }));
  const addTaskLabel = (label) => {
    setTask((prevTask) => ({
      ...prevTask,
      labels: [...prevTask.labels, label],
    }));
  };
  const removeTaskLabel = (labelIndex) =>
    setTask((prevTask) => ({
      ...prevTask,
      labels: prevTask.labels.filter((_, labelI) => labelI !== labelIndex),
    }));
  // TASK MANIPULATION FNS

  const addFiles = (e) => {
    const csv = e.target.files[0];

    // Handle wrong file format
    if (csv.name.split(".").pop().toLowerCase() !== "csv") {
      openModal(GENERIC_MESSAGE_MODAL, {
        title: "Invalid File Type.",
        text: "We only support csv files right now.",
      });

      return;
    }

    var reader = new FileReader();

    reader.onload = (e) => {
      if (!!get(e, "target.result")) {
        setImageURLs(parseArrayFromCSV(e.target.result));
      }
    };

    reader.readAsText(csv);
  };

  return (
    <div className={styles.container}>
      <input
        ref={inputRef}
        onChange={addFiles}
        accept="image/*"
        type="file"
        multiple
        style={{ display: "none" }}
      />
      <h2 style={{ display: "flex" }}>
        <BiAddToQueue />
        <span style={{ marginLeft: 8 }}>Create Task Batch</span>
      </h2>
      <Column className={styles.uploadContainer}>
        <Row>
          <UnstyledButton
            className={styles.btn}
            onClick={() => inputRef.current.click()}
          >
            Upload
          </UnstyledButton>
          <Column style={{ maxWidth: "-webkit-fill-available" }}>
            <div style={{ marginBottom: 4 }}>
              <span>Image URLs selected: {imageURLs.length}</span>
            </div>
            <Column className={styles.imgListContainer}>
              {imageURLs.map((imgURL) => (
                <span>{imgURL}</span>
              ))}
            </Column>
          </Column>
        </Row>
        <TaskCreation
          task={task}
          setTaskType={setTaskType}
          addTaskLabel={addTaskLabel}
          removeTaskLabel={removeTaskLabel}
        />
        {!isEmpty(imageURLs) && !isEmpty(task.labels) && (
          <UnstyledButton
            disabled={loading}
            style={{ opacity: loading ? 0.5 : 1 }}
            onClick={() => {
              setLoading(true);
              createTaskBatch(task.labels, imageURLs)
                .then(({ data }) => {
                  console.log(data);
                  return createCheckoutSession({
                    product_id: "",
                    quantity: imageURLs.length,
                    batch_identifier: data.task_batch.batch_identifier,
                  });
                })
                // TODO: catch errors
                .finally(() => setLoading(false));
            }}
          >
            Checkout
          </UnstyledButton>
        )}
      </Column>
    </div>
  );
};

export default BatchUploader;
