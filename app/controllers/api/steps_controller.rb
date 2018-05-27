module Api
    class StepsController < ActionController::API
        respond_to :json
        before_action :set_step, only: [:show, :update, :destroy]
        
        def index
            render json: Task.find(params[:task_id]).steps.all
        end

        def show
            render json: @step
        end
        
        def create
            @step = Task.find(params[:task_id]).steps.new(step_parameters)
            
            @step.save
            render json: @step
        end
        
        def update
            @step.update_attributes(step_parameters)
            render json: @step
        end
        
        def delete
            @step.delete
            
            head :no_content
        end
        
        private
        
        def set_step
            @step = Step.find(params[:id])
        end
        
        def step_parameters
            params.require(:step).permit(:task_id, :description, :completed, :active, :order)
        end
    end
end