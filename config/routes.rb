Rails.application.routes.draw do
  devise_for :users
  root 'pages#index'

  namespace :api do
    resources :workgroups do
      resources :workgroup_task
      resources :workgroup_users
      resources :task
    end
    
    resources :task do
      resources :steps
    end
    resources :users
    resources :workgroup_task do
      resources :workgroup_steps
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
