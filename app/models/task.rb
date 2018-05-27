class Task < ApplicationRecord
  belongs_to :workgroup
  belongs_to :workgroup_task
  has_many :steps, dependent: :destroy
end
