class User < ApplicationRecord
  
  has_many :workgroups, dependent: :destroy
  has_many :task, dependent: :destroy
  has_many :workgroup_users, dependent: :destroy
  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable
         
  validates :username, presence: true, 
                       length: { maximum: 50 },
                       uniqueness: {case_sensitive: false}

end
