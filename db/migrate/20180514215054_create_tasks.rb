class CreateTasks < ActiveRecord::Migration[5.1]
  def change
    create_table :tasks do |t|
      t.references :workgroup, foreign_key: true
      t.references :workgroup_task, foreign_key: true
      t.references :user, foreign_key: true
      t.string :name
      t.string :entityName

      t.timestamps
    end
  end
end
