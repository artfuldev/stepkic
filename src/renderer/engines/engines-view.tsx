import React, { FC, useCallback, useState } from "react";
import { EngineInfo } from "../../shared/model";
import "./global.scss";
import {
  Button,
  Table,
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

type IdentifiableEngine = EngineInfo & { id: string };

type Props = {
  engines: IdentifiableEngine[];
  onAdd: () => void;
  onDelete: (id: string) => void;
};

export const EnginesView: FC<Props> = ({ engines, onAdd, onDelete }) => {
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

  return (
    <TableContainer title="Engines" description="List of available engines">
      <TableToolbar>
        <TableToolbarContent>
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
              checked={engines.length === selected.count()}
              onSelect={selectAll}
            />
            {columns.map((header) => (
              <TableHeader key={header}>{header}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
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
