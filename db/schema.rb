# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20191206154835) do

  create_table "steps", force: :cascade do |t|
    t.integer "task_id"
    t.text "description"
    t.boolean "completed"
    t.boolean "active"
    t.integer "order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["task_id"], name: "index_steps_on_task_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.integer "workgroup_id"
    t.integer "workgroup_task_id"
    t.integer "user_id"
    t.string "name"
    t.string "entity_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "description"
    t.index ["user_id"], name: "index_tasks_on_user_id"
    t.index ["workgroup_id"], name: "index_tasks_on_workgroup_id"
    t.index ["workgroup_task_id"], name: "index_tasks_on_workgroup_task_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "username", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "workgroup_steps", force: :cascade do |t|
    t.integer "workgroup_task_id"
    t.text "description"
    t.integer "order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["workgroup_task_id"], name: "index_workgroup_steps_on_workgroup_task_id"
  end

  create_table "workgroup_tasks", force: :cascade do |t|
    t.integer "workgroup_id"
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["workgroup_id"], name: "index_workgroup_tasks_on_workgroup_id"
  end

  create_table "workgroup_users", force: :cascade do |t|
    t.integer "workgroup_id"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_workgroup_users_on_user_id"
    t.index ["workgroup_id"], name: "index_workgroup_users_on_workgroup_id"
  end

  create_table "workgroups", force: :cascade do |t|
    t.integer "user_id"
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_workgroups_on_user_id"
  end

end
