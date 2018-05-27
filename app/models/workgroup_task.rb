class WorkgroupTask < ApplicationRecord
  belongs_to :workgroup
  has_many :workgroup_steps, dependent: :destroy
  
end
