import EmptyState from "../EmptyState";

const InsightList = ({ insights, emptyTitle = "No insights available", emptyDescription }) => {
  if (!insights?.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="stack-list">
      {insights.map((insight) => (
        <article key={insight.title} className={`insight-card ${insight.tone}`}>
          <strong>{insight.title}</strong>
          <p>{insight.description}</p>
        </article>
      ))}
    </div>
  );
};

export default InsightList;
