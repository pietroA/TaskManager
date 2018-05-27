class Workgroup < ApplicationRecord
  belongs_to :user
  has_many :workgroup_users, dependent: :destroy
  has_many :workgroup_task, dependent: :destroy
  has_many :task, dependent: :destroy
  
  validates :name,  presence: true, 
                    length: { maximum: 50 },
                    uniqueness: {case_sensitive: false}
  def as_json(options = {})
    #include both relational tables and methods results
    super(options.merge(include:[:user ])
#        .merge(methods:[ :method_name])
      )
  end

end
