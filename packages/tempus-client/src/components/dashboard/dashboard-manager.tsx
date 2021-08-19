import { FC, useCallback, useMemo, useState } from 'react';
import { DashboardRow } from '../../interfaces';
import getDashboardDataService from '../../services/getDashboardDataService';
import Dashboard from './dashboard';

type DashboardManagerProps = {
  selectedRow: DashboardRow | null;
  onRowSelected?: (row: DashboardRow | null) => void;
};

const DashboardManager: FC<DashboardManagerProps> = ({ selectedRow, onRowSelected }): JSX.Element => {
  const [rows, setRows] = useState<DashboardRow[]>([]);

  useMemo(() => {
    setRows(getDashboardDataService().getRows());
  }, [setRows]);

  const onRowActionClick = useCallback(
    (row: any) => {
      onRowSelected && onRowSelected(row);
    },
    [onRowSelected],
  );

  const onCloseRowDetail = useCallback(() => {
    onRowSelected && onRowSelected(null);
  }, [onRowSelected]);

  const shouldShowDashboard = !!selectedRow;

  return (
    <>
      <Dashboard hidden={shouldShowDashboard} rows={rows} onRowActionClick={onRowActionClick} />
      <div className="tf__detail__section__container" hidden={!shouldShowDashboard}>
        <div>Here the details</div> <div onClick={onCloseRowDetail}>Close</div>
      </div>
    </>
  );
};

export default DashboardManager;
