import React, { useState, useEffect, useRef } from 'react';

interface RowData {
  id: number;
  [key: string]: any;
}

interface VirtualTableProps {
  data: RowData[];
  columns: string[];
  estimatedRowHeight: number;
  visibleRows: number;
  resizableColumns?: boolean;
  pinnedColumns?: string[]; // New prop to specify pinned columns
}

const VirtualTable: React.FC<VirtualTableProps> = ({ 
  data, 
  columns, 
  estimatedRowHeight, 
  visibleRows,
  resizableColumns = false,
  pinnedColumns = [] // Default to no pinned columns
}) => {
  const [start, setStart] = useState(0);
  const [rowHeights, setRowHeights] = useState<number[]>([]);
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    Object.fromEntries(columns.map(column => [column, 100]))
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const resizingColumn = useRef<string | null>(null);

  const scrollableColumns = columns.filter(col => !pinnedColumns.includes(col));

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const newStart = Math.floor(scrollTop / estimatedRowHeight);
        setStart(newStart);
      }
    };

    containerRef.current?.addEventListener('scroll', handleScroll);
    return () => containerRef.current?.removeEventListener('scroll', handleScroll);
  }, [estimatedRowHeight]);

  useEffect(() => {
    const measureRowHeights = () => {
      const newRowHeights = rowRefs.current.map(
        (rowRef) => rowRef?.getBoundingClientRect().height || estimatedRowHeight
      );
      setRowHeights(newRowHeights);
    };

    measureRowHeights();
    window.addEventListener('resize', measureRowHeights);
    return () => window.removeEventListener('resize', measureRowHeights);
  }, [data, estimatedRowHeight]);

  const getTotalHeight = () => {
    return rowHeights.reduce((sum, height) => sum + height, 0) || data.length * estimatedRowHeight;
  };

  const getOffsetForIndex = (index: number) => {
    return rowHeights.slice(0, index).reduce((sum, height) => sum + height, 0);
  };

  const visibleData = data.slice(start, start + visibleRows);

  const handleMouseDown = (column: string) => (e: React.MouseEvent) => {
    if (resizableColumns) {
      resizingColumn.current = column;
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (resizableColumns && resizingColumn.current) {
      const newWidth = Math.max(50, e.clientX - (e.target as HTMLElement).getBoundingClientRect().left);
      setColumnWidths(prev => ({
        ...prev,
        [resizingColumn.current!]: newWidth
      }));
    }
  };

  const handleMouseUp = () => {
    if (resizableColumns) {
      resizingColumn.current = null;
    }
  };

  useEffect(() => {
    if (resizableColumns) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [resizableColumns]);

  const renderTableContent = (columnSet: string[]) => (
    <table style={{ 
      transform: `translateY(${getOffsetForIndex(start)}px)`,
      width: '100%',
      borderCollapse: 'collapse'
    }}>
      <thead>
        <tr>
          {columnSet.map((column) => (
            <th key={column} style={{ 
              padding: '8px', 
              textAlign: 'left', 
              fontWeight: 'bold',
              width: columnWidths[column],
              position: 'relative'
            }}>
              {column}
              {resizableColumns && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '5px',
                    cursor: 'col-resize',
                    background: 'transparent'
                  }}
                  onMouseDown={handleMouseDown(column)}
                />
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {visibleData.map((row, index) => (
          <tr
            key={row.id}
            ref={(el) => (rowRefs.current[start + index] = el)}
          >
            {columnSet.map((column) => (
              <td key={column} style={{ 
                padding: '8px',
                width: columnWidths[column],
                maxWidth: columnWidths[column],
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {row[column]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div
      ref={containerRef}
      style={{
        height: `${visibleRows * estimatedRowHeight}px`,
        overflowY: 'auto',
        display: 'flex'
      }}
    >
      {pinnedColumns.length > 0 && (
        <div style={{ 
          position: 'sticky', 
          left: 0, 
          zIndex: 1, 
          backgroundColor: 'white',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
        }}>
          <div style={{ height: `${getTotalHeight()}px`, position: 'relative' }}>
            {renderTableContent(pinnedColumns)}
          </div>
        </div>
      )}
      <div style={{ 
        flexGrow: 1, 
        overflowX: 'auto',
        marginLeft: pinnedColumns.length > 0 ? '5px' : '0'
      }}>
        <div style={{ height: `${getTotalHeight()}px`, position: 'relative' }}>
          {renderTableContent(scrollableColumns)}
        </div>
      </div>
    </div>
  );
};

export default VirtualTable;