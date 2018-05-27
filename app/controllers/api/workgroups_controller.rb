module Api
    class WorkgroupsController < ActionController::API
        respond_to :json
        before_action :set_workgroup, only: [:show, :update, :destroy]
        
        def index
            render json: Workgroup.joins(:workgroup_users).where(:workgroup_users => {:user_id => current_user.id})
        end

        def show
            render json: @workgroup
        end
        
        def create
            @workgroup = current_user.workgroups.new(workgroup_parameters)
            
            @workgroup.save
            workgroup_user = @workgroup.workgroup_users.new(user_id: current_user.id)
            workgroup_user.save
            
            render json: @workgroup
        end
        
        def update
            @workgroup.update_attributes(workgroup_parameters)
            render json: @workgroup
        end
        
        def delete
            @workgroup.delete
            
            head :no_content
        end
        
        private
        
        def set_workgroup
            @workgroup = WorkgroupUser.find(params[:id])
        end
        
        def workgroup_parameters
            params.require(:workgroup).permit(:user_id, :name, :description)
        end
    end
end