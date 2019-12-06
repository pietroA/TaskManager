module Api
    class TaskController < ActionController::API
        respond_to :json
        before_action :set_task, only: [:show, :update, :destroy]
        
        def index
            puts params[:workgroup_id]
            render json: Workgroup.find(params[:workgroup_id]).task.where(user_id: current_user.id).all
        end

        def show
            render json: @task
        end
        
        def create
            @task = Workgroup.find(params[:workgroup_id]).task.new(task_parameters)
            @task.save
            @task.update_attributes(user_id: current_user.id);
            generate_default_steps if @task.workgroup_task
            
            render json: @task
        end
        
        def update
            @task.update_attributes(task_parameters)
            render json: @task
        end
        
        def destroy
            p @task
            @task.destroy
            
            head :no_content
        end
        
        private
        
        def set_task
            @task = Task.find(params[:id])
        end
        
        def task_parameters
            params.require(:task).permit(:workgroup_id, :workgroup_task_id, :user_id, :name, :entity_name, :description)
        end
        
        def generate_default_steps
            @task.workgroup_task.workgroup_steps.each do |ws|
                description = ws.description.gsub('§entity', @task.entity_name)
                step = @task.steps.new(description: description, order: ws.order, active: true, completed: false)
                step.save
            end
        end
    end
end
