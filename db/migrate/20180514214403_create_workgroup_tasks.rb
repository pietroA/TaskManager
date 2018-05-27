class CreateWorkgroupTasks < ActiveRecord::Migration[5.1]
  def change
    create_table :workgroup_tasks do |t|
      t.references :workgroup, foreign_key: true
      t.string :name
      t.text :description

      t.timestamps
    end
  end
end
