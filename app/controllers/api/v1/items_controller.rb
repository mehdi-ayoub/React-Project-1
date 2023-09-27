class Api::V1::ItemsController < ApplicationController
  before_action :set_product_type, only: [:index]
  before_action :set_item, only: [:show, :update, :destroy]

  # GET /product_types/:product_type_id/items
  def index
    @items = @product_type.items
    render json: @items
  end

  # GET /items/1
  def show
    render json: @item
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
      render json: { message: 'Item was successfully updated.', item: @item }, status: :ok
    else
      render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /items/1
  def destroy
    if @item.destroy
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
    @item = Item.find(params[:id])
  end

  def item_params
    params.require(:item).permit(:product_type_id, :serial_number, :sold)
  end
end
