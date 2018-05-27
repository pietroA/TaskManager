class RenameEntityNameInTask < ActiveRecord::Migration[5.1]
  def change
    rename_column :tasks, :entityName, :entity_name
  end
end
