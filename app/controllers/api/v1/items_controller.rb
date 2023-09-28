class Api::V1::ItemsController < ApplicationController
  before_action :set_product_type, only: [:index, :create, :show, :update]
  before_action :set_item, only: [:show, :update]

  # Protect from CSRF attacks while allowing null session for APIs
  protect_from_forgery with: :null_session

  # GET /product_types/:product_type_id/items
  def index
    @items = @product_type.items
    render json: @items
  end

  # GET /items/1
  def show
    product_type = ProductType.find(params[:id])
    render json: {
      id: product_type.id,
      name: product_type.name,
      items_count: product_type.available_items.count
    }
  end


  # POST /items
  def create
    @item = Item.new(item_params)

    if @item.save
      render json: { message: 'Item was successfully created.', item: @item }, status: :created
    else
      render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /items/1
  def update
    if @item.update(item_params)
      render json: @item
    else
      render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    # Retrieve the product type

    product_type = ProductType.find(params[:product_type_id])

    # Find the item associated with the given product type
    item = product_type.items.find(params[:id])

    # Attempt to destroy the item
    if item.destroy
      render json: { message: 'Item was successfully destroyed.' }, status: :ok
    else
      render json: { errors: "Failed to delete the item" }, status: :unprocessable_entity
    end
  end

  # Custom action for searching items
  def search
    @search_query = params[:query]
    @items = Item.where("serial_number LIKE ?", "%#{@search_query}%")
    render json: @items
  end

  private

  def set_product_type
    @product_type = ProductType.find(params[:product_type_id])
  end

  def set_item
    @item = @product_type.items.find(params[:id])
  end

  def item_params
    # Removed :product_type_id from permitted parameters
    params.require(:item).permit(:serial_number, :sold)
  end
end
