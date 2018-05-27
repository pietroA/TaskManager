class WorkgroupUser < ApplicationRecord
  belongs_to :workgroup
  belongs_to :user
  
  def as_json(options = {})
    #include both relational tables and methods results
    super(options.merge(include:[ :workgroup, :user ])
#        .merge(methods:[ :method_name])
      )
  end

end
