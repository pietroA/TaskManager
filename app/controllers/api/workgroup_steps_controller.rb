module Api
    class WorkgroupStepsController < ActionController::API
        respond_to :json
        before_action :set_workgroup_step, only: [:show, :update, :destroy]
        
        def index
            render json: WorkgroupTask.find(params[:workgroup_task_id]).workgroup_steps.all
        end

        def show
            render json: @workgroup_step
        end
        
        def create
            @workgroup_step = WorkgroupTask.find(params[:workgroup_task_id]).workgroup_steps.new(workgroup_step_parameters)
            
            @workgroup_step.save
            render json: @workgroup_step
        end
        
        def update
            @workgroup_step.update_attributes(workgroup_step_parameters)
            render json: @workgroup_step
        end
        
        def delete
            @workgroup_step.delete
            
            head :no_content
        end
        
        private
        
        def set_workgroup_step
            @workgroup_step = WorkgroupStep.find(params[:id])
        end
        
        def workgroup_step_parameters
            params.require(:workgroup_step).permit(:workgroup_task_id, :user_id, :description, :order)
        end
    end
end