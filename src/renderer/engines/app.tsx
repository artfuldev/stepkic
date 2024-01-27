import React, { FC, useEffect, useState } from "react";
import { EngineInfo } from "../../shared/model";
import { Response } from "../../shared/messaging/engines/response";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Request } from "../../shared/messaging/engines/request";
import "./global.scss";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@carbon/react";

const helper = createColumnHelper<EngineInfo>();

export const App: FC = () => {
  const [engines, setEngines] = useState<[string, EngineInfo][]>([]);
  const data = engines.map(([, info]) => info);
  const table = useReactTable({
    data,
    columns: [
      helper.accessor("name", {}),
      helper.accessor("version", {}),
      helper.accessor("author", {}),
    ],
    getCoreRowModel: getCoreRowModel(),
  });
  useEffect(() => {
    return window.electron.ipcRenderer.on(
      "engines",
      (_, response: Response) => {
        setEngines(Object.entries(response.args[0]));
      }
    );
  }, []);
  useEffect(() => {
    window.electron.ipcRenderer.send("engines", Request.List());
  }, []);
  useEffect(() => {
    window.electron.ipcRenderer.send(
      "engines",
      Request.Create({
        command: "docker",
        args: `run -i --memory=512m --cpus=1.0 random-step:v2.2.0`.split(" "),
      })
    );
  }, []);
  return (
    <div>
      <main>
        <h4>Engines</h4>
        <Table>
          <TableHead>
            <TableRow>
              {table
                .getHeaderGroups()
                .map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <TableHeader key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHeader>
                  ))
                )}
            </TableRow>
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
};
