import React, { useRef, useState } from "react";
import { useModalService } from "../../components/ModalContainer/ModalService";

// Components
import { UnstyledButton } from "../../components/Button/UnstyledButton";
import DropdownMenu from "../../components/DropdownMenu/DropdownMenu";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import PromptButton from "../../components/Button/PromptButton";
import ToolTip from "../../components/ToolTip/ToolTip";
import Column from "../../components/Layout/Column";
import { RiArrowRightSLine, RiQuestionLine } from "react-icons/ri";
import Row from "../../components/Layout/Row";

// Utils
import { parseArrayFromCSV } from "../../utils/general";
import { get, isEmpty } from "lodash";

// Icons
import { BiAddToQueue } from "react-icons/bi";
import { IoIosCloseCircle } from "react-icons/io";

// Constants
import { GENERIC_MESSAGE_MODAL } from "../../components/ModalContainer/ModalConstants";

// Styles
import regStyles from "../../styles/constants";
import styles from "./BatchUploader.css";

// Queries
import { createCheckoutSession, createTaskBatch } from "../../utils/queries";

const urlWithHTTPRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
const taskTypes = ["Classification"];
const emptyTask = { type: "", labels: [] };
const maxLabels = 8;
const minLabels = 2;

const filterAndReturnDuplicates = (arr) => {
  return arr.reduce(
    (acc, currVal, currI) =>
      arr.indexOf(currVal) === currI
        ? [[...acc[0], currVal], acc[1]] // Add, not a duplicate
        : [acc[0], acc[1] + 1], // Don't add, increment duplicate
    [[], 0] // initial value
  );
};

const UploadExplanation = ({}) => {
  return (
    <div style={{ width: 300, whiteSpace: "pre-wrap" }}>
      Upload a csv with a list of urls that point to the images you would like
      to label.
      {"\n\n"}
      Go ahead and drop any headers or metadata you have in the csv - we grab
      everything!
      {"\n\n"}
      Make sure the images are publicly available for the duration of the
      labeling request - if we can't access your images then we can't label
      them!
    </div>
  );
};

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
          <span
            style={{
              marginBottom: 4,
              marginLeft: 4,
              fontSize: 10,
              fontWeight: "bold",
            }}
          >
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
              placeholder="Select Task Type"
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
  const [duplicates, setDuplicates] = useState(0);
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
    const csv = get(e, "target.files[0]");

    // // file doesn't exist
    if (!csv) {
      return;
    }

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
        const [urls, duplicates] = filterAndReturnDuplicates(
          parseArrayFromCSV(e.target.result)
        );
        setImageURLs(urls);
        setDuplicates(duplicates);
      }
    };

    reader.readAsText(csv);
  };

  const proceedToCheckout = () => {
    setLoading(true);
    createTaskBatch(task.labels, imageURLs)
      .then(({ data }) => {
        return createCheckoutSession({
          product_id: "",
          quantity: imageURLs.length,
          batch_identifier: data.task_batch.batch_identifier,
        }).catch(() =>
          openModal(GENERIC_MESSAGE_MODAL, {
            title: "Uh Oh!",
            blocks: [
              {
                text: "It looks like we're having some issues with Stripe. Don't worry! We've got your batch saved and ready to go.",
              },
              {
                text: (
                  <span>
                    Shoot me an email at{" "}
                    <a href="mailto:jake@trygauss.com?subject=Stripe Issues">
                      jake@trygauss.com
                    </a>{" "}
                    and we'll get your payment underway and your batch labeled
                    asap.
                  </span>
                ),
              },
              {
                text: (
                  <span>
                    Don't forget to reference batch id{" "}
                    {data.task_batch.batch_identifier}.
                  </span>
                ),
              },
            ],
          })
        );
      })
      // TODO: catch errors
      .finally(() => setLoading(false));
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
          <Column className={styles.hoverIcon}>
            <ToolTip tooltip={<UploadExplanation />}>
              <RiQuestionLine size={32} />
            </ToolTip>
          </Column>
          <Column style={{ maxWidth: "-webkit-fill-available" }}>
            <div style={{ marginBottom: 4, marginTop: 8 }}>
              <span>Image URLs Selected: {imageURLs.length}</span>
            </div>
            {duplicates > 0 && (
              <div style={{ marginBottom: 4, marginTop: 4 }}>
                <span>Duplicates Filtered: {imageURLs.length}</span>
              </div>
            )}
            <Column
              style={{
                height: Math.min(imageURLs.length * 21, 250),
                ...(imageURLs.length === 0 && { border: "none" }),
              }}
              className={styles.imgListContainer}
            >
              {imageURLs.map((imgURL, i) => (
                <Row key={imgURL}>
                  <UnstyledButton
                    onClick={() =>
                      setImageURLs(
                        imageURLs.filter((v, targetindex) => targetindex !== i)
                      )
                    }
                  >
                    <IoIosCloseCircle
                      style={{ color: regStyles.dark, marginRight: 8 }}
                    />
                  </UnstyledButton>
                  <span>{imgURL}</span>
                </Row>
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
        {!isEmpty(imageURLs) &&
          !isEmpty(task.labels) &&
          task.labels.length >= minLabels && (
            <PromptButton
              className={styles.checkoutBtn}
              disabled={loading}
              shouldPrompt={imageURLs.some(
                (url) => !url.match(urlWithHTTPRegex)
              )}
              modalConfig={{
                title: "Hold up!",
                subtitle:
                  "It looks like some of the image urls you uploaded may be formatted incorrectly. " +
                  "If a URL isn't accessible, we won't be able to label it.",
                rejectButton: {
                  text: "Stop and Review",
                },
                approveButton: {
                  text: "Continue to Checkout",
                  onClick: proceedToCheckout,
                },
              }}
              buttonStyles={{
                opacity: loading ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
              onClick={proceedToCheckout}
            >
              Save and Pay
            </PromptButton>
          )}
      </Column>
    </div>
  );
};

export default BatchUploader;
