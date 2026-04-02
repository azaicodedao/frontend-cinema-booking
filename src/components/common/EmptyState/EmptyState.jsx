import React from 'react';
import './EmptyState.css';

const EmptyState = ({
  icon = '📭',
  title = 'No data found',
  description,
  action,
}) => {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">{icon}</span>
      <h3 className="empty-state__title">{title}</h3>
      {description && (
        <p className="empty-state__description">{description}</p>
      )}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
};

export default EmptyState;
