import React, { FC, useCallback, useMemo, useState } from "react";
import { Modal, Select, SelectItem } from "@carbon/react";
import { EngineInfo } from "../../shared/model";
import ReactDOM from "react-dom";
import { Identifiable } from "./identifiable.type";

type IdentifiableEngine = Identifiable<EngineInfo>;

type Props = {
  engines: IdentifiableEngine[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onPlay: (x: IdentifiableEngine, o: IdentifiableEngine) => void;
};

export const CreateGame: FC<Props> = ({ engines, open, setOpen, onPlay }) => {
  const map = engines.reduce(
    (map, engine) => map.set(engine.id, engine),
    new Map<string, IdentifiableEngine>()
  );
  const [x, setX] = useState<IdentifiableEngine | undefined>(engines[0]);
  const [o, setO] = useState<IdentifiableEngine | undefined>(undefined);
  const valid = useMemo(() => x != null, [x]);
  const onClose = useCallback(() => setOpen(false), [setOpen]);
  const onSubmit = useCallback(() => {
    onPlay(x!, o ?? x!);
    onClose();
  }, [x, o, onPlay, onClose]);
  const selectX = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setX(map.get(event.target.value));
    },
    [setX, map]
  );
  const selectO = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setO(map.get(event.target.value));
    },
    [setO, map]
  );
  return ReactDOM.createPortal(
    <Modal
      open={open}
      onRequestClose={onClose}
      onRequestSubmit={onSubmit}
      modalHeading="Create a game"
      modalLabel="Engines"
      primaryButtonText="Create"
      secondaryButtonText="Cancel"
      primaryButtonDisabled={!valid}
    >
      <p
        style={{
          marginBottom: "1rem",
        }}
      >
        You can create a game between 2 engines, or a game where a single engine
        plays both sides.
      </p>
      <Select
        required
        data-modal-primary-focus
        id="x"
        value={x?.id}
        onChange={selectX}
        labelText="Side X"
        placeholder="Select an engine"
        helperText="Engine to play side X"
        style={{
          marginBottom: "1rem",
        }}
      >
        <SelectItem value="" text="Select an engine" />
        {engines.map((engine) => (
          <SelectItem key={engine.id} value={engine.id} text={engine.name} />
        ))}
      </Select>
      <Select
        id="o"
        value={o?.id}
        onChange={selectO}
        labelText="Side O"
        placeholder="Select an engine"
        helperText="Engine to play side O, if different from side X"
        style={{
          marginBottom: "1rem",
        }}
      >
        <SelectItem value="" text="Select an engine" />
        {engines.map((engine) => (
          <SelectItem key={engine.id} value={engine.id} text={engine.name} />
        ))}
      </Select>
    </Modal>,
    document.body
  );
};
