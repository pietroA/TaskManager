module Api
    class UsersController < ActionController::API
        respond_to :json
        
        def index
            render json: 
            if params[:query]
                query = params[:query]
                User.where('username like ?', "%#{query}%").order(:name).all
            else
                User.all
            end
        end
        
        def show
            render json: User.find(params[:id])
        end

    end
end