import React, { FC, useCallback, useState } from "react";
import { EngineInfo } from "../../shared/model";
import {
  Button,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarContent,
} from "@carbon/react";
import { Set } from "immutable";
import { Play, TrashCan } from "@carbon/icons-react";
import { Identifiable } from "./identifiable.type";

type IdentifiableEngine = Identifiable<EngineInfo>;

type Props = {
  engines: IdentifiableEngine[];
  onAdd: () => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
};

export const EnginesView: FC<Props> = ({
  engines,
  onAdd,
  onCreate,
  onDelete,
}) => {
  const columns: (keyof IdentifiableEngine)[] = ["name", "version", "author"];
  const [selected, setSelected] = useState<Set<string>>(Set());
  const select = useCallback(
    (row: string) =>
      setSelected((selected) =>
        selected.has(row) ? selected.delete(row) : selected.add(row)
      ),
    [setSelected]
  );
  const selectAll = useCallback(() => {
    if (engines.length === selected.count()) {
      setSelected(Set());
    } else {
      setSelected(Set(engines.map(({ id }) => id)));
    }
  }, [selected, engines, setSelected]);
  const onBulkDelete = useCallback(() => {
    selected.forEach((id) => onDelete(id));
    setSelected(Set());
  }, [selected, onDelete, setSelected]);

  return (
    <TableContainer title="Engines" description="List of available engines">
      <TableToolbar>
        <TableBatchActions
          shouldShowBatchActions={!selected.isEmpty()}
          totalSelected={selected.count()}
          onCancel={() => setSelected(Set())}
        >
          <TableBatchAction renderIcon={TrashCan} onClick={onBulkDelete}>
            Delete
          </TableBatchAction>
        </TableBatchActions>
        <TableToolbarContent>
          <Button
            disabled={engines.length === 0}
            renderIcon={Play}
            onClick={onCreate}
            iconDescription="Create Game"
            kind="ghost"
          />
          <Button onClick={onAdd} kind="primary">
            Add new
          </Button>
        </TableToolbarContent>
      </TableToolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableSelectAll
              id="select-all"
              name="select-all"
              ariaLabel="Select all"
              checked={
                engines.length !== 0 && engines.length === selected.count()
              }
              onSelect={selectAll}
            />
            {columns.map((header) => (
              <TableHeader key={header}>{header}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {engines.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} align="center">
                Add your first engine above.
              </TableCell>
            </TableRow>
          ) : null}
          {engines.map((row) => (
            <TableRow key={row.id}>
              <TableSelectRow
                id={`select-${row.id}`}
                name={`select-${row.id}`}
                ariaLabel={`Select ${row.id}`}
                checked={selected.has(row.id)}
                onSelect={() => select(row.id)}
              />
              {columns.map((column) => (
                <TableCell key={column}>{row[column]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
