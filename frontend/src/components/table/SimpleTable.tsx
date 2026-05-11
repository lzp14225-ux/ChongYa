/*
 * 通用简单表格组件，用于静态数据列表和可点击行展示。
 */

import type { ReactNode } from 'react';

type SimpleTableProps = {
  headers: string[];
  rows: ReactNode[][];
  onRowClick?: () => void;
};

export function SimpleTable({ headers, rows, onRowClick }: SimpleTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} onClick={onRowClick}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
