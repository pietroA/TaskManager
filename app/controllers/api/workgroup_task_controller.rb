module Api
    class WorkgroupTaskController < ActionController::API
        respond_to :json
        before_action :set_workgroup_task, only: [:show, :update, :destroy]
        
        def index
            render json: Workgroup.find(params[:workgroup_id]).workgroup_task.all
        end

        def show
            render json: @workgroup_task
        end
        
        def create
            @workgroup_task = Workgroup.find(params[:workgroup_id]).workgroup_task.new(workgroup_task_parameters)
            
            @workgroup_task.save
            render json: @workgroup_task
        end
        
        def update
            @workgroup_task.update_attributes(workgroup_task_parameters)
            render json: @workgroup_task
        end
        
        def delete
            @workgroup_task.delete
            
            head :no_content
        end
        
        private
        
        def set_workgroup_task
            @workgroup_task = WorkgroupTask.find(params[:id])
        end
        
        def workgroup_task_parameters
            params.require(:workgroup_task).permit(:workgroup_id, :name, :description)
        end
    end
end