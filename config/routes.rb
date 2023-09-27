Rails.application.routes.draw do
  root 'home#index'

  namespace :api do
    namespace :v1 do
      resources :product_types do
        resources :items
      end
    end
  end
end
