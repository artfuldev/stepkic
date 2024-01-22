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
        args: `run -i --memory=512m --cpus=1.0 random-step`.split(" "),
      })
    );
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
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </main>
    </div>
  );
};
