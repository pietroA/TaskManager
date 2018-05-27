class CreateWorkgroupUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :workgroup_users do |t|
      t.references :workgroup, foreign_key: true
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
