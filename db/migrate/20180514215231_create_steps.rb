class CreateSteps < ActiveRecord::Migration[5.1]
  def change
    create_table :steps do |t|
      t.references :task, foreign_key: true
      t.text :description
      t.boolean :completed
      t.boolean :active
      t.integer :order

      t.timestamps
    end
  end
end
