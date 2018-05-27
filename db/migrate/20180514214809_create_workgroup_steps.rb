class CreateWorkgroupSteps < ActiveRecord::Migration[5.1]
  def change
    create_table :workgroup_steps do |t|
      t.references :workgroup_task, foreign_key: true
      t.text :description
      t.integer :order

      t.timestamps
    end
  end
end
