import React, { FC, useCallback, useMemo, useState } from "react";
import {
  Modal,
  Select,
  SelectItem,
  Slider,
  Grid,
  Column,
  Form,
} from "@carbon/react";
import { EngineInfo, Msvn } from "../../shared/model";
import ReactDOM from "react-dom";
import { Identifiable } from "./identifiable.type";
import { NewGameArgs } from "./new-game-args";

type IdentifiableEngine = Identifiable<EngineInfo>;

type Props = {
  msvn: Msvn;
  engines: IdentifiableEngine[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onPlay: (args: NewGameArgs) => void;
};

export const CreateGame: FC<Props> = ({
  engines,
  msvn,
  open,
  setOpen,
  onPlay,
}) => {
  const map = engines.reduce(
    (map, engine) => map.set(engine.id, engine),
    new Map<string, IdentifiableEngine>()
  );
  const [x, setX] = useState<IdentifiableEngine | undefined>(engines[0]);
  const [o, setO] = useState<IdentifiableEngine | undefined>(undefined);
  const [size, setSize] = useState(3);
  const [winLength, setWinLength] = useState(3);
  const valid = useMemo(() => x != null, [x]);
  const onClose = useCallback(() => setOpen(false), [setOpen]);
  const onSubmit = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    onPlay({ x: x!, o: o ?? x!, size, winLength });
    onClose();
  }, [x, o, size, winLength, onPlay, onClose]);
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
  const onSizeChange = useCallback(
    ({ value }: { value: number }) => {
      setSize(value);
      setWinLength(value);
    },
    [setWinLength, setSize]
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
      <Form>
        <Grid>
          <Column lg={8} md={4} sm={2}>
            <Select
              required
              data-modal-primary-focus
              id="x"
              value={x?.id}
              onChange={selectX}
              labelText="Side X"
              placeholder="Select an engine"
              style={{
                marginBottom: "1rem",
              }}
            >
              <SelectItem value="" text="Select an engine" />
              {engines.map(({ id, name, version }) => (
                <SelectItem key={id} value={id} text={`${name} v${version}`} />
              ))}
            </Select>
          </Column>
          <Column lg={8} md={4} sm={2}>
            <Select
              id="o"
              value={o?.id}
              onChange={selectO}
              labelText="Side O (Optional)"
              placeholder="Select an engine"
              style={{
                marginBottom: "1rem",
              }}
            >
              <SelectItem value="" text="Select an engine" />
              {engines.map(({ id, name, version }) => (
                <SelectItem key={id} value={id} text={`${name} v${version}`} />
              ))}
            </Select>
          </Column>
        </Grid>
        <Slider
          labelText="Size"
          value={size}
          min={3}
          max={15}
          step={2}
          onChange={onSizeChange}
          invalidText="Invalid size"
        />
        {Msvn.above(2)(() => <></>)(() => (
          <Slider
            labelText="Win Length"
            value={winLength}
            min={2}
            max={size}
            onChange={({ value }) => setWinLength(value)}
            invalidText="Invalid win length"
          />
        ))(msvn)}
      </Form>
    </Modal>,
    document.body
  );
};
