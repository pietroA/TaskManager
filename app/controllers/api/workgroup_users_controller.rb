module Api
    class WorkgroupUsersController < ActionController::API
        respond_to :json
        before_action :set_workgroup_user, only: [:show, :update, :destroy]
        
        def index
            render json: Workgroup.find(params[:workgroup_id]).workgroup_users.all
        end

        def show
            render json: @workgroup_user
        end
        
        def create
            @workgroup_user = Workgroup.find(params[:workgroup_id]).workgroup_users.new(workgroup_user_parameters)
            
            @workgroup_user.save
            render json: @workgroup_user
        end
        
        def update
            @workgroup_user.update_attributes(workgroup_user_parameters)
            render json: @workgroup_user
        end
        
        def destroy
            @workgroup_user.delete
            
            head :no_content
        end
        
        private
        
        def set_workgroup_user
            @workgroup_user = WorkgroupUser.find(params[:id])
        end
        
        def workgroup_user_parameters
            params.require(:workgroup_user).permit(:workgroup_id, :user_id)
        end
    end
end