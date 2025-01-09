interface TopicActionsProps {
  isEditing: boolean;
  handleSave: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
}

export const TopicActions: React.FC<TopicActionsProps> = (
  {
    isEditing,
    handleSave,
    handleEdit,
    handleDelete,
  }) => {
  return (
    <div className="messenger__action">
      {isEditing ? (
        <button className="action-button icon-add" onClick={handleSave}/>
      ) : (
        <button className="action-button icon-edit" onClick={handleEdit}/>
      )}
      <button className="action-button icon-del" onClick={handleDelete}/>
    </div>
  );
};
