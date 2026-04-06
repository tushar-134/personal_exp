import EmptyState from "../EmptyState";
import { formatCurrency, formatDate } from "../../utils/format";

const getRecordTitle = (record) => record.category || record.source || "Untitled record";

const getRecordDescription = (record) => record.description || "No description";

const TransactionList = ({
  records,
  emptyTitle,
  emptyDescription,
  maxItems,
  sortByDate = false,
}) => {
  if (!records?.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const visibleRecords = [...records];

  if (sortByDate) {
    visibleRecords.sort((left, right) => new Date(right.date) - new Date(left.date));
  }

  const items = typeof maxItems === "number" ? visibleRecords.slice(0, maxItems) : visibleRecords;

  return (
    <div className="table-list">
      {items.map((record) => (
        <div key={record._id} className="table-row">
          <div>
            <strong>{getRecordTitle(record)}</strong>
            <p className="muted">{getRecordDescription(record)}</p>
          </div>
          <div className="table-meta">
            <span>{formatCurrency(record.amount)}</span>
            <span className="muted">{formatDate(record.date)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
