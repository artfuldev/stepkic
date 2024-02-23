import React, { FC, useCallback, useMemo, useState } from "react";
import { Modal, TextInput } from "@carbon/react";
import { ProcessInfo } from "../../shared/model";
import ReactDOM from "react-dom";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd: (info: ProcessInfo) => void;
};

export const AddEngine: FC<Props> = ({ open, setOpen, onAdd }) => {
  const [args, setArgs] = useState("");
  const [command, setCommand] = useState("");
  const [cwd, setCwd] = useState("");
  const valid = useMemo(() => command !== "", [args, command, cwd]);
  const onClose = useCallback(() => setOpen(false), [setOpen]);
  const onSubmit = useCallback(() => {
    onAdd({
      command: command,
      cwd: cwd === "" ? undefined : cwd,
      args: args
        .split(" ")
        .filter(Boolean)
        .map((x) => x.trim()),
    });
    onClose();
  }, [args, command, cwd, onAdd, onClose]);
  return ReactDOM.createPortal(
    <Modal
      open={open}
      onRequestClose={onClose}
      onRequestSubmit={onSubmit}
      modalHeading="Add an engine"
      modalLabel="Engines"
      primaryButtonText="Add"
      secondaryButtonText="Cancel"
      primaryButtonDisabled={!valid}
    >
      <p
        style={{
          marginBottom: "1rem",
        }}
      >
        Engines must follow the ST3P protocol. They can be run in a custom
        directory, and take additional arguments
      </p>
      <TextInput
        required
        data-modal-primary-focus
        id="command"
        value={command}
        onChange={(ev) => setCommand(ev.target.value)}
        labelText="Command"
        placeholder="e.g. docker"
        style={{
          marginBottom: "1rem",
        }}
      />
      <TextInput
        id="args"
        value={args}
        onChange={(ev) => setArgs(ev.target.value)}
        labelText="Arguments"
        placeholder="e.g. run -i --memory=512m --cpus=1.0 --network=none random-step:v2.2.0"
        style={{
          marginBottom: "1rem",
        }}
      />
      <TextInput
        id="cwd"
        value={cwd}
        onChange={(ev) => setCwd(ev.target.value)}
        labelText="Current Working Directory (optional)"
        placeholder="e.g. /usr/bin"
        style={{
          marginBottom: "1rem",
        }}
      />
    </Modal>,
    document.body
  );
};
